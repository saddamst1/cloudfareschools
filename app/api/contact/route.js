import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, school, details, trap } = body;

    // 1. Honeypot check
    if (trap) {
      // Return a simulated success response immediately to trick bots
      return NextResponse.json({ success: true, message: 'Message sent successfully!' });
    }

    // 2. Input validation
    if (!name || !email || !school || !details) {
      return NextResponse.json(
        { error: 'All fields (Name, Email, School/UDISE, and Details) are required.' },
        { status: 400 }
      );
    }

    const nameClean = name.trim();
    const emailClean = email.trim().toLowerCase();
    const schoolClean = school.trim();
    const detailsClean = details.trim();

    if (nameClean.length < 2 || nameClean.length > 80) {
      return NextResponse.json({ error: 'Name must be between 2 and 80 characters.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailClean)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    if (schoolClean.length < 5 || schoolClean.length > 150) {
      return NextResponse.json({ error: 'School/UDISE details must be between 5 and 150 characters.' }, { status: 400 });
    }

    if (detailsClean.length < 10 || detailsClean.length > 2000) {
      return NextResponse.json({ error: 'Discrepancy details must be between 10 and 2000 characters.' }, { status: 400 });
    }

    // Prevent link injection in user messages (anti-spam check)
    const linkRegex = /https?:\/\/|www\.|\b[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.(com|org|net|in|co|us|info|biz|io|me|net|edu|app|club|xyz)\b/i;
    if (linkRegex.test(detailsClean) || linkRegex.test(nameClean) || linkRegex.test(schoolClean)) {
      return NextResponse.json(
        { error: 'Links or website URLs are not allowed in messages.' },
        { status: 400 }
      );
    }

    // 3. Save to database
    await query(
      `INSERT INTO contact_submissions (name, email, school, details) VALUES (?, ?, ?, ?)`,
      [nameClean, emailClean, schoolClean, detailsClean]
    );

    return NextResponse.json({ success: true, message: 'Your report has been logged successfully!' });
  } catch (e) {
    console.error('[POST Contact API Error]', e.message);
    return NextResponse.json({ error: 'Failed to submit report. Please try again later.' }, { status: 500 });
  }
}
