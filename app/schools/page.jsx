import Link from 'next/link';
import { getAllStates } from '@/lib/queries';
import StateCard from '@/components/StateCard';
import AdSlot from '@/components/AdSlot';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Schools in India — Browse by State | SchoolsPedia',
  description: 'Browse schools in all 36 states and Union Territories of India. Find government and private schools by state, district, block, or village. 16.5+ lakh schools from UDISE+.',
  alternates: { canonical: 'https://www.schoolspedia.in/schools' },
};

export default async function SchoolsIndexPage() {
  const states = await getAllStates();
  const totalSchools = states.reduce((s, st) => s + (Number(st.total_schools) || 0), 0);

  return (
    <>
      {/* Header */}
      <div style={{ background: '#1E40AF', padding: '32px 24px 28px', color: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#93C5FD', marginBottom: 10 }}>
            <Link href="/" style={{ color: '#93C5FD', textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <span style={{ color: 'white' }}>All States</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'white', marginBottom: 0 }}>
            Schools in India — Browse by State
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 0' }}>
        <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
          {totalSchools.toLocaleString('en-IN')}+ schools across 36 states and Union Territories of India.
          Click any state to explore its districts, blocks, villages, and individual school UDISE codes.
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px 24px' }}>
        <AdSlot size="leaderboard" />

        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '20px 22px', marginBottom: 24, marginTop: 16 }}>
          <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, margin: 0 }}>
            <strong>SchoolsPedia</strong> is a free directory mapping over <strong>{totalSchools.toLocaleString('en-IN')} schools</strong> across all 36 states and Union Territories. All school data comes directly from official <strong>UDISE+ government records</strong>, allowing you to browse verified details down to any local district, block, or village. Whether you need to look up a school&apos;s unique <strong>11-digit UDISE code</strong> for scholarship forms (like NSP), verify school management (government vs private), or check basic infrastructure like drinking water and toilets, you can find the details here. Just choose your state below to explore the directory.
          </p>
        </div>

        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>
            All 36 States & Union Territories
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}>
            {states.map((state, i) => (
              <StateCard key={state.state_slug} state={state} index={i} />
            ))}
          </div>
        </div>

        {/* Content for SEO - AdSense Booster */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 32 }}>
          
          {/* Comparison Table */}
          <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
              📊 School counts across major states
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.7, marginBottom: 16 }}>
              The table below shows how schools are distributed across some of the major states in India. You will see that Uttar Pradesh has the largest number of schools, followed by Madhya Pradesh and Maharashtra.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                    <th style={{ padding: '10px', color: '#475569', fontWeight: 700 }}>State / UT</th>
                    <th style={{ padding: '10px', color: '#475569', fontWeight: 700 }}>Total Schools</th>
                    <th style={{ padding: '10px', color: '#475569', fontWeight: 700 }}>Districts</th>
                    <th style={{ padding: '10px', color: '#475569', fontWeight: 700 }}>Blocks</th>
                    <th style={{ padding: '10px', color: '#475569', fontWeight: 700 }}>Avg. Literacy</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Uttar Pradesh', count: '2,45,000+', dist: 75, blocks: 822, lit: '67.7%' },
                    { name: 'Madhya Pradesh', count: '1,42,000+', dist: 52, blocks: 313, lit: '69.3%' },
                    { name: 'Maharashtra', count: '1,09,000+', dist: 36, blocks: 351, lit: '82.3%' },
                    { name: 'Bihar', count: '93,000+', dist: 38, blocks: 534, lit: '61.8%' },
                    { name: 'Rajasthan', count: '85,000+', dist: 33, blocks: 301, lit: '66.1%' },
                    { name: 'West Bengal', count: '82,000+', dist: 23, blocks: 341, lit: '76.3%' },
                  ].map((row, idx) => (
                    <tr key={row.name} style={{ borderBottom: '1px solid #F1F5F9', background: idx % 2 === 0 ? 'white' : '#F8FAFC' }}>
                      <td style={{ padding: '10px', fontWeight: 600, color: '#1E293B' }}>{row.name}</td>
                      <td style={{ padding: '10px', color: '#1E40AF', fontWeight: 700 }}>{row.count}</td>
                      <td style={{ padding: '10px', color: '#475569' }}>{row.dist}</td>
                      <td style={{ padding: '10px', color: '#475569' }}>{row.blocks}</td>
                      <td style={{ padding: '10px', color: '#0D9488', fontWeight: 600 }}>{row.lit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Education Boards Guide */}
          <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1E293B', marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
              🏫 A Simple Guide to School Boards in India
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: 14 }}>
              When you choose a school for your child, the <strong>board of education</strong> is one of the biggest factors to consider. The board determines the syllabus, textbooks, exam strictness, and learning style. Here is a quick, practical breakdown of the four main school boards in India:
            </p>
            <ul style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.75, paddingLeft: 20, margin: 0 }}>
              <li style={{ marginBottom: 10 }}>
                <strong>CBSE (Central Board of Secondary Education)</strong>: This is India&apos;s most popular national board, managed by the Central Government. It follows the <strong>NCERT syllabus</strong>, which is the exact base used for competitive entrance exams like <strong>JEE (Engineering)</strong> and <strong>NEET (Medical)</strong>. Best if you have transferable jobs or want your child to prepare for national-level competitive tests.
              </li>
              <li style={{ marginBottom: 10 }}>
                <strong>State Boards (e.g., UPMSP, MSBSHSE)</strong>: Managed by individual state governments. The syllabus is tailored to local languages, regional history, and culture, and textbooks are typically very affordable. Best for families looking for budget-friendly education or focusing on state-level government exams.
              </li>
              <li style={{ marginBottom: 10 }}>
                <strong>CISCE (ICSE / ISC)</strong>: A private national board known for its balanced, comprehensive syllabus and strong focus on English literature, science, and practical projects. It is generally considered more demanding than CBSE. Best if you want to develop strong communication skills or plan to send your child abroad for higher studies.
              </li>
              <li style={{ marginBottom: 0 }}>
                <strong>NIOS (National Institute of Open Schooling)</strong>: A highly flexible open board under the Ministry of Education. It allows students to study at their own pace and choose from a wide range of subjects. Best for young athletes, performing artists, or students who need a customized study schedule.
              </li>
            </ul>
          </div>

          {/* FAQ Accordion */}
          <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
              FAQs
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                {
                  q: "How many total schools are there in India?",
                  a: "According to government records, India has over **16.5 lakh schools**. This includes government, private, and government-aided schools, serving more than 26 crore students."
                },
                {
                  q: "What is the ratio of government versus private schools in India?",
                  a: "About 63% of the schools in India (around 10.5 lakh) are run by the government. The rest are run by private owners or local municipal bodies."
                },
                {
                  q: "How is school data updated on SchoolsPedia?",
                  a: "We get all our school information directly from the government's official UDISE+ database. We update our database whenever the government publishes new records."
                },
                {
                  q: "What is a UDISE code, and why is it important?",
                  a: "A UDISE code is a unique 11-digit number given to every school in India. You will need it for scholarship forms, board exam registrations, or RTE admissions."
                }
              ].map(({ q, a }) => (
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

        <AdSlot size="responsive" className="" style={{ marginTop: 24 }} />
      </div>
    </>
  );
}
