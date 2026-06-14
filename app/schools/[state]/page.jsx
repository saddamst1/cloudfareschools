import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllStates, getState, getStateDistricts, getStateCategoryCounts, getStateMgmtCounts } from '@/lib/queries';
import { getStateMeta, breadcrumbSchema } from '@/lib/seo';
import AdSlot from '@/components/AdSlot';

export const revalidate = 86400;

const STATE_BOARDS = {
  'uttar-pradesh': { name: 'UP Board of High School and Intermediate Education (UPMSP)', url: 'https://upmsp.edu.in' },
  'bihar': { name: 'Bihar School Examination Board (BSEB)', url: 'http://biharboardonline.bihar.gov.in' },
  'maharashtra': { name: 'Maharashtra State Board of Secondary and Higher Secondary Education (MSBSHSE)', url: 'https://www.mahahsscboard.in' },
  'madhya-pradesh': { name: 'Madhya Pradesh Board of Secondary Education (MPBSE)', url: 'https://mpbse.nic.in' },
  'rajasthan': { name: 'Board of Secondary Education, Rajasthan (BSER)', url: 'http://rajeduboard.rajasthan.gov.in' },
  'west-bengal': { name: 'West Bengal Board of Secondary Education (WBBSE)', url: 'https://wbbse.wb.gov.in' },
  'karnataka': { name: 'Karnataka School Examination and Assessment Board (KSEAB)', url: 'https://kseab.karnataka.gov.in' },
  'gujarat': { name: 'Gujarat Secondary and Higher Secondary Education Board (GSEB)', url: 'https://www.gseb.org' },
  'tamil-nadu': { name: 'Tamil Nadu Directorate of Government Examinations (TNDGE)', url: 'https://dge.tn.gov.in' },
  'delhi': { name: 'Central Board of Secondary Education (CBSE)', url: 'https://www.cbse.gov.in' },
  'haryana': { name: 'Board of School Education Haryana (BSEH)', url: 'https://bseh.org.in' },
  'punjab': { name: 'Punjab School Education Board (PSEB)', url: 'https://www.pseb.ac.in' },
  'andhra-pradesh': { name: 'Board of Secondary Education, Andhra Pradesh (BSEAP)', url: 'https://bse.ap.gov.in' },
  'telangana': { name: 'Telangana Board of Secondary Education (BSE Telangana)', url: 'https://bse.telangana.gov.in' },
  'kerala': { name: 'Kerala Board of Public Examinations (KBPE)', url: 'https://pareekshabhavan.kerala.gov.in' },
  'odisha': { name: 'Board of Secondary Education, Odisha (BSE Odisha)', url: 'http://www.bseodisha.ac.in' },
  'jharkhand': { name: 'Jharkhand Academic Council (JAC)', url: 'https://jac.jharkhand.gov.in' },
  'chhattisgarh': { name: 'Chhattisgarh Board of Secondary Education (CGBSE)', url: 'https://cgbse.nic.in' },
  'assam': { name: 'Board of Secondary Education, Assam (SEBA)', url: 'https://sebaonline.org' },
  'uttarakhand': { name: 'Uttarakhand Board of School Education (UBSE)', url: 'https://ubse.uk.gov.in' },
  'himachal-pradesh': { name: 'Himachal Pradesh Board of School Education (HPBOSE)', url: 'https://hpbose.org' },
  'jammu-and-kashmir': { name: 'Jammu and Kashmir State Board of School Education (JKBOSE)', url: 'https://jkbose.nic.in' }
};

export async function generateStaticParams() {
  const states = await getAllStates();
  return states.map(s => ({ state: s.state_slug }));
}

export async function generateMetadata({ params }) {
  const { state: stateSlug } = await params;
  const state = await getState(stateSlug);
  if (!state) return { title: 'State Not Found | SchoolsPedia' };
  return getStateMeta(state);
}

export default async function StatePage({ params }) {
  const { state: stateSlug } = await params;
  const [state, districts, categories, mgmtCounts] = await Promise.all([
    getState(stateSlug),
    getStateDistricts(stateSlug),
    getStateCategoryCounts(stateSlug),
    getStateMgmtCounts(stateSlug),
  ]);

  if (!state) notFound();

  const board = STATE_BOARDS[stateSlug] || null;

  const crumbSchema = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: state.state_name, url: `/schools/${stateSlug}` },
  ]);

  const fmt = (n) => n ? Number(n).toLocaleString('en-IN') : '0';

  const catColors = {
    'Primary':          { bg: '#EFF6FF', color: '#1E40AF' },
    'Upper Primary':    { bg: '#F0FDFA', color: '#0D9488' },
    'Secondary':        { bg: '#FFF7ED', color: '#F97316' },
    'Higher Secondary': { bg: '#F5F3FF', color: '#7C3AED' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="breadcrumb-inner">
          <Link href="/">Home</Link>
          <span className="sep">›</span>
          <Link href="/schools">Schools</Link>
          <span className="sep">›</span>
          <span className="current">{state.state_name}</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', padding: '28px 24px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'white', marginBottom: 8 }}>
            Schools in {state.state_name}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#93C5FD', lineHeight: 1.6, marginBottom: 18 }}>
            {fmt(state.total_schools)}+ schools across {state.district_count} districts,
            {' '}{state.block_count} blocks, and {fmt(state.village_count)}+ villages
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[['📚', fmt(state.total_schools), 'Total Schools'], ['🏛️', state.district_count, 'Districts'], ['🗺️', state.block_count, 'Blocks']].map(([icon, n, label]) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '10px 16px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>{icon} {n}</div>
                <div style={{ fontSize: '0.75rem', color: '#BAE6FD' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <div className="state-layout-grid">

          {/* Main col */}
          <div>
            <AdSlot size="leaderboard" />

            {/* Districts Grid */}
            <div style={{ marginTop: 24 }}>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.05rem', fontWeight: 700, marginBottom: 16 }}>
                Districts in {state.state_name} ({districts.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 10 }}>
                {districts.map(d => (
                  <Link key={d.district_slug} href={`/schools/${stateSlug}/${d.district_slug}`} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ padding: '14px 16px', cursor: 'pointer' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>{d.district_name}</div>
                      <div style={{ display: 'flex', gap: 12, fontSize: '0.775rem', color: '#64748B', marginBottom: 8 }}>
                        <span>{fmt(d.total_schools)} schools</span>
                        <span>{d.block_count} blocks</span>
                      </div>
                      {d.dist_literacy_pct && (
                        <div style={{ fontSize: '0.75rem', color: '#0D9488', fontWeight: 600 }}>
                          Literacy: {d.dist_literacy_pct.toFixed(1)}%
                        </div>
                      )}
                      <div style={{ fontSize: '0.75rem', color: '#1E40AF', marginTop: 6 }}>Explore →</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* School categories */}
            {categories.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.05rem', fontWeight: 700, marginBottom: 16 }}>School categories in {state.state_name}</h2>
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
                  {categories.map((cat, i) => {
                    const c = catColors[cat.school_category] || { bg: '#F1F5F9', color: '#475569' };
                    const total = categories.reduce((s, c) => s + (c.count || 0), 0);
                    const pct = total ? ((cat.count / total) * 100).toFixed(1) : 0;
                    return (
                      <div key={cat.school_category} style={{ padding: '12px 18px', borderBottom: i < categories.length - 1 ? '1px solid #F1F5F9' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ background: c.bg, color: c.color, fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 99, minWidth: 120 }}>{cat.school_category}</div>
                        <div style={{ flex: 1, height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: c.color, borderRadius: 3 }} />
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E293B', minWidth: 80, textAlign: 'right' }}>{fmt(cat.count)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* State Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24 }}>
              
              {/* About State Schools */}
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '22px' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
                  Schools in {state.state_name}
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: 12 }}>
                  {state.state_name} has <strong>{fmt(state.total_schools)} registered schools</strong> across <strong>{state.district_count} districts</strong> and <strong>{state.block_count} blocks</strong>. Most are government-run schools in rural areas, following the curriculum set by the {board ? <><strong><a href={board.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1E40AF' }}>{board.name}</a></strong></> : <strong>{state.state_name} State Board</strong>}. Private schools, mostly in cities, run CBSE or ICSE.
                </p>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75 }}>
                  Private schools must reserve 25% of their Class 1 seats for children from low-income families under the RTE Act. The state runs this through an online lottery — applications open around March-April each year. Use the district links below to find schools near your area.
                </p>
              </div>

              {/* State FAQs */}
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '22px' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
                  FAQs
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {[
                    {
                      q: `How many schools are in ${state.state_name}?`,
                      a: `${state.state_name} has **${fmt(state.total_schools)} schools** listed in UDISE+. This includes government, private-aided, and private-unaided schools across all ${state.district_count} districts.`
                    },
                    {
                      q: `How do I apply for RTE free admission in ${state.state_name}?`,
                      a: `${state.state_name} runs RTE admissions online. Applications usually open in March or April. You'll need your child's birth certificate, Aadhaar card, and an income certificate showing the family earns below the state's EWS limit. The school allotment is done through a computer lottery — not by queue or personal connections.`
                    },
                    {
                      q: `Which school board is most common in ${state.state_name}?`,
                      a: board
                        ? `Government schools in ${state.state_name} follow the **${board.name}**. Private schools in cities usually run CBSE. ICSE schools exist but are fewer in number.`
                        : `Government schools in ${state.state_name} follow the state board. Private schools in cities usually run CBSE or ICSE.`
                    },
                    {
                      q: `How do I check if a school in ${state.state_name} is genuine?`,
                      a: `Every registered school has an 11-digit UDISE code shown on its SchoolsPedia page. Go to **udiseplus.gov.in** and search by that code to verify the school's registration directly with the Ministry of Education.`
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

            <AdSlot size="responsive" className="" style={{ marginTop: 20 }} />
          </div>

          {/* Sidebar */}
          <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mgmtCounts.length > 0 && (
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Management type</div>
                {mgmtCounts.slice(0, 5).map(m => (
                  <div key={m.national_mgmt} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #F1F5F9', fontSize: '0.8rem' }}>
                    <span style={{ color: '#64748B', fontSize: '0.775rem' }}>{m.national_mgmt}</span>
                    <span style={{ fontWeight: 700, color: '#1E293B' }}>{fmt(m.count)}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', borderRadius: 10, padding: 16, color: 'white' }}>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '0.95rem', fontWeight: 700, marginBottom: 8 }}>Can&apos;t find your school?</div>
              <div style={{ fontSize: '0.8rem', color: '#BAE6FD', lineHeight: 1.5, marginBottom: 14 }}>Search from 16.5 lakh+ schools across all 36 states and UTs of India</div>
              <Link href={`/search?state=${stateSlug}`} style={{ display: 'block', background: '#F97316', color: 'white', textAlign: 'center', padding: '10px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                🔍 Search {state.state_name} Schools
              </Link>
            </div>

            {board && (
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
                  🏛️ Educational Board
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', marginBottom: 6 }}>
                  {board.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.5, marginBottom: 12 }}>
                  Official authority regulating examinations and syllabus in {state.state_name}.
                </div>
                <a 
                  href={board.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ display: 'inline-block', fontSize: '0.8rem', color: '#1E40AF', fontWeight: 600, textDecoration: 'none' }}
                >
                  Visit Board Website →
                </a>
              </div>
            )}

            <AdSlot size="sidebar" />
          </div>
        </div>
      </div>

      <style>{`
        .state-layout-grid {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .state-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
