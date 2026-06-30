import Link from 'next/link';
import AdSlot from '../../components/AdSlot';
import { breadcrumbSchema } from '../../lib/seo';

export const metadata = {
  title: 'Terms of Service | SchoolsPedia',
  description: 'Review the Terms of Service for SchoolsPedia.in. Learn about terms of data lookup, usage restrictions, and intellectual property limits.',
  alternates: { canonical: 'https://www.schoolspedia.in/terms-of-service' },
};

export default function TermsOfServicePage() {
  const crumbJsonLd = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Terms of Service', url: '/terms-of-service' },
  ]);

  return (
    <>
      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbJsonLd) }} />

      {/* Breadcrumbs */}
      <div className="breadcrumb" aria-label="breadcrumb">
        <div className="breadcrumb-inner">
          <Link href="/">Home</Link>
          <span className="sep" aria-hidden="true">›</span>
          <span className="current">Terms of Service</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', padding: '40px 24px', color: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: 8 }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: '1rem', color: '#BAE6FD', lineHeight: 1.6, maxWidth: 700 }}>
            Governing guidelines for search query usage, data retrieval licensing, and acceptable research/personal lookups.
          </p>
        </div>
      </div>

      {/* Content Container */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'start' }}>
          
          {/* Main Column */}
          <div>
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '32px', marginBottom: 24 }}>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                Welcome to SchoolsPedia. These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the website located at <Link href="/">https://www.schoolspedia.in</Link> (&ldquo;Site&rdquo; or &ldquo;SchoolsPedia&rdquo;) and any directory services, datasets, or search interfaces provided.
              </p>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>1. Acceptance of Terms</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                By accessing, browsing, or searching this Site, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree, please do not use the Site.
              </p>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>2. Nature of Service & Data Disclaimer</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                SchoolsPedia is an independent search directory. The school records, UDISE codes, and facility audits are compiled from publicly available datasets published by the <strong>Unified District Information System for Education Plus (UDISE+)</strong>, Ministry of Education, Government of India, and demographic indexes from the <strong>Census of India</strong>. 
              </p>
              <div style={{ background: '#FFFBEB', borderLeft: '4px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '16px 20px', marginBottom: 20 }}>
                <p style={{ fontSize: '0.875rem', color: '#78350F', margin: 0, lineHeight: 1.6 }}>
                  <strong>Disclaimer:</strong> While we make reasonable efforts to maintain the directory&apos;s structural alignment, the data is provided &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo;. We do not guarantee the completeness, accuracy, or real-time validity of any record. Official applications, scholarships, or legal filings must be verified through the respective school administrations or official education portals.
                </p>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>3. Acceptable Use License</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                Users are granted a limited, non-exclusive, non-transferable, and revocable license to access and use the Site for personal lookups, parent counseling, academic research, and non-commercial educational evaluations.
              </p>
              <div style={{ background: '#EFF6FF', borderLeft: '4px solid #3B82F6', borderRadius: '0 8px 8px 0', padding: '16px 20px', marginBottom: 20 }}>
                <p style={{ fontSize: '0.925rem', color: '#1E3A8A', margin: 0, fontWeight: 700, marginBottom: 8 }}>
                  🚫 Prohibited Conduct:
                </p>
                <ul style={{ fontSize: '0.875rem', color: '#1E40AF', lineHeight: 1.75, paddingLeft: 20, margin: 0 }}>
                  <li style={{ marginBottom: 6 }}>Deploy automated bots, scrapers, crawlers, or scripts to systematically dump, scrape, or extract our databases.</li>
                  <li style={{ marginBottom: 6 }}>Attempt to bypass search limits or compromise the API endpoints of the Site.</li>
                  <li style={{ marginBottom: 6 }}>Re-distribute or re-license the database listings for commercial profit.</li>
                  <li style={{ marginBottom: 6 }}>Use the Site to gather contact details of school administrators for spam, cold outreach, or phishing campaigns.</li>
                </ul>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>4. Intellectual Property</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                The search design, logo, visual components, color palettes, templates, custom programmatic text generation logic, and UI code are the intellectual property of SchoolsPedia. Public datasets, school names, addresses, and official UDISE codes remain the property of their respective creators and government agencies.
              </p>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>5. Limitation of Liability</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                In no event shall SchoolsPedia, its developers, or its editors be liable for any direct, indirect, incidental, special, or consequential damages arising out of the use, inability to use, or reliance on school directory information, even if advised of the possibility of such damage.
              </p>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>6. Modifications to Terms</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 0 }}>
                We reserve the right to modify these Terms at any time without prior notice. Continued use of the Site following updates constitutes acceptance of the modified Terms.
              </p>
            </div>

            <AdSlot size="responsive" />
          </div>

          {/* Right Sidebar */}
          <div>
            {/* Legal Directory Widget */}
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
                ⚖️ Legal Center
              </div>
              {[
                ['/privacy-policy', 'Privacy Policy', '#475569'],
                ['/terms-of-service', 'Terms of Service (Active)', '#1E40AF'],
                ['/disclaimer', 'Disclaimer Notice', '#475569'],
                ['/dmca', 'DMCA Policy', '#475569'],
                ['/contact', 'Contact & Reports', '#475569'],
              ].map(([href, label, color]) => (
                <Link key={href} href={href} style={{ display: 'block', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: '0.825rem', color, fontWeight: href === '/terms-of-service' ? 700 : 500, textDecoration: 'none' }}>
                  {label}
                </Link>
              ))}
            </div>

            <AdSlot size="sidebar" />
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 968px) {
          .content-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </>
  );
}
