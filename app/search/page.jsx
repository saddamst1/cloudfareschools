import Link from 'next/link';
import { searchSchools } from '../../lib/queries';
import SchoolCard from '../../components/SchoolCard';
import AdSlot from '../../components/AdSlot';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q || '';
  return {
    title: q ? `"${q}" — School Search Results | SchoolsPedia` : 'Search Schools | SchoolsPedia',
    description: `Search results for "${q}" — find schools across India by name, UDISE code, village, district or block.`,
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q || '';
  const stateSlug = sp?.state || null;
  const districtSlug = sp?.district || null;
  const category = sp?.category || '';
  const mgmt = sp?.mgmt || '';

  const results = q.length >= 2 ? await searchSchools(q, 40, stateSlug, { category, mgmt, districtSlug }) : [];

  const trendingKeywords = ['Kendriya Vidyalaya', 'Jawahar Navodaya', 'Primary School', 'Model School', 'Saraswati Shishu Mandir'];

  const categories = [
    { label: 'All Categories', value: '' },
    { label: 'Primary', value: 'Primary' },
    { label: 'Upper Primary', value: 'Upper Primary' },
    { label: 'Secondary', value: 'Secondary' },
    { label: 'Higher Secondary', value: 'Higher Secondary' },
  ];

  const managementTypes = [
    { label: 'All Managements', value: '' },
    { label: 'Department of Education', value: 'Department of Education' },
    { label: 'Private Unaided', value: 'Private Unaided' },
    { label: 'Private Aided', value: 'Private Aided' },
    { label: 'Local Body', value: 'Local Body' },
    { label: 'Government Aided', value: 'Government Aided' },
  ];

  return (
    <>
      {/* Search & Filter Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0F172A 100%)', padding: '36px 24px', color: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'white', marginBottom: 16 }}>
            Explore 16.5 Lakh+ Schools
          </h1>
          <form method="GET" style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 800 }}>
            {/* Top Search Bar */}
            <div style={{ display: 'flex', gap: 0, borderRadius: 10, overflow: 'hidden', border: '2px solid #3B82F6', background: 'white' }}>
              <input 
                name="q" 
                defaultValue={q} 
                placeholder="Search by school name, UDISE code, village, or district..." 
                style={{ flex: 1, padding: '14px 18px', border: 'none', outline: 'none', fontSize: '0.925rem', background: 'white', color: '#1E293B' }} 
              />
              {stateSlug && <input type="hidden" name="state" value={stateSlug} />}
              {districtSlug && <input type="hidden" name="district" value={districtSlug} />}
              <button type="submit" style={{ background: '#F97316', color: 'white', border: 'none', padding: '14px 26px', fontSize: '0.925rem', fontWeight: 700, cursor: 'pointer', transition: 'background-color 0.15s' }}>
                🔍 Search
              </button>
            </div>

            {/* Filter Dropdowns Row */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 200, flex: 1 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: 0.5 }}>School Level</span>
                <select 
                  name="category" 
                  defaultValue={category} 
                  style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
                >
                  {categories.map(c => <option key={c.value} value={c.value} style={{ color: '#1E293B' }}>{c.label}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 240, flex: 1 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: 0.5 }}>Management Type</span>
                <select 
                  name="mgmt" 
                  defaultValue={mgmt} 
                  style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
                >
                  {managementTypes.map(m => <option key={m.value} value={m.value} style={{ color: '#1E293B' }}>{m.label}</option>)}
                </select>
              </div>
            </div>
          </form>

          {/* Trending suggestions */}
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: '0.8rem', color: '#93C5FD' }}>
            <span>Trending:</span>
            {trendingKeywords.map(kw => (
              <Link 
                key={kw} 
                href={`/search?q=${encodeURIComponent(kw)}${stateSlug ? `&state=${stateSlug}` : ''}${districtSlug ? `&district=${districtSlug}` : ''}`} 
                className="trending-tag"
                style={{ color: 'white', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 12, textDecoration: 'none', transition: 'background 0.15s' }}
              >
                {kw}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <AdSlot size="leaderboard" />

        {q && (
          <div style={{ marginTop: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>
              {results.length > 0 
                ? `${results.length} results found matching "${q}"` 
                : `No results found for "${q}"`}
            </h2>

            {results.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                {results.map(school => <SchoolCard key={school.udise_code} school={school} />)}
              </div>
            ) : (
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 40, textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>No matching schools found</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, marginBottom: 20 }}>
                  We couldn't find any schools matching your search criteria. Try modifying your filters or search keywords.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                  <Link href="/search" style={{ background: '#F1F5F9', color: '#475569', padding: '10px 18px', borderRadius: 8, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                    Clear Filters
                  </Link>
                  <Link href="/schools" style={{ background: '#1E40AF', color: 'white', padding: '10px 18px', borderRadius: 8, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                    Browse Directory
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {!q && (
          <div style={{ marginTop: 32, textAlign: 'center', padding: '40px 0', maxWidth: 600, margin: '0 auto' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏫</div>
            <h2 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>
              Search School Directories
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, marginBottom: 24 }}>
              Enter a school name, UDISE code, village, or district above. You can also filter results by education level and management type.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <Link href="/schools" style={{ background: '#1E40AF', color: 'white', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
                Browse by State
              </Link>
              <Link href="/schools/districts" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
                Browse by District
              </Link>
            </div>
          </div>
        )}

        <AdSlot size="responsive" style={{ marginTop: 24 }} />
      </div>
      
      <style>{`
        .trending-tag:hover {
          background: rgba(255, 255, 255, 0.2) !important;
        }
      `}</style>
    </>
  );
}
