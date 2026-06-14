import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlock, getBlockVillages, getBlockSchools } from '@/lib/queries';
import { getBlockMeta, breadcrumbSchema } from '@/lib/seo';
import SchoolCard from '@/components/SchoolCard';
import AdSlot from '@/components/AdSlot';

export const revalidate = 86400;

export async function generateMetadata({ params }) {
  const { state: stateSlug, district: districtSlug, block: blockSlug } = await params;
  const block = await getBlock(stateSlug, districtSlug, blockSlug);
  if (!block) return { title: 'Block Not Found | SchoolsPedia' };
  return getBlockMeta(block);
}

export default async function BlockPage({ params, searchParams }) {
  const { state: stateSlug, district: districtSlug, block: blockSlug } = await params;
  const sp = await searchParams;
  const page = Number(sp?.page) || 1;
  const category = sp?.category || null;

  const [block, villages, schoolsData] = await Promise.all([
    getBlock(stateSlug, districtSlug, blockSlug),
    getBlockVillages(stateSlug, districtSlug, blockSlug),
    getBlockSchools(stateSlug, districtSlug, blockSlug, { page, category }),
  ]);
  if (!block) notFound();

  const crumbSchema = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: block.state_name, url: `/schools/${stateSlug}` },
    { name: block.district_name, url: `/schools/${stateSlug}/${districtSlug}` },
    { name: block.block_name, url: `/schools/${stateSlug}/${districtSlug}/${blockSlug}` },
  ]);

  const fmt = (n) => n ? Number(n).toLocaleString('en-IN') : '0';
  const categories = ['Primary', 'Upper Primary', 'Secondary', 'Higher Secondary'];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />

      <div className="breadcrumb">
        <div className="breadcrumb-inner">
          <Link href="/">Home</Link><span className="sep">›</span>
          <Link href={`/schools/${stateSlug}`}>{block.state_name}</Link><span className="sep">›</span>
          <Link href={`/schools/${stateSlug}/${districtSlug}`}>{block.district_name}</Link><span className="sep">›</span>
          <span className="current">{block.block_name}</span>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', padding: '28px 24px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.3rem, 3vw, 1.75rem)', fontWeight: 700, color: 'white', marginBottom: 8 }}>
            Schools in {block.block_name} Block, {block.district_name}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#93C5FD' }}>
            {fmt(block.total_schools)} schools · {block.village_count} villages · {block.state_name}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <AdSlot size="leaderboard" />

        {/* Villages - Collapsible/Scrollable panel */}
        {villages.length > 0 && (
          <div className="card" style={{ padding: '18px', marginTop: 24 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              🏘️ Villages in {block.block_name} Block ({villages.length})
            </h2>
            <p style={{ fontSize: '0.825rem', color: '#64748B', marginBottom: 14 }}>
              Click on any village below to view its local schools, pin codes, and rural demographics.
            </p>
            <div style={{ maxHeight: 220, overflowY: 'auto', padding: '12px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
              {villages.map(v => (
                <Link key={v.village_slug} href={`/schools/${stateSlug}/${districtSlug}/${blockSlug}/${v.village_slug}`}
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
          <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Filter:</span>
          <Link href={`/schools/${stateSlug}/${districtSlug}/${blockSlug}`}
            style={{ padding: '5px 14px', borderRadius: 99, fontSize: '0.775rem', fontWeight: 600, background: !category ? '#1E40AF' : '#F1F5F9', color: !category ? 'white' : '#475569', textDecoration: 'none' }}>All</Link>
          {categories.map(cat => (
            <Link key={cat} href={`/schools/${stateSlug}/${districtSlug}/${blockSlug}?category=${encodeURIComponent(cat)}`}
              style={{ padding: '5px 14px', borderRadius: 99, fontSize: '0.775rem', fontWeight: 600, background: category === cat ? '#1E40AF' : '#F1F5F9', color: category === cat ? 'white' : '#475569', textDecoration: 'none' }}>{cat}</Link>
          ))}
        </div>

        {/* Schools Grid */}
        <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>
          {fmt(schoolsData.total)} Schools in {block.block_name}
          {category ? ` — ${category}` : ''}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {schoolsData.schools.map(school => (
            <SchoolCard key={school.udise_code} school={school} />
          ))}
        </div>

        {/* Pagination */}
        {schoolsData.pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '6px 4px', maxWidth: '100%', scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch' }}>
              {Array.from({ length: Math.min(schoolsData.pages, 10) }, (_, i) => i + 1).map(p => (
                <Link key={p} href={`/schools/${stateSlug}/${districtSlug}/${blockSlug}?page=${p}${category ? `&category=${category}` : ''}`}
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
              Schools in {block.block_name} Block
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: 12 }}>
              {block.block_name} block has <strong>{fmt(block.total_schools)} schools</strong> across <strong>{block.village_count} villages</strong> in {block.district_name} district.
            </p>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75 }}>
              The <strong>Block Education Officer (BEO)</strong> is responsible for all schools in this block — teacher attendance, school inspections, mid-day meal monitoring, and complaints go through this office. Government schools here are free. Students get textbooks and a cooked meal daily under <strong>PM POSHAN</strong>.
            </p>
          </div>

          {/* Block FAQs */}
          <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '22px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
              FAQs
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
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

        <AdSlot size="responsive" style={{ marginTop: 24 }} />
      </div>
    </>
  );
}
