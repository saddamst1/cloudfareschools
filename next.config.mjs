/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack config (Next.js 16 default bundler)
  turbopack: {},

  experimental: {
    cpus: 2,
  },

  // Webpack config for --webpack flag fallback
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },

  compress: true,

  env: {
    SITE_URL: process.env.SITE_URL || 'https://www.schoolspedia.in',
  },

  async headers() {
    return [
      // Security headers — all pages
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      // Static assets — 1 year immutable cache (hashed filenames never change)
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Images
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
      // ISR school/state/district pages — serve stale while revalidating
      {
        source: '/schools/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
      // Blog articles — longer cache, rarely updated
      {
        source: '/blog/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/sitemaps/sitemap-index.xml',
      },
    ];
  },
};

export default nextConfig;

