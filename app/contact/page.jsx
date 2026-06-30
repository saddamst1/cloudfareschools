import Link from 'next/link';
import ContactForm from '../../components/ContactForm';
import { breadcrumbSchema } from '../../lib/seo';

export const metadata = {
  title: 'Contact Us & Report Errors | SchoolsPedia',
  description: 'Report data discrepancies or get in touch with the SchoolsPedia editorial team regarding school records.',
};

export default function ContactPage() {
  const crumbJsonLd = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Contact Us', url: '/contact' },
  ]);

  return (
    <>
      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbJsonLd) }} />

      <div className="breadcrumb">
        <div className="breadcrumb-inner">
          <Link href="/">Home</Link><span className="sep">›</span>
          <span className="current">Contact Us</span>
        </div>
      </div>

      <div style={{ background: '#1E40AF', padding: '36px 24px', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: '2.2rem', fontWeight: 800, color: 'white' }}>Contact & Support</h1>
          <p style={{ fontSize: '1rem', color: '#93C5FD', marginTop: 8, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            Found a data discrepancy or need help? Report school errors or reach out to our team.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 32 }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1E293B', marginBottom: 14 }}>Report a School Data Error</h2>
          <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.7, marginBottom: 20 }}>
            Since our database is compiled directly from official UDISE+ and Ministry of Education datasets, we do not manually alter records. However, if a school has been closed down or contains obsolete details, fill out this report form. Obsolete details are verified and updated in our periodic updates.
          </p>

          <ContactForm />

          <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #F1F5F9' }} />

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 12 }}>Administrative Inquiries</h2>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.75 }}>
            For research collaborations, dataset access requests, or official regulatory communications, you can email our database administrator team directly at <strong style={{ color: '#1E40AF' }}>data@schoolspedia.in</strong>. We respond to verified academic and government queries within 3–5 business days.
          </p>
        </div>
      </div>
    </>
  );
}
