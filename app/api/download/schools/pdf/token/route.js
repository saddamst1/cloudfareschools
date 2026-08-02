import { NextResponse } from 'next/server';

/**
 * Simple endpoint that returns a secret download token.
 * Only same‑origin requests are allowed to prevent external scrapers
 * from fetching the token.
 */
export async function GET(request) {
  const referer = request.headers.get('referer') || '';
  const allowedOrigin = process.env.SITE_URL || 'https://www.schoolspedia.in';

  // Reject cross‑origin calls
  if (referer && !referer.startsWith(allowedOrigin)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const secret = process.env.DOWNLOAD_SECRET || 'schoolspedia-download-secret';
  // In production you may replace this with a short‑lived JWT.
  return new NextResponse(JSON.stringify({ token: secret }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
