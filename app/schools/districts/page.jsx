import Link from 'next/link';
import { getAllDistricts } from '@/lib/queries';
import AdSlot from '@/components/AdSlot';
import DistrictsDirectory from '@/components/DistrictsDirectory';
import { faqSchema } from '@/lib/seo';

export const revalidate = 86400; // Daily static revalidation

export const metadata = {
  title: 'Schools in India — Browse by District | SchoolsPedia',
  description: 'Browse schools across 740+ districts in India. Find government and private schools with UDISE codes, block lists, and village directories.',
  alternates: { canonical: 'https://www.schoolspedia.in/schools/districts' },
};

const DISTRICT_FAQS = [
  {
    q: "How are school districts organized under the education system in India?",
    a: "School districts represent the primary administrative tier for educational monitoring in India. Each district oversees several blocks, which are further divided into school clusters and individual villages. The District Education Officer (DEO) monitors school registries, regulatory standards, and facilities."
  },
  {
    q: "How can I find the UDISE code of a school in my district?",
    a: "Select your state and district on this page, then filter down by block and village. Every school profile page on SchoolsPedia displays its verified 11-digit UDISE code at the top. You will need this code for scholarship submissions (like NSP) and transfer certificates."
  },
  {
    q: "What role does the district play in RTE 25% quota admissions?",
    a: "Under Section 12(1)(c) of the Right to Education (RTE) Act, private schools reserve 25% of entry-level seats for economically weaker and disadvantaged children. The district administration, overseen by the District Education Officer (DEO) and local Block Education Officers (BEO), verifies documents, allocates seats, and processes fee reimbursements."
  },
  {
    q: "Where does the district-level school data on SchoolsPedia come from?",
    a: "All data is compiled directly from official government registries including the UDISE+ database from the Ministry of Education and Census of India demographic indicators. We update the database periodically to sync with state records."
  }
];

export default async function DistrictsIndexPage() {
  const districts = await getAllDistricts();
  const faqJsonLd = faqSchema(DISTRICT_FAQS);

  return (
    <>
      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Breadcrumbs */}
      <div className="breadcrumb" aria-label="breadcrumb">
        <div className="breadcrumb-inner">
          <Link href="/">Home</Link>
          <span className="sep" aria-hidden="true">›</span>
          <Link href="/schools">Schools</Link>
          <span className="sep" aria-hidden="true">›</span>
          <span className="current">All Districts</span>
        </div>
      </div>

      {/* Hero Header */}
      <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', padding: '32px 24px 28px', color: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, color: 'white', marginBottom: 0 }}>
            Browse Schools by District
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 0' }}>
        <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, maxWidth: 800, margin: 0 }}>
          Explore verified school profiles and UDISE+ registry details across {districts.length} districts in India. 
          Use the real-time search tool below or browse by state using the collapsible directory panels.
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px 24px' }}>
        <AdSlot size="leaderboard" />

        {/* Client-Side Interactive Directory (Search & Collapsible Accordion) */}
        <DistrictsDirectory districts={districts} />

        {/* Ad Slots */}
        <AdSlot size="responsive" style={{ marginTop: 24 }} />

        {/* SEO Information & FAQ Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 32 }}>
          
          {/* Detailed Educational Guide */}
          <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1E293B', marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
              📚 Understanding District-Level School Administration in India
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: 12 }}>
              In India, a <strong>district</strong> acts as the central administrative hub for educational planning, budget allocation, and policy enforcement under the state Department of Education. Each district is headed by the <strong>District Education Officer (DEO)</strong>, who supervises school inspections, resolves teacher recruitment guidelines, and monitors infrastructure compliance under local regulatory norms.
            </p>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: 16 }}>
              Each district has a dedicated <strong>District Information System for Education (DISE)</strong> coordinator. The DISE coordinator audits school submissions, updates infrastructure fields, and uploads the verified dataset to the national UDISE+ database. For parents, understanding district directories makes it simple to cross-verify school credentials, track local literacy levels, and connect with regulatory offices when resolving RTE admission quotas or scholarship discrepancies.
            </p>

            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E40AF', margin: '20px 0 8px' }}>
              The Role of District Administration in Indian Education
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.75, marginBottom: 12 }}>
              The district education administration acts as the critical link between state-level policy formulation and village-level implementation. The DEO manages school inspections, maintains records of both government and private entities, and ensures compliance with safe school infrastructure mandates.
            </p>
            <ul style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.75, paddingLeft: 20, marginBottom: 16 }}>
              <li style={{ marginBottom: 6 }}>
                <strong>Quality Assurance</strong>: Conducting periodic inspections to verify that schools maintain structural safety standards, separate working toilets, and functional computer facilities.
              </li>
              <li style={{ marginBottom: 6 }}>
                <strong>RTE Act Compliance</strong>: Ensuring that private, unaided schools in the district implement the 25% reservation quota correctly for children from Economically Weaker Sections (EWS).
              </li>
              <li style={{ marginBottom: 0 }}>
                <strong>UDISE Registry Control</strong>: Reviewing and approving the annual UDISE+ database submissions from all schools, ensuring that student enrollment counts and infrastructure parameters are reported accurately.
              </li>
            </ul>

            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0D9488', margin: '20px 0 8px' }}>
              How Parents Can Use District Directory Data
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.75, marginBottom: 0 }}>
              Checking district records helps parents verify school affiliations before enrollment. If a school does not have a valid UDISE code in the district directory, it may not be recognized by the government, which can lead to issues with board registration and college admissions. Additionally, comparing block-level literacy and school densities helps researchers analyze educational access across rural and urban divisions.
            </p>
          </div>

          {/* FAQ Accordion Section */}
          <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1E293B', marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
              Frequently Asked Questions (FAQs)
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {DISTRICT_FAQS.map(({ q, a }) => (
                <details key={q} className="faq-item">
                  <summary>
                    <span className="faq-q">
                      <span style={{ color: '#1E40AF', flexShrink: 0 }}>✅</span>
                      {q}
                    </span>
                  </summary>
                  <p className="faq-a" dangerouslySetInnerHTML={{ __html: a.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </details>
              ))}
            </div>
          </div>

        </div>

        <AdSlot size="responsive" style={{ marginTop: 24 }} />
      </div>
    </>
  );
}
