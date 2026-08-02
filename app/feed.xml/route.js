import { ARTICLE_DATA } from '@/data/articles-data';


export async function GET() {
  const feedItems = Object.entries(ARTICLE_DATA).map(([slug, post]) => {
    // Escape XML special characters
    const escapeXml = (str) => {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    const url = `https://www.schoolspedia.in/blog/${slug}`;
    const pubDate = new Date('2026-06-05').toUTCString(); // Standard mock date for these guides

    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid>${escapeXml(url)}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
  }).join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SchoolsPedia Blog</title>
    <link>https://www.schoolspedia.in/blog</link>
    <description>Guides, resources, and demographic data analysis of the Indian education system.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://www.schoolspedia.in/feed.xml" rel="self" type="application/rss+xml"/>
    ${feedItems}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
