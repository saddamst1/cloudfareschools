import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export const dynamic = 'force-dynamic';

// In-memory cache for IP rate-limiting
const rateLimitCache = new Map();

// Clean up old entries in rateLimitCache to prevent memory leaks
if (typeof global._rateLimitCleanup === 'undefined') {
  global._rateLimitCleanup = setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of rateLimitCache.entries()) {
      if (now - data.resetTime > 0) {
        rateLimitCache.delete(ip);
      }
    }
  }, 300000); // Clean every 5 minutes
}

// GET reviews for a school
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const udise_code = searchParams.get('udise_code') || '';

  if (!udise_code) {
    return NextResponse.json({ error: 'Missing udise_code parameter' }, { status: 400 });
  }

  try {
    const reviews = await query(
      `SELECT id, udise_code, reviewer_name, rating, comment, created_at 
       FROM reviews WHERE udise_code = ? ORDER BY created_at DESC`,
      [udise_code]
    );

    // Calculate average rating
    let avgRating = 0;
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      avgRating = Number((totalRating / reviews.length).toFixed(1));
    }

    return NextResponse.json({
      reviews,
      avgRating,
      count: reviews.length
    });
  } catch (e) {
    console.error('[GET Reviews Error]', e.message);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST a new review
export async function POST(request) {
  try {
    // Extract client IP address
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') || 
               'anonymous';

    const now = Date.now();
    const limitDuration = 3600000; // 1 hour in ms
    const maxRequests = 3;

    if (!rateLimitCache.has(ip)) {
      rateLimitCache.set(ip, {
        count: 1,
        resetTime: now + limitDuration,
      });
    } else {
      const rateData = rateLimitCache.get(ip);
      if (now > rateData.resetTime) {
        // Reset limit window
        rateData.count = 1;
        rateData.resetTime = now + limitDuration;
      } else {
        if (rateData.count >= maxRequests) {
          return NextResponse.json(
            { error: 'Too many reviews submitted. You can submit up to 3 reviews per hour.' },
            { status: 429 }
          );
        }
        rateData.count += 1;
      }
    }

    const body = await request.json();
    const { udise_code, reviewer_name, rating, comment } = body;

    // 1. Basic validation
    if (!udise_code || !reviewer_name || !rating || !comment) {
      return NextResponse.json({ error: 'All fields (name, rating, comment) are required.' }, { status: 400 });
    }

    const nameClean = reviewer_name.trim();
    const commentClean = comment.trim();
    const ratingNum = parseInt(rating, 10);

    if (nameClean.length < 2 || nameClean.length > 50) {
      return NextResponse.json({ error: 'Name must be between 2 and 50 characters.' }, { status: 400 });
    }

    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ error: 'Rating must be a number between 1 and 5.' }, { status: 400 });
    }

    if (commentClean.length < 5 || commentClean.length > 1000) {
      return NextResponse.json({ error: 'Comment must be between 5 and 1000 characters.' }, { status: 400 });
    }

    // 2. Link prevention / anti-spam validation
    // Regex matches common link indicators: http://, https://, www., and common domain extensions like .com, .in, .net, etc.
    const linkRegex = /https?:\/\/|www\.|\b[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.(com|org|net|in|co|us|info|biz|io|me|net|edu|app|club|xyz)\b/i;
    
    if (linkRegex.test(commentClean) || linkRegex.test(nameClean)) {
      return NextResponse.json({ 
        error: 'Links, URLs, or website domains are not allowed in reviews. Please write a text-only comment.' 
      }, { status: 400 });
    }

    // 3. Save to database
    await query(
      `INSERT INTO reviews (udise_code, reviewer_name, rating, comment) VALUES (?, ?, ?, ?)`,
      [udise_code, nameClean, ratingNum, commentClean]
    );

    return NextResponse.json({ success: true, message: 'Review submitted successfully!' });

  } catch (e) {
    console.error('[POST Review Error]', e.message);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
