/**
 * SchoolsPedia — PostgreSQL Parallel Migration Script
 * 
 * Reads local SQLite database and migrates everything to PostgreSQL/CockroachDB
 * using parallel connection pooling and batch statements.
 */

import { createClient } from '@libsql/client';
import pg from 'pg';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const { Pool } = pg;

// 1. Load env variables from .env.local if present
const envPath = join(process.cwd(), '.env.local');
if (existsSync(envPath)) {
  console.log('[Migration] Loading env variables from .env.local');
  const envContent = readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
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

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl || (!dbUrl.startsWith('postgres:') && !dbUrl.startsWith('postgresql:'))) {
  console.error('[Migration Error] DATABASE_URL is not set or not a valid PostgreSQL URL in environment / .env.local.');
  process.exit(1);
}

const dbPath = process.env.DB_PATH || join(process.cwd(), 'data', 'schoolspedia.db');
if (!existsSync(dbPath)) {
  console.error('[Migration Error] Local SQLite database file not found at:', dbPath);
  process.exit(1);
}

// Helper to construct bulk inserts under the 65,535 parameter limit of PostgreSQL
async function bulkInsert(pgClient, tableName, columns, rows) {
  if (rows.length === 0) return;
  
  const placeholders = [];
  const values = [];
  let paramIndex = 1;

  rows.forEach(row => {
    const rowPlaceholders = [];
    columns.forEach(col => {
      rowPlaceholders.push(`$${paramIndex++}`);
      values.push(row[col]);
    });
    placeholders.push(`(${rowPlaceholders.join(',')})`);
  });

  const queryStr = `INSERT INTO ${tableName} (${columns.join(',')}) VALUES ${placeholders.join(',')}`;
  await pgClient.query(queryStr, values);
}

// Helper that wraps bulkInsert with connection checkouts, error listeners, and retry policies
async function bulkInsertWithRetry(pgPool, tableName, columns, rows, maxRetries = 5) {
  let attempt = 0;
  while (attempt < maxRetries) {
    const client = await pgPool.connect();
    // Register error handler to avoid unhandled 'error' crashes
    client.on('error', (err) => {
      console.warn(`[DB Client Warning] Connection error on client: ${err.message}`);
    });
    
    try {
      await bulkInsert(client, tableName, columns, rows);
      client.release();
      return; // Success!
    } catch (e) {
      client.release(true); // Destroy the connection if it failed
      attempt++;
      console.warn(`[DB Client Warning] Batch insert failed for table "${tableName}" (Attempt ${attempt}/${maxRetries}): ${e.message}`);
      if (attempt >= maxRetries) {
        throw e; // Exceeded retries, throw the error
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}

async function migrateTable(sqliteClient, pgPool, tableName, pgColumns, batchSize = 1000, concurrencyLimit = 8) {
  console.log(`[Migration] Copying table "${tableName}"...`);
  
  // Clean target table first
  await pgPool.query(`TRUNCATE TABLE ${tableName} CASCADE`);

  let offset = 0;
  let count = 0;
  let hasMore = true;

  // Shared function to fetch next batch
  async function fetchNextBatch() {
    if (!hasMore) return null;
    
    const currentOffset = offset;
    offset += batchSize;
    
    const res = await sqliteClient.execute({
      sql: `SELECT * FROM ${tableName} LIMIT ? OFFSET ?`,
      args: [batchSize, currentOffset]
    });

    if (!res.rows || res.rows.length === 0) {
      hasMore = false;
      return null;
    }

    return res.rows.map(rowArray => {
      const obj = {};
      res.columns.forEach((col, idx) => {
        obj[col] = rowArray[idx];
      });
      return obj;
    });
  }

  // Spawn persistent workers
  const workers = Array.from({ length: concurrencyLimit }, async () => {
    while (true) {
      const rows = await fetchNextBatch();
      if (!rows) break;

      await bulkInsertWithRetry(pgPool, tableName, pgColumns, rows);
      count += rows.length;
      if (count % 20000 === 0 || rows.length < batchSize) {
        console.log(`  -> Processed ${count.toLocaleString()} rows for table "${tableName}"`);
      }
    }
  });

  // Wait for all workers to finish
  await Promise.all(workers);
  console.log(`[Migration] Completed table "${tableName}": Loaded ${count.toLocaleString()} rows.`);
}

async function run() {
  const start = Date.now();
  console.log('[Migration] Starting SQLite to PostgreSQL migration...');

  // SQLite connection
  const sqliteClient = createClient({
    url: `file:${dbPath.replace(/\\/g, '/')}`
  });

  // PostgreSQL connection Pool
  const sslConfig = dbUrl.includes('sslmode=') || dbUrl.includes('ssl=') || process.env.PG_SSL === 'true'
    ? { rejectUnauthorized: false }
    : false;

  const pgPool = new Pool({
    connectionString: dbUrl,
    ssl: sslConfig,
    max: 12, // Use 12 parallel connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000,
  });

  // Test pool connection
  const res = await pgPool.query('SELECT 1 AS ok');
  if (res.rows && res.rows.length > 0) {
    console.log('[Migration] Connected to PostgreSQL target database pool.');
  }

  // Create DDL tables
  console.log('[Migration] Creating schemas...');
  await pgPool.query(`
    DROP TABLE IF EXISTS schools, villages, block_villages, blocks, districts, states CASCADE;

    CREATE TABLE IF NOT EXISTS states (
        state_slug VARCHAR(255) PRIMARY KEY,
        state_name VARCHAR(150) NOT NULL,
        total_schools INTEGER DEFAULT 0,
        district_count INTEGER DEFAULT 0,
        block_count INTEGER DEFAULT 0,
        village_count INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS districts (
        district_slug VARCHAR(255) NOT NULL,
        state_slug VARCHAR(255) NOT NULL,
        district_name VARCHAR(150) NOT NULL,
        state_name VARCHAR(150) NOT NULL,
        total_schools INTEGER DEFAULT 0,
        block_count INTEGER DEFAULT 0,
        village_count INTEGER DEFAULT 0,
        dist_population INTEGER,
        dist_literacy_pct DOUBLE PRECISION,
        dist_sex_ratio DOUBLE PRECISION,
        dist_avg_lat DOUBLE PRECISION,
        dist_avg_long DOUBLE PRECISION,
        dist_sample_pin INTEGER,
        PRIMARY KEY (state_slug, district_slug)
    );

    CREATE TABLE IF NOT EXISTS blocks (
        block_slug VARCHAR(255) NOT NULL,
        district_slug VARCHAR(255) NOT NULL,
        state_slug VARCHAR(255) NOT NULL,
        block_name VARCHAR(150) NOT NULL,
        district_name VARCHAR(150) NOT NULL,
        state_name VARCHAR(150) NOT NULL,
        total_schools INTEGER DEFAULT 0,
        village_count INTEGER DEFAULT 0,
        PRIMARY KEY (state_slug, district_slug, block_slug)
    );

    CREATE TABLE IF NOT EXISTS block_villages (
        village_slug VARCHAR(255) NOT NULL,
        block_slug VARCHAR(255) NOT NULL,
        district_slug VARCHAR(255) NOT NULL,
        state_slug VARCHAR(255) NOT NULL,
        village_name VARCHAR(150) NOT NULL,
        school_count INTEGER DEFAULT 0,
        PRIMARY KEY (state_slug, district_slug, block_slug, village_slug)
    );

    CREATE TABLE IF NOT EXISTS villages (
        village_code BIGINT PRIMARY KEY,
        village_name VARCHAR(150) NOT NULL,
        village_slug VARCHAR(255) NOT NULL,
        block_code INTEGER,
        block_name VARCHAR(150),
        block_is_pesa VARCHAR(50),
        district_code INTEGER,
        district_name VARCHAR(150) NOT NULL,
        district_slug VARCHAR(255) NOT NULL,
        state_code INTEGER,
        state_name VARCHAR(150) NOT NULL,
        state_slug VARCHAR(255) NOT NULL,
        is_tribal_area VARCHAR(50),
        page_url TEXT,
        dist_population INTEGER,
        dist_male INTEGER,
        dist_female INTEGER,
        dist_sex_ratio DOUBLE PRECISION,
        dist_literacy_pct DOUBLE PRECISION,
        dist_male_lit_pct DOUBLE PRECISION,
        dist_female_lit_pct DOUBLE PRECISION,
        dist_area_sqkm DOUBLE PRECISION,
        dist_pop_density DOUBLE PRECISION,
        dist_sc_pct DOUBLE PRECISION,
        dist_st_pct DOUBLE PRECISION,
        dist_hindus INTEGER,
        dist_hindu_pct DOUBLE PRECISION,
        dist_muslims INTEGER,
        dist_muslim_pct DOUBLE PRECISION,
        dist_total_schools INTEGER,
        dist_govt_schools INTEGER,
        dist_private_schools INTEGER,
        dist_sample_pin INTEGER,
        dist_avg_lat DOUBLE PRECISION,
        dist_avg_long DOUBLE PRECISION,
        block_schools INTEGER
    );

    CREATE TABLE IF NOT EXISTS schools (
        udise_code BIGINT PRIMARY KEY,
        school_name VARCHAR(255) NOT NULL,
        state VARCHAR(150) NOT NULL,
        district VARCHAR(150) NOT NULL,
        block VARCHAR(150) NOT NULL,
        village VARCHAR(150) NOT NULL,
        cluster VARCHAR(150),
        location VARCHAR(100),
        state_mgmt VARCHAR(150),
        national_mgmt VARCHAR(150),
        school_category VARCHAR(150),
        school_type VARCHAR(100),
        school_status VARCHAR(100),
        state_slug VARCHAR(255) NOT NULL,
        district_slug VARCHAR(255) NOT NULL,
        block_slug VARCHAR(255) NOT NULL,
        village_slug VARCHAR(255) NOT NULL,
        school_slug VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        has_library INTEGER DEFAULT 0,
        has_electricity INTEGER DEFAULT 0,
        has_computers INTEGER DEFAULT 0,
        boys_toilets_count INTEGER DEFAULT 0,
        girls_toilets_count INTEGER DEFAULT 0,
        school_id BIGINT,
        pincode VARCHAR(20),
        address TEXT,
        email VARCHAR(255),
        headmaster_name VARCHAR(255),
        establishment_year INTEGER,
        phone VARCHAR(100),
        website VARCHAR(255),
        medium_of_instruction VARCHAR(255),
        has_playground VARCHAR(50),
        has_internet VARCHAR(50),
        has_toilet INTEGER DEFAULT 0,
        total_students INTEGER,
        boys INTEGER,
        girls INTEGER,
        total_teachers INTEGER,
        male_teachers INTEGER,
        female_teachers INTEGER,
        last_updated VARCHAR(100)
    );

    CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        udise_code VARCHAR(50) NOT NULL,
        reviewer_name VARCHAR(150) NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        school VARCHAR(255) NOT NULL,
        details TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('[Migration] Table schemas verified.');

  // Drop indexes before copying for better insertion speed
  console.log('[Migration] Dropping old indexes to speed up insertion...');
  const indexDrops = [
    'idx_schools_state_slug', 'idx_schools_district_slug', 'idx_schools_block_slug',
    'idx_schools_village_slug', 'idx_schools_slug', 'idx_schools_udise_code',
    'idx_villages_slugs', 'idx_block_villages_slugs', 'idx_blocks_slugs', 'idx_districts_slugs',
    'idx_schools_lower_name', 'idx_schools_trgm_direct', 'idx_schools_trgm_village', 'idx_schools_trgm_district'
  ];
  for (const idx of indexDrops) {
    await pgPool.query(`DROP INDEX IF EXISTS ${idx}`);
  }

  // 1. States table
  await migrateTable(sqliteClient, pgPool, 'states', [
    'state_slug', 'state_name', 'total_schools', 'district_count', 'block_count', 'village_count'
  ], 100, 2);

  // 2. Districts table
  await migrateTable(sqliteClient, pgPool, 'districts', [
    'district_slug', 'state_slug', 'district_name', 'state_name', 'total_schools',
    'block_count', 'village_count', 'dist_population', 'dist_literacy_pct',
    'dist_sex_ratio', 'dist_avg_lat', 'dist_avg_long', 'dist_sample_pin'
  ], 500, 2);

  // 3. Blocks table
  await migrateTable(sqliteClient, pgPool, 'blocks', [
    'block_slug', 'district_slug', 'state_slug', 'block_name', 'district_name',
    'state_name', 'total_schools', 'village_count'
  ], 1000, 4);

  // 4. Block Villages table (Medium size)
  await migrateTable(sqliteClient, pgPool, 'block_villages', [
    'village_slug', 'block_slug', 'district_slug', 'state_slug', 'village_name', 'school_count'
  ], 2000, 8); // Concurrency 8, batch size 2000

  // 5. Villages table (Large size)
  await migrateTable(sqliteClient, pgPool, 'villages', [
    'village_code', 'village_name', 'village_slug', 'block_code', 'block_name',
    'block_is_pesa', 'district_code', 'district_name', 'district_slug', 'state_code',
    'state_name', 'state_slug', 'is_tribal_area', 'page_url', 'dist_population',
    'dist_male', 'dist_female', 'dist_sex_ratio', 'dist_literacy_pct', 'dist_male_lit_pct',
    'dist_female_lit_pct', 'dist_area_sqkm', 'dist_pop_density', 'dist_sc_pct', 'dist_st_pct',
    'dist_hindus', 'dist_hindu_pct', 'dist_muslims', 'dist_muslim_pct', 'dist_total_schools',
    'dist_govt_schools', 'dist_private_schools', 'dist_sample_pin', 'dist_avg_lat',
    'dist_avg_long', 'block_schools'
  ], 200, 10); // Concurrency 10, batch size 200

  // 6. Schools table (Very large: 1.6M rows)
  await migrateTable(sqliteClient, pgPool, 'schools', [
    'udise_code', 'school_name', 'state', 'district', 'block', 'village', 'cluster',
    'location', 'state_mgmt', 'national_mgmt', 'school_category', 'school_type',
    'school_status', 'state_slug', 'district_slug', 'block_slug', 'village_slug',
    'school_slug', 'url', 'has_library', 'has_electricity', 'has_computers',
    'boys_toilets_count', 'girls_toilets_count', 'school_id', 'pincode', 'address',
    'email', 'headmaster_name', 'establishment_year', 'phone', 'website',
    'medium_of_instruction', 'has_playground', 'has_internet', 'has_toilet',
    'total_students', 'boys', 'girls', 'total_teachers', 'male_teachers',
    'female_teachers', 'last_updated'
  ], 300, 10); // Concurrency 10, batch size 300

  // 7. Reviews and Submissions table (usually empty or small during init)
  // Commeted out to protect production user data from truncate:
  // await migrateTable(sqliteClient, pgPool, 'reviews', [
  //   'udise_code', 'reviewer_name', 'rating', 'comment'
  // ], 1000, 2);
  // 
  // await migrateTable(sqliteClient, pgPool, 'contact_submissions', [
  //   'name', 'email', 'school', 'details'
  // ], 1000, 2);

  // Re-create indexes POST-loading
  console.log('[Migration] Creating optimized database indexes...');
  await pgPool.query(`
    CREATE INDEX IF NOT EXISTS idx_schools_state_slug ON schools (state_slug);
    CREATE INDEX IF NOT EXISTS idx_schools_district_slug ON schools (state_slug, district_slug);
    CREATE INDEX IF NOT EXISTS idx_schools_block_slug ON schools (state_slug, district_slug, block_slug);
    CREATE INDEX IF NOT EXISTS idx_schools_village_slug ON schools (state_slug, district_slug, block_slug, village_slug);
    CREATE INDEX IF NOT EXISTS idx_schools_slug ON schools (school_slug);
    CREATE INDEX IF NOT EXISTS idx_schools_udise_code ON schools (udise_code);
    CREATE INDEX IF NOT EXISTS idx_schools_lower_name ON schools (lower(school_name));
    CREATE INDEX IF NOT EXISTS idx_schools_trgm_direct ON schools USING gin (school_name gin_trgm_ops);
    CREATE INDEX IF NOT EXISTS idx_schools_trgm_village ON schools USING gin (village gin_trgm_ops);
    CREATE INDEX IF NOT EXISTS idx_schools_trgm_district ON schools USING gin (district gin_trgm_ops);

    CREATE INDEX IF NOT EXISTS idx_villages_slugs ON villages (state_slug, district_slug, village_slug);
    CREATE INDEX IF NOT EXISTS idx_block_villages_slugs ON block_villages (state_slug, district_slug, block_slug, village_slug);
    CREATE INDEX IF NOT EXISTS idx_blocks_slugs ON blocks (state_slug, district_slug, block_slug);
    CREATE INDEX IF NOT EXISTS idx_districts_slugs ON districts (state_slug, district_slug);
  `);
  console.log('[Migration] Database indexes successfully created.');

  const durationSec = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`[Migration SUCCESS] SQLite to PostgreSQL migration finished successfully in ${durationSec}s.`);

  await pgPool.end();
}

run().catch(e => {
  console.error('[Migration FAILED]', e);
  process.exit(1);
});
