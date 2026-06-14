import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthorBox from '../components/AuthorBox';
import { organizationSchema, websiteSchema } from '../lib/seo';
import Script from 'next/script';

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
  },
  twitter: {
    card: 'summary_large_image',
    site: '@schoolspedia',
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
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {process.env.NODE_ENV === 'production' && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`}
            crossOrigin="anonymous"
          />
        )}

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
