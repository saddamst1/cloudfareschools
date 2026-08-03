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
// Build _worker.js — strip Durable Object exports which crash Pages Free
// (DurableObject class from "cloudflare:workers" is unavailable on Pages)
// -----------------------------------------------------------------------
const workerSrc = path.join(openNextDir, 'worker.js');
const workerDest = path.join(assetsDir, '_worker.js');
console.log('Building _worker.js (stripping Durable Object exports)...');

let w = fs.readFileSync(workerSrc, 'utf8');

// Strip DO export lines — these reference .build/durable-objects/*.js which
// import from "cloudflare:workers", unavailable on Pages Free tier.
w = w.replace(/\/\/[^\n]*\nexport { DOQueueHandler } from ".*?";\r?\n?/g, '');
w = w.replace(/\/\/[^\n]*\nexport { DOShardedTagCache } from ".*?";\r?\n?/g, '');
w = w.replace(/\/\/[^\n]*\nexport { BucketCachePurge } from ".*?";\r?\n?/g, '');
// Catch remaining bare export lines if comment pattern differs
w = w.replace(/export { DOQueueHandler } from ".*?";\r?\n?/g, '');
w = w.replace(/export { DOShardedTagCache } from ".*?";\r?\n?/g, '');
w = w.replace(/export { BucketCachePurge } from ".*?";\r?\n?/g, '');

fs.writeFileSync(workerDest, w, 'utf8');
console.log('OK: _worker.js written (DO exports stripped)');

// Verify no DO exports remain
if (w.includes('DOQueueHandler') || w.includes('DOShardedTagCache') || w.includes('BucketCachePurge')) {
  console.error('ERROR: Durable Object exports were NOT fully stripped! Aborting.');
  process.exit(1);
}
console.log('OK: Verified — no Durable Object exports in _worker.js');

// Write _routes.json
fs.writeFileSync(
  path.join(assetsDir, '_routes.json'),
  JSON.stringify({ version: 1, include: ['/*'], exclude: [] })
);
console.log('OK: _routes.json written');

// -----------------------------------------------------------------------
// Copy supporting dirs — skip symlinks (circular copy) AND .build/
// (.build/ only contains Durable Object JS that needs "cloudflare:workers")
// -----------------------------------------------------------------------
function copyDirNoSymlinks(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isSymbolicLink()) {
      // skip — avoids circular-copy crash (pg symlink pointing to root node_modules)
      continue;
    } else if (entry.isDirectory()) {
      copyDirNoSymlinks(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// NOTE: '.build' is intentionally excluded — it only has Durable Object files
const dirsToKeep = ['server-functions', 'middleware', 'cloudflare', 'cache'];
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
