import { NextResponse } from 'next/server';
import { searchSchools } from '../../../lib/queries';

export const dynamic = 'force-dynamic';

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

  try {
    const results = await searchSchools(q, limit, stateSlug, { category, mgmt, districtSlug });

    const response = NextResponse.json({
      results,
      query: q,
      count: results.length,
    });

    // Cache identical queries for 60 seconds at CDN / browser level.
    // Stale-while-revalidate means the user never waits for a refresh.
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    );
    return response;

  } catch (e) {
    console.error('[Search API Error]', e.message);
    return NextResponse.json(
      { results: [], query: q, error: 'Search failed' },
      { status: 500 }
    );
  }
}

