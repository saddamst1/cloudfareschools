import Link from 'next/link';
import AdSlot from '../../components/AdSlot';
import { breadcrumbSchema } from '../../lib/seo';

export const metadata = {
  title: 'Privacy Policy | SchoolsPedia',
  description: 'Read the privacy policy for SchoolsPedia.in. Learn how we handle user data, cookies, Google AdSense advertising, and your privacy rights.',
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
          <p style={{ fontSize: '0.85rem', color: '#93C5FD', marginTop: 8 }}>
            Last Updated: July 19, 2025
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
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                If you have additional questions or require more information about our Privacy Policy, do not hesitate to <Link href="/contact">contact us</Link>.
              </p>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>General Data Protection Regulation (GDPR)</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 12 }}>
                We are a Data Controller of your information. Our legal basis for collecting and using personal information described in this Privacy Policy depends on the personal information we collect and the specific context in which we collect it:
              </p>
              <ul style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, paddingLeft: 20, marginBottom: 20 }}>
                <li>SchoolsPedia needs to perform a contract with you.</li>
                <li>You have given SchoolsPedia permission to do so.</li>
                <li>Processing your personal information is in SchoolsPedia&apos;s legitimate interests.</li>
                <li>SchoolsPedia needs to comply with applicable law.</li>
              </ul>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                If you are a resident of the European Economic Area (EEA) or United Kingdom, you have certain data protection rights. SchoolsPedia aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your personal information. If you wish to be informed about what personal information we hold about you and if you want it to be removed from our systems, please <Link href="/contact">contact us</Link>.
              </p>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>Log Files &amp; Search Queries</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                SchoolsPedia follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services&apos; analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users&apos; movement on the website, and gathering demographic information.
              </p>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>Cookies and Web Beacons</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                Like any other website, SchoolsPedia uses &ldquo;cookies&rdquo;. These cookies are used to store information including visitors&apos; preferences and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.
              </p>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>Google AdSense &amp; Third-Party Advertising</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 12 }}>
                SchoolsPedia uses Google AdSense to display advertisements. Google, as a third-party vendor, uses cookies to serve ads based on a user&apos;s prior visits to <strong>www.schoolspedia.in</strong> and other sites on the internet. Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the internet.
              </p>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#1E40AF' }}>Google Ads Settings</a>. Alternatively, you can opt out of third-party vendor use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: '#1E40AF' }}>www.aboutads.info</a>.
              </p>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>Your Advertising Choices &amp; Consent</h2>
              <div style={{ background: '#EFF6FF', borderLeft: '4px solid #3B82F6', borderRadius: '0 8px 8px 0', padding: '16px 20px', marginBottom: 20 }}>
                <p style={{ fontSize: '0.9rem', color: '#1E40AF', margin: 0, lineHeight: 1.6 }}>
                  <strong>Managing Your Preferences:</strong> You can control your cookie preferences and advertising choices through your browser settings. Most browsers allow you to refuse cookies or delete them. Note that disabling cookies may affect some functionality of the website.
                </p>
              </div>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 12 }}>
                For users in the European Economic Area (EEA) and United Kingdom, we comply with applicable data protection law and Google&apos;s EU User Consent Policy. We will seek your consent before setting non-essential cookies or using your data for personalized advertising where required by law.
              </p>
              <ul style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, paddingLeft: 20, marginBottom: 20 }}>
                <li>
                  <strong>Opt-out of Google personalized ads:</strong>{' '}
                  <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#1E40AF' }}>
                    google.com/settings/ads
                  </a>
                </li>
                <li>
                  <strong>Google Privacy Policy:</strong>{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#1E40AF' }}>
                    policies.google.com/privacy
                  </a>
                </li>
                <li>
                  <strong>Google Technologies &amp; Advertising:</strong>{' '}
                  <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#1E40AF' }}>
                    policies.google.com/technologies/ads
                  </a>
                </li>
              </ul>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>Data We Collect</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 12 }}>
                SchoolsPedia is an informational directory. We do not require user registration or collect personally identifiable information to use the site. The data we may collect includes:
              </p>
              <ul style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, paddingLeft: 20, marginBottom: 20 }}>
                <li>Search queries entered on the site (used to improve search results, not linked to identity)</li>
                <li>Usage data collected via Google Analytics (anonymized, used for improving site performance)</li>
                <li>Information you voluntarily submit via our <Link href="/contact">Contact form</Link> (name, email, message)</li>
              </ul>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                School data on this site is sourced from the Indian government&apos;s Unified District Information System for Education Plus (UDISE+) database, which is publicly available. We do not sell, trade, or otherwise transfer any information to outside parties.
              </p>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>Children&apos;s Information</h2>
              <div style={{ background: '#EFF6FF', borderLeft: '4px solid #3B82F6', borderRadius: '0 8px 8px 0', padding: '16px 20px', marginBottom: 12 }}>
                <p style={{ fontSize: '0.925rem', color: '#1E3A8A', margin: 0, fontWeight: 700, marginBottom: 8 }}>
                  Safety Note for Parents
                </p>
                <p style={{ fontSize: '0.9rem', color: '#1E40AF', margin: 0, lineHeight: 1.6 }}>
                  Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
                </p>
              </div>
              <div style={{ background: '#FFFBEB', borderLeft: '4px solid #F59E0B', borderRadius: '0 8px 8px 0', padding: '16px 20px', marginBottom: 20 }}>
                <p style={{ fontSize: '0.9rem', color: '#78350F', margin: 0, lineHeight: 1.6 }}>
                  SchoolsPedia does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to <Link href="/contact" style={{ color: '#92400E' }}>contact us</Link> immediately and we will do our best efforts to promptly remove such information from our records.
                </p>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, marginTop: 24, borderLeft: '3px solid #1E40AF', paddingLeft: 10 }}>Consent</h2>
              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.75, marginBottom: 0 }}>
                By using our website, you hereby consent to our Privacy Policy and agree to its terms. If you do not agree to this policy, please do not use our site. Your continued use of the site following the posting of changes to this policy will be deemed your acceptance of those changes.
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

            {/* Opt-out Info Widget */}
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#166534', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
                🛡️ Your Privacy Choices
              </div>
              <p style={{ fontSize: '0.8rem', color: '#15803D', lineHeight: 1.6, marginBottom: 10 }}>
                You can opt out of personalized ads served by Google on this site.
              </p>
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', background: '#16A34A', color: 'white', padding: '8px 14px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}
              >
                Manage Ad Preferences →
              </a>
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
