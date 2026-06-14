import Link from 'next/link';
import { breadcrumbSchema } from '../../lib/seo';

export const metadata = {
  title: 'Editorial Policy & Sourcing standards | SchoolsPedia',
  description: 'Understand how SchoolsPedia collects, verifies, and updates school records from official government registries.',
};

export default function EditorialPolicyPage() {
  const crumbJsonLd = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Editorial Policy', url: '/editorial-policy' },
  ]);

  return (
    <>
      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbJsonLd) }} />

      <div className="breadcrumb" aria-label="breadcrumb">
        <div className="breadcrumb-inner">
          <Link href="/">Home</Link>
          <span className="sep" aria-hidden="true">›</span>
          <span className="current">Editorial Policy</span>
        </div>
      </div>

      <div style={{ background: '#1E40AF', padding: '36px 24px', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.2rem', fontWeight: 800, color: 'white' }}>Editorial Policy</h1>
          <p style={{ fontSize: '1rem', color: '#93C5FD', marginTop: 8, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            Our standards for collecting, cleaning, and publishing verified educational records in India.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 32 }}>
          
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, borderLeft: '3px solid #1E40AF', paddingLeft: 10, marginTop: 24 }}>
            1. Sourcing from Official Registries
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.75, marginBottom: 16 }}>
            SchoolsPedia operates as an independent open data directory. We do not manually invent or create school listings. All records, school categories, management classifications, and structural indicators are sourced directly from the <strong>Unified District Information System for Education Plus (UDISE+)</strong> database, published annually by the Department of School Education & Literacy, Ministry of Education, Government of India.
          </p>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
            Demographic statistics and literacy percentages are compiled from the official <strong>Census of India</strong> dataset. By combining these two official sources, we provide structured context to help researchers and parents understand local education availability.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, borderLeft: '3px solid #1E40AF', paddingLeft: 10, marginTop: 24 }}>
            2. Data Cleaning & Normalization
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.75, marginBottom: 16 }}>
            Raw government tables contain millions of entries with inconsistent spellings, uppercase letter loops, and duplicate headers. The SchoolsPedia editorial team cleans this raw database by:
          </p>
          <ul style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.75, paddingLeft: 20, marginBottom: 20 }}>
            <li style={{ marginBottom: 8 }}>Formatting school and village names into proper title cases (e.g., converting "GOVT. H.S." to "Govt High School").</li>
            <li style={{ marginBottom: 8 }}>Removing redundant spaces, corrupted characters, and invalid database null values.</li>
            <li style={{ marginBottom: 8 }}>Grouping schools by state, district, block, and village slugs to enable hierarchical web crawling.</li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, borderLeft: '3px solid #1E40AF', paddingLeft: 10, marginTop: 24 }}>
            3. Accuracy and Updates Schedulers
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.75, marginBottom: 16 }}>
            Because the government publishes database updates once a year, changes in a school status (such as a school closing down or changing affiliation) may take time to show up in official releases. We update our databases periodically to synchronize with new government datasets.
          </p>
          <div style={{ background: '#FFFBEB', borderLeft: '4px solid #F59E0B', padding: '12px 16px', borderRadius: '0 8px 8px 0', marginBottom: 20 }}>
            <p style={{ fontSize: '0.825rem', color: '#92400E', margin: 0, lineHeight: 1.6 }}>
              <strong>Important:</strong> SchoolsPedia is an educational directory meant for informational purposes. It is not a legal document. Always verify details with school heads or block education officers before enrolling.
            </p>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, borderLeft: '3px solid #1E40AF', paddingLeft: 10, marginTop: 24 }}>
            4. Correction Requests
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.75, marginBottom: 0 }}>
            If you represent a school and identify an obsolete record on our page, please report it via our dedicated <Link href="/contact" style={{ color: '#1E40AF', fontWeight: 650, textDecoration: 'none' }}>Contact Page</Link>. Reported reports are reviewed and queued for the next database update cycle.
          </p>

        </div>
      </div>
    </>
  );
}
