import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getVillageSchools, getDistrictStatsForSchool, getBlockVillages } from '@/lib/queries';
import { breadcrumbSchema } from '@/lib/seo';
import AdSlot from '@/components/AdSlot';
import DistrictStats from '@/components/DistrictStats';
import SchoolCard from '@/components/SchoolCard';

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { village: villageSlug, district: districtSlug, state: stateSlug, block: blockSlug } = await params;
  const schools = await getVillageSchools(stateSlug, districtSlug, blockSlug, villageSlug);
  const villageName = villageSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const count = schools.length;
  return {
    title: `Schools in ${villageName} Village — ${count} Schools | SchoolsPedia`,
    description: `${count} school${count !== 1 ? 's' : ''} in ${villageName} village. Get UDISE codes, school categories, management types and enrollment details.`,
    alternates: { canonical: `https://www.schoolspedia.in/schools/${stateSlug}/${districtSlug}/${blockSlug}/${villageSlug}` },
  };
}

export default async function VillagePage({ params }) {
  const { state: stateSlug, district: districtSlug, block: blockSlug, village: villageSlug } = await params;

  const [schools, districtStats, allVillages] = await Promise.all([
    getVillageSchools(stateSlug, districtSlug, blockSlug, villageSlug),
    getDistrictStatsForSchool(stateSlug, districtSlug),
    getBlockVillages(stateSlug, districtSlug, blockSlug),
  ]);

  const villageName = schools.length > 0
    ? schools[0].village
    : villageSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const blockName = blockSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const districtName = districtStats?.district_name || districtSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const stateName = schools.length > 0 ? schools[0].state : stateSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const crumbSchema = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: stateName, url: `/schools/${stateSlug}` },
    { name: districtName, url: `/schools/${stateSlug}/${districtSlug}` },
    { name: blockName, url: `/schools/${stateSlug}/${districtSlug}/${blockSlug}` },
    { name: villageName, url: `/schools/${stateSlug}/${districtSlug}/${blockSlug}/${villageSlug}` },
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
          <Link href={`/schools/${stateSlug}`}>{stateName}</Link><span className="sep">›</span>
          <Link href={`/schools/${stateSlug}/${districtSlug}`}>{districtName}</Link><span className="sep">›</span>
          <Link href={`/schools/${stateSlug}/${districtSlug}/${blockSlug}`}>{blockSlug.split('-').map(w=>w[0]?.toUpperCase()+w.slice(1)).join(' ')}</Link><span className="sep">›</span>
          <span className="current">{villageName}</span>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', padding: '28px 24px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.3rem, 3vw, 1.75rem)', fontWeight: 700, color: 'white', marginBottom: 8 }}>
            Schools in {villageName} Village
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#93C5FD' }}>
            {schools.length} school{schools.length !== 1 ? 's' : ''} found · {districtName} District · {stateName}
            {districtStats?.dist_literacy_pct ? ` · District literacy: ${districtStats.dist_literacy_pct.toFixed(1)}%` : ''}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <div className="school-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
          <div>
            <AdSlot size="leaderboard" />

            <div style={{ marginTop: 24 }}>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>
                All {schools.length} Schools in {villageName}
              </h2>

              {schools.length === 0 ? (
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 32, textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                  <p style={{ color: '#64748B', fontSize: '0.9rem' }}>No schools found for this village in our database. This may be a very small settlement or the schools may be listed under an adjacent village.</p>
                  <Link href={`/schools/${stateSlug}/${districtSlug}/${blockSlug}`} style={{ display: 'inline-block', marginTop: 16, background: '#1E40AF', color: 'white', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
                    View all schools in this block →
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                  {schools.map(school => <SchoolCard key={school.udise_code} school={school} />)}
                </div>
              )}
            </div>

            {/* Content Section */}
            {schools.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24 }}>
                
                {/* About Village Schools */}
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 22 }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
                    Schools in {villageName} Village
                  </h2>
                  {schools.length === 1 ? (
                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75 }}>
                      There is <strong>1 school</strong> registered in {villageName} under UDISE+. Click on the school card above to see its UDISE code, category, management type, and other details.
                    </p>
                  ) : schools.length <= 5 ? (
                    <>
                      <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: 10 }}>
                        {villageName} has <strong>{schools.length} schools</strong> registered in UDISE+. The cards above show each school's name, category (Primary / Upper Primary / Secondary), and management type (Government or Private).
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75 }}>
                        {schools.some(s => s.national_mgmt?.includes('Department') || s.national_mgmt?.includes('Local Body'))
                          ? `At least one school here is government-run. Government schools are free — no tuition fee, textbooks provided, and a cooked meal every school day under PM POSHAN.`
                          : `Check the management type on each school card. Private unaided schools charge fees. Under RTE, they must give 25% of Class 1 seats free to low-income families.`
                        }
                      </p>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: 10 }}>
                        {villageName} has <strong>{schools.length} schools</strong> registered in UDISE+. The school cards above show name, category, and management type. Click any card to see the UDISE code and full details.
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75 }}>
                        For secondary school (Class 9 onwards), check whether a Secondary or Higher Secondary school is listed. If not, students from {villageName} typically travel to the nearest town or block headquarters.
                      </p>
                    </>
                  )}
                  <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginTop: 10 }}>
                    Before visiting any school, check if it has working toilets for boys and girls and safe drinking water. Download the school's free Report Card from <strong>udiseplus.gov.in</strong> using the UDISE code shown on the school's page.
                  </p>
                </div>

                {/* Village FAQs */}
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 22 }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
                    FAQs
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {[
                      {
                        q: `How many schools are in ${villageName}?`,
                        a: `${schools.length} school${schools.length !== 1 ? 's are' : ' is'} registered in ${villageName} in the UDISE+ database.`
                      },
                      {
                        q: `Are there free government schools in ${villageName}?`,
                        a: schools.some(s => s.national_mgmt?.includes('Department') || s.national_mgmt?.includes('Local Body'))
                          ? `Yes. Check the school cards above — schools listed as Government are free. No tuition fee, textbooks provided, and a cooked mid-day meal every school day.`
                          : `The schools listed here may not include a government school — check the management type on each card. If you need a free government school, look in nearby villages in **${blockName} block**.`
                      },
                      {
                        q: `Where do Class 9-12 students from ${villageName} study?`,
                        a: schools.some(s => s.school_category === 'Secondary' || s.school_category === 'Higher Secondary')
                          ? `There is a secondary school in ${villageName} itself. Check the school cards above for secondary options.`
                          : `${villageName} doesn't appear to have a secondary school. Students usually go to the nearest secondary school in **${blockName} block** or the district headquarters.`
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
            )}

            <AdSlot size="responsive" style={{ marginTop: 20 }} />
          </div>

          <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Other Villages Widget */}
            {allVillages && allVillages.length > 1 && (
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
                  🏘️ Other Villages in {blockName}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
                  {allVillages
                    .filter(v => v.village_slug !== villageSlug)
                    .slice(0, 10)
                    .map(v => (
                      <Link key={v.village_slug} href={`/schools/${stateSlug}/${districtSlug}/${blockSlug}/${v.village_slug}`}
                        style={{ fontSize: '0.825rem', color: '#1E40AF', textDecoration: 'none', fontWeight: 500 }}
                        className="village-cross-link"
                      >
                        {v.village_name} <span style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 400 }}>({v.school_count})</span>
                      </Link>
                    ))
                  }
                </div>
              </div>
            )}

            <DistrictStats stats={districtStats} districtName={districtName} />
            <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', borderRadius: 10, padding: 16, color: 'white' }}>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '0.95rem', fontWeight: 700, marginBottom: 8 }}>Search more schools</div>
              <Link href={`/schools/${stateSlug}/${districtSlug}/${blockSlug}`} style={{ display: 'block', background: '#F97316', color: 'white', textAlign: 'center', padding: '10px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                View all block schools →
              </Link>
            </div>
            <AdSlot size="sidebar" />
          </div>
        </div>
      </div>

      <style>{`
        .village-cross-link:hover {
          text-decoration: underline !important;
        }
      `}</style>
    </>
  );
}
