import fs from 'fs';
import path from 'path';

console.log('Running Cloudflare Pages post-build script...');

const openNextDir = '.open-next';
const assetsDir = path.join(openNextDir, 'assets');

if (!fs.existsSync(assetsDir)) {
  console.error('ERROR: .open-next/assets does not exist!');
  process.exit(1);
}

// Generate a fresh unique BUILD_ID to bust Cloudflare Pages CDN edge ETag cache
const newBuildId = 'build_' + Date.now();
fs.writeFileSync(path.join(openNextDir, 'BUILD_ID'), newBuildId);
fs.writeFileSync(path.join(assetsDir, 'BUILD_ID'), newBuildId);
console.log('OK: Generated fresh BUILD_ID:', newBuildId);

// -----------------------------------------------------------------------
// Build _worker.js for Cloudflare Pages:
// 1. Convert dynamic import of server handler to a STATIC top-level import.
// 2. Strip Durable Object exports (DOQueueHandler, DOShardedTagCache, BucketCachePurge).
// 3. Wrap fetch handler in try/catch to expose exact stack trace if an exception occurs.
// -----------------------------------------------------------------------
const workerSrc = path.join(openNextDir, 'worker.js');
const workerDest = path.join(assetsDir, '_worker.js');
console.log('Building _worker.js with static server handler bundle...');

let w = fs.readFileSync(workerSrc, 'utf8');

// 1. Remove Durable Object exports
w = w.replace(/export\s+\{\s*DOQueueHandler\s*\}\s+from\s+["']\.\/\.build\/durable-objects\/queue\.js["'];?/g, '');
w = w.replace(/export\s+\{\s*DOShardedTagCache\s*\}\s+from\s+["']\.\/\.build\/durable-objects\/sharded-tag-cache\.js["'];?/g, '');
w = w.replace(/export\s+\{\s*BucketCachePurge\s*\}\s+from\s+["']\.\/\.build\/durable-objects\/bucket-cache-purge\.js["'];?/g, '');
w = w.replace(/\/\/@ts-expect-error:\s*Will be resolved by wrangler build\s*\r?\n(?=export\s+\{)/g, '');

// 2. Add top-level static import of serverHandler
const middlewareImportStr = 'import { handler as middlewareHandler } from "./middleware/handler.mjs";';
const staticServerImportStr = 'import { handler as middlewareHandler } from "./middleware/handler.mjs";\nimport { handler as serverHandler } from "./server-functions/default/handler.mjs";';

w = w.replace(middlewareImportStr, staticServerImportStr);

// 3. Replace dynamic import with static serverHandler call
const dynamicImportStr = 'const { handler } = await import("./server-functions/default/handler.mjs");\n            return handler(reqOrResp, env, ctx, request.signal);';
const staticCallStr = 'return serverHandler(reqOrResp, env, ctx, request.signal);';

w = w.replace(dynamicImportStr, staticCallStr);
w = w.replace(/const\s+\{\s*handler\s*\}\s*=\s*await\s+import\("\.\/server-functions\/default\/handler\.mjs"\);\s*\r?\n\s*return\s+handler\(reqOrResp,\s*env,\s*ctx,\s*request\.signal\);/g, 'return serverHandler(reqOrResp, env, ctx, request.signal);');

// 4. Wrap fetch handler body in try/catch error boundary
w = w.replace(
  'async fetch(request, env, ctx) {',
  `async fetch(request, env, ctx) {
        try {`
);

w = w.replace(
  '    },\n};',
  `        } catch (err) {
            return new Response("FATAL WORKER ERROR:\\n" + (err.stack || err.message || String(err)), {
                status: 500,
                headers: { "content-type": "text/plain; charset=utf-8" }
            });
        }
    },
};`
);

fs.writeFileSync(workerDest, w, 'utf8');
console.log('OK: _worker.js generated with static bundle');

// Write _routes.json
const routesContent = JSON.stringify({
  version: 1,
  include: ['/*'],
  exclude: [
    '/_next/static/*',
    '/favicon.ico',
    '/og-*.png',
    '/authors/*',
    '/blog-images/*',
    '/ads.txt',
    '/*.svg',
    '/*.png',
    '/*.jpg',
    '/robots.txt',
    '/BUILD_ID'
  ]
});
fs.writeFileSync(path.join(assetsDir, '_routes.json'), routesContent);
console.log('OK: _routes.json written');

// Copy supporting dirs — skip symlinks
function copyDirNoSymlinks(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isSymbolicLink()) {
      console.log('  SKIP symlink:', entry.name);
      continue;
    } else if (entry.isDirectory()) {
      copyDirNoSymlinks(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const dirsToKeep = ['server-functions', 'middleware', 'cloudflare', '.build'];
for (const dir of dirsToKeep) {
  const src = path.join(openNextDir, dir);
  const dest = path.join(assetsDir, dir);
  if (fs.existsSync(src)) {
    console.log('Copying', dir, '...');
    copyDirNoSymlinks(src, dest);
    console.log('OK:', dir, 'copied');
  } else {
    console.log('SKIP:', dir, '(not found)');
  }
}

// Clean stale assets/cache directory
const assetsCacheDir = path.join(assetsDir, 'cache');
if (fs.existsSync(assetsCacheDir)) {
  fs.rmSync(assetsCacheDir, { recursive: true, force: true });
  console.log('OK: Cleaned stale assets/cache directory');
}

// -----------------------------------------------------------------------
// Fix Bare Node.js Builtin Imports:
// Cloudflare Workers `nodejs_compat` requires `node:` prefix for all Node built-ins.
// Convert require("fs") -> require("node:fs"), from "path" -> from "node:path", etc.
// -----------------------------------------------------------------------
const nodeBuiltinModules = [
  'async_hooks', 'buffer', 'child_process', 'crypto', 'dns', 'events', 
  'fs', 'http', 'https', 'net', 'os', 'path', 'process', 'querystring', 
  'stream', 'string_decoder', 'tls', 'url', 'util', 'vm', 'zlib', 'assert'
];

let totalNodeFixes = 0;
function fixNodeImportsInDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) {
      fixNodeImportsInDir(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.mjs') || entry.name.endsWith('.cjs'))) {
      let code = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      for (const m of nodeBuiltinModules) {
        // require("fs") -> require("node:fs")
        const r1 = new RegExp(`require\\(["']${m}["']\\)`, 'g');
        if (r1.test(code)) {
          code = code.replace(r1, `require("node:${m}")`);
          changed = true;
          totalNodeFixes++;
        }
        // from "fs" -> from "node:fs"
        const r2 = new RegExp(`from\\s+["']${m}["']`, 'g');
        if (r2.test(code)) {
          code = code.replace(r2, `from "node:${m}"`);
          changed = true;
          totalNodeFixes++;
        }
        // import("fs") -> import("node:fs")
        const r3 = new RegExp(`import\\(["']${m}["']\\)`, 'g');
        if (r3.test(code)) {
          code = code.replace(r3, `import("node:${m}")`);
          changed = true;
          totalNodeFixes++;
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, code, 'utf8');
      }
    }
  }
}

console.log('Fixing bare Node.js builtin imports for Cloudflare nodejs_compat...');
fixNodeImportsInDir(assetsDir);
console.log(`OK: Converted ${totalNodeFixes} bare Node.js builtin imports to node: specifiers across all assets`);

console.log('Post-build complete!');
