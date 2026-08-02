/**
 * SchoolsPedia — Database Client (Cloudflare Pages & Edge Compatible)
 *
 * Supports:
 * 1. CockroachDB / PostgreSQL via `pg` Connection Pool (over TCP via nodejs_compat).
 * 2. Hosted Turso/libSQL if TURSO_URL is configured.
 * 3. Graceful fallback to mock data when database is unavailable.
 *
 * ── IN-MEMORY QUERY CACHE ──────────────────────────────────────────────────
 * Deduplicates identical DB queries within warm Worker invocations.
 */

import pg from 'pg';

let _pool = null;
let _tursoClient = null;
let _mode = null; // 'postgres' | 'turso' | null
let _dbAttempted = false;

// ── Query Cache ────────────────────────────────────────────────────────────
const _cache = new Map();
const DEFAULT_TTL = 10 * 60 * 1000; // 10 minutes in ms

function getCacheTTL(sql) {
  const s = sql.toLowerCase();
  if (/from\s+(states|districts|blocks|block_villages)/.test(s) && !/where/.test(s)) {
    return 24 * 60 * 60 * 1000; // 24 hours
  }
  if (/from\s+schools\s+where/.test(s)) return 30 * 60 * 1000; // 30 min
  if (/like\s+'%/.test(s) || /search/.test(s)) return 5 * 60 * 1000; // 5 min
  return DEFAULT_TTL;
}

function cacheGet(key) {
  const entry = _cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) { _cache.delete(key); return null; }
  return entry.data;
}

function cacheSet(key, data, ttl) {
  if (_cache.size >= 500) {
    const firstKey = _cache.keys().next().value;
    _cache.delete(firstKey);
  }
  _cache.set(key, { data, expires: Date.now() + ttl });
}
// ──────────────────────────────────────────────────────────────────────────

/**
 * Convert SQLite '?' placeholders to PostgreSQL '$1', '$2', ...
 */
function convertSqlPlaceholders(sql) {
  let paramIndex = 1;
  return sql.replace(/\?/g, () => `$${paramIndex++}`);
}

async function initClient() {
  if (_dbAttempted && _mode) return;
  _dbAttempted = true;

  const dbUrl = process.env.DATABASE_URL || '';

  // ── Option 1: PostgreSQL / CockroachDB Connection Pool ───────────────────
  if (dbUrl.startsWith('postgres:') || dbUrl.startsWith('postgresql:')) {
    try {
      const Pool = pg.Pool || pg.default?.Pool || pg.default;
      _pool = new Pool({
        connectionString: dbUrl,
        max: parseInt(process.env.PG_POOL_MAX || '5', 10),
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 5000,
        ssl: { rejectUnauthorized: false },
        statement_timeout: 10000,
        application_name: 'schoolspedia-cf',
      });

      _pool.on('error', (err) => {
        console.warn('[SchoolsPedia PG Pool Warning]', err.message);
      });

      // Test connection
      const res = await _pool.query('SELECT 1 AS ok');
      if (res.rows && res.rows.length > 0) {
        _mode = 'postgres';
        console.log('[SchoolsPedia DB] Connected to PostgreSQL / CockroachDB');
        return;
      }
    } catch (e) {
      console.warn('[SchoolsPedia DB] PostgreSQL connection failed, falling back:', e.message);
      _pool = null;
      _dbAttempted = false; // Allow retry on next request
    }
  }

  // ── Option 2: Hosted Turso/libSQL ────────────────────────────────────────
  if (process.env.TURSO_URL && process.env.TURSO_URL.startsWith('libsql:')) {
    try {
      const { createClient } = await import('@libsql/client/web');
      _tursoClient = createClient({
        url: process.env.TURSO_URL,
        authToken: process.env.TURSO_AUTH_TOKEN || '',
      });
      await _tursoClient.execute('SELECT 1');
      _mode = 'turso';
      console.log('[SchoolsPedia DB] Connected to hosted Turso database');
      return;
    } catch (e) {
      console.warn('[SchoolsPedia DB] Hosted Turso connection failed, falling back:', e.message);
      _tursoClient = null;
      _dbAttempted = false;
    }
  }

  console.warn('[SchoolsPedia DB] Database unavailable. Mock data fallback active.');
}

export async function isDbAvailable() {
  await initClient();
  return _mode !== null;
}

export function isPostgres() {
  return _mode === 'postgres';
}

export async function query(sql, params = []) {
  await initClient();
  if (!_mode) return [];

  // ── Cache lookup ──
  const cacheKey = sql + '|' + JSON.stringify(params);
  const cached = cacheGet(cacheKey);
  if (cached !== null) return cached;

  // ── PostgreSQL / CockroachDB Path ───────────────────────────────────────
  if (_mode === 'postgres') {
    try {
      const pgSql = convertSqlPlaceholders(sql);
      const res = await _pool.query(pgSql, params);
      cacheSet(cacheKey, res.rows, getCacheTTL(sql));
      return res.rows;
    } catch (e) {
      console.error('[Postgres Query Error]', e.message, '\nSQL:', sql.slice(0, 80));
      return [];
    }
  }

  // ── Turso / libSQL Path ──────────────────────────────────────────────────
  if (_mode === 'turso') {
    try {
      const res = await _tursoClient.execute({ sql, args: params });
      const rows = res.rows.map(row => {
        const obj = {};
        if (res.columns) {
          res.columns.forEach((col, idx) => { obj[col] = row[idx]; });
        } else {
          for (const key of Object.keys(row)) { obj[key] = row[key]; }
        }
        return obj;
      });
      cacheSet(cacheKey, rows, getCacheTTL(sql));
      return rows;
    } catch (e) {
      console.error('[Turso Query Error]', e.message, '\nSQL:', sql.slice(0, 80));
      return [];
    }
  }

  return [];
}

export async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0] : null;
}
