import { query } from '@/lib/db';
import { ARTICLE_DATA } from '@/data/articles-data';

export const revalidate = 86400; // Cache sitemaps for 24 hours

const SITE_URL = process.env.SITE_URL || 'https://www.schoolspedia.in';
const TARGET_STATES = ['uttar-pradesh', 'bihar', 'madhya-pradesh'];

export async function GET(request, { params }) {
  const { filename } = await params;

  // 1. Sitemap Index – redirect to the new sitemap.xml
  if (filename === 'sitemap-index.xml') {
    return new Response(null, {
      status: 301,
      headers: {
        Location: `${SITE_URL}/sitemap.xml`,
      },
    });
  }

  // 1b. Pages Sitemap (Static pages, Blog posts, and Authors)
  if (filename === 'pages.xml') {
    try {
      let xml = '<?xml version="1.0" encoding="UTF-8"?>';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
      
      const staticPages = [
        '/',
        '/about',
        '/contact',
        '/privacy-policy',
        '/terms-of-service',
        '/disclaimer',
        '/dmca',
        '/editorial-policy',
        '/fact-checking-policy',
        '/blog',
      ];
      
      staticPages.forEach(p => {
        xml += `<url><loc>${SITE_URL}${p === '/' ? '' : p}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
      });

      const blogSlugs = Object.keys(ARTICLE_DATA);

      blogSlugs.forEach(slug => {
        xml += `<url><loc>${SITE_URL}/blog/${slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`;
      });

      const authorSlugs = ['sahajul', 'schoolspedia-editorial'];

      authorSlugs.forEach(slug => {
        xml += `<url><loc>${SITE_URL}/blog/author/${slug}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>`;
      });

      xml += '</urlset>';
      
      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      });
    } catch (e) {
      console.error('[Pages Sitemap Error]', e.message);
      return new Response('Error generating pages sitemap', { status: 500 });
    }
  }

  // 2. States Sitemap
  if (filename === 'states.xml') {
    try {
      const states = await query('SELECT state_slug FROM states ORDER BY state_slug');
      let xml = '<?xml version="1.0" encoding="UTF-8"?>';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
      
      // Homepage
      xml += `<url><loc>${SITE_URL}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`;
      // All States Index
      xml += `<url><loc>${SITE_URL}/schools</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`;
      
      // Individual States
      states.forEach(s => {
        xml += `<url><loc>${SITE_URL}/schools/${s.state_slug}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
        if (TARGET_STATES.includes(s.state_slug)) {
          xml += `<url><loc>${SITE_URL}/hi/schools/${s.state_slug}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
        }
      });
      xml += '</urlset>';
      
      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      });
    } catch (e) {
      return new Response('Error generating states sitemap', { status: 500 });
    }
  }

  // 3. Districts Sitemap
  if (filename === 'districts.xml') {
    try {
      const districts = await query('SELECT state_slug, district_slug FROM districts ORDER BY state_slug, district_slug');
      let xml = '<?xml version="1.0" encoding="UTF-8"?>';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
      
      // Virtual City Landing Pages
      const virtualCities = [
        { state_slug: 'maharashtra', district_slug: 'mumbai' },
        { state_slug: 'karnataka', district_slug: 'bengaluru' },
        { state_slug: 'karnataka', district_slug: 'bangalore' },
        { state_slug: 'delhi', district_slug: 'delhi' },
        { state_slug: 'delhi', district_slug: 'new-delhi' }
      ];

      virtualCities.forEach(vc => {
        xml += `<url><loc>${SITE_URL}/schools/${vc.state_slug}/${vc.district_slug}</loc><changefreq>weekly</changefreq><priority>0.85</priority></url>`;
      });
      
      districts.forEach(d => {
        xml += `<url><loc>${SITE_URL}/schools/${d.state_slug}/${d.district_slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`;
        if (TARGET_STATES.includes(d.state_slug)) {
          xml += `<url><loc>${SITE_URL}/hi/schools/${d.state_slug}/${d.district_slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`;
        }
      });
      xml += '</urlset>';
      
      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      });
    } catch (e) {
      return new Response('Error generating districts sitemap', { status: 500 });
    }
  }

  // 4. Blocks by State Sitemap (English)
  const blockMatch = filename.match(/^blocks-([a-z-]+)\.xml$/);
  if (blockMatch) {
    try {
      const stateSlug = blockMatch[1];
      const blocks = await query('SELECT district_slug, block_slug FROM blocks WHERE state_slug = ? ORDER BY block_slug', [stateSlug]);
      
      let xml = '<?xml version="1.0" encoding="UTF-8"?>';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
      
      blocks.forEach(b => {
        xml += `<url><loc>${SITE_URL}/schools/${stateSlug}/${b.district_slug}/${b.block_slug}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>`;
      });
      xml += '</urlset>';
      
      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      });
    } catch (e) {
      return new Response('Error generating blocks sitemap', { status: 500 });
    }
  }

  // 4b. Hindi Blocks by State Sitemap
  const hiBlockMatch = filename.match(/^hi-blocks-([a-z-]+)\.xml$/);
  if (hiBlockMatch) {
    try {
      const stateSlug = hiBlockMatch[1];
      if (!TARGET_STATES.includes(stateSlug)) {
        return new Response('Not Found', { status: 404 });
      }
      const blocks = await query('SELECT district_slug, block_slug FROM blocks WHERE state_slug = ? ORDER BY block_slug', [stateSlug]);
      
      let xml = '<?xml version="1.0" encoding="UTF-8"?>';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
      
      blocks.forEach(b => {
        xml += `<url><loc>${SITE_URL}/hi/schools/${stateSlug}/${b.district_slug}/${b.block_slug}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>`;
      });
      xml += '</urlset>';
      
      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      });
    } catch (e) {
      return new Response('Error generating blocks sitemap', { status: 500 });
    }
  }

  // 5. Schools by District Sitemap (English)
  const schoolMatch = filename.match(/^schools-([a-z-]+)-([a-z-]+)\.xml$/);
  if (schoolMatch) {
    try {
      const stateSlug = schoolMatch[1];
      const districtSlug = schoolMatch[2];
      const schools = await query('SELECT url FROM schools WHERE state_slug = ? AND district_slug = ? ORDER BY school_slug', [stateSlug, districtSlug]);
      
      let xml = '<?xml version="1.0" encoding="UTF-8"?>';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
      
      schools.forEach(s => {
        xml += `<url><loc>${SITE_URL}${s.url}</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`;
      });
      xml += '</urlset>';
      
      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      });
    } catch (e) {
      return new Response('Error generating schools sitemap', { status: 500 });
    }
  }

  // 5b. Hindi Schools by District Sitemap
  const hiSchoolMatch = filename.match(/^hi-schools-([a-z-]+)-([a-z-]+)\.xml$/);
  if (hiSchoolMatch) {
    try {
      const stateSlug = hiSchoolMatch[1];
      const districtSlug = hiSchoolMatch[2];
      if (!TARGET_STATES.includes(stateSlug)) {
        return new Response('Not Found', { status: 404 });
      }
      const schools = await query('SELECT url FROM schools WHERE state_slug = ? AND district_slug = ? ORDER BY school_slug', [stateSlug, districtSlug]);
      
      let xml = '<?xml version="1.0" encoding="UTF-8"?>';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
      
      schools.forEach(s => {
        xml += `<url><loc>${SITE_URL}/hi${s.url}</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`;
      });
      xml += '</urlset>';
      
      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      });
    } catch (e) {
      return new Response('Error generating schools sitemap', { status: 500 });
    }
  }

  // 6. Villages by District Sitemap (English)
  const villageMatch = filename.match(/^villages-([a-z-]+)-([a-z-]+)\.xml$/);
  if (villageMatch) {
    try {
      const stateSlug = villageMatch[1];
      const districtSlug = villageMatch[2];
      const villages = await query('SELECT page_url FROM villages WHERE state_slug = ? AND district_slug = ? ORDER BY village_slug', [stateSlug, districtSlug]);
      
      let xml = '<?xml version="1.0" encoding="UTF-8"?>';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
      
      villages.forEach(v => {
        if (v.page_url) {
          xml += `<url><loc>${SITE_URL}${v.page_url}</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`;
        }
      });
      xml += '</urlset>';
      
      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      });
    } catch (e) {
      return new Response('Error generating villages sitemap', { status: 500 });
    }
  }

  // 6b. Hindi Villages by District Sitemap
  const hiVillageMatch = filename.match(/^hi-villages-([a-z-]+)-([a-z-]+)\.xml$/);
  if (hiVillageMatch) {
    try {
      const stateSlug = hiVillageMatch[1];
      const districtSlug = hiVillageMatch[2];
      if (!TARGET_STATES.includes(stateSlug)) {
        return new Response('Not Found', { status: 404 });
      }
      const villages = await query('SELECT page_url FROM villages WHERE state_slug = ? AND district_slug = ? ORDER BY village_slug', [stateSlug, districtSlug]);
      
      let xml = '<?xml version="1.0" encoding="UTF-8"?>';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
      
      villages.forEach(v => {
        if (v.page_url) {
          xml += `<url><loc>${SITE_URL}/hi${v.page_url}</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`;
        }
      });
      xml += '</urlset>';
      
      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      });
    } catch (e) {
      return new Response('Error generating villages sitemap', { status: 500 });
    }
  }

  return new Response('Not Found', { status: 404 });
}
