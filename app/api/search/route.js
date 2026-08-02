import { NextResponse } from 'next/server';
import { searchSchools } from '../../../lib/queries';

export const dynamic = 'force-dynamic';

// In-memory LRU search cache for instant response (<1ms)
const searchMemoryCache = new Map();
const MAX_CACHE_SIZE = 500;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q          = (searchParams.get('q') || '').trim();
  const limit      = Math.min(Number(searchParams.get('limit') || 10), 20);
  const stateSlug  = searchParams.get('state') || null;
  const districtSlug = searchParams.get('district') || null;
  const category   = searchParams.get('category') || null;
  const mgmt       = searchParams.get('mgmt') || null;

  // Don't hit the DB for very short queries
  if (q.length < 2) {
    return NextResponse.json({ results: [], query: q, count: 0 });
  }

  const cacheKey = `${q.toLowerCase()}_${limit}_${stateSlug || ''}_${districtSlug || ''}_${category || ''}_${mgmt || ''}`;

  if (searchMemoryCache.has(cacheKey)) {
    const cachedData = searchMemoryCache.get(cacheKey);
    return NextResponse.json(cachedData);
  }

  try {
    const results = await searchSchools(q, limit, stateSlug, { category, mgmt, districtSlug });

    const payload = {
      results,
      query: q,
      count: results.length,
    };

    if (searchMemoryCache.size > MAX_CACHE_SIZE) {
      const firstKey = searchMemoryCache.keys().next().value;
      searchMemoryCache.delete(firstKey);
    }
    searchMemoryCache.set(cacheKey, payload);

    return NextResponse.json(payload);

  } catch (e) {
    console.error('[Search API Error]', e.message);
    return NextResponse.json(
      { results: [], query: q, error: e.message, stack: e.stack },
      { status: 500 }
    );
  }
}

