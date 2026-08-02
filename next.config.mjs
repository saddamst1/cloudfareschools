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

    // Alias optional native dependencies so bundlers replace them with empty objects
    config.resolve.alias = {
      ...config.resolve.alias,
      'pg-native': false,
      'pg-cloudflare': false,
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        pg: false,
        'pg-native': false,
      };
    }
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

      // Images
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
      // ISR school/state/district pages — cache for 30 days, stale-while-revalidate for 7 days
      {
        source: '/schools/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=2592000, stale-while-revalidate=604800' },
          { key: 'Vary', value: 'accept-encoding' },
        ],
      },
      {
        source: '/hi/schools/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=2592000, stale-while-revalidate=604800' },
          { key: 'Vary', value: 'accept-encoding' },
        ],
      },
      // Blog pages
      {
        source: '/blog',
        headers: [
          { key: 'Vary', value: 'accept-encoding' },
        ],
      },
      // Blog articles
      {
        source: '/blog/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // 301 permanent redirect: non-www → www
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'schoolspedia.in' }],
        destination: 'https://www.schoolspedia.in/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
