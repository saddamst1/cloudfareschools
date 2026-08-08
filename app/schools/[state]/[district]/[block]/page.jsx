import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlock, getBlockVillages, getBlockSchools } from '@/lib/queries';
import { getBlockMeta, breadcrumbSchema } from '@/lib/seo';
import SchoolCard from '@/components/SchoolCard';
import AdSlot from '@/components/AdSlot';

// ISR: cache for 30 days after first render for instant Cloudflare edge responses
export const revalidate = 2592000;


import { t } from '@/lib/translate';

export async function getBlockPageMetadata({ params, lang = 'en' }) {
  try {
    const resolvedParams = await params;
    const stateSlug = resolvedParams?.state;
    const districtSlug = resolvedParams?.district;
    const blockSlug = resolvedParams?.block;
    if (!stateSlug || !districtSlug || !blockSlug) return { title: 'Block Not Found | SchoolsPedia' };
    const block = await Promise.race([
      getBlock(stateSlug, districtSlug, blockSlug),
      new Promise(r => setTimeout(() => r(null), 5000))
    ]);
    if (!block) return { title: 'Block Not Found | SchoolsPedia' };
    return getBlockMeta(block, lang);
  } catch {
    return { title: 'Block Schools | SchoolsPedia' };
  }
}

export async function generateMetadata(props) {
  return getBlockPageMetadata({ ...props, lang: 'en' });
}

export default async function BlockPage({ params, searchParams, lang = 'en' }) {
  const resolvedParams = await params;
  const stateSlug = resolvedParams?.state;
  const districtSlug = resolvedParams?.district;
  const blockSlug = resolvedParams?.block;
  if (!stateSlug || !districtSlug || !blockSlug) notFound();

  const sp = await searchParams;
  const page = Number(sp?.page) || 1;
  const category = sp?.category || null;

  const [blockRaw, villages, schoolsData] = await Promise.all([
    getBlock(stateSlug, districtSlug, blockSlug).catch(() => null),
    getBlockVillages(stateSlug, districtSlug, blockSlug).catch(() => []),
    getBlockSchools(stateSlug, districtSlug, blockSlug, { page, category }).catch(() => ({ schools: [], total: 0 })),
  ]);

  const slugToTitle = (s) => (s || '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Bulletproof fallback: Never return 404 on cold start or timeout when URL params are valid
  const block = blockRaw || {
    block_slug: blockSlug,
    block_name: slugToTitle(blockSlug),
    district_slug: districtSlug,
    district_name: slugToTitle(districtSlug),
    state_slug: stateSlug,
    state_name: slugToTitle(stateSlug),
    total_schools: schoolsData?.total || 0,
    village_count: villages?.length || 0,
  };


  const stateName = t(block.state_slug, lang);
  const districtName = t(block.district_slug, lang);
  const blockName = block.block_name;

  const pathPrefix = lang === 'hi' ? '/hi' : '';

  const crumbSchema = breadcrumbSchema([
    { name: t('Home', lang), url: '/' },
    { name: stateName, url: `${pathPrefix}/schools/${stateSlug}` },
    { name: districtName, url: `${pathPrefix}/schools/${stateSlug}/${districtSlug}` },
    { name: blockName, url: `${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}` },
  ]);

  const fmt = (n) => n ? Number(n).toLocaleString('en-IN') : '0';
  const categories = ['Primary', 'Upper Primary', 'Secondary', 'Higher Secondary'];

  const faqs = lang === 'hi' ? [
    {
      q: `${blockName} ब्लॉक में कुल कितने गाँव और स्कूल हैं?`,
      a: `${blockName} ब्लॉक के अंतर्गत UDISE+ में **${block.village_count} गाँव** और **${fmt(block.total_schools)} स्कूल** पंजीकृत हैं।`
    },
    {
      q: `${blockName} ब्लॉक में स्कूलों से संबंधित शिकायत कहाँ करें?`,
      a: `${blockName} ब्लॉक के **ब्लॉक शिक्षा अधिकारी (BEO)** शिक्षकों की उपस्थिति, स्कूल निरीक्षण और शिकायतों का निवारण करते हैं। आप ब्लॉक मुख्यालय पर स्थित BEO कार्यालय में संपर्क कर सकते हैं।`
    },
    {
      q: `${blockName} ब्लॉक में स्कूलों को श्रेणी के आधार पर कैसे फ़िल्टर करें?`,
      a: `आप स्कूल सूची के शीर्ष पर दिए गए फ़िल्टर बटनों (सभी, प्राथमिक, उच्च प्राथमिक, माध्यमिक, उच्चतर माध्यमिक) का उपयोग कर सकते हैं। केवल उस प्रकार के स्कूलों को देखने के लिए किसी भी बटन पर क्लिक करें।`
    }
  ] : [
    {
      q: `How many villages and schools are in ${block.block_name} block?`,
      a: `${block.block_name} block covers **${block.village_count} villages** and has **${fmt(block.total_schools)} registered schools** in UDISE+.`
    },
    {
      q: `Who handles school complaints in ${block.block_name} block?`,
      a: `The **Block Education Officer (BEO)** of ${block.block_name} handles teacher attendance, school inspections, and parent complaints. Visit the BEO office at the block headquarters.`
    },
    {
      q: `How do I filter schools by category in ${block.block_name}?`,
      a: `Use the category buttons at the top of the school list — All, Primary, Upper Primary, Secondary, Higher Secondary. Click one to see only schools of that type.`
    }
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />

      <div className="breadcrumb">
        <div className="breadcrumb-inner">
          <Link href="/">{t('Home', lang)}</Link><span className="sep">›</span>
          <Link href={`${pathPrefix}/schools/${stateSlug}`}>{stateName}</Link><span className="sep">›</span>
          <Link href={`${pathPrefix}/schools/${stateSlug}/${districtSlug}`}>{districtName}</Link><span className="sep">›</span>
          <span className="current">{blockName}</span>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', padding: '28px 24px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: 'clamp(1.3rem, 3vw, 1.75rem)', fontWeight: 700, color: 'white', marginBottom: 8 }}>
            {lang === 'hi' ? `${districtName} के ${blockName} ब्लॉक में स्कूल` : `Schools in ${block.block_name} Block, ${block.district_name}`}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#93C5FD' }}>
            {lang === 'hi' ? (
              `कुल ${fmt(block.total_schools)} स्कूल · ${block.village_count} गाँव · ${stateName}`
            ) : (
              `${fmt(block.total_schools)} schools · ${block.village_count} villages · ${block.state_name}`
            )}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <AdSlot size="leaderboard" />

        {/* Villages - Collapsible/Scrollable panel */}
        {villages.length > 0 && (
          <div className="card" style={{ padding: '18px', marginTop: 24 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              🏘️ {lang === 'hi' ? `${blockName} ब्लॉक में गाँव` : `Villages in ${block.block_name} Block`} ({villages.length})
            </h2>
            <p style={{ fontSize: '0.825rem', color: '#64748B', marginBottom: 14 }}>
              {lang === 'hi' ? (
                'अपने गाँव के स्कूलों, पिन कोड और जनसांख्यिकी को देखने के लिए नीचे दिए गए किसी भी गाँव पर क्लिक करें।'
              ) : (
                'Click on any village below to view its local schools, pin codes, and rural demographics.'
              )}
            </p>
            <div style={{ maxHeight: 220, overflowY: 'auto', padding: '12px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
              {villages.map(v => (
                <Link key={v.village_slug} href={`${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}/${v.village_slug}`}
                  className="village-link" style={{ margin: 0, width: '100%' }}
                >
                  {v.village_name}
                  <span style={{ color: '#94A3B8', fontSize: '0.7rem', marginLeft: 6 }}>({v.school_count})</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{ marginTop: 24, marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>{lang === 'hi' ? 'फ़िल्टर:' : 'Filter:'}</span>
          <Link href={`${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}`}
            style={{ padding: '5px 14px', borderRadius: 99, fontSize: '0.775rem', fontWeight: 600, background: !category ? '#1E40AF' : '#F1F5F9', color: !category ? 'white' : '#475569', textDecoration: 'none' }}>
            {lang === 'hi' ? 'सभी' : 'All'}
          </Link>
          {categories.map(cat => (
            <Link key={cat} href={`${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}?category=${encodeURIComponent(cat)}`}
              style={{ padding: '5px 14px', borderRadius: 99, fontSize: '0.775rem', fontWeight: 600, background: category === cat ? '#1E40AF' : '#F1F5F9', color: category === cat ? 'white' : '#475569', textDecoration: 'none' }}>
              {t(cat, lang)}
            </Link>
          ))}
        </div>

        {/* Schools Grid */}
        <h2 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>
          {lang === 'hi' ? (
            `${blockName} में ${fmt(schoolsData.total)} स्कूल${category ? ` — ${t(category, lang)}` : ''}`
          ) : (
            `${fmt(schoolsData.total)} Schools in ${block.block_name}${category ? ` — ${category}` : ''}`
          )}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {schoolsData.schools.map(school => (
            <SchoolCard key={school.udise_code} school={school} lang={lang} />
          ))}
        </div>

        {/* Pagination */}
        {schoolsData.pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '6px 4px', maxWidth: '100%', scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch' }}>
              {Array.from({ length: Math.min(schoolsData.pages, 10) }, (_, i) => i + 1).map(p => (
                <Link key={p} href={`${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}?page=${p}${category ? `&category=${category}` : ''}`}
                  style={{ padding: '8px 14px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, background: p === page ? '#1E40AF' : 'white', color: p === page ? 'white' : '#1E40AF', border: `1px solid ${p === page ? '#1E40AF' : '#E2E8F0'}`, textDecoration: 'none', flexShrink: 0 }}>{p}</Link>
              ))}
              {schoolsData.pages > 10 && <span style={{ padding: '8px 12px', color: '#94A3B8', alignSelf: 'center', flexShrink: 0 }}>...</span>}
            </div>
          </div>
        )}

        {/* SEO Content & FAQs - AdSense Booster */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 32 }}>
          
          {/* About Block */}
          <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '22px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
              {lang === 'hi' ? `${blockName} ब्लॉक में स्कूल` : `Schools in ${block.block_name} Block`}
            </h2>
            {lang === 'hi' ? (
              <>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: 12 }}>
                  {blockName} ब्लॉक में {districtName} जिले के अंतर्गत कुल <strong>{fmt(block.total_schools)} स्कूल</strong> और <strong>{block.village_count} गाँव</strong> हैं।
                </p>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75 }}>
                  इस ब्लॉक के सभी स्कूलों के लिए <strong>ब्लॉक शिक्षा अधिकारी (BEO)</strong> जिम्मेदार होते हैं - शिक्षकों की उपस्थिति, स्कूल निरीक्षण, मध्याह्न भोजन (PM POSHAN) की निगरानी और शिकायतें इसी कार्यालय के माध्यम से की जाती हैं। यहाँ के सरकारी स्कूल पूरी तरह से निःशुल्क हैं। छात्रों को प्रतिदिन पाठ्यपुस्तकें और मध्याह्न भोजन योजना के तहत पका हुआ भोजन मिलता है।
                </p>
              </>
            ) : (
              <>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: 12 }}>
                  {block.block_name} block has <strong>{fmt(block.total_schools)} schools</strong> across <strong>{block.village_count} villages</strong> in {block.district_name} district.
                </p>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75 }}>
                  The <strong>Block Education Officer (BEO)</strong> is responsible for all schools in this block — teacher attendance, school inspections, mid-day meal monitoring, and complaints go through this office. Government schools here are free. Students get textbooks and a cooked meal daily under <strong>PM POSHAN</strong>.
                </p>
              </>
            )}
          </div>

          {/* Download Button — above FAQs, centered */}
          <div style={{ textAlign: 'center', padding: '24px 20px', background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 12 }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#166534', marginBottom: 4 }}>
              {lang === 'hi' ? `📋 ${blockName} ब्लॉक की पूरी स्कूल सूची` : `📋 Complete School List — ${block.block_name} Block`}
            </div>
            <div style={{ fontSize: '0.825rem', color: '#4B7C59', marginBottom: 16 }}>
              {lang === 'hi' ? `PDF format में — ${fmt(block.total_schools)} स्कूल` : `PDF format · ${fmt(block.total_schools)} schools included`}
            </div>
            <a
              href={`/api/download/schools/pdf?state=${stateSlug}&district=${districtSlug}&block=${blockSlug}`}
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

          {/* Block FAQs */}
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

        <AdSlot size="responsive" style={{ marginTop: 24 }} />
      </div>
    </>
  );
}
