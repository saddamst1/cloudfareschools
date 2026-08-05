import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllStates, getState, getStateDistricts, getStateCategoryCounts, getStateMgmtCounts } from '@/lib/queries';
import { getStateMeta, breadcrumbSchema } from '@/lib/seo';
import AdSlot from '@/components/AdSlot';

// ISR: cache for 24h after first render — prevents CPU limit on large states
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



import { t } from '@/lib/translate';

export async function getStatePageMetadata({ params, lang = 'en' }) {
  try {
    const resolvedParams = await params;
    const stateSlug = resolvedParams?.state || '';
    const stName = stateSlug.split('-').map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ');
    const state = await getState(stateSlug).catch(() => null);
    return getStateMeta(state || {
      state_name: stName,
      state_slug: stateSlug,
      total_schools: 50000,
      district_count: 20,
      block_count: 200
    }, lang);
  } catch {
    return { title: 'State Schools | SchoolsPedia' };
  }
}

export async function generateMetadata(props) {
  return getStatePageMetadata({ ...props, lang: 'en' });
}

export default async function StatePage({ params, searchParams, lang = 'en' }) {
  const resolvedParams = await params;
  const stateSlug = resolvedParams?.state || '';
  const stateName = t(stateSlug, lang);

  const [stateRes, districtsRes, categoriesRes] = await Promise.all([
    getState(stateSlug).catch(() => null),
    getStateDistricts(stateSlug).catch(() => []),
    getStateCategoryCounts(stateSlug).catch(() => []),
  ]);


  const state = stateRes || {
    state_slug: stateSlug,
    state_name: stateName,
    total_schools: 50000,
    district_count: 20,
    block_count: 200,
    village_count: 10000
  };
  const districts = districtsRes || [];
  const categories = categoriesRes || [];
  const mgmtCounts = mgmtCountsRes || [];

  const board = STATE_BOARDS[stateSlug] || null;

  const crumbSchema = breadcrumbSchema([
    { name: t('Home', lang), url: '/' },
    { name: stateName, url: `${lang === 'hi' ? '/hi' : ''}/schools/${stateSlug}` },
  ]);

  const fmt = (n) => n ? Number(n).toLocaleString('en-IN') : '0';

  const catColors = {
    'Primary':          { bg: '#EFF6FF', color: '#1E40AF' },
    'Upper Primary':    { bg: '#F0FDFA', color: '#0D9488' },
    'Secondary':        { bg: '#FFF7ED', color: '#F97316' },
    'Higher Secondary': { bg: '#F5F3FF', color: '#7C3AED' },
  };

  const pathPrefix = lang === 'hi' ? '/hi' : '';

  const faqs = lang === 'hi' ? [
    {
      q: `${stateName} में कुल कितने स्कूल हैं?`,
      a: `${stateName} में UDISE+ के अनुसार **${fmt(state.total_schools)} स्कूल** पंजीकृत हैं। इसमें सभी ${state.district_count} जिलों के सरकारी, निजी सहायता प्राप्त और निजी गैर-सहायता प्राप्त स्कूल शामिल हैं।`
    },
    {
      q: `मैं ${stateName} में आरटीई (RTE) मुफ्त प्रवेश के लिए कैसे आवेदन करूँ?`,
      a: `${stateName} में आरटीई प्रवेश की प्रक्रिया ऑनलाइन आयोजित की जाती है। आवेदन सामान्यतः मार्च या अप्रैल में शुरू होते हैं। आपको बच्चे का जन्म प्रमाण पत्र, आधार कार्ड (बच्चे और माता-पिता का), निवास प्रमाण पत्र और आय प्रमाण पत्र की आवश्यकता होगी। स्कूलों का आवंटन कंप्यूटर लॉटरी के माध्यम से किया जाता है।`
    },
    {
      q: `${stateName} में कौन सा स्कूल बोर्ड सबसे आम है?`,
      a: board
        ? `सरकारी स्कूल **${board.name}** का पालन करते हैं। शहरों में निजी स्कूल आमतौर पर सीबीएसई (CBSE) बोर्ड का पालन करते हैं।`
        : `सरकारी स्कूल राज्य बोर्ड का पालन करते हैं। शहरों में निजी स्कूल आमतौर पर सीबीएसई (CBSE) या आईसीएसई (ICSE) बोर्ड का पालन करते हैं।`
    },
    {
      q: `मैं कैसे जांचूं कि ${stateName} का कोई स्कूल मान्यता प्राप्त है या नहीं?`,
      a: `प्रत्येक पंजीकृत स्कूल का 11-अंकों का UDISE कोड होता है जो स्कूल के विवरण पृष्ठ पर दिखाया गया है। आप शिक्षा मंत्रालय के आधिकारिक पोर्टल **udiseplus.gov.in** पर जाकर इस कोड के माध्यम से स्कूल की जानकारी सत्यापित कर सकते हैं।`
    }
  ] : [
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
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="breadcrumb-inner">
          <Link href="/">{t('Home', lang)}</Link>
          <span className="sep">›</span>
          <Link href="/schools">{t('Schools', lang)}</Link>
          <span className="sep">›</span>
          <span className="current">{stateName}</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', padding: '28px 24px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'white', marginBottom: 8 }}>
            {lang === 'hi' ? `${stateName} में स्कूल` : `Schools in ${state.state_name}`}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#93C5FD', lineHeight: 1.6, marginBottom: 18 }}>
            {lang === 'hi' ? (
              `${stateName} में ${fmt(state.total_schools)}+ स्कूल, जो ${state.district_count} जिलों, ${state.block_count} ब्लॉकों और ${fmt(state.village_count)}+ गाँवों में फैले हैं`
            ) : (
              `${fmt(state.total_schools)}+ schools across ${state.district_count} districts, ${state.block_count} blocks, and ${fmt(state.village_count)}+ villages`
            )}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[[ '📚', fmt(state.total_schools), t('Total Schools', lang) ], [ '🏛️', state.district_count, t('Districts', lang) ], [ '🗺️', state.block_count, t('Blocks', lang) ]].map(([icon, n, label]) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '10px 16px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>{icon} {n}</div>
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
              <h2 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: '1.05rem', fontWeight: 700, marginBottom: 16 }}>
                {lang === 'hi' ? `${stateName} में जिले` : `Districts in ${state.state_name}`} ({districts.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 10 }}>
                {districts.map(d => {
                  const dName = t(d.district_slug, lang);
                  return (
                    <Link key={d.district_slug} href={`${pathPrefix}/schools/${stateSlug}/${d.district_slug}`} style={{ textDecoration: 'none' }}>
                      <div className="card" style={{ padding: '14px 16px', cursor: 'pointer' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>{dName}</div>
                        <div style={{ display: 'flex', gap: 12, fontSize: '0.775rem', color: '#64748B', marginBottom: 8 }}>
                          <span>{fmt(d.total_schools)} {t('schools', lang)}</span>
                          <span>{d.block_count} {t('Blocks', lang)}</span>
                        </div>
                        {d.dist_literacy_pct && (
                          <div style={{ fontSize: '0.75rem', color: '#0D9488', fontWeight: 600 }}>
                            {lang === 'hi' ? 'साक्षरता' : 'Literacy'}: {d.dist_literacy_pct.toFixed(1)}%
                          </div>
                        )}
                        <div style={{ fontSize: '0.75rem', color: '#1E40AF', marginTop: 6 }}>{t('Explore', lang)} →</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* School categories */}
            {categories.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: '1.05rem', fontWeight: 700, marginBottom: 16 }}>
                  {lang === 'hi' ? `${stateName} में स्कूल की श्रेणियाँ` : `School categories in ${state.state_name}`}
                </h2>
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
                  {categories.map((cat, i) => {
                    const c = catColors[cat.school_category] || { bg: '#F1F5F9', color: '#475569' };
                    const total = categories.reduce((s, c) => s + (c.count || 0), 0);
                    const pct = total ? ((cat.count / total) * 100).toFixed(1) : 0;
                    return (
                      <div key={cat.school_category} style={{ padding: '12px 18px', borderBottom: i < categories.length - 1 ? '1px solid #F1F5F9' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ background: c.bg, color: c.color, fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 99, minWidth: 120 }}>{t(cat.school_category, lang)}</div>
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
                  {lang === 'hi' ? `${stateName} में स्कूल` : `Schools in ${state.state_name}`}
                </h2>
                {lang === 'hi' ? (
                  <>
                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: 12 }}>
                      <strong>{stateName}</strong> में <strong>{fmt(state.total_schools)} पंजीकृत स्कूल</strong> हैं जो <strong>{state.district_count} जिलों</strong> और <strong>{state.block_count} ब्लॉकों</strong> में फैले हैं। इनमें से अधिकांश ग्रामीण क्षेत्रों में सरकारी स्कूल हैं, जो {board ? <><strong><a href={board.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1E40AF' }}>{board.name}</a></strong></> : <strong>{stateName} राज्य बोर्ड</strong>} द्वारा निर्धारित पाठ्यक्रम का पालन करते हैं। शहरों में निजी स्कूल मुख्य रूप से सीबीएसई (CBSE) या आईसीएसई (ICSE) बोर्ड से संबद्ध हैं।
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75 }}>
                      शिक्षा के अधिकार (RTE) अधिनियम के तहत निजी स्कूलों में आर्थिक रूप से कमजोर परिवारों के बच्चों के लिए कक्षा 1 में 25% सीटें आरक्षित होनी चाहिए। राज्य सरकार इसे ऑनलाइन लॉटरी के माध्यम से संचालित करती है - आवेदन सामान्यतः प्रत्येक वर्ष मार्च-अप्रैल के आसपास खुलते हैं। अपने क्षेत्र के पास के स्कूल खोजने के लिए नीचे दिए गए जिला लिंक का उपयोग करें।
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: 12 }}>
                      {state.state_name} has <strong>{fmt(state.total_schools)} registered schools</strong> across <strong>{state.district_count} districts</strong> and <strong>{state.block_count} blocks</strong>. Most are government-run schools in rural areas, following the curriculum set by the {board ? <><strong><a href={board.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1E40AF' }}>{board.name}</a></strong></> : <strong>{state.state_name} State Board</strong>}. Private schools, mostly in cities, run CBSE or ICSE.
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75 }}>
                      Private schools must reserve 25% of their Class 1 seats for children from low-income families under the RTE Act. The state runs this through an online lottery — applications open around March-April each year. Use the district links below to find schools near your area.
                    </p>
                  </>
                )}
              </div>

              {/* State FAQs */}
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '22px' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
                  {t('FAQs', lang)}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {faqs.map(({ q, a }) => (
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
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
                  {t('Management type', lang)}
                </div>
                {mgmtCounts.slice(0, 5).map(m => (
                  <div key={m.national_mgmt} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #F1F5F9', fontSize: '0.8rem' }}>
                    <span style={{ color: '#64748B', fontSize: '0.775rem' }}>{t(m.national_mgmt, lang)}</span>
                    <span style={{ fontWeight: 700, color: '#1E293B' }}>{fmt(m.count)}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', borderRadius: 10, padding: 16, color: 'white' }}>
              <div style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: '0.95rem', fontWeight: 700, marginBottom: 8 }}>
                {lang === 'hi' ? 'अपना स्कूल नहीं मिल रहा?' : "Can't find your school?"}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#BAE6FD', lineHeight: 1.5, marginBottom: 14 }}>
                {lang === 'hi' ? (
                  'भारत के सभी 36 राज्यों और केंद्र शासित प्रदेशों के 16.5 लाख+ स्कूलों में खोजें'
                ) : (
                  "Search from 16.5 lakh+ schools across all 36 states and UTs of India"
                )}
              </div>
              <Link href={`/search?state=${stateSlug}`} style={{ display: 'block', background: '#F97316', color: 'white', textAlign: 'center', padding: '10px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                🔍 {lang === 'hi' ? `${stateName} स्कूल खोजें` : `Search ${state.state_name} Schools`}
              </Link>
            </div>

            {board && (
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
                  🏛️ {lang === 'hi' ? 'शिक्षा बोर्ड' : 'Educational Board'}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', marginBottom: 6 }}>
                  {board.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.5, marginBottom: 12 }}>
                  {lang === 'hi' ? (
                    `${stateName} में परीक्षाओं और पाठ्यक्रम को विनियमित करने वाला आधिकारिक प्राधिकरण।`
                  ) : (
                    `Official authority regulating examinations and syllabus in ${state.state_name}.`
                  )}
                </div>
                <a 
                  href={board.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ display: 'inline-block', fontSize: '0.8rem', color: '#1E40AF', fontWeight: 600, textDecoration: 'none' }}
                >
                  {lang === 'hi' ? 'बोर्ड की वेबसाइट पर जाएं' : 'Visit Board Website'} →
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
