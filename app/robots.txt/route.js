export function GET() {
  const content = `User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://www.schoolspedia.in/sitemaps/sitemap-index.xml
`;
  return new Response(content, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
