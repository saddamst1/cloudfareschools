import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

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
// Build _worker.js entrypoint:
// Convert dynamic import of server handler to a STATIC top-level import.
// Strip Durable Object exports (DOQueueHandler, DOShardedTagCache, BucketCachePurge).
// Wrap fetch handler in try/catch error boundary and defer createMainHandler to lazy load inside fetch.
// -----------------------------------------------------------------------
const workerSrc = path.join(openNextDir, 'worker.js');
const workerDest = path.join(assetsDir, '_worker.js');
console.log('Building initial _worker.js entrypoint...');

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

// 4. Defer top-level await createMainHandler() to lazy promise inside fetch handler
w = w.replace(
  'var handler2 = await createMainHandler();',
  `let _handler2Promise = null;
function getMainHandler() {
  if (!_handler2Promise) {
    _handler2Promise = createMainHandler();
  }
  return _handler2Promise;
}`
);

w = w.replace(
  'return handler2(reqOrResp, env, ctx, request.signal);',
  `const handler2Inst = await getMainHandler();
            return handler2Inst(reqOrResp, env, ctx, request.signal);`
);

// 5. Wrap fetch handler body in try/catch error boundary
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
console.log('OK: Initial _worker.js written');

// Write _routes.json
const routesContent = JSON.stringify({
  version: 1,
  include: ['/*'],
  exclude: [
    '/_next/static/*',
    '/favicon.ico',
    '/og-*.png',
    '/authors/*',
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
// -----------------------------------------------------------------------
const nodeBuiltinModules = [
  'async_hooks', 'buffer', 'child_process', 'crypto', 'dns', 'events', 
  'fs', 'http', 'https', 'module', 'net', 'os', 'path', 'process', 'querystring', 
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
        const r1 = new RegExp(`require\\(["']${m}["']\\)`, 'g');
        if (r1.test(code)) {
          code = code.replace(r1, `require("node:${m}")`);
          changed = true;
          totalNodeFixes++;
        }
        const r2 = new RegExp(`from\\s+["']${m}["']`, 'g');
        if (r2.test(code)) {
          code = code.replace(r2, `from "node:${m}"`);
          changed = true;
          totalNodeFixes++;
        }
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

console.log('Fixing bare Node.js builtin imports...');
fixNodeImportsInDir(assetsDir);
console.log(`OK: Applied Node.js compat fixes across all assets (${totalNodeFixes} bare imports replaced)`);

// -----------------------------------------------------------------------
// Single-File Bundle Generation:
// Bundle _worker.js + middleware + server-functions into a single 100% self-contained ESM _worker.js file.
// Uses custom require proxy that lazily delegates to native createRequire with fallback stub.
// -----------------------------------------------------------------------
console.log('Bundling _worker.js into a single self-contained Worker bundle via esbuild...');
const bannerCode = `import { createRequire as _uniqueReq_ } from 'node:module';
if (!Promise.withResolvers) {
  Promise.withResolvers = function() {
    let resolve, reject;
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
    return { promise, resolve, reject };
  };
}
class DummyStream { constructor() {} on() { return this; } emit() { return true; } pipe(dest) { return dest; } write() { return true; } end() {} }
class DummyAsyncLocalStorage {
  constructor() { this.store = null; }
  getStore() { return this.store; }
  run(store, callback, ...args) { this.store = store; try { return callback(...args); } finally { this.store = null; } }
  exit(callback, ...args) { return callback(...args); }
  enterWith(store) { this.store = store; }
}
class DummySocket {
  constructor() { this.writable = true; this.readable = true; }
  connect() { return this; }
  on() { return this; }
  once() { return this; }
  removeListener() { return this; }
  write() { return true; }
  destroy() {}
  end() {}
  setTimeout() {}
  setNoDelay() {}
  setKeepAlive() {}
}
const __fsStub__ = {
  prototype: { require: () => {} },
  _resolveFilename: (id) => id,
  Socket: DummySocket, connect: () => new DummySocket(), createConnection: () => new DummySocket(),
  readFileSync: () => '', existsSync: () => false, statSync: () => ({ size: 0, isDirectory: () => false }),
  promises: { readFile: async () => '', stat: async () => ({ size: 0, isDirectory: () => false }), access: async () => {} },
  promisify: Object.assign((fn) => fn, { custom: Symbol.for('nodejs.util.promisify.custom') }),
  TextEncoder: globalThis.TextEncoder, TextDecoder: globalThis.TextDecoder,
  AsyncLocalStorage: DummyAsyncLocalStorage, AsyncResource: class { runInAsyncScope(fn, ...args) { return fn(...args); } },
  Readable: DummyStream, Writable: DummyStream, Transform: DummyStream, PassThrough: DummyStream, Stream: DummyStream,
  Agent: DummyStream,
  randomUUID: () => '00000000-0000-4000-8000-000000000000',
  randomBytes: (sz, cb) => { const buf = globalThis.Buffer ? globalThis.Buffer.alloc(sz) : new Uint8Array(sz); return cb ? cb(null, buf) : buf; },
  randomFillSync: (buf) => buf,
  createHash: () => ({ update: function() { return this; }, digest: () => '0000000000000000' }),
  createHmac: () => ({ update: function() { return this; }, digest: () => '0000000000000000' }),
  readdirSync: () => [], mkdirSync: () => {}, writeFileSync: () => {}, Session: function() {},
  cpus: () => [{ model: 'Cloudflare Worker', speed: 2400 }], type: () => 'Linux', release: () => '1.0.0', arch: () => 'x64',
  platform: () => 'linux', totalmem: () => 1073741824, freemem: () => 536870912, homedir: () => '/tmp', tmpdir: () => '/tmp',
  userInfo: () => ({ username: 'worker' }), hostname: () => 'cloudflare', endianness: () => 'LE', loadavg: () => [0, 0, 0],
  networkInterfaces: () => ({}), uptime: () => 100,
  resolve: (...args) => args.join('/'), join: (...args) => args.join('/'), relative: () => '', dirname: (p) => p || '/',
  basename: (p) => p || '', extname: () => '', isAbsolute: () => true, sep: '/', delimiter: ':', normalize: (p) => p,
  parse: () => ({ root: '/', dir: '/', base: '', ext: '', name: '' }), format: () => ''
};
__fsStub__.posix = __fsStub__;
__fsStub__.win32 = __fsStub__;
let _cachedNativeReq = undefined;
function getNativeReq() {
  if (_cachedNativeReq !== undefined) return _cachedNativeReq;
  try {
    if (typeof _uniqueReq_ === 'function') {
      _cachedNativeReq = _uniqueReq_('file:///worker.js');
      return _cachedNativeReq;
    }
  } catch (e) {}
  _cachedNativeReq = null;
  return null;
}
const require = function(id) {
  try {
    const nr = getNativeReq();
    const mod = nr ? nr(id) : null;
    if (mod) return Object.assign({}, __fsStub__, mod);
  } catch (e) {}
  return __fsStub__;
};
globalThis.require = require;`;

try {
  execSync(
    `npx -y esbuild .open-next/assets/_worker.js --bundle --format=esm --target=es2022 --platform=neutral "--define:this=globalThis" "--external:node:*" "--external:cloudflare:*" "--banner:js=${bannerCode.replace(/\n/g, ' ')}" --outfile=.open-next/assets/_worker.js --allow-overwrite`,
    { stdio: 'inherit' }
  );
  console.log('OK: Single-file _worker.js bundle generated successfully!');
} catch (e) {
  console.error('ERROR: Failed to bundle _worker.js:', e.message);
  process.exit(1);
}

// -----------------------------------------------------------------------
// Post-bundle fixes:
// Defer top-level await createMainHandler() to lazy load inside fetch.
// Patches for frozen module mutation in Next.js internal loggers.
// -----------------------------------------------------------------------
let bundledWorker = fs.readFileSync(workerDest, 'utf8');

bundledWorker = bundledWorker.replace(
  'var handler22 = await createMainHandler();',
  `let _handler22Promise = null;
function getMainHandler() {
  if (!_handler22Promise) {
    _handler22Promise = createMainHandler();
  }
  return _handler22Promise;
}`
);

bundledWorker = bundledWorker.replace(
  'return handler22(reqOrResp, env, ctx, request.signal);',
  `const handler22 = await getMainHandler();
        return handler22(reqOrResp, env, ctx, request.signal);`
);

bundledWorker = bundledWorker.replace(/nodeTimers\.setImmediate\s*=\s*patchedSetImmediate/g, 'patchedSetImmediate');
bundledWorker = bundledWorker.replace(/nodeTimers\.clearImmediate\s*=\s*patchedClearImmediate/g, 'patchedClearImmediate');
bundledWorker = bundledWorker.replace(/nodeTimersPromises\.setImmediate\s*=\s*patchedSetImmediatePromise/g, 'patchedSetImmediatePromise');
fs.writeFileSync(workerDest, bundledWorker, 'utf8');
console.log('OK: Applied post-bundle ESM frozen module mutation and lazy main handler patches on _worker.js');

console.log('Post-build complete!');
