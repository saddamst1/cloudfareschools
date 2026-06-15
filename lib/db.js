/**
 * SchoolsPedia — Database Client
 * 
 * Supports:
 * 1. Hosted PostgreSQL (via pg Pool) if DATABASE_URL starts with postgres: or postgresql:.
 * 2. Hosted Turso/libSQL if TURSO_URL is set.
 * 3. Local SQLite via @libsql/client local driver.
 * 4. Graceful fallback to mock data when database is unavailable.
 */

import { createClient } from '@libsql/client';
import pg from 'pg';
import { existsSync } from 'fs';
import { join } from 'path';

const { Pool } = pg;

let _client = null;
let _isPostgres = false;
let _dbAvailable = false;
let _dbAttempted = false;

// Convert SQLite '?' placeholders to PostgreSQL '$1', '$2', etc.
function convertSqlPlaceholders(sql) {
  let paramIndex = 1;
  return sql.replace(/\?/g, () => `$${paramIndex++}`);
}

async function initClient() {
  if (_dbAttempted && _dbAvailable) return _client;
  _dbAttempted = true;
  _isPostgres = false;
  _dbAvailable = false;
  _client = null;

  const dbUrl = process.env.DATABASE_URL || '';

  // Option 1: PostgreSQL Connection Pool
  if (dbUrl.startsWith('postgres:') || dbUrl.startsWith('postgresql:')) {
    try {
      const sslConfig = dbUrl.includes('sslmode=') || dbUrl.includes('ssl=') || process.env.PG_SSL === 'true'
        ? { rejectUnauthorized: false }
        : false;

      _client = new Pool({
        connectionString: dbUrl,
        // max=4 prevents query queuing within a worker process while keeping total
        // connections low across all build workers.
        max: parseInt(process.env.PG_POOL_MAX || '4', 10),
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 30000,
        ssl: sslConfig,
        // Kill runaway queries after 30s — protects against slow search scans
        statement_timeout: 30000,
        application_name: 'schoolspedia-web',
      });

      // Test connection
      const res = await _client.query('SELECT 1 AS ok');
      if (res.rows && res.rows.length > 0) {
        _isPostgres = true;
        _dbAvailable = true;
        console.log('[SchoolsPedia DB] Connected to PostgreSQL Connection Pool');
        return _client;
      }
    } catch (e) {
      console.warn('[SchoolsPedia DB] PostgreSQL connection failed, falling back:', e.message);
      _client = null;
    }
  }

  // Option 2: Hosted Turso config
  if (process.env.TURSO_URL && process.env.TURSO_URL.startsWith('libsql:')) {
    try {
      _client = createClient({
        url: process.env.TURSO_URL,
        authToken: process.env.TURSO_AUTH_TOKEN || '',
      });
      await _client.execute('SELECT 1');
      _dbAvailable = true;
      console.log('[SchoolsPedia DB] Connected to hosted Turso database');
      return _client;
    } catch (e) {
      console.warn('[SchoolsPedia DB] Hosted Turso connection failed, falling back:', e.message);
      _client = null;
    }
  }

  // Option 3: Local SQLite file via @libsql/client
  const dbPath = process.env.DB_PATH || join(process.cwd(), 'data', 'schoolspedia.db');
  if (existsSync(dbPath)) {
    try {
      const absolutePath = dbPath.replace(/\\/g, '/'); // Normalize windows backslashes
      _client = createClient({
        url: `file:${absolutePath}`,
      });
      await _client.execute('SELECT 1');
      _dbAvailable = true;
      console.log('[SchoolsPedia DB] Connected to local SQLite file:', absolutePath);
      return _client;
    } catch (e) {
      console.warn('[SchoolsPedia DB] Local SQLite connection failed:', e.message);
      _client = null;
    }
  } else {
    console.log('[SchoolsPedia DB] No local database found at:', dbPath);
    console.log('[SchoolsPedia DB] Using mock data. Run pipeline.py to generate schoolspedia.db');
  }

  if (!_dbAvailable) {
    _dbAttempted = false; // Reset to allow retry on next query if database setup failed
  }

  return null;
}

export async function isDbAvailable() {
  await initClient();
  return _dbAvailable;
}

export function isPostgres() {
  return _isPostgres;
}

export async function query(sql, params = []) {
  await initClient();
  if (!_dbAvailable || !_client) return [];

  // Route PostgreSQL queries
  if (_isPostgres) {
    try {
      const translatedSql = convertSqlPlaceholders(sql);
      const res = await _client.query(translatedSql, params);
      return res.rows;
    } catch (e) {
      console.error('[Postgres Query Error]', e.message, '\n', sql.slice(0, 80));
      return [];
    }
  }

  // Route SQLite queries
  try {
    const res = await _client.execute({ sql, args: params });
    return res.rows.map(row => {
      const obj = {};
      if (res.columns) {
        res.columns.forEach((col, idx) => {
          obj[col] = row[idx];
        });
      } else {
        for (const key of Object.keys(row)) {
          obj[key] = row[key];
        }
      }
      return obj;
    });
  } catch (e) {
    console.error('[DB Query Error]', e.message, '\n', sql.slice(0, 80));
    return [];
  }
}

export async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0] : null;
}
