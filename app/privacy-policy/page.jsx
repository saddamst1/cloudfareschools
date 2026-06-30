import Link from 'next/link';
import AdSlot from '../../components/AdSlot';
import { breadcrumbSchema } from '../../lib/seo';

export const metadata = {
  title: 'Privacy Policy | SchoolsPedia',
  description: 'Read the privacy policy for SchoolsPedia.in. Learn how we handle database queries, cookies, and Google AdSense compliance.',
  alternates: { canonical: 'https://www.schoolspedia.in/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  const crumbJsonLd = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Privacy Policy', url: '/privacy-policy' },
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
          <span className="current">Privacy Policy</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', padding: '40px 24px', color: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: 8 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '1rem', color: '#BAE6FD', lineHeight: 1.6, maxWidth: 700 }}>
            Our commitment to protecting user privacy, complying with ad network policies, and managing academic database requests.
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
                At SchoolsPedia, accessible from <Link href="/">https://www.schoolspedia.in</Link>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by SchoolsPedia and how we use it.
              </p>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>General Data Protection Regulation (GDPR)</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                We are a Data Controller of your information. Our legal basis for collecting and using the personal information described in this Privacy Policy depends on the Personal Information we collect and the specific context in which we collect the information:
              </p>
              <ul style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, paddingLeft: 20, marginBottom: 20 }}>
                <li>SchoolsPedia needs to perform a contract with you.</li>
                <li>You have given SchoolsPedia permission to do so.</li>
                <li>Processing your personal information is in SchoolsPedia legitimate interests.</li>
                <li>SchoolsPedia needs to comply with the law.</li>
              </ul>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>Log Files & Search Queries</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                SchoolsPedia follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services&apos; analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users&apos; movement on the website, and gathering demographic information.
              </p>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>Cookies and Web Beacons</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                Like any other website, SchoolsPedia uses &ldquo;cookies&rdquo;. These cookies are used to store information including visitors&apos; preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.
              </p>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>Google DoubleClick DART Cookie</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a>
              </p>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>Our Advertising Partners</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                Some of the advertisers on our site may use cookies and web beacons. Our advertising partners include Google AdSense. Each of our advertising partners has their own Privacy Policy for their policies on user data. For easier access, we link to their Privacy Policies.
              </p>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>Children&apos;s Information</h2>
              <div style={{ background: '#EFF6FF', borderLeft: '4px solid #3B82F6', borderRadius: '0 8px 8px 0', padding: '16px 20px', marginBottom: 20 }}>
                <p style={{ fontSize: '0.925rem', color: '#1E3A8A', margin: 0, fontWeight: 700, marginBottom: 8 }}>
                  Safety Note for Parents
                </p>
                <p style={{ fontSize: '0.9rem', color: '#1E40AF', margin: 0, lineHeight: 1.6 }}>
                  Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
                </p>
              </div>
              <div style={{ background: '#FFFBEB', borderLeft: '4px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '16px 20px', marginBottom: 20 }}>
                <p style={{ fontSize: '0.9rem', color: '#78350F', margin: 0, lineHeight: 1.6 }}>
                  SchoolsPedia does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
                </p>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>Consent</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 0 }}>
                By using our website, you hereby consent to our Privacy Policy and agree to its terms.
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
                ['/privacy-policy', 'Privacy Policy (Active)', '#1E40AF'],
                ['/terms-of-service', 'Terms of Service', '#475569'],
                ['/disclaimer', 'Disclaimer Notice', '#475569'],
                ['/dmca', 'DMCA Policy', '#475569'],
                ['/contact', 'Contact & Reports', '#475569'],
              ].map(([href, label, color]) => (
                <Link key={href} href={href} style={{ display: 'block', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: '0.825rem', color, fontWeight: href === '/privacy-policy' ? 700 : 500, textDecoration: 'none' }}>
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
