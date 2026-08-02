/**
 * SchoolsPedia — Database Client (Cloudflare Pages Compatible)
 *
 * Connects to PostgreSQL / CockroachDB via `pg` Connection Pool (over TCP via nodejs_compat).
 * Falls back gracefully to mock data when database is unavailable.
 *
 * ── IN-MEMORY QUERY CACHE ──────────────────────────────────────────────────
 * Deduplicates identical DB queries within warm Worker invocations.
 */

import pg from 'pg';

let _pool = null;
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
  if (_dbAttempted && _pool) return _pool;
  _dbAttempted = true;

  const dbUrl = process.env.DATABASE_URL || '';

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
        console.log('[SchoolsPedia DB] Connected to PostgreSQL / CockroachDB');
        return _pool;
      }
    } catch (e) {
      console.warn('[SchoolsPedia DB] PostgreSQL connection failed, falling back to mock data:', e.message);
      _pool = null;
      _dbAttempted = false; // Allow retry on next request
    }
  }

  console.warn('[SchoolsPedia DB] Database unavailable. Mock data fallback active.');
  return null;
}

export async function isDbAvailable() {
  await initClient();
  return _pool !== null;
}

export function isPostgres() {
  return true;
}

export async function query(sql, params = []) {
  await initClient();
  if (!_pool) return [];

  // ── Cache lookup ──
  const cacheKey = sql + '|' + JSON.stringify(params);
  const cached = cacheGet(cacheKey);
  if (cached !== null) return cached;

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

export async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0] : null;
}
