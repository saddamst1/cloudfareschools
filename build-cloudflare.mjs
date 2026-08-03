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
// 1. Strip Durable Object exports (DOQueueHandler, DOShardedTagCache, BucketCachePurge)
// 2. Add catch block inside fetch() to surface uncaught worker exceptions
// -----------------------------------------------------------------------
const workerSrc = path.join(openNextDir, 'worker.js');
const workerDest = path.join(assetsDir, '_worker.js');
console.log('Building _worker.js...');

let w = fs.readFileSync(workerSrc, 'utf8');

// Strip Durable Object exports
w = w.replace(/export\s+\{\s*DOQueueHandler\s*\}\s+from\s+["']\.\/\.build\/durable-objects\/queue\.js["'];?/g, '');
w = w.replace(/export\s+\{\s*DOShardedTagCache\s*\}\s+from\s+["']\.\/\.build\/durable-objects\/sharded-tag-cache\.js["'];?/g, '');
w = w.replace(/export\s+\{\s*BucketCachePurge\s*\}\s+from\s+["']\.\/\.build\/durable-objects\/bucket-cache-purge\.js["'];?/g, '');
w = w.replace(/\/\/@ts-expect-error:\s*Will be resolved by wrangler build\s*\r?\n(?=export\s+\{)/g, '');

// Wrap fetch handler in try/catch to expose exact error stack if import or execution fails
w = w.replace(
  'async fetch(request, env, ctx) {',
  `async fetch(request, env, ctx) {
        try {`
);

w = w.replace(
  '    },\n};',
  `        } catch (err) {
            return new Response("WORKER ERROR:\\n" + (err.stack || err.message || String(err)), {
                status: 500,
                headers: { "content-type": "text/plain; charset=utf-8" }
            });
        }
    },
};`
);

fs.writeFileSync(workerDest, w, 'utf8');
console.log('OK: _worker.js written');

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
