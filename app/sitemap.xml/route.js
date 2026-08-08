import { query } from '@/lib/db';

// This route handles /sitemap.xml — the standard URL Google expects
// It generates a full sitemap index pointing to all sub-sitemaps


const SITE_URL = process.env.SITE_URL || 'https://www.schoolspedia.in';
const TARGET_STATES = ['uttar-pradesh', 'bihar', 'madhya-pradesh'];

export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
  try {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    // Core sitemaps
    xml += `<sitemap><loc>${SITE_URL}/sitemaps/states.xml</loc></sitemap>`;
    xml += `<sitemap><loc>${SITE_URL}/sitemaps/districts.xml</loc></sitemap>`;
    xml += `<sitemap><loc>${SITE_URL}/sitemaps/pages.xml</loc></sitemap>`;

    // Block sitemaps per state
    const states = await query('SELECT state_slug FROM states ORDER BY state_slug');
    states.forEach(s => {
      xml += `<sitemap><loc>${SITE_URL}/sitemaps/blocks-${s.state_slug}.xml</loc></sitemap>`;
      if (TARGET_STATES.includes(s.state_slug)) {
        xml += `<sitemap><loc>${SITE_URL}/sitemaps/hi-blocks-${s.state_slug}.xml</loc></sitemap>`;
      }
    });

    // School + village sitemaps per district — ENABLED on Cloudflare Pages
    // (was disabled for Vercel due to crawler load, not an issue on Cloudflare edge)
    const districts = await query('SELECT state_slug, district_slug FROM districts ORDER BY state_slug, district_slug');
    districts.forEach(d => {
      xml += `<sitemap><loc>${SITE_URL}/sitemaps/schools-${d.state_slug}-${d.district_slug}.xml</loc></sitemap>`;
      xml += `<sitemap><loc>${SITE_URL}/sitemaps/villages-${d.state_slug}-${d.district_slug}.xml</loc></sitemap>`;
      if (TARGET_STATES.includes(d.state_slug)) {
        xml += `<sitemap><loc>${SITE_URL}/sitemaps/hi-schools-${d.state_slug}-${d.district_slug}.xml</loc></sitemap>`;
        xml += `<sitemap><loc>${SITE_URL}/sitemaps/hi-villages-${d.state_slug}-${d.district_slug}.xml</loc></sitemap>`;
      }
    });

    xml += '</sitemapindex>';

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (e) {
    console.error('[sitemap.xml Error]', e.message);
    return new Response('Error generating sitemap', { status: 500 });
  }
}
