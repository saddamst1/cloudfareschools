import { createClient } from '@libsql/client';

const dbPath = process.cwd() + '/data/schoolspedia.db';
const client = createClient({ url: `file:${dbPath.replace(/\\/g, '/')}` });

async function run() {
  try {
    const q = 'public';
    const ftsQuery = q.trim().split(/\s+/).filter(Boolean).map(w => `"${w}"*`).join(' OR ');
    console.log("ftsQuery:", ftsQuery);
    const sql = `SELECT * FROM schools_fts WHERE schools_fts MATCH ? ORDER BY rank LIMIT 5`;
    console.log("sql:", sql);
    const res = await client.execute({ sql, args: [ftsQuery] });
    console.log("rows:", res.rows);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
run();
