import fs from 'fs';
import path from 'path';

console.log('Running Cloudflare Pages post-build script...');

const openNextDir = '.open-next';
const assetsDir = path.join(openNextDir, 'assets');

if (!fs.existsSync(assetsDir)) {
  console.error('ERROR: .open-next/assets does not exist!');
  process.exit(1);
}

// -----------------------------------------------------------------------
// Build _worker.js:
// 1. Convert dynamic import of server handler to a STATIC top-level import.
// 2. STRIP ALL DURABLE OBJECT EXPORTS (unsupported on CF Pages Free tier & crashes isolates).
// 3. Add error boundary inside fetch() to surface any unhandled exceptions cleanly.
// -----------------------------------------------------------------------
const workerSrc = path.join(openNextDir, 'worker.js');
const workerDest = path.join(assetsDir, '_worker.js');
console.log('Building _worker.js...');

let w = fs.readFileSync(workerSrc, 'utf8');

// 1. Remove Durable Object exports (DOQueueHandler, DOShardedTagCache, BucketCachePurge)
// These import from `cloudflare:workers` which crashes Cloudflare Pages Free tier isolates.
w = w.replace(/export\s+\{\s*DOQueueHandler\s*\}\s+from\s+["']\.\/\.build\/durable-objects\/queue\.js["'];?/g, '');
w = w.replace(/export\s+\{\s*DOShardedTagCache\s*\}\s+from\s+["']\.\/\.build\/durable-objects\/sharded-tag-cache\.js["'];?/g, '');
w = w.replace(/export\s+\{\s*BucketCachePurge\s*\}\s+from\s+["']\.\/\.build\/durable-objects\/bucket-cache-purge\.js["'];?/g, '');
w = w.replace(/\/\/@ts-expect-error:\s*Will be resolved by wrangler build\s*\r?\n(?=export\s+\{)/g, '');

// 2. Add static top-level import of the server handler
w = w.replace(
  '// @ts-expect-error: Will be resolved by wrangler build\nimport { handler as middlewareHandler } from "./middleware/handler.mjs";',
  '// @ts-expect-error: Will be resolved by wrangler build\nimport { handler as middlewareHandler } from "./middleware/handler.mjs";\nimport { handler as serverHandler } from "./server-functions/default/handler.mjs";'
);
w = w.replace(
  '// @ts-expect-error: Will be resolved by wrangler build\r\nimport { handler as middlewareHandler } from "./middleware/handler.mjs";',
  '// @ts-expect-error: Will be resolved by wrangler build\r\nimport { handler as middlewareHandler } from "./middleware/handler.mjs";\r\nimport { handler as serverHandler } from "./server-functions/default/handler.mjs";'
);

// 3. Replace dynamic import call with statically-imported serverHandler
w = w.replace(
  '// @ts-expect-error: resolved by wrangler build\n            const { handler } = await import("./server-functions/default/handler.mjs");\n            return handler(reqOrResp, env, ctx, request.signal);',
  'return serverHandler(reqOrResp, env, ctx, request.signal);'
);
w = w.replace(
  '// @ts-expect-error: resolved by wrangler build\r\n            const { handler } = await import("./server-functions/default/handler.mjs");\r\n            return handler(reqOrResp, env, ctx, request.signal);',
  'return serverHandler(reqOrResp, env, ctx, request.signal);'
);
w = w.replace(
  /const\s+\{\s*handler\s*\}\s*=\s*await\s+import\("\.\/server-functions\/default\/handler\.mjs"\);\s*\r?\n\s*return\s+handler\(reqOrResp/g,
  'return serverHandler(reqOrResp'
);

// 4. Wrap fetch body with try/catch to expose any unhandled errors
w = w.replace(
  'async fetch(request, env, ctx) {',
  'async fetch(request, env, ctx) {\n        try {'
);

// Add catch block right before export default closing brace
w = w.replace(
  '    },\n};',
  '        } catch (err) {\n            return new Response("WORKER ERROR: " + (err.stack || err.message || err), { status: 500, headers: { "content-type": "text/plain" } });\n        }\n    },\n};'
);

fs.writeFileSync(workerDest, w, 'utf8');
console.log('OK: _worker.js built successfully');

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

const dirsToKeep = ['server-functions', 'middleware', 'cloudflare', '.build', 'cache'];
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

console.log('Post-build complete!');
