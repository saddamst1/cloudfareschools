import pg from 'pg';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const { Pool } = pg;

// Read .env.production.local manually
const envPath = join(process.cwd(), '.env.production.local');
if (existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      process.env[key] = val;
    }
  });
}

const dbUrl = process.env.DATABASE_URL || 'postgresql://schoolsv1:taxzmVDYud4CswwoUYvuxg@sound-python-30115.j77.aws-ap-south-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full';

async function checkCockroach() {
  console.log('====================================================');
  console.log('🔍 COCKROACHDB DATA AUDIT & VERIFICATION REPORT');
  console.log('====================================================');
  
  if (!dbUrl) {
    console.error('❌ DATABASE_URL is not defined in .env.production.local');
    return;
  }

  // Obfuscate DB host for logging security
  const safeUrl = dbUrl.replace(/:[^:@]+@/, ':****@');
  console.log('🌐 Connecting to CockroachDB:', safeUrl);

  const sslConfig = dbUrl.includes('sslmode=') || dbUrl.includes('ssl=') || process.env.PG_SSL === 'true'
    ? { rejectUnauthorized: false }
    : false;

  const pool = new Pool({
    connectionString: dbUrl,
    ssl: sslConfig,
    connectionTimeoutMillis: 15000,
  });

  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to CockroachDB!');

    const tables = ['states', 'districts', 'blocks', 'block_villages', 'villages', 'schools'];
    
    // SQLite master expected baseline
    const expectedCounts = {
      states: 36,
      districts: 748,
      blocks: 7453,
      block_villages: 588312,
      villages: 652177,
      schools: 1653159
    };

    console.log('\n----------------------------------------------------');
    console.log('📊 TABLE ROW COUNTS COMPARISON (CockroachDB vs SQLite)');
    console.log('----------------------------------------------------');
    
    const results = {};

    for (const table of tables) {
      try {
        const res = await client.query(`SELECT COUNT(*) AS total FROM ${table}`);
        const count = parseInt(res.rows[0].total, 10);
        results[table] = count;
        const expected = expectedCounts[table];
        const diff = count - expected;
        const status = count === expected ? '✅ MATCH' : count > 0 ? `⚠️ PARTIAL (${diff > 0 ? '+' : ''}${diff})` : '❌ EMPTY';
        console.log(`Table '${table}': CockroachDB = ${count.toLocaleString('en-IN')} | Master SQLite = ${expected.toLocaleString('en-IN')} | Status: ${status}`);
      } catch (err) {
        console.error(`❌ Error querying table '${table}': ${err.message}`);
      }
    }

    // Check sample URLs and missing URL patterns
    console.log('\n----------------------------------------------------');
    console.log('🔗 CHECKING URL FORMATS & MISSING SLUGS IN COCKROACHDB');
    console.log('----------------------------------------------------');

    const sampleSchools = await client.query(`
      SELECT udise_code, school_name, state_slug, district_slug, block_slug, village_slug, school_slug 
      FROM schools LIMIT 5
    `);
    console.log('Sample CockroachDB School Rows:');
    sampleSchools.rows.forEach(r => {
      console.log(` - UDISE: ${r.udise_code} | Name: ${r.school_name} | URL: /schools/${r.state_slug}/${r.district_slug}/${r.block_slug}/${r.village_slug}/${r.school_slug}`);
    });

    // Check null or empty URLs/slugs
    const nullSlugs = await client.query(`
      SELECT 
        SUM(CASE WHEN state_slug IS NULL OR state_slug = '' THEN 1 ELSE 0 END) AS missing_state_slug,
        SUM(CASE WHEN district_slug IS NULL OR district_slug = '' THEN 1 ELSE 0 END) AS missing_dist_slug,
        SUM(CASE WHEN block_slug IS NULL OR block_slug = '' THEN 1 ELSE 0 END) AS missing_block_slug,
        SUM(CASE WHEN village_slug IS NULL OR village_slug = '' THEN 1 ELSE 0 END) AS missing_village_slug,
        SUM(CASE WHEN school_slug IS NULL OR school_slug = '' THEN 1 ELSE 0 END) AS missing_school_slug
      FROM schools
    `);
    console.log('\nMissing Slugs Check in CockroachDB:');
    console.log(nullSlugs.rows[0]);

    client.release();
  } catch (e) {
    console.error('❌ Connection / Query Error:', e.message);
  } finally {
    await pool.end();
  }
}

checkCockroach();
