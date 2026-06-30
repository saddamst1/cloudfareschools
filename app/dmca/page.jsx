import Link from 'next/link';
import AdSlot from '../../components/AdSlot';
import { breadcrumbSchema } from '../../lib/seo';

export const metadata = {
  title: 'DMCA Notice & Copyright Policy | SchoolsPedia',
  description: 'Read the DMCA and Copyright notice for SchoolsPedia.in. Learn how copyright holders can submit database takedown or corrections requests.',
  alternates: { canonical: 'https://www.schoolspedia.in/dmca' },
};

export default function DmcaPage() {
  const crumbJsonLd = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'DMCA Policy', url: '/dmca' },
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
          <span className="current">DMCA Policy</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', padding: '40px 24px', color: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: 8 }}>
            DMCA & Copyright Notice
          </h1>
          <p style={{ fontSize: '1rem', color: '#BAE6FD', lineHeight: 1.6, maxWidth: 700 }}>
            Policy guidelines regarding intellectual property claims, database ownership, and the removal or correction of directory listings.
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
                SchoolsPedia respects the intellectual property rights of others. In accordance with the Digital Millennium Copyright Act (&ldquo;DMCA&rdquo;) and international copyright regulations, we will respond expeditiously to claims of copyright infringement or database rights violations on the Site.
              </p>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>1. Intellectual Property & Public Datasets</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                The core database listings on SchoolsPedia (including school names, addresses, village codes, and registration categories) are compiled from publicly accessible government archives. These lists represent factual, directory-level data, which is open-access and published under the Open Government Data (OGD) frameworks of the Ministry of Education, India.
              </p>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                Factual listings and public educational data elements do not constitute proprietary copyrightable material. However, if you represent a school administration or hold trademark/copyright rights to specific branding assets or private photographs that have been uploaded without authorization, you may file a notice.
              </p>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>2. Takedown or Correction Requests</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                To file a valid copyright infringement notice, please provide our designated database administrator with the following details:
              </p>
              <div style={{ background: '#EFF6FF', borderLeft: '4px solid #3B82F6', borderRadius: '0 8px 8px 0', padding: '16px 20px', marginBottom: 20 }}>
                <ul style={{ fontSize: '0.875rem', color: '#1E40AF', lineHeight: 1.75, paddingLeft: 20, margin: 0 }}>
                  <li style={{ marginBottom: 6 }}>Identification of the copyrighted work claimed to have been infringed (such as school branding, logos, or media assets).</li>
                  <li style={{ marginBottom: 6 }}>Specific URLs of the directory listings on the Site containing the disputed material.</li>
                  <li style={{ marginBottom: 6 }}>Your contact information, including physical address, telephone number, and email.</li>
                  <li style={{ marginBottom: 6 }}>A statement of good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.</li>
                  <li style={{ marginBottom: 6 }}>A statement, under penalty of perjury, that the information in the notice is accurate and that you are authorized to act on behalf of the owner.</li>
                </ul>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>3. Submission Channels</h2>
              <div style={{ background: '#FFFBEB', borderLeft: '4px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '16px 20px', marginBottom: 20 }}>
                <p style={{ fontSize: '0.9rem', color: '#78350F', margin: 0, lineHeight: 1.6 }}>
                  Please submit your notices directly to our data administrator team by email at: <strong style={{ color: '#1E40AF' }}>dmca@schoolspedia.in</strong>.
                </p>
              </div>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 0 }}>
                For database corrections, typos in school names, closed school notices, or updates to contact details, please use our standard reporting form on the <Link href="/contact">Contact Page</Link>. These reports are processed much faster as they do not require formal copyright validation.
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
                ['/terms-of-service', 'Terms of Service', '#475569'],
                ['/disclaimer', 'Disclaimer Notice', '#475569'],
                ['/dmca', 'DMCA Policy (Active)', '#1E40AF'],
                ['/contact', 'Contact & Reports', '#475569'],
              ].map(([href, label, color]) => (
                <Link key={href} href={href} style={{ display: 'block', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: '0.825rem', color, fontWeight: href === '/dmca' ? 700 : 500, textDecoration: 'none' }}>
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
