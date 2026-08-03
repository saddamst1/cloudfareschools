import fs from 'fs';
import path from 'path';

const modules = [
  'async_hooks', 'buffer', 'child_process', 'crypto', 'dns', 'events', 
  'fs', 'http', 'https', 'net', 'os', 'path', 'process', 'querystring', 
  'stream', 'string_decoder', 'tls', 'url', 'util', 'vm', 'zlib', 'assert'
];

export function fixBareNodeImportsInFile(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  let code = fs.readFileSync(filePath, 'utf8');
  let replacements = 0;

  for (const m of modules) {
    // 1. require("fs") -> require("node:fs")
    const r1 = new RegExp(`require\\(["']${m}["']\\)`, 'g');
    const matches1 = (code.match(r1) || []).length;
    if (matches1 > 0) {
      code = code.replace(r1, `require("node:${m}")`);
      replacements += matches1;
    }

    // 2. from "fs" -> from "node:fs"
    const r2 = new RegExp(`from\\s+["']${m}["']`, 'g');
    const matches2 = (code.match(r2) || []).length;
    if (matches2 > 0) {
      code = code.replace(r2, `from "node:${m}"`);
      replacements += matches2;
    }

    // 3. import("fs") -> import("node:fs")
    const r3 = new RegExp(`import\\(["']${m}["']\\)`, 'g');
    const matches3 = (code.match(r3) || []).length;
    if (matches3 > 0) {
      code = code.replace(r3, `import("node:${m}")`);
      replacements += matches3;
    }
  }

  if (replacements > 0) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
  return replacements;
}
