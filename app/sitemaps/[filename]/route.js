import { query } from '@/lib/db';
import { ARTICLE_DATA } from '@/data/articles-data';

export const revalidate = 86400; // Cache sitemaps for 24 hours

const SITE_URL = process.env.SITE_URL || 'https://www.schoolspedia.in';

export async function GET(request, { params }) {
  const { filename } = await params;

  // 1. Sitemap Index
  if (filename === 'sitemap-index.xml') {
    try {
      let xml = '<?xml version="1.0" encoding="UTF-8"?>';
      xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
      
      // Core indices
      xml += `<sitemap><loc>${SITE_URL}/sitemaps/states.xml</loc></sitemap>`;
      xml += `<sitemap><loc>${SITE_URL}/sitemaps/districts.xml</loc></sitemap>`;
      xml += `<sitemap><loc>${SITE_URL}/sitemaps/pages.xml</loc></sitemap>`;

      // Fetch states for block sitemaps
      const states = await query('SELECT state_slug FROM states ORDER BY state_slug');
      states.forEach(s => {
        xml += `<sitemap><loc>${SITE_URL}/sitemaps/blocks-${s.state_slug}.xml</loc></sitemap>`;
      });

      // Fetch districts for school and village sitemaps
      const districts = await query('SELECT state_slug, district_slug FROM districts ORDER BY state_slug, district_slug');
      districts.forEach(d => {
        xml += `<sitemap><loc>${SITE_URL}/sitemaps/schools-${d.state_slug}-${d.district_slug}.xml</loc></sitemap>`;
        xml += `<sitemap><loc>${SITE_URL}/sitemaps/villages-${d.state_slug}-${d.district_slug}.xml</loc></sitemap>`;
      });

      xml += '</sitemapindex>';
      
      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      });
    } catch (e) {
      console.error('[Sitemap Index Error]', e.message);
      return new Response('Error generating sitemap index', { status: 500 });
    }
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
      
      districts.forEach(d => {
        xml += `<url><loc>${SITE_URL}/schools/${d.state_slug}/${d.district_slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`;
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

  // 4. Blocks by State Sitemap
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

  // 5. Schools by District Sitemap
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

  // 6. Villages by District Sitemap
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

  return new Response('Not Found', { status: 404 });
}
