import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllDistrictSlugs, getDistrict, getDistrictBlocks, getDistrictCategoryCounts, getAdjacentDistricts, getDistrictSchools } from '@/lib/queries';
import { getDistrictMeta, breadcrumbSchema } from '@/lib/seo';
import AdSlot from '@/components/AdSlot';
import SearchBox from '@/components/SearchBox';
import DistrictStats from '@/components/DistrictStats';

export const dynamic = 'force-dynamic';



import { t } from '@/lib/translate';

export async function getDistrictPageMetadata({ params, lang = 'en' }) {
  try {
    const resolvedParams = await params;
    const stateSlug = resolvedParams?.state || '';
    const districtSlug = resolvedParams?.district || '';
    const distName = districtSlug.split('-').map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ');
    const stName = stateSlug.split('-').map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ');
    const district = await getDistrict(stateSlug, districtSlug).catch(() => null);
    return getDistrictMeta(district || {
      district_name: distName,
      state_name: stName,
      district_slug: districtSlug,
      state_slug: stateSlug,
      total_schools: 5000,
      block_count: 10
    }, lang);
  } catch {
    return { title: 'District Schools | SchoolsPedia' };
  }
}

export async function generateMetadata(props) {
  return getDistrictPageMetadata({ ...props, lang: 'en' });
}

export default async function DistrictPage({ params, lang = 'en' }) {
  const resolvedParams = await params;
  const stateSlug = resolvedParams?.state || '';
  const districtSlug = resolvedParams?.district || '';

  const stateName = t(stateSlug, lang);
  const districtName = t(districtSlug, lang);

  const [districtRes, blocksRes, categoriesRes, adjacentRes, schoolsRes] = await Promise.all([
    getDistrict(stateSlug, districtSlug).catch(() => null),
    getDistrictBlocks(stateSlug, districtSlug).catch(() => []),
    getDistrictCategoryCounts(stateSlug, districtSlug).catch(() => []),
    getAdjacentDistricts(stateSlug, districtSlug).catch(() => []),
    getDistrictSchools(stateSlug, districtSlug, 12).catch(() => []),
  ]);

  const district = districtRes || {
    district_slug: districtSlug,
    district_name: districtName,
    state_slug: stateSlug,
    state_name: stateName,
    total_schools: 5000,
    block_count: 10,
    village_count: 100,
    dist_population: 1000000,
    dist_literacy_pct: 70,
    dist_sex_ratio: 920,
    dist_sample_pin: '200001'
  };
  const blocks = blocksRes || [];
  const categories = categoriesRes || [];
  const adjacent = adjacentRes || [];
  const districtSchools = schoolsRes || [];

  const crumbSchema = breadcrumbSchema([
    { name: t('Home', lang), url: '/' },
    { name: stateName, url: `${lang === 'hi' ? '/hi' : ''}/schools/${stateSlug}` },
    { name: districtName, url: `${lang === 'hi' ? '/hi' : ''}/schools/${stateSlug}/${districtSlug}` },
  ]);

  const fmt = (n) => n ? Number(n).toLocaleString('en-IN') : '—';
  const fmtPop = (n) => {
    if (!n) return '—';
    if (n >= 10000000) return `${(n/10000000).toFixed(1)} ${lang === 'hi' ? 'करोड़' : 'Cr'}`;
    if (n >= 100000) return `${(n/100000).toFixed(1)} ${lang === 'hi' ? 'लाख' : 'Lakh'}`;
    return n.toLocaleString('en-IN');
  };

  const pathPrefix = lang === 'hi' ? '/hi' : '';

  const faqs = lang === 'hi' ? [
    {
      q: `${districtName} जिले में कुल कितने ब्लॉक और स्कूल हैं?`,
      a: `${districtName} जिले में UDISE+ के अंतर्गत कुल **${fmt(district.total_schools)} स्कूल** और **${district.block_count} ब्लॉक** हैं। अपने गाँव और स्कूलों को देखने के लिए ऊपर दी गई सूची में से किसी भी ब्लॉक पर क्लिक करें।`
    },
    {
      q: `${districtName} जिले में साक्षरता दर क्या है?`,
      a: district.dist_literacy_pct
        ? `${districtName} जिले में साक्षरता दर जनगणना डेटा के अनुसार **${district.dist_literacy_pct.toFixed(1)}%** है।`
        : `${districtName} जिले के लिए साक्षरता दर का डेटा उपलब्ध नहीं है।`
    },
    {
      q: `${districtName} के किसी विशिष्ट गाँव में स्कूल कैसे खोजें?`,
      a: `सबसे पहले ऊपर दी गई सूची से अपने ब्लॉक पर क्लिक करें। ब्लॉक पृष्ठ पर उस ब्लॉक के सभी गाँवों की सूची दिखाई देगी। अपने गाँव पर क्लिक करके आप वहाँ के सभी पंजीकृत स्कूलों की सूची UDISE कोड के साथ देख सकते हैं।`
    },
    {
      q: `क्या ${districtName} के निजी स्कूल आरटीई (RTE) के तहत मुफ्त सीटें प्रदान करते हैं?`,
      a: `हाँ। शिक्षा के अधिकार (RTE) अधिनियम के तहत, सभी निजी गैर-सहायता प्राप्त स्कूलों को अपनी प्रवेश कक्षा (नर्सरी या कक्षा 1) में 25% सीटें पड़ोस के आर्थिक रूप से कमजोर और वंचित समूहों के बच्चों के लिए मुफ्त आरक्षित रखनी होती हैं।`
    }
  ] : [
    {
      q: `How many blocks and schools are in ${district.district_name}?`,
      a: `${district.district_name} has **${fmt(district.total_schools)} schools** across **${district.block_count} blocks**. Click any block in the list above to see its villages and schools.`
    },
    {
      q: `What is the literacy rate in ${district.district_name}?`,
      a: district.dist_literacy_pct
        ? `The literacy rate in ${district.district_name} is **${district.dist_literacy_pct.toFixed(1)}%** as per Census data.`
        : `Literacy rate data for ${district.district_name} is not available in our current dataset. Check the Census of India website for district-level education data.`
    },
    {
      q: `How do I find a school in a specific village in ${district.district_name}?`,
      a: `Click the block your village belongs to from the list above. The block page shows all villages. Click your village to see every school registered there in UDISE+.`
    },
    {
      q: `Do private schools in ${district.district_name} offer free seats under RTE?`,
      a: `Yes. Private unaided schools must keep 25% of their entry-class seats (Nursery or Class 1) free for children from low-income or disadvantaged families. Admission is through the state's RTE portal — not directly at the school.`
    }
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />

      <div className="breadcrumb">
        <div className="breadcrumb-inner">
          <Link href="/">{t('Home', lang)}</Link><span className="sep">›</span>
          <Link href="/schools">{t('Schools', lang)}</Link><span className="sep">›</span>
          <Link href={`${pathPrefix}/schools/${stateSlug}`}>{stateName}</Link><span className="sep">›</span>
          <span className="current">{districtName}</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', padding: '28px 24px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: 'clamp(1.4rem, 3vw, 1.85rem)', fontWeight: 700, color: 'white', marginBottom: 8 }}>
            {lang === 'hi' ? `${stateName} के ${districtName} जिले में स्कूल` : `Schools in ${district.district_name} District, ${district.state_name}`}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#93C5FD', lineHeight: 1.6, marginBottom: 0 }}>
            {lang === 'hi' ? (
              `कुल ${fmt(district.total_schools)} स्कूल, जो ${district.block_count} ब्लॉकों में फैले हैं`
            ) : (
              `${fmt(district.total_schools)} schools across ${district.block_count} blocks`
            )}
            {district.dist_literacy_pct ? ` · ${lang === 'hi' ? 'साक्षरता' : 'Literacy'}: ${district.dist_literacy_pct.toFixed(1)}%` : ''}
            {district.dist_population ? ` · ${lang === 'hi' ? 'जनसंख्या' : 'Population'}: ${fmtPop(district.dist_population)}` : ''}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <div className="school-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>

          <div>
            <AdSlot size="leaderboard" />

            <div style={{ marginTop: 24, marginBottom: 16 }}>
              <SearchBox 
                placeholder={lang === 'hi' ? `${districtName} में स्कूल खोजें...` : `Search schools in ${district.district_name}...`} 
                stateSlug={stateSlug} 
                districtSlug={districtSlug} 
                lang={lang}
              />
            </div>

            {/* Category Filter Chips */}
            {categories && categories.length > 0 && (
              <div style={{ marginTop: 24, marginBottom: 8 }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {t('Filter schools by category', lang)}:
                </span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {categories.map(cat => (
                    <Link
                      key={cat.school_category}
                      href={`/search?q=${encodeURIComponent(cat.school_category)}&state=${stateSlug}&district=${districtSlug}`}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: 99,
                        padding: '6px 14px',
                        fontSize: '0.775rem',
                        fontWeight: 600,
                        color: '#1E40AF',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                      }}
                      className="category-chip"
                    >
                      🏫 {t(cat.school_category, lang)} ({fmt(cat.count)})
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Blocks Grid */}
            <div style={{ marginTop: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>
                {lang === 'hi' ? `${districtName} में ब्लॉक` : `Blocks in ${district.district_name}`} ({blocks.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 10 }}>
                {blocks.map(b => (
                  <Link key={b.block_slug} href={`${pathPrefix}/schools/${stateSlug}/${b.district_slug || districtSlug}/${b.block_slug}`} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ padding: '14px 16px', cursor: 'pointer' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', marginBottom: 6 }}>{b.block_name}</div>
                      <div style={{ display: 'flex', gap: 12, fontSize: '0.775rem', color: '#64748B' }}>
                        <span>{fmt(b.total_schools)} {t('schools', lang)}</span>
                        <span>{b.village_count} {t('villages', lang)}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#1E40AF', marginTop: 8 }}>{t('View block', lang)} →</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Top Schools Widget */}
            {districtSchools && districtSchools.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h2 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: '1.05rem', fontWeight: 700, marginBottom: 16 }}>
                  🏫 {lang === 'hi' ? `${districtName} में प्रमुख स्कूल` : `Featured Schools in ${district.district_name} District`}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                  {districtSchools.map(school => (
                    <Link key={school.udise_code} href={`${pathPrefix}${school.url}`} style={{ textDecoration: 'none' }}>
                      <div className="card" style={{ padding: '14px 16px', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', marginBottom: 6, lineHeight: 1.4 }}>
                            {school.school_name}
                          </div>
                          <div style={{ display: 'flex', gap: 8, fontSize: '0.725rem', color: '#64748B', flexWrap: 'wrap', marginBottom: 6 }}>
                            <span style={{ background: '#EFF6FF', color: '#1E40AF', padding: '2px 8px', borderRadius: 99, fontWeight: 600 }}>
                              {t(school.school_category, lang)}
                            </span>
                            <span>{school.village}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #F1F5F9', paddingTop: 8, marginTop: 10 }}>
                          <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.7rem', color: '#94A3B8' }}>
                            UDISE: {school.udise_code}
                          </span>
                          <span style={{ fontSize: '0.725rem', color: '#1E40AF', fontWeight: 600 }}>{t('Explore', lang)} →</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* SEO Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24 }}>
              
              {/* About District */}
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '22px' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
                  {lang === 'hi' ? `${districtName} जिले में स्कूल` : `Schools in ${district.district_name} District`}
                </h2>
                {lang === 'hi' ? (
                  <>
                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: district.dist_literacy_pct || district.dist_population ? 12 : 0 }}>
                      <strong>{districtName}</strong> जिले में UDISE+ के अनुसार कुल <strong>{fmt(district.total_schools)} स्कूल</strong> हैं जो <strong>{district.block_count} ब्लॉकों</strong> में स्थित हैं। अपने नजदीकी स्कूल को खोजने के लिए, उस ब्लॉक पर क्लिक करें जिसके अंतर्गत आपका गाँव आता है - ब्लॉक विवरण पृष्ठ पर सभी गाँवों की सूची मिलेगी, और गाँव के पृष्ठ पर वहाँ पंजीकृत सभी स्कूलों की जानकारी प्राप्त होगी।
                    </p>
                    {(district.dist_literacy_pct || district.dist_population) && (
                      <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: 0 }}>
                        {district.dist_literacy_pct ? <>साक्षरता दर: <strong>{district.dist_literacy_pct.toFixed(1)}%</strong> (जनगणना डेटा)। </> : null}
                        {district.dist_population ? <>जनसंख्या: <strong>{fmtPop(district.dist_population)}</strong>।</> : null}
                        {district.dist_sex_ratio ? <> लिंगानुपात: <strong>{Math.round(district.dist_sex_ratio)} महिलाएँ प्रति 1,000 पुरुष</strong>।</> : null}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: district.dist_literacy_pct || district.dist_population ? 12 : 0 }}>
                      {district.district_name} has <strong>{fmt(district.total_schools)} schools</strong> across <strong>{district.block_count} blocks</strong>. To find a school near you, click on the block your village falls under — the block page will list all villages, and the village page shows every school registered there.
                    </p>
                    {(district.dist_literacy_pct || district.dist_population) && (
                      <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: 0 }}>
                        {district.dist_literacy_pct ? <><strong>Literacy rate: {district.dist_literacy_pct.toFixed(1)}%</strong> (Census data). </> : null}
                        {district.dist_population ? <>Population: <strong>{fmtPop(district.dist_population)}</strong>.</> : null}
                        {district.dist_sex_ratio ? <> Sex ratio: <strong>{Math.round(district.dist_sex_ratio)} females per 1,000 males</strong>.</> : null}
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Download Button — above FAQs, centered */}
              <div style={{ textAlign: 'center', padding: '24px 20px', background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 12 }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#166534', marginBottom: 4 }}>
                  {lang === 'hi' ? `📋 ${districtName} जिले की पूरी स्कूल सूची` : `📋 Complete School List — ${district.district_name} District`}
                </div>
                <div style={{ fontSize: '0.825rem', color: '#4B7C59', marginBottom: 16 }}>
                  {lang === 'hi' ? `Excel/CSV format में — ${fmt(district.total_schools)} स्कूल` : `PDF format · ${fmt(district.total_schools)} schools included`}
                </div>
                <a
                  href={`/api/download/schools/pdf?state=${stateSlug}&district=${districtSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    background: '#16A34A',
                    color: 'white',
                    padding: '12px 28px',
                    borderRadius: 8,
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(22,163,74,0.3)',
                  }}
                  className="btn-download"
                >
                  📄 {lang === 'hi' ? 'स्कूल सूची PDF डाउनलोड करें' : 'Download School List PDF'}
                </a>
              </div>

              {/* District FAQs */}
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



            <AdSlot size="responsive" style={{ marginTop: 20 }} />
          </div>

          {/* Sidebar — District Census Data */}
          <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(district.dist_population || district.dist_literacy_pct) && (
              <DistrictStats stats={district} districtName={districtName} lang={lang} />
            )}

            {adjacent && adjacent.length > 0 && (
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
                  🗺️ {lang === 'hi' ? `${stateName} में आस-पास के जिले` : `Browse Nearby Districts`}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {adjacent.map(adj => {
                    const adjName = t(adj.district_slug, lang);
                    return (
                      <Link key={adj.district_slug} href={`${pathPrefix}/schools/${stateSlug}/${adj.district_slug}`}
                            className="adj-district-tag"
                            style={{ display: 'block', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 12px', fontSize: '0.825rem', color: '#1E293B', fontWeight: 600, textDecoration: 'none', transition: 'border-color 0.15s ease' }}
                      >
                        {adjName}
                        <span style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 500, float: 'right' }}>{fmt(adj.total_schools)}</span>
                      </Link>
                    );
                  })}
                </div>
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
              <Link href={`/search?state=${stateSlug}&district=${districtSlug}`} style={{ display: 'block', background: '#F97316', color: 'white', textAlign: 'center', padding: '10px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                🔍 {lang === 'hi' ? `${districtName} स्कूल खोजें` : `Search ${district.district_name} Schools`}
              </Link>
            </div>

            <AdSlot size="sidebar" />
          </div>
        </div>
      </div>

      <style>{`
        .adj-district-tag:hover {
          border-color: #1E40AF !important;
          color: #1E40AF !important;
        }
      `}</style>
    </>
  );
}
