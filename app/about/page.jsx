import Link from 'next/link';
import { getHomepageStats } from '../../lib/queries';
import AdSlot from '../../components/AdSlot';
import { breadcrumbSchema } from '../../lib/seo';

export const revalidate = 86400; // Revalidate daily

export const metadata = {
  title: 'About SchoolsPedia | School Directory India',
  description: 'SchoolsPedia is a free school directory for India. School records are sourced from UDISE+ (Ministry of Education). Find any school by name, village, district, or UDISE code.',
  alternates: { canonical: 'https://www.schoolspedia.in/about' },
};

export default async function AboutPage() {
  const stats = await getHomepageStats();
  const fmt = (n) => n ? Number(n).toLocaleString('en-IN') : '—';

  const crumbJsonLd = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'About Us', url: '/about' },
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
          <span className="current">About Us</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', padding: '48px 24px', color: 'white', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: 12 }}>
            About SchoolsPedia
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#BAE6FD', lineHeight: 1.6, maxWidth: 700 }}>
            Helping parents, students, and researchers find verified school details, UDISE codes, and facilities across India.
          </p>
        </div>
      </div>

      {/* Main 2-Column Container */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'start' }}>
          
          {/* Left Main Column */}
          <div>
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '32px', marginBottom: 24 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>What is SchoolsPedia?</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.8, marginBottom: 20 }}>
                SchoolsPedia is a free school directory for India. We index records for over <strong>{fmt(stats?.total_schools)} schools</strong> from the UDISE+ database and make them easy to search by school name, village, district, or UDISE code.
              </p>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.8, marginBottom: 20 }}>
                We built this because finding a school’s official information through government portals is harder than it should be. UDISE+, District Information offices, state board sites — information is scattered. We pull it into one place and make it searchable.
              </p>

              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1E293B', marginBottom: 14 }}>Where Does Our Data Come From?</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.8, marginBottom: 20 }}>
                School data is from the <strong>UDISE+</strong> database maintained by the Department of School Education &amp; Literacy, Ministry of Education, Government of India. Literacy and population figures are from the <strong>Census of India</strong>.
              </p>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.8, marginBottom: 20 }}>
                We do not change or add to any school records. If UDISE+ says a school is operational, we show it as operational. If a record is missing, we say so. We don’t fill in blanks with guesses.
              </p>

              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1E293B', marginBottom: 14 }}>Who Uses SchoolsPedia?</h2>
              <ul style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.8, paddingLeft: 20, marginBottom: 24 }}>
                <li style={{ marginBottom: 10 }}>
                  <strong>Parents</strong> looking to check if a school is government-registered, or finding nearby schools in a village.
                </li>
                <li style={{ marginBottom: 10 }}>
                  <strong>Students</strong> who need their school’s 11-digit UDISE code for NSP scholarships or board exam forms.
                </li>
                <li style={{ marginBottom: 10 }}>
                  <strong>Researchers and NGOs</strong> mapping school coverage in rural blocks or studying literacy data by district.
                </li>
              </ul>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1E293B', marginTop: 32, marginBottom: 16 }}>Who Runs SchoolsPedia?</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.8, marginBottom: 24 }}>
                SchoolsPedia is run by a small team of writers and developers. We keep school records accurate, write practical guides about admissions and UDISE codes, and update data whenever UDISE+ releases new records.
              </p>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24, display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center', marginBottom: 24 }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', border: '3px solid #3B82F6', flexShrink: 0 }}>
                  <img src="/authors/sahajul.jpg" alt="Sahajul" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Sahajul</h3>
                  <p style={{ fontSize: '0.825rem', color: '#0D9488', fontWeight: 700, marginTop: 2, marginBottom: 8 }}>Founder & Chief Editor</p>
                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    Living in Tezpur, Assam, India, Sahajul is a passionate blogger who has been writing content online for more than 14 years. He started SchoolsPedia to make it easy for parents to search and read about schools without getting confused by complicated government lists.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div style={{ border: '1px solid #E2E8F0', borderRadius: 10, padding: 18 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', margin: '0 0 6px 0' }}>Data Team</h4>
                  <p style={{ fontSize: '0.775rem', color: '#0D9488', fontWeight: 700, margin: '0 0 8px 0' }}>Records &amp; Accuracy</p>
                  <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                    Keeps UDISE data in sync and checks district records when new UDISE releases come out.
                  </p>
                </div>
                <div style={{ border: '1px solid #E2E8F0', borderRadius: 10, padding: 18 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', margin: '0 0 6px 0' }}>Editorial Team</h4>
                  <p style={{ fontSize: '0.775rem', color: '#0D9488', fontWeight: 700, margin: '0 0 8px 0' }}>Guides &amp; Accuracy</p>
                  <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                    Writes and updates admission guides, RTE articles, and UDISE explanations that are actually useful.
                  </p>
                </div>
              </div>

              <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: 10, padding: 20, marginBottom: 20 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F766E', marginBottom: 6 }}>100% Free and Open-Access</h3>
                <p style={{ fontSize: '0.85rem', color: '#115E59', margin: 0, lineHeight: 1.6 }}>
                  SchoolsPedia requires no registrations, sign-ups, or fees. We believe basic educational data is a public resource and should remain open to everyone.
                </p>
              </div>
            </div>

            <AdSlot size="responsive" />
          </div>

          {/* Right Sidebar */}
          <div>
            {/* Sidebar Stats Widget */}
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 }}>
                📊 SchoolsPedia at a Glance
              </div>

              {[
                ['Total Schools', fmt(stats?.total_schools), '#1E40AF'],
                ['States & UTs', fmt(stats?.total_states), '#0D9488'],
                ['Districts Mapped', fmt(stats?.total_districts), '#1E40AF'],
                ['Indexed Villages', fmt(stats?.total_villages), '#F97316'],
                ['Data Refresh', '2026 Sync', '#475569'],
                ['Access License', 'Open Data', '#16A34A'],
              ].map(([label, val, color]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #F1F5F9', fontSize: '0.825rem' }}>
                  <span style={{ color: '#64748B' }}>{label}</span>
                  <span style={{ color, fontWeight: 700 }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Quick Links Widget */}
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
                🔗 Legal & Contact
              </div>
              {[
                ['/privacy-policy', 'Privacy Policy'],
                ['/terms-of-service', 'Terms of Service'],
                ['/disclaimer', 'Disclaimer'],
                ['/dmca', 'DMCA Notice'],
                ['/contact', 'Contact Us'],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="sidebar-text-link">
                  {label} →
                </Link>
              ))}
            </div>

            <AdSlot size="sidebar" />
          </div>

        </div>
      </div>

      <style>{`
        .sidebar-text-link {
          display: block;
          padding: 6px 0;
          font-size: 0.825rem;
          color: #1E40AF;
          text-decoration: none;
          transition: text-decoration 0.15s ease;
        }
        .sidebar-text-link:hover {
          text-decoration: underline !important;
        }
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
