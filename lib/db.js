/**
 * SchoolsPedia — Database Client (Cloudflare Pages Compatible)
 *
 * Connects to PostgreSQL / CockroachDB via `pg` Connection Pool.
 * Falls back gracefully to mock data when database is unavailable.
 *
 * ── OPTIMIZATIONS ──────────────────────────────────────────────────────────
 * 1. In-memory query cache (per-worker, warm requests are instant)
 * 2. Connection promise deduplication (concurrent cold-starts share one init)
 * 3. Auto pool reset on connection errors (self-healing)
 * 4. Graceful fallback — never throws, always returns [] or null
 */

import pg from 'pg';

let _pool = null;
let _initPromise = null; // Deduplicates concurrent init calls

// ── Query Cache ────────────────────────────────────────────────────────────
const _cache = new Map();

function getCacheTTL(sql) {
  const s = sql.toLowerCase();
  // Large stable tables — 24h cache
  if (/from\s+(states|districts|blocks|block_villages)\b/.test(s) && !/where/.test(s)) {
    return 24 * 60 * 60 * 1000;
  }
  // State/district/block lookups — 1h cache
  if (/from\s+(states|districts|blocks)\s+where/.test(s)) return 60 * 60 * 1000;
  // School listings — 30min cache
  if (/from\s+schools\s+where/.test(s)) return 30 * 60 * 1000;
  // Search queries — 5min cache
  if (/like\s+'%/.test(s) || /ilike/.test(s)) return 5 * 60 * 1000;
  return 10 * 60 * 1000; // default 10min
}

function cacheGet(key) {
  const entry = _cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) { _cache.delete(key); return null; }
  return entry.data;
}

function cacheSet(key, data, ttl) {
  // LRU eviction at 1000 entries
  if (_cache.size >= 1000) {
    const firstKey = _cache.keys().next().value;
    _cache.delete(firstKey);
  }
  _cache.set(key, { data, expires: Date.now() + ttl });
}
// ──────────────────────────────────────────────────────────────────────────

function convertSqlPlaceholders(sql) {
  let i = 1;
  return sql.replace(/\?/g, () => `$${i++}`);
}

function withTimeout(promise, ms, label = 'Operation') {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    promise.then(r => { clearTimeout(timer); resolve(r); })
           .catch(e => { clearTimeout(timer); reject(e); });
  });
}

async function initClient() {
  // Return existing healthy pool immediately
  if (_pool) return _pool;

  // Deduplicate concurrent init requests — all callers share one promise
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    const dbUrl = process.env.DATABASE_URL || '';
    if (!dbUrl.startsWith('postgres')) {
      console.warn('[DB] No DATABASE_URL configured. Mock data fallback active.');
      _initPromise = null;
      return null;
    }

    try {
      const Pool = pg.Pool || pg.default?.Pool || pg.default;
      const testPool = new Pool({
        connectionString: dbUrl,
        max: 3,
        min: 0,
        idleTimeoutMillis: 20000,
        connectionTimeoutMillis: 8000, // CockroachDB serverless cold start can take 5-6s
        ssl: { rejectUnauthorized: false },
        statement_timeout: 8000,
        application_name: 'schoolspedia-cf',
      });

      testPool.on('error', (err) => {
        console.warn('[DB Pool Error]', err.message);
        // Self-heal: reset pool so next request reconnects
        _pool = null;
        _initPromise = null;
      });

      const res = await withTimeout(testPool.query('SELECT 1 AS ok'), 8000, 'DB Connect');
      if (res?.rows?.length > 0) {
        console.log('[DB] Connected to CockroachDB ✓');
        _pool = testPool;
        _initPromise = null;
        return _pool;
      }
    } catch (e) {
      console.warn('[DB] Connection failed, using mock data:', e.message);
    }

    _pool = null;
    _initPromise = null;
    return null;
  })();

  return _initPromise;
}

export async function isDbAvailable() {
  try {
    const p = await initClient();
    return p !== null;
  } catch {
    return false;
  }
}

export function isPostgres() { return true; }

export async function query(sql, params = []) {
  try {
    const p = await initClient();
    if (!p) return [];

    const cacheKey = sql + '|' + JSON.stringify(params);
    const cached = cacheGet(cacheKey);
    if (cached !== null) return cached;

    const pgSql = convertSqlPlaceholders(sql);
    const res = await withTimeout(p.query(pgSql, params), 8000, 'DB Query');
    if (res?.rows) {
      cacheSet(cacheKey, res.rows, getCacheTTL(sql));
      return res.rows;
    }
    return [];
  } catch (e) {
    console.error('[DB Query Error]', e.message, '| SQL:', sql.slice(0, 100));
    // Self-heal on connection errors
    if (e.message && (e.message.includes('timeout') || e.message.includes('connect') || e.message.includes('ECONNRESET'))) {
      _pool = null;
      _initPromise = null;
    }
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
