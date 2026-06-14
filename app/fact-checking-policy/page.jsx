import Link from 'next/link';
import { breadcrumbSchema } from '../../lib/seo';

export const metadata = {
  title: 'Fact-Checking & Review Verification Policy | SchoolsPedia',
  description: 'Learn about our content moderation guidelines, verification protocols, and how we keep user reviews spam-free.',
};

export default function FactCheckingPolicyPage() {
  const crumbJsonLd = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Fact-Checking Policy', url: '/fact-checking-policy' },
  ]);

  return (
    <>
      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbJsonLd) }} />

      <div className="breadcrumb" aria-label="breadcrumb">
        <div className="breadcrumb-inner">
          <Link href="/">Home</Link>
          <span className="sep" aria-hidden="true">›</span>
          <span className="current">Fact-Checking Policy</span>
        </div>
      </div>

      <div style={{ background: '#1E40AF', padding: '36px 24px', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.2rem', fontWeight: 800, color: 'white' }}>Fact-Checking & Review Policy</h1>
          <p style={{ fontSize: '1rem', color: '#93C5FD', marginTop: 8, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            Our guidelines for moderating parent feedback and maintaining database integrity.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 32 }}>
          
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, borderLeft: '3px solid #1E40AF', paddingLeft: 10, marginTop: 24 }}>
            1. User-Submitted Content Moderation
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.75, marginBottom: 16 }}>
            SchoolsPedia allows parents, alumni, and local residents to submit comments and ratings on school listings. While we encourage open and honest reviews, all submissions must comply with strict content safety rules.
          </p>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
            Comments are scanned automatically by our spam filtering system. We reject submissions containing URLs, website domains, email addresses, phone numbers, or promotional advertising codes.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, borderLeft: '3px solid #1E40AF', paddingLeft: 10, marginTop: 24 }}>
            2. Fact-Checking Official School Data
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.75, marginBottom: 16 }}>
            All directory data, including UDISE codes and location records, is checked against official databases. We do not modify statistical items based on user requests alone.
          </p>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
            If a school administration requests an update to a code or location parameter, we cross-verify it against the active records published on the official UDISE+ and Ministry of Education portals before changing any index listings.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, borderLeft: '3px solid #1E40AF', paddingLeft: 10, marginTop: 24 }}>
            3. Review Removal Guidelines
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.75, marginBottom: 16 }}>
            We reserve the right to remove user-submitted comments that violate our community guidelines. Content is removed if it contains:
          </p>
          <ul style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.75, paddingLeft: 20, marginBottom: 20 }}>
            <li style={{ marginBottom: 8 }}>Explicit, offensive, or harassing language targeted at teachers or students.</li>
            <li style={{ marginBottom: 8 }}>Spam marketing copy or search engine optimization link schemes.</li>
            <li style={{ marginBottom: 8 }}>Obvious misinformation, false claims, or fake rating campaigns.</li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, borderLeft: '3px solid #1E40AF', paddingLeft: 10, marginTop: 24 }}>
            4. Reporting Inaccuracies
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.75, marginBottom: 0 }}>
            If you identify a comment containing false information or violating safety rules, please report it to our team at <strong style={{ color: '#1E40AF' }}>moderation@schoolspedia.in</strong>. Include the school UDISE code and the reviewer's display name for quick identification.
          </p>

        </div>
      </div>
    </>
  );
}
