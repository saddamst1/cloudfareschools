/**
 * SchoolsPedia — All DB Queries (async, sql.js compatible)
 * With graceful fallback to mock data when DB is unavailable.
 */

import { query, queryOne, isDbAvailable, isPostgres } from './db.js';
import {
  MOCK_STATES, MOCK_DISTRICTS_UP, MOCK_SCHOOLS, MOCK_STATS, MOCK_DISTRICT_STATS
} from './mock-data.js';


// isDbAvailable is imported directly from db.js (reuses pool — no extra SELECT 1 overhead)


// ─── Homepage ─────────────────────────────────────────────────────────────────

export async function getHomepageStats() {
  return {
    total_schools: 1653159,
    total_states: 36,
    total_districts: 748,
    total_villages: 650000
  };
}

export async function getAllStates() {
  if (!(await isDbAvailable())) return MOCK_STATES;
  const rows = await query(`
    SELECT state_slug, state_name, total_schools, district_count, block_count, village_count
    FROM states ORDER BY total_schools DESC
  `);
  return rows.length ? rows : MOCK_STATES;
}

function normalizeStateSlug(slug) {
  if (!slug) return slug;
  if (slug === 'tamil-nadu') return 'tamilnadu';
  return slug;
}

// ─── State Page ───────────────────────────────────────────────────────────────

export async function getState(stateSlug) {
  const slug = normalizeStateSlug(stateSlug);
  if (!(await isDbAvailable())) {
    return MOCK_STATES.find(s => s.state_slug === slug || s.state_slug === stateSlug) || null;
  }
  return await queryOne(`SELECT * FROM states WHERE state_slug = ? OR state_slug = ?`, [slug, stateSlug]);
}

export async function getStateDistricts(stateSlug) {
  const slug = normalizeStateSlug(stateSlug);
  if (!(await isDbAvailable())) {
    return (slug === 'uttar-pradesh' || stateSlug === 'uttar-pradesh') ? MOCK_DISTRICTS_UP : [];
  }
  return await query(`
    SELECT district_slug, district_name, state_name, total_schools,
           block_count, village_count, dist_population, dist_literacy_pct,
           dist_sex_ratio, dist_avg_lat, dist_avg_long, dist_sample_pin
    FROM districts WHERE state_slug = ? OR state_slug = ? ORDER BY total_schools DESC
  `, [slug, stateSlug]);
}

export async function getStateCategoryCounts(stateSlug) {
  const slug = normalizeStateSlug(stateSlug);
  if (!(await isDbAvailable())) {
    return [
      { school_category: 'Primary', count: 520000 },
      { school_category: 'Upper Primary', count: 380000 },
      { school_category: 'Secondary', count: 210000 },
      { school_category: 'Higher Secondary', count: 140000 },
    ];
  }
  return await query(`
    SELECT school_category, COUNT(*) AS count FROM schools
    WHERE state_slug = ? OR state_slug = ? GROUP BY school_category ORDER BY count DESC
  `, [slug, stateSlug]);
}

export async function getStateMgmtCounts(stateSlug) {
  const slug = normalizeStateSlug(stateSlug);
  if (!(await isDbAvailable())) {
    return [
      { national_mgmt: 'Department of Education', count: 1050000 },
      { national_mgmt: 'Private Unaided', count: 450000 },
      { national_mgmt: 'Private Aided', count: 100000 },
    ];
  }
  return await query(`
    SELECT national_mgmt, COUNT(*) AS count FROM schools
    WHERE state_slug = ? OR state_slug = ? GROUP BY national_mgmt ORDER BY count DESC
  `, [slug, stateSlug]);
}

// ─── District Page ────────────────────────────────────────────────────────────

export function getVirtualDistrictMapping(stateSlug, districtSlug) {
  if (stateSlug === 'maharashtra' && districtSlug === 'mumbai') {
    return {
      name: 'Mumbai',
      slugs: ['mumbai-suburban', 'mumbai-ii']
    };
  }
  if (stateSlug === 'karnataka' && (districtSlug === 'bengaluru' || districtSlug === 'bangalore')) {
    return {
      name: 'Bengaluru',
      slugs: ['bengaluru-u-north', 'bengaluru-u-south']
    };
  }
  if (stateSlug === 'delhi' && (districtSlug === 'delhi' || districtSlug === 'new-delhi')) {
    return {
      name: 'Delhi',
      slugs: ['central', 'east', 'north', 'north-east', 'north-west-a', 'north-west-b', 'south', 'south-east', 'south-west-a', 'south-west-b', 'west-a', 'west-b']
    };
  }
  return null;
}

export async function getDistrict(stateSlug, districtSlug) {
  if (!(await isDbAvailable())) {
    return MOCK_DISTRICTS_UP.find(d => d.district_slug === districtSlug) || null;
  }
  const mapping = getVirtualDistrictMapping(stateSlug, districtSlug);
  if (mapping) {
    const placeholders = mapping.slugs.map(() => '?').join(', ');
    return await queryOne(`
      SELECT 
        CAST(? AS VARCHAR) AS district_slug,
        CAST(? AS VARCHAR) AS district_name,
        MAX(state_name) AS state_name,
        MAX(state_slug) AS state_slug,
        SUM(total_schools) AS total_schools,
        SUM(block_count) AS block_count,
        SUM(village_count) AS village_count,
        SUM(dist_population) AS dist_population,
        AVG(dist_literacy_pct) AS dist_literacy_pct,
        AVG(dist_sex_ratio) AS dist_sex_ratio,
        AVG(dist_avg_lat) AS dist_avg_lat,
        AVG(dist_avg_long) AS dist_avg_long,
        MAX(dist_sample_pin) AS dist_sample_pin
      FROM districts WHERE state_slug = ? AND district_slug IN (${placeholders})
    `, [districtSlug, mapping.name, stateSlug, ...mapping.slugs]);
  }
  return await queryOne(`
    SELECT * FROM districts WHERE state_slug = ? AND district_slug = ?
  `, [stateSlug, districtSlug]);
}

export async function getDistrictBlocks(stateSlug, districtSlug) {
  if (!(await isDbAvailable())) {
    return [
      { block_slug: 'mohanlalganj', block_name: 'Mohanlalganj', district_name: 'Lucknow', state_name: 'Uttar Pradesh', total_schools: 1890, village_count: 112 },
      { block_slug: 'bakshi-ka-talab', block_name: 'Bakshi Ka Talab', district_name: 'Lucknow', state_name: 'Uttar Pradesh', total_schools: 1654, village_count: 98 },
      { block_slug: 'chinhat', block_name: 'Chinhat', district_name: 'Lucknow', state_name: 'Uttar Pradesh', total_schools: 1432, village_count: 86 },
      { block_slug: 'gosainganj', block_name: 'Gosainganj', district_name: 'Lucknow', state_name: 'Uttar Pradesh', total_schools: 1267, village_count: 73 },
      { block_slug: 'kakori', block_name: 'Kakori', district_name: 'Lucknow', state_name: 'Uttar Pradesh', total_schools: 1134, village_count: 65 },
      { block_slug: 'malihabad', block_name: 'Malihabad', district_name: 'Lucknow', state_name: 'Uttar Pradesh', total_schools: 1089, village_count: 61 },
      { block_slug: 'sarojini-nagar', block_name: 'Sarojini Nagar', district_name: 'Lucknow', state_name: 'Uttar Pradesh', total_schools: 967, village_count: 54 },
      { block_slug: 'mal', block_name: 'Mal', district_name: 'Lucknow', state_name: 'Uttar Pradesh', total_schools: 801, village_count: 42 },
    ];
  }
  const mapping = getVirtualDistrictMapping(stateSlug, districtSlug);
  if (mapping) {
    const placeholders = mapping.slugs.map(() => '?').join(', ');
    return await query(`
      SELECT block_slug, block_name, district_name, district_slug, state_name, total_schools, village_count
      FROM blocks WHERE state_slug = ? AND district_slug IN (${placeholders}) ORDER BY total_schools DESC
    `, [stateSlug, ...mapping.slugs]);
  }
  return await query(`
    SELECT block_slug, block_name, district_name, district_slug, state_name, total_schools, village_count
    FROM blocks WHERE state_slug = ? AND district_slug = ? ORDER BY total_schools DESC
  `, [stateSlug, districtSlug]);
}

export async function getDistrictCategoryCounts(stateSlug, districtSlug) {
  if (!(await isDbAvailable())) return [];
  const mapping = getVirtualDistrictMapping(stateSlug, districtSlug);
  if (mapping) {
    const placeholders = mapping.slugs.map(() => '?').join(', ');
    return await query(`
      SELECT school_category, COUNT(*) AS count FROM schools
      WHERE state_slug = ? AND district_slug IN (${placeholders}) GROUP BY school_category ORDER BY count DESC
    `, [stateSlug, ...mapping.slugs]);
  }
  return await query(`
    SELECT school_category, COUNT(*) AS count FROM schools
    WHERE state_slug = ? AND district_slug = ? GROUP BY school_category ORDER BY count DESC
  `, [stateSlug, districtSlug]);
}

export async function getAdjacentDistricts(stateSlug, districtSlug) {
  if (!(await isDbAvailable())) {
    return [
      { district_slug: 'raebareli', district_name: 'Raebareli', state_slug: stateSlug, total_schools: 1240, block_count: 14 },
      { district_slug: 'barabanki', district_name: 'Barabanki', state_slug: stateSlug, total_schools: 1450, block_count: 16 },
      { district_slug: 'unnao', district_name: 'Unnao', state_slug: stateSlug, total_schools: 1320, block_count: 15 },
      { district_slug: 'sitapur', district_name: 'Sitapur', state_slug: stateSlug, total_schools: 1980, block_count: 19 },
    ].filter(d => d.district_slug !== districtSlug).slice(0, 4);
  }

  const mapping = getVirtualDistrictMapping(stateSlug, districtSlug);
  if (mapping) {
    const placeholders = mapping.slugs.map(() => '?').join(', ');
    const current = await queryOne(`
      SELECT AVG(dist_avg_lat) AS lat, AVG(dist_avg_long) AS lon 
      FROM districts WHERE state_slug = ? AND district_slug IN (${placeholders})
    `, [stateSlug, ...mapping.slugs]);

    if (current && current.lat && current.lon) {
      return await query(`
        SELECT district_slug, district_name, state_slug, total_schools, block_count,
               ((dist_avg_lat - ?) * (dist_avg_lat - ?) + (dist_avg_long - ?) * (dist_avg_long - ?)) AS distance
        FROM districts
        WHERE state_slug = ? AND district_slug NOT IN (${placeholders}) AND dist_avg_lat IS NOT NULL AND dist_avg_long IS NOT NULL
        ORDER BY distance ASC LIMIT 4
      `, [current.lat, current.lat, current.lon, current.lon, stateSlug, ...mapping.slugs]);
    }
  }

  const current = await queryOne(`
    SELECT dist_avg_lat, dist_avg_long FROM districts WHERE state_slug = ? AND district_slug = ?
  `, [stateSlug, districtSlug]);

  if (current && current.dist_avg_lat && current.dist_avg_long) {
    const lat = current.dist_avg_lat;
    const lon = current.dist_avg_long;
    return await query(`
      SELECT district_slug, district_name, state_slug, total_schools, block_count,
             ((dist_avg_lat - ?) * (dist_avg_lat - ?) + (dist_avg_long - ?) * (dist_avg_long - ?)) AS distance
      FROM districts
      WHERE state_slug = ? AND district_slug != ? AND dist_avg_lat IS NOT NULL AND dist_avg_long IS NOT NULL
      ORDER BY distance ASC LIMIT 4
    `, [lat, lat, lon, lon, stateSlug, districtSlug]);
  }

  return await query(`
    SELECT district_slug, district_name, state_slug, total_schools, block_count
    FROM districts
    WHERE state_slug = ? AND district_slug != ?
    ORDER BY total_schools DESC LIMIT 4
  `, [stateSlug, districtSlug]);
}

// ─── Block Page ───────────────────────────────────────────────────────────────

export async function getBlock(stateSlug, districtSlug, blockSlug) {
  if (!(await isDbAvailable())) {
    return { block_slug: blockSlug, block_name: blockSlug.split('-').map(w => w[0]?.toUpperCase() + w.slice(1)).join(' '), district_name: 'Lucknow', state_name: 'Uttar Pradesh', total_schools: 1890, village_count: 112 };
  }
  return await queryOne(`
    SELECT * FROM blocks WHERE state_slug=? AND district_slug=? AND block_slug=?
  `, [stateSlug, districtSlug, blockSlug]);
}

export async function getBlockVillages(stateSlug, districtSlug, blockSlug) {
  if (!(await isDbAvailable())) {
    return [
      { village_slug: 'atrawa',        village_name: 'Atrawa',        school_count: 3 },
      { village_slug: 'rampur-khurd',  village_name: 'Rampur Khurd',  school_count: 2 },
      { village_slug: 'haiderganj',    village_name: 'Haiderganj',    school_count: 4 },
      { village_slug: 'kalyanpur',     village_name: 'Kalyanpur',     school_count: 5 },
      { village_slug: 'kataria',       village_name: 'Kataria',       school_count: 2 },
    ];
  }
  return await query(`
    SELECT village_slug, village_name, school_count FROM block_villages
    WHERE state_slug=? AND district_slug=? AND block_slug=? ORDER BY school_count DESC
  `, [stateSlug, districtSlug, blockSlug]);
}

export async function getBlockSchools(stateSlug, districtSlug, blockSlug, { page = 1, perPage = 24, category = null, mgmt = null } = {}) {
  if (!(await isDbAvailable())) {
    return { schools: MOCK_SCHOOLS, total: MOCK_SCHOOLS.length, page: 1, pages: 1 };
  }
  const filters = ['state_slug=?', 'district_slug=?', 'block_slug=?'];
  const params  = [stateSlug, districtSlug, blockSlug];
  if (category) { filters.push('school_category=?'); params.push(category); }
  if (mgmt)     { filters.push('national_mgmt=?');   params.push(mgmt); }
  const where  = filters.join(' AND ');
  const offset = (page - 1) * perPage;
  const totalRow = await queryOne(`SELECT COUNT(*) AS c FROM schools WHERE ${where}`, params);
  const total    = totalRow?.c || 0;
  const schools  = await query(`
    SELECT udise_code, school_name, village, village_slug, district, district_slug, school_category,
           school_type, national_mgmt, school_status, url, school_slug
    FROM schools WHERE ${where} ORDER BY village, school_name LIMIT ? OFFSET ?
  `, [...params, perPage, offset]);
  return { schools, total, page, pages: Math.ceil(total / perPage) };
}

// ─── Village Page ─────────────────────────────────────────────────────────────

export async function getVillageSchools(stateSlug, districtSlug, blockSlug, villageSlug) {
  if (!(await isDbAvailable())) {
    return MOCK_SCHOOLS.filter(s => s.village_slug === villageSlug);
  }
  return await query(`
    SELECT udise_code, school_name, village, district, district_slug, school_category, school_type,
           national_mgmt, school_status, url, school_slug
    FROM schools
    WHERE state_slug=? AND district_slug=? AND block_slug=? AND village_slug=?
    ORDER BY school_category, school_name
  `, [stateSlug, districtSlug, blockSlug, villageSlug]);
}

// ─── School Page ──────────────────────────────────────────────────────────────

export async function getSchoolBySlug(schoolSlug) {
  if (!(await isDbAvailable())) {
    return MOCK_SCHOOLS.find(s => s.school_slug === schoolSlug) || null;
  }
  // Try querying by slug first
  let school = await queryOne(`SELECT * FROM schools WHERE school_slug = ?`, [schoolSlug]);
  if (school) return school;

  // Fallback: extract UDISE code from the end of the slug and query by UDISE code
  const match = schoolSlug.match(/(\d+)$/);
  if (match) {
    const udiseCode = Number(match[1]);
    school = await queryOne(`SELECT * FROM schools WHERE udise_code = ?`, [udiseCode]);
    if (school) return school;
  }

  return null;
}

export async function getSchoolByUdise(udiseCode) {
  if (!(await isDbAvailable())) {
    return MOCK_SCHOOLS.find(s => String(s.udise_code) === String(udiseCode)) || null;
  }
  return await queryOne(`SELECT * FROM schools WHERE udise_code = ?`, [udiseCode]);
}

export async function getNearbySchools(stateSlug, districtSlug, blockSlug, villageSlug, excludeUdise, limit = 6) {
  if (!(await isDbAvailable())) {
    return MOCK_SCHOOLS.filter(s => s.udise_code !== excludeUdise).slice(0, limit);
  }
  return await query(`
    SELECT udise_code, school_name, village, district, district_slug, school_category, school_type,
           national_mgmt, school_status, url, school_slug
    FROM schools
    WHERE state_slug=? AND district_slug=? AND block_slug=? AND udise_code != ?
    ORDER BY (village_slug = ?) DESC, school_name ASC LIMIT ?
  `, [stateSlug, districtSlug, blockSlug, excludeUdise, villageSlug, limit]);
}

export async function getDistrictStatsForSchool(stateSlug, districtSlug) {
  if (!(await isDbAvailable())) return MOCK_DISTRICT_STATS;
  try {
    const dist = await queryOne(`
      SELECT district_name, total_schools, block_count FROM districts WHERE state_slug=? AND district_slug=?
    `, [stateSlug, districtSlug]);

    if (!dist) return MOCK_DISTRICT_STATS;

    const census = await queryOne(`
      SELECT dist_population, dist_literacy_pct, dist_sex_ratio, dist_avg_lat, dist_avg_long,
             dist_sample_pin, dist_male, dist_female, dist_sc_pct, dist_st_pct,
             dist_hindus, dist_hindu_pct, dist_muslims, dist_muslim_pct,
             dist_govt_schools, dist_private_schools
      FROM villages WHERE state_slug=? AND district_slug=? LIMIT 1
    `, [stateSlug, districtSlug]);

    return {
      ...dist,
      ...(census || {}),
    };
  } catch (e) {
    console.error('[Queries error]', e.message);
    return MOCK_DISTRICT_STATS;
  }
}

// ─── Search ───────────────────────────────────────────────────────────────────

function tokenizeSearchQuery(q) {
  let cleaned = q.toLowerCase()
    .replace(/h\.s\./g, 'hs')
    .replace(/\bh\s+s\b/g, 'hs')
    .replace(/p\.s\./g, 'ps')
    .replace(/\bp\s+s\b/g, 'ps')
    .replace(/m\.s\./g, 'ms')
    .replace(/\bm\s+s\b/g, 'ms')
    .replace(/u\.p\./g, 'up')
    .replace(/\bu\s+p\b/g, 'up')
    .replace(/[^a-z0-9\s]/g, ' '); // remove punctuation
  return cleaned.trim().split(/\s+/).filter(w => w.length > 0);
}

export async function searchSchools(q, limit = 20, stateSlug = null, { category = null, mgmt = null, districtSlug = null } = {}) {
  if (!q || q.trim().length < 2) return [];
  if (!(await isDbAvailable())) {
    const lower = q.toLowerCase();
    const mapping = districtSlug ? getVirtualDistrictMapping(stateSlug, districtSlug) : null;
    const targetDistricts = mapping ? mapping.slugs : (districtSlug ? [districtSlug] : null);
    return MOCK_SCHOOLS.filter(s => {
      const matchText = s.school_name.toLowerCase().includes(lower) ||
        s.village.toLowerCase().includes(lower) ||
        s.district.toLowerCase().includes(lower) ||
        String(s.udise_code).includes(lower);
      const matchCat = !category || s.school_category === category;
      const matchMgmt = !mgmt || s.national_mgmt === mgmt;
      const matchState = !stateSlug || s.state_slug === stateSlug;
      const matchDistrict = !targetDistricts || targetDistricts.includes(s.district_slug);
      return matchText && matchCat && matchMgmt && matchState && matchDistrict;
    }).slice(0, limit);
  }

  const term = q.trim();

  // ── Tier 0: UDISE code exact match ──────────────────────────────────────────
  // Numbers only → direct lookup, zero scan
  if (/^\d+$/.test(term)) {
    const codeNum = parseInt(term, 10);
    const rows = await query(`
      SELECT udise_code, school_name, village, village_slug, district, district_slug, state, state_slug,
             school_category, school_type, national_mgmt, school_status, url, school_slug
      FROM schools WHERE udise_code = ? LIMIT 1
    `, [codeNum]);
    if (rows.length > 0) return rows;
  }

  const mapping = districtSlug ? getVirtualDistrictMapping(stateSlug, districtSlug) : null;
  const targetDistricts = mapping ? mapping.slugs : (districtSlug ? [districtSlug] : null);

  // ── Helper: build optional filter clauses ────────────────────────────────────
  const buildFilters = (baseParams) => {
    let clauses = '';
    const params = [...baseParams];
    if (stateSlug)  { clauses += ` AND state_slug = ?`;       params.push(stateSlug); }
    if (targetDistricts) {
      const placeholders = targetDistricts.map(() => '?').join(', ');
      clauses += ` AND district_slug IN (${placeholders})`;
      params.push(...targetDistricts);
    }
    if (category)   { clauses += ` AND school_category = ?`;  params.push(category); }
    if (mgmt)       { clauses += ` AND national_mgmt = ?`;    params.push(mgmt); }
    return { clauses, params };
  };

  // ── Tier 1: Prefix match on school_name ─────────────────────────────────────
  // Use lower(school_name) LIKE ? to utilize the idx_schools_lower_name B-tree index.
  const prefixPattern = `${term}%`;
  const { clauses: c1, params: p1 } = buildFilters([prefixPattern]);
  const prefixResults = await query(`
    SELECT udise_code, school_name, village, village_slug, district, district_slug, state, state_slug,
           school_category, school_type, national_mgmt, school_status, url, school_slug
    FROM schools
    WHERE school_name ILIKE ?${c1}
    ORDER BY school_name
    LIMIT ?
  `, [...p1, limit]);

  if (prefixResults.length > 0) return prefixResults;

  // ── Tier 2: Smart Tokenized Match on school_name ───────────────────────────
  // User typed multiple words or abbreviations. We break the query into tokens
  // and search for schools containing ALL tokens using GIN/Trigram index.
  const tokens = tokenizeSearchQuery(term);
  
  // Define extremely common stopwords in school directories. We will filter them
  // out from the index search if there are other, more specific keywords.
  // This prevents expensive index scans on very common words (e.g. "school" matches 1.5M+ rows).
  const SEARCH_STOPWORDS = new Set([
    'school', 'schools', 'public', 'govt', 'government', 'private',
    'aided', 'unaided', 'academy', 'college', 'inter', 'education',
    'educational', 'central', 'national', 'international', 'boys', 'girls',
    'co-ed', 'co-educational', 'institute', 'institutions', 'primary',
    'secondary', 'higher', 'senior', 'junior', 'vidyalaya', 'vidyalayas',
    'schooling'
  ]);

  let searchTokens = tokens;
  const nonStopwords = tokens.filter(t => !SEARCH_STOPWORDS.has(t));
  if (nonStopwords.length > 0 && tokens.length > 1) {
    searchTokens = nonStopwords;
  }

  let nameResults = [];

  if (searchTokens.length > 0) {
    const isPg = isPostgres();
    const tableName = 'schools';
    
    // Build SQL clauses for each token
    const tokenClauses = [];
    const tokenParams = [];
    
    for (const t of searchTokens) {
      if (t === 'hs') {
        if (isPg) {
          tokenClauses.push('(school_name ILIKE ? OR school_name ILIKE ? OR school_name ILIKE ?)');
          tokenParams.push('%hs%', '%h%s%', '%h.s%');
        } else {
          tokenClauses.push('(lower(school_name) LIKE ? OR lower(school_name) LIKE ? OR lower(school_name) LIKE ?)');
          tokenParams.push('%hs%', '%h%s%', '%h.s%');
        }
      } else if (t === 'ps') {
        if (isPg) {
          tokenClauses.push('(school_name ILIKE ? OR school_name ILIKE ? OR school_name ILIKE ?)');
          tokenParams.push('%ps%', '%p%s%', '%p.s%');
        } else {
          tokenClauses.push('(lower(school_name) LIKE ? OR lower(school_name) LIKE ? OR lower(school_name) LIKE ?)');
          tokenParams.push('%ps%', '%p%s%', '%p.s%');
        }
      } else if (t === 'ms') {
        if (isPg) {
          tokenClauses.push('(school_name ILIKE ? OR school_name ILIKE ? OR school_name ILIKE ?)');
          tokenParams.push('%ms%', '%m%s%', '%m.s%');
        } else {
          tokenClauses.push('(lower(school_name) LIKE ? OR lower(school_name) LIKE ? OR lower(school_name) LIKE ?)');
          tokenParams.push('%ms%', '%m%s%', '%m.s%');
        }
      } else if (t === 'up') {
        if (isPg) {
          tokenClauses.push('(school_name ILIKE ? OR school_name ILIKE ? OR school_name ILIKE ?)');
          tokenParams.push('%up%', '%u%p%', '%u.p%');
        } else {
          tokenClauses.push('(lower(school_name) LIKE ? OR lower(school_name) LIKE ? OR lower(school_name) LIKE ?)');
          tokenParams.push('%up%', '%u%p%', '%u.p%');
        }
      } else {
        if (isPg) {
          tokenClauses.push('school_name ILIKE ?');
          tokenParams.push(`%${t}%`);
        } else {
          tokenClauses.push('lower(school_name) LIKE ?');
          tokenParams.push(`%${t.toLowerCase()}%`);
        }
      }
    }
    
    const whereTokens = tokenClauses.join(' AND ');
    const { clauses: c2, params: p2 } = buildFilters(tokenParams);
    
    nameResults = await query(`
      SELECT udise_code, school_name, village, village_slug, district, district_slug, state, state_slug,
             school_category, school_type, national_mgmt, school_status, url, school_slug
      FROM ${tableName}
      WHERE ${whereTokens}${c2}
      ${isPg ? '' : 'ORDER BY school_name'}
      LIMIT ?
    `, [...p2, limit]);
  }

  if (nameResults.length > 0) return nameResults;

  // ── Tier 3: Broad search — village OR district ───────────────────────────────
  // Fallback to searching by village or district names if name search fails
  const containsPattern = `%${term}%`;
  const isPg = isPostgres();
  let broadResults = [];
  
  if (isPg) {
    const buildSingleFilter = (pattern) => {
      let clauses = '';
      const params = [pattern];
      if (stateSlug)  { clauses += ` AND state_slug = ?`;       params.push(stateSlug); }
      if (targetDistricts) {
        const placeholders = targetDistricts.map(() => '?').join(', ');
        clauses += ` AND district_slug IN (${placeholders})`;
        params.push(...targetDistricts);
      }
      if (category)   { clauses += ` AND school_category = ?`;  params.push(category); }
      if (mgmt)       { clauses += ` AND national_mgmt = ?`;    params.push(mgmt); }
      return { clauses, params };
    };

    const fVillage = buildSingleFilter(containsPattern);
    const fDistrict = buildSingleFilter(containsPattern);

    const [villageRes, districtRes] = await Promise.all([
      query(`
        SELECT udise_code, school_name, village, village_slug, district, district_slug, state, state_slug,
               school_category, school_type, national_mgmt, school_status, url, school_slug
        FROM schools
        WHERE village ILIKE ?${fVillage.clauses}
        LIMIT ?
      `, [...fVillage.params, limit]),
      query(`
        SELECT udise_code, school_name, village, village_slug, district, district_slug, state, state_slug,
               school_category, school_type, national_mgmt, school_status, url, school_slug
        FROM schools
        WHERE district ILIKE ?${fDistrict.clauses}
        LIMIT ?
      `, [...fDistrict.params, limit])
    ]);

    const seenBroad = new Set();
    for (const r of [...villageRes, ...districtRes]) {
      if (!seenBroad.has(r.udise_code)) {
        seenBroad.add(r.udise_code);
        broadResults.push(r);
      }
    }
  } else {
    // SQLite fallback
    const { clauses: c3, params: p3 } = buildFilters([containsPattern.toLowerCase(), containsPattern.toLowerCase()]);
    broadResults = await query(`
      SELECT udise_code, school_name, village, village_slug, district, district_slug, state, state_slug,
             school_category, school_type, national_mgmt, school_status, url, school_slug
      FROM schools
      WHERE (lower(village) LIKE ? OR lower(district) LIKE ?)${c3}
      ORDER BY school_name
      LIMIT ?
    `, [...p3, limit]);
  }

  // Merge: nameResults first, then broad, deduplicate by udise_code
  const seen = new Set(nameResults.map(r => r.udise_code));
  const merged = [...nameResults];
  for (const r of broadResults) {
    if (!seen.has(r.udise_code)) {
      seen.add(r.udise_code);
      merged.push(r);
    }
    if (merged.length >= limit) break;
  }
  return merged;
}



// ─── Static Paths ─────────────────────────────────────────────────────────────

export async function getAllStateSlugs() {
  if (!(await isDbAvailable())) return MOCK_STATES.map(s => s.state_slug);
  const rows = await query(`SELECT state_slug FROM states`);
  return rows.map(r => r.state_slug);
}

export async function getAllDistrictSlugs() {
  if (!(await isDbAvailable())) return MOCK_DISTRICTS_UP.map(d => ({ state_slug: d.state_slug, district_slug: d.district_slug }));
  return await query(`SELECT state_slug, district_slug FROM districts`);
}

export async function getAllDistricts() {
  if (!(await isDbAvailable())) return MOCK_DISTRICTS_UP;
  return await query(`
    SELECT district_slug, district_name, state_name, state_slug, total_schools, block_count, village_count
    FROM districts ORDER BY state_name ASC, district_name ASC
  `);
}

export async function getAllBlockSlugs() {
  if (!(await isDbAvailable())) return [];
  return await query(`SELECT state_slug, district_slug, block_slug FROM blocks`);
}

// ─── Sitemap ──────────────────────────────────────────────────────────────────

export async function getSitemapBatch(level, offset, limit = 10000) {
  if (!(await isDbAvailable())) return [];
  const queries = {
    state:    `SELECT '/schools/' || state_slug AS url FROM states`,
    district: `SELECT '/schools/' || state_slug || '/' || district_slug AS url FROM districts`,
    block:    `SELECT '/schools/' || state_slug || '/' || district_slug || '/' || block_slug AS url FROM blocks`,
    school:   `SELECT url FROM schools`,
  };
  const q = queries[level];
  if (!q) throw new Error(`Unknown level: ${level}`);
  const rows = await query(`${q} LIMIT ? OFFSET ?`, [limit, offset]);
  return rows.map(r => r.url);
}

export async function getDistrictSchools(stateSlug, districtSlug, limit = 12) {
  if (!(await isDbAvailable())) return MOCK_SCHOOLS.slice(0, limit);
  const mapping = getVirtualDistrictMapping(stateSlug, districtSlug);
  if (mapping) {
    const placeholders = mapping.slugs.map(() => '?').join(', ');
    return await query(`
      SELECT udise_code, school_name, village, school_category,
             national_mgmt, school_status, url, school_slug
      FROM schools
      WHERE state_slug=? AND district_slug IN (${placeholders}) AND school_status='Operational'
      LIMIT ?
    `, [stateSlug, ...mapping.slugs, limit]);
  }
  return await query(`
    SELECT udise_code, school_name, village, school_category,
           national_mgmt, school_status, url, school_slug
    FROM schools
    WHERE state_slug=? AND district_slug=? AND school_status='Operational'
    LIMIT ?
  `, [stateSlug, districtSlug, limit]);
}

export async function getSchoolReviewStats(udiseCode) {
  if (!(await isDbAvailable())) {
    return { avgRating: 0, count: 0 };
  }
  try {
    const row = await queryOne(`
      SELECT COUNT(*) AS count, AVG(rating) AS avg_rating
      FROM reviews WHERE udise_code = ?
    `, [String(udiseCode)]);
    
    if (row && Number(row.count) > 0) {
      return {
        avgRating: Number(Number(row.avg_rating).toFixed(1)),
        count: Number(row.count)
      };
    }
  } catch (e) {
    console.error('[getSchoolReviewStats error]', e.message);
  }
  return { avgRating: 0, count: 0 };
}

export async function getDownloadSchools(stateSlug, districtSlug, blockSlug = null) {
  if (!(await isDbAvailable())) return MOCK_SCHOOLS;
  const mapping = getVirtualDistrictMapping(stateSlug, districtSlug);
  if (blockSlug) {
    return await query(`
      SELECT udise_code, school_name, village, block, district, state, school_category, national_mgmt, school_status
      FROM schools
      WHERE state_slug=? AND district_slug=? AND block_slug=? AND school_status='Operational'
      ORDER BY school_name ASC
    `, [stateSlug, districtSlug, blockSlug]);
  } else if (mapping) {
    const placeholders = mapping.slugs.map(() => '?').join(', ');
    return await query(`
      SELECT udise_code, school_name, village, block, district, state, school_category, national_mgmt, school_status
      FROM schools
      WHERE state_slug=? AND district_slug IN (${placeholders}) AND school_status='Operational'
      ORDER BY school_name ASC
    `, [stateSlug, ...mapping.slugs]);
  } else {
    return await query(`
      SELECT udise_code, school_name, village, block, district, state, school_category, national_mgmt, school_status
      FROM schools
      WHERE state_slug=? AND district_slug=? AND school_status='Operational'
      ORDER BY school_name ASC
    `, [stateSlug, districtSlug]);
  }
}

