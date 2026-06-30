import Link from 'next/link';
import AdSlot from '../../components/AdSlot';
import { breadcrumbSchema } from '../../lib/seo';

export const metadata = {
  title: 'Disclaimer & Non-Affiliation | SchoolsPedia',
  description: 'Read the official disclaimer for SchoolsPedia.in. We are an independent educational lookup directory, not affiliated with the government.',
  alternates: { canonical: 'https://www.schoolspedia.in/disclaimer' },
};

export default function DisclaimerPage() {
  const crumbJsonLd = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Disclaimer', url: '/disclaimer' },
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
          <span className="current">Disclaimer</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', padding: '40px 24px', color: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: 8 }}>
            Disclaimer
          </h1>
          <p style={{ fontSize: '1rem', color: '#BAE6FD', lineHeight: 1.6, maxWidth: 700 }}>
            Clarification of our status as an independent directory, and limitations regarding government affiliation or representation.
          </p>
        </div>
      </div>

      {/* Content Container */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'start' }}>
          
          {/* Main Column */}
          <div>
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '32px', marginBottom: 24 }}>
              <div style={{ background: '#FFF7ED', borderLeft: '4px solid #F97316', borderRadius: '0 8px 8px 0', padding: '16px 20px', marginBottom: 24 }}>
                <p style={{ fontSize: '0.9rem', color: '#7C2D12', margin: 0, fontWeight: 700 }}>
                  ⚠️ IMPORTANT NOTICE: NON-AFFILIATION DISCLAIMER
                </p>
                <p style={{ fontSize: '0.85rem', color: '#7C2D12', margin: '6px 0 0', lineHeight: 1.6 }}>
                  SchoolsPedia.in is a fully independent, private educational search directory and database portal. We have NO official affiliation, connection, authorization, endorsement, or representation by the Ministry of Education, Government of India, the Department of School Education, or any state education board.
                </p>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24 }}>1. Independent Information Index</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                The listings, geographic hierarchies, categories, teacher-pupil structures, and facility metrics published on SchoolsPedia are aggregated for informational purposes only. The raw database feeds are compiled from the open datasets of the <strong>Unified District Information System for Education Plus (UDISE+)</strong> and the <strong>Census of India</strong>, which are released under the Open Government Data (OGD) License.
              </p>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24 }}>2. Not a Government Application Portal</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                SchoolsPedia is NOT an application portal for school admissions, RTE (Right to Education) seat requests, government scholarships, board examination registrations, or administrative teacher recruitments. Any guide or tutorial posted on this Site regarding government portals (such as the National Scholarship Portal, state RTE dashboards, or CBSE portals) is provided solely for educational guidance. Users must visit official government web domains (`.gov.in` or `.nic.in`) to complete administrative filings.
              </p>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24 }}>3. Accuracy and &ldquo;As-Is&rdquo; Provision</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                We make continuous efforts to clean, index, and organize database records. However, the school network in India changes constantly. Schools may close down, relocate, change administrative management, alter board affiliations, or adjust fee levels. Consequently:
              </p>
              <ul style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, paddingLeft: 20, marginBottom: 20 }}>
                <li style={{ marginBottom: 6 }}>SchoolsPedia makes no warranties, express or implied, regarding the currency or error-free status of the listings.</li>
                <li style={{ marginBottom: 6 }}>We are not responsible for any decision made by users (such as school enrollments, relocations, or scholarship filings) in reliance on our directory details.</li>
                <li style={{ marginBottom: 6 }}>Official verification of UDISE codes and school parameters should always be performed directly with the school administration or respective government regulators.</li>
              </ul>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24 }}>4. Contact for Corrections</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 0 }}>
                If you are a school principal, administrator, or local officer and notice an error, typo, or outdated parameter in our index, please read our <Link href="/contact">Contact & Reports</Link> guidelines to report the discrepancies. We verify reports during our regular database updates.
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
                ['/disclaimer', 'Disclaimer Notice (Active)', '#1E40AF'],
                ['/dmca', 'DMCA Policy', '#475569'],
                ['/contact', 'Contact & Reports', '#475569'],
              ].map(([href, label, color]) => (
                <Link key={href} href={href} style={{ display: 'block', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: '0.825rem', color, fontWeight: href === '/disclaimer' ? 700 : 500, textDecoration: 'none' }}>
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
