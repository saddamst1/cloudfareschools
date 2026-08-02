
export function GET() {
  const content = `User-agent: Mediapartners-Google
Allow: /

User-agent: AdsBot-Google
Allow: /

User-agent: Googlebot
User-agent: Bingbot
User-agent: Applebot
User-agent: Slurp
User-agent: DuckDuckBot
Allow: /
Disallow: /api/

User-agent: AhrefsBot
User-agent: SemrushBot
User-agent: PetalBot
User-agent: Bytespider
User-agent: BLEXBot
User-agent: DotBot
User-agent: Yandex
User-agent: MJ12bot
User-agent: Amazonbot
User-agent: Rogerbot
User-agent: GPTBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Google-Extended
Disallow: /

User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://www.schoolspedia.in/sitemap.xml
`;
  return new Response(content, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
