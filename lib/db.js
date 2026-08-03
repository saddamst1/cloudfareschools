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

/**
 * Helper: Promise timeout wrapper to prevent worker hangs
 */
function withTimeout(promise, ms, label = 'Operation') {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
    promise
      .then((res) => { clearTimeout(timer); resolve(res); })
      .catch((err) => { clearTimeout(timer); reject(err); });
  });
}

async function initClient() {
  if (_dbAttempted) return _pool;
  _dbAttempted = true;

  const dbUrl = process.env.DATABASE_URL || '';

  if (dbUrl.startsWith('postgres:') || dbUrl.startsWith('postgresql:')) {
    try {
      const Pool = pg.Pool || pg.default?.Pool || pg.default;
      const testPool = new Pool({
        connectionString: dbUrl,
        max: parseInt(process.env.PG_POOL_MAX || '3', 10),
        idleTimeoutMillis: 5000,
        connectionTimeoutMillis: 2000,
        ssl: { rejectUnauthorized: false },
        statement_timeout: 3000,
        application_name: 'schoolspedia-cf',
      });

      testPool.on('error', (err) => {
        console.warn('[SchoolsPedia PG Pool Warning]', err.message);
      });

      // Test connection with a strict 1.5s timeout to prevent worker cold start hangs
      const res = await withTimeout(testPool.query('SELECT 1 AS ok'), 1500, 'DB Connection');
      if (res && res.rows && res.rows.length > 0) {
        console.log('[SchoolsPedia DB] Connected to PostgreSQL / CockroachDB');
        _pool = testPool;
        return _pool;
      }
    } catch (e) {
      console.warn('[SchoolsPedia DB] PostgreSQL connection failed, using mock data fallback:', e.message);
      _pool = null;
    }
  }

  console.warn('[SchoolsPedia DB] Database unavailable. Mock data fallback active.');
  return null;
}

export async function isDbAvailable() {
  try {
    const p = await initClient();
    return p !== null;
  } catch {
    return false;
  }
}

export function isPostgres() {
  return true;
}

export async function query(sql, params = []) {
  try {
    const p = await initClient();
    if (!p) return [];

    // ── Cache lookup ──
    const cacheKey = sql + '|' + JSON.stringify(params);
    const cached = cacheGet(cacheKey);
    if (cached !== null) return cached;

    const pgSql = convertSqlPlaceholders(sql);
    const res = await withTimeout(p.query(pgSql, params), 3000, 'DB Query');
    if (res && res.rows) {
      cacheSet(cacheKey, res.rows, getCacheTTL(sql));
      return res.rows;
    }
    return [];
  } catch (e) {
    console.error('[Postgres Query Error]', e.message, '\nSQL:', sql.slice(0, 80));
    return [];
  }
}

export async function queryOne(sql, params = []) {
  try {
    const rows = await query(sql, params);
    return rows.length > 0 ? rows[0] : null;
  } catch {
    return null;
  }
}
