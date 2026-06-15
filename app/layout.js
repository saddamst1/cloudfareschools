import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthorBox from '../components/AuthorBox';
import { organizationSchema, websiteSchema } from '../lib/seo';
import Script from 'next/script';

import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata = {
  metadataBase: new URL('https://www.schoolspedia.in'),
  title: {
    default: "SchoolsPedia — India's Largest School Directory | 16.5 Lakh+ Schools",
    template: '%s | SchoolsPedia',
  },
  description: "Find any school in India by name, UDISE code, village, block or district. 1,653,159 schools from UDISE+ across 36 states. Official government data, free to search.",
  keywords: ['schools in India', 'UDISE code', 'school directory India', 'government schools', 'UDISE+'],
  authors: [{ name: 'SchoolsPedia Editorial Team' }],
  creator: 'SchoolsPedia',
  publisher: 'SchoolsPedia',
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'SchoolsPedia',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: "SchoolsPedia — India's School Directory",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@schoolspedia',
    images: ['/og-default.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  verification: {
    google: 'AcmHh0gGsU77WKGebJ8RzMyKWk1BbxiSF1EwNFjl9LA',
  },
};

export default function RootLayout({ children }) {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || 'ca-pub-XXXXXXXXXXXXXXXX';
  const orgSchema = organizationSchema();
  const siteSchema = websiteSchema();

  return (
    <html lang="en-IN" className={`${outfit.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {/* Google AdSense (Optimized loading via next/script) */}
        {process.env.NODE_ENV === 'production' && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}

        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GPNB12813S"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GPNB12813S');
          `}
        </Script>

        <Navbar />
        <main>{children}</main>
        <AuthorBox />
        <Footer />
      </body>
    </html>
  );
}
