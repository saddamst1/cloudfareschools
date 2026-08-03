import fs from 'fs';
import path from 'path';

console.log('Running Cloudflare Pages post-build script...');

const openNextDir = '.open-next';
const assetsDir = path.join(openNextDir, 'assets');

// Ensure assets dir exists
if (!fs.existsSync(assetsDir)) {
  console.error('ERROR: .open-next/assets does not exist!');
  process.exit(1);
}

// Copy worker.js to assets/_worker.js with error logging wrapper
const workerSrc = path.join(openNextDir, 'worker.js');
const workerDest = path.join(assetsDir, '_worker.js');
console.log('Copying worker.js to assets/_worker.js with error handling wrapper...');

let workerContent = fs.readFileSync(workerSrc, 'utf8');

// Inject try/catch inside fetch handler so any runtime crash prints the actual error message
workerContent = workerContent.replace(
  'async fetch(request, env, ctx) {',
  `async fetch(request, env, ctx) {
        try {`
);

// Close try block before the fetch function end
workerContent = workerContent.replace(
  'return handler(reqOrResp, env, ctx, request.signal);\n        });\n    },',
  `return await handler(reqOrResp, env, ctx, request.signal);
        });
        } catch (err) {
          console.error("WORKER EXCEPTION:", err);
          return new Response("WORKER ERROR: " + (err?.stack || err?.message || String(err)), { status: 500, headers: { "content-type": "text/plain" } });
        }
    },`
);

fs.writeFileSync(workerDest, workerContent, 'utf8');
console.log('OK: _worker.js created with error capture wrapper');

// Write _routes.json
const routesContent = JSON.stringify({ version: 1, include: ['/*'], exclude: [] });
fs.writeFileSync(path.join(assetsDir, '_routes.json'), routesContent);
console.log('OK: _routes.json written');

// Copy required directories - but skip symlinks to avoid circular copy
function copyDirNoSymlinks(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
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
    console.log('SKIP:', dir, 'does not exist');
  }
}

console.log('Post-build complete!');
