import Link from 'next/link';
import { getAllStates } from '../../lib/queries';
import AdSlot from '../../components/AdSlot';

export const revalidate = 86400; // Revalidate daily

export const metadata = {
  title: 'Sitemap — SchoolsPedia Directory Index | SchoolsPedia',
  description: 'Locate schools across all 36 states and Union Territories in India. Browse our comprehensive educational directory sitemap, legal sections, and blog guides.',
  alternates: { canonical: 'https://www.schoolspedia.in/sitemap-page' },
};

export default async function SitemapPage() {
  const states = await getAllStates();
  const fmt = (n) => n ? Number(n).toLocaleString('en-IN') : '—';

  return (
    <>
      {/* Breadcrumbs */}
      <div className="breadcrumb" aria-label="breadcrumb">
        <div className="breadcrumb-inner">
          <Link href="/">Home</Link>
          <span className="sep" aria-hidden="true">›</span>
          <span className="current">Sitemap</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', padding: '40px 24px', color: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: 8 }}>
            Sitemap & Directory Index
          </h1>
          <p style={{ fontSize: '1rem', color: '#BAE6FD', lineHeight: 1.6, maxWidth: 700 }}>
            A complete human-browsable roadmap of SchoolsPedia&apos;s school directories, research articles, and legal documents.
          </p>
        </div>
      </div>

      {/* Main 2-Column Container */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'start' }}>
          
          {/* Left Column - Main Index */}
          <div>
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '32px', marginBottom: 24 }}>
              
              {/* Directory Sections */}
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1E293B', marginBottom: 18, borderBottom: '2px solid #EFF6FF', paddingBottom: 10 }}>
                🇮🇳 Browse Schools by State
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, marginBottom: 20 }}>
                Explore government, private aided, and private unaided schools, UDISE codes, and local Census details for any state or union territory.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginBottom: 32 }}>
                {states.map(state => (
                  <Link key={state.state_slug} href={`/schools/${state.state_slug}`} className="sitemap-state-link">
                    <div className="sitemap-state-card">
                      <span>{state.state_name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#0D9488', fontWeight: 500 }}>{fmt(state.total_schools)}</span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Blog Articles */}
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1E293B', marginBottom: 16, borderBottom: '2px solid #EFF6FF', paddingBottom: 10 }}>
                📚 Research & Guides
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                {[
                  ['/blog/what-is-udise-code', 'Understanding UDISE+ Codes: The DNA of Indian School Data'],
                  ['/blog/govt-vs-private-schools', 'Government vs Private Schools: A Data-Driven Analysis of Indian Education'],
                  ['/blog/rural-education-india', 'Rural Education in India: Key Insights from Census and UDISE+'],
                  ['/blog/rte-admission-guide', 'RTE Admission Guide: How to Apply for 25% Free Quota Seats'],
                ].map(([href, title]) => (
                  <Link key={href} href={href} className="sitemap-blog-link">
                    {title} →
                  </Link>
                ))}
              </div>

              {/* Main Site Sections */}
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1E293B', marginBottom: 16, borderBottom: '2px solid #EFF6FF', paddingBottom: 10 }}>
                🧭 Main Navigation & Support
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  ['/', 'Homepage'],
                  ['/schools', 'All States Index'],
                  ['/about', 'About Us & Mission'],
                  ['/contact', 'Contact Us & Error Reporting'],
                  ['/search', 'Advanced School Search'],
                ].map(([href, title]) => (
                  <Link key={href} href={href} style={{ display: 'block', padding: '10px 12px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, fontSize: '0.85rem', color: '#1D4ED8', fontWeight: 600, textDecoration: 'none' }}>
                    {title}
                  </Link>
                ))}
              </div>

            </div>

            <AdSlot size="responsive" />
          </div>

          {/* Right Sidebar */}
          <div>
            {/* Legal Directory Widget */}
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
                ⚖️ Legal Pages
              </div>
              {[
                ['/privacy-policy', 'Privacy Policy'],
                ['/terms-of-service', 'Terms of Service'],
                ['/disclaimer', 'Disclaimer Notice'],
                ['/dmca', 'DMCA Policy'],
                ['/contact', 'Contact & Reports'],
              ].map(([href, label]) => (
                <Link key={href} href={href} style={{ display: 'block', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: '0.825rem', color: '#475569', textDecoration: 'none' }}>
                  {label}
                </Link>
              ))}
            </div>

            <AdSlot size="sidebar" />
          </div>

        </div>
      </div>

      <style>{`
        .sitemap-state-link {
          text-decoration: none;
        }
        .sitemap-state-card {
          padding: 10px 14px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.85rem;
          color: #1E293B;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: border-color 0.15s ease;
        }
        .sitemap-state-link:hover .sitemap-state-card {
          border-color: #3B82F6 !important;
        }
        .sitemap-blog-link {
          display: block;
          padding: 12px 14px;
          background: #F0FDF4;
          border: 1px solid #A7F3D0;
          border-radius: 8px;
          font-size: 0.875rem;
          color: #047857 !important;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.15s ease;
        }
        .sitemap-blog-link:hover {
          background: #ECFDF5 !important;
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
