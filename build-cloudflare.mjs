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
// Convert dynamic import of server handler to a STATIC top-level import.
// This forces CF Pages' esbuild to BUNDLE handler.mjs at compile time,
// rather than leaving it as a runtime dynamic module lookup that can fail.
// -----------------------------------------------------------------------
const workerSrc = path.join(openNextDir, 'worker.js');
const workerDest = path.join(assetsDir, '_worker.js');
console.log('Building _worker.js with static server handler import...');

let w = fs.readFileSync(workerSrc, 'utf8');

// 1. Add static top-level import of the server handler (before the export default)
w = w.replace(
  '// @ts-expect-error: Will be resolved by wrangler build\nimport { handler as middlewareHandler } from "./middleware/handler.mjs";',
  '// @ts-expect-error: Will be resolved by wrangler build\nimport { handler as middlewareHandler } from "./middleware/handler.mjs";\n// Static import (instead of dynamic) so CF Pages bundles it at compile time\nimport { handler as serverHandler } from "./server-functions/default/handler.mjs";'
);

// 2. Replace the dynamic import call with the statically-imported handler
w = w.replace(
  '// @ts-expect-error: resolved by wrangler build\n            const { handler } = await import("./server-functions/default/handler.mjs");\n            return handler(reqOrResp, env, ctx, request.signal);',
  'return serverHandler(reqOrResp, env, ctx, request.signal);'
);
// Fallback pattern in case spacing differs slightly
w = w.replace(
  /const \{ handler \} = await import\("\.\/server-functions\/default\/handler\.mjs"\);\s*\n\s*return handler\(reqOrResp/,
  'return serverHandler(reqOrResp'
);

fs.writeFileSync(workerDest, w, 'utf8');
console.log('OK: _worker.js written with static import');

// Sanity check - no dynamic import left
if (w.includes('await import(')) {
  console.warn('WARN: Dynamic import still present in _worker.js - static replacement may have failed');
} else {
  console.log('OK: No dynamic imports remain - all bundled statically');
}

// Write _routes.json - exclude static assets so CF serves them directly (no worker needed)
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
console.log('OK: _routes.json written (static assets excluded from worker)');

// -----------------------------------------------------------------------
// Copy supporting dirs — skip symlinks (circular copy avoidance)
// -----------------------------------------------------------------------
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
