import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div style={{ padding: '40px 24px 0', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 32, marginBottom: 32 }}>
          {/* Brand */}
          <div>
            <div className="footer-logo" style={{ marginBottom: 10 }}>Schools<span className="teal">Pedia</span><span style={{ color: '#F97316' }}>.in</span></div>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.7, marginBottom: 12 }}>
              India&apos;s largest school directory with 16.5+ lakh schools from UDISE+ data.
              Find any school by state, district, block, village or UDISE code — free and fast.
            </p>
            <p style={{ fontSize: '0.7rem', color: '#475569' }}>Data: UDISE+, Ministry of Education, Govt. of India · Census of India</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              <span className="f-badge">🛡️ UDISE+ Sourced</span>
              <span className="f-badge">🔒 SSL Secured</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Quick Links</div>
            {[['/', 'Home'], ['/schools', 'All States'], ['/about', 'About Us'], ['/contact', 'Contact'], ['/blog', 'Blog'], ['/sitemap-page', 'Sitemap']].map(([href, label]) => (
              <Link key={href} href={href} className="footer-link">{label}</Link>
            ))}
          </div>

          {/* Browse */}
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Browse</div>
            {[
              ['/schools/uttar-pradesh', 'UP Schools'],
              ['/schools/maharashtra', 'Maharashtra'],
              ['/schools/bihar', 'Bihar Schools'],
              ['/schools/rajasthan', 'Rajasthan'],
              ['/schools/madhya-pradesh', 'MP Schools'],
              ['/schools', 'All 36 States →'],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="footer-link">{label}</Link>
            ))}
          </div>

          {/* Legal */}
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Legal</div>
            {[
              ['/privacy-policy', 'Privacy Policy'],
              ['/terms-of-service', 'Terms of Service'],
              ['/editorial-policy', 'Editorial Policy'],
              ['/fact-checking-policy', 'Fact-Checking Policy'],
              ['/disclaimer', 'Disclaimer'],
              ['/dmca', 'DMCA'],
              ['/contact', 'Report Error'],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="footer-link">{label}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid #334155', padding: '16px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>© {currentYear} SchoolsPedia.in · All rights reserved</div>
            <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: 3 }}>School data sourced from UDISE+, Ministry of Education, Govt. of India. For informational purposes only.</div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
