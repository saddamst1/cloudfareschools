import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllDistrictSlugs, getDistrict, getDistrictBlocks, getDistrictCategoryCounts, getAdjacentDistricts, getDistrictSchools } from '@/lib/queries';
import { getDistrictMeta, breadcrumbSchema } from '@/lib/seo';
import AdSlot from '@/components/AdSlot';

export const revalidate = 86400;

export async function generateStaticParams() {
  const all = await getAllDistrictSlugs();
  return all.map(d => ({ state: d.state_slug, district: d.district_slug }));
}

export async function generateMetadata({ params }) {
  const { state: stateSlug, district: districtSlug } = await params;
  const district = await getDistrict(stateSlug, districtSlug);
  if (!district) return { title: 'District Not Found | SchoolsPedia' };
  return getDistrictMeta(district);
}

export default async function DistrictPage({ params }) {
  const { state: stateSlug, district: districtSlug } = await params;
  const [district, blocks, categories, adjacent, districtSchools] = await Promise.all([
    getDistrict(stateSlug, districtSlug),
    getDistrictBlocks(stateSlug, districtSlug),
    getDistrictCategoryCounts(stateSlug, districtSlug),
    getAdjacentDistricts(stateSlug, districtSlug),
    getDistrictSchools(stateSlug, districtSlug, 12),
  ]);
  if (!district) notFound();

  const crumbSchema = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: district.state_name, url: `/schools/${stateSlug}` },
    { name: district.district_name, url: `/schools/${stateSlug}/${districtSlug}` },
  ]);

  const fmt = (n) => n ? Number(n).toLocaleString('en-IN') : '—';
  const fmtPop = (n) => {
    if (!n) return '—';
    if (n >= 10000000) return `${(n/10000000).toFixed(1)} Cr`;
    if (n >= 100000) return `${(n/100000).toFixed(1)} Lakh`;
    return n.toLocaleString('en-IN');
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />

      <div className="breadcrumb">
        <div className="breadcrumb-inner">
          <Link href="/">Home</Link><span className="sep">›</span>
          <Link href="/schools">Schools</Link><span className="sep">›</span>
          <Link href={`/schools/${stateSlug}`}>{district.state_name}</Link><span className="sep">›</span>
          <span className="current">{district.district_name}</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', padding: '28px 24px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.4rem, 3vw, 1.85rem)', fontWeight: 700, color: 'white', marginBottom: 8 }}>
            Schools in {district.district_name} District, {district.state_name}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#93C5FD', lineHeight: 1.6 }}>
            {fmt(district.total_schools)} schools across {district.block_count} blocks
            {district.dist_literacy_pct ? ` · Literacy: ${district.dist_literacy_pct.toFixed(1)}%` : ''}
            {district.dist_population ? ` · Population: ${fmtPop(district.dist_population)}` : ''}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <div className="school-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>

          <div>
            <AdSlot size="leaderboard" />

            {/* Blocks Grid */}
            <div style={{ marginTop: 24 }}>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>
                Blocks in {district.district_name} ({blocks.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 10 }}>
                {blocks.map(b => (
                  <Link key={b.block_slug} href={`/schools/${stateSlug}/${districtSlug}/${b.block_slug}`} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ padding: '14px 16px', cursor: 'pointer' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', marginBottom: 6 }}>{b.block_name}</div>
                      <div style={{ display: 'flex', gap: 12, fontSize: '0.775rem', color: '#64748B' }}>
                        <span>{fmt(b.total_schools)} schools</span>
                        <span>{b.village_count} villages</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#1E40AF', marginTop: 8 }}>View block →</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Top Schools Widget */}
            {districtSchools && districtSchools.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.05rem', fontWeight: 700, marginBottom: 16 }}>
                  🏫 Featured Schools in {district.district_name} District
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                  {districtSchools.map(school => (
                    <Link key={school.udise_code} href={school.url} style={{ textDecoration: 'none' }}>
                      <div className="card" style={{ padding: '14px 16px', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', marginBottom: 6, lineHeight: 1.4 }}>
                            {school.school_name}
                          </div>
                          <div style={{ display: 'flex', gap: 8, fontSize: '0.725rem', color: '#64748B', flexWrap: 'wrap', marginBottom: 6 }}>
                            <span style={{ background: '#EFF6FF', color: '#1E40AF', padding: '2px 8px', borderRadius: 99, fontWeight: 600 }}>
                              {school.school_category}
                            </span>
                            <span>{school.village}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #F1F5F9', paddingTop: 8, marginTop: 10 }}>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#94A3B8' }}>
                            UDISE: {school.udise_code}
                          </span>
                          <span style={{ fontSize: '0.725rem', color: '#1E40AF', fontWeight: 600 }}>Explore →</span>
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
                  Schools in {district.district_name} District
                </h2>
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
              </div>

              {/* District FAQs */}
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '22px' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
                  FAQs
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {[
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

            {/* Adjacent Districts Widget */}
            {adjacent && adjacent.length > 0 && (
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '22px', marginTop: 24 }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
                  🗺️ Browse Nearby Districts in {district.state_name}
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {adjacent.map(adj => (
                    <Link key={adj.district_slug} href={`/schools/${stateSlug}/${adj.district_slug}`}
                          className="adj-district-tag"
                          style={{ display: 'inline-block', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 12px', fontSize: '0.85rem', color: '#1E293B', fontWeight: 600, textDecoration: 'none', transition: 'border-color 0.15s ease' }}
                    >
                      {adj.district_name}
                      <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, marginLeft: 6 }}>({fmt(adj.total_schools)} schools)</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <AdSlot size="responsive" style={{ marginTop: 20 }} />
          </div>

          {/* Sidebar — District Census Data */}
          <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(district.dist_population || district.dist_literacy_pct) && (
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
                  📊 {district.district_name} Census Data
                </div>
                {[
                  ['Literacy Rate', district.dist_literacy_pct ? `${district.dist_literacy_pct.toFixed(1)}%` : '—', '#0D9488'],
                  ['Population', fmtPop(district.dist_population), '#1E293B'],
                  ['Sex Ratio', district.dist_sex_ratio ? `${Math.round(district.dist_sex_ratio)}/1000` : '—', '#7C3AED'],
                  ['Total Schools', fmt(district.total_schools), '#1E40AF'],
                  ['Blocks', district.block_count, '#F97316'],
                ].map(([label, val, color]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #F1F5F9', fontSize: '0.8rem' }}>
                    <span style={{ color: '#64748B', fontSize: '0.775rem' }}>{label}</span>
                    <span style={{ color, fontWeight: 700 }}>{val}</span>
                  </div>
                ))}
              </div>
            )}
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
