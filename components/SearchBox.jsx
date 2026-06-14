'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBox({ placeholder = 'School name, UDISE code, village, district...', stateSlug = null, districtSlug = null, lang = 'en' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const timeoutRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (query.length < 2) { setResults([]); setOpen(false); return; }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        let url = `/api/search?q=${encodeURIComponent(query)}&limit=8`;
        if (stateSlug) url += `&state=${stateSlug}`;
        if (districtSlug) url += `&district=${districtSlug}`;
        const res = await fetch(url);
        const data = await res.json();
        setResults(data.results || []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 280);
  }, [query, stateSlug, districtSlug]);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      let url = `/search?q=${encodeURIComponent(query.trim())}`;
      if (stateSlug) url += `&state=${stateSlug}`;
      if (districtSlug) url += `&district=${districtSlug}`;
      router.push(url);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') setOpen(false);
  };

  const categoryColor = (cat) => {
    if (cat === 'Primary') return '#1E40AF';
    if (cat === 'Upper Primary') return '#0D9488';
    if (cat === 'Secondary') return '#F97316';
    return '#6D28D9';
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%', maxWidth: 600, margin: '0 auto' }}>
      <div className="search-box">
        <input
          id="main-search"
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          aria-label="Search schools"
        />
        <button onClick={handleSearch} aria-label="Search">
          {loading ? '⏳' : '🔍'} {lang === 'hi' ? 'खोजें' : 'Search'}
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0, right: 0,
          background: '#FFFFFF',
          border: '1px solid #94A3B8',
          borderRadius: 12,
          boxShadow: '0 12px 40px rgba(15, 23, 42, 0.22)',
          zIndex: 200,
          overflow: 'hidden',
          textAlign: 'left',
        }}>
          {/* Scrollable container for suggestion items */}
          <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
            {results.map((r, i) => {
              const resolvedUrl = lang === 'hi' && r.url?.startsWith('/schools/') ? `/hi${r.url}` : r.url;
              return (
                <a
                  key={r.udise_code || i}
                  href={resolvedUrl}
                style={{
                  display: 'block',
                  padding: '11px 16px',
                  borderBottom: '1px solid #E2E8F0',
                  textDecoration: 'none',
                  transition: 'background 0.1s',
                  background: '#FAFBFD',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#E0F2FE'}
                onMouseLeave={e => e.currentTarget.style.background = '#FAFBFD'}
                onClick={() => setOpen(false)}
              >
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A', marginBottom: 3 }}>{r.school_name}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#475569' }}>📍 {r.village}, {r.district}, {r.state}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: categoryColor(r.school_category), background: '#EFF6FF', padding: '1px 6px', borderRadius: 99 }}>{r.school_category}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: 2, fontFamily: 'monospace' }}>UDISE: {String(r.udise_code).padStart(11, '0')}</div>
                </a>
              );
            })}
          </div>
          {/* Sticky view all results bar */}
          <a
            href={`/search?q=${encodeURIComponent(query)}${stateSlug ? `&state=${stateSlug}` : ''}${districtSlug ? `&district=${districtSlug}` : ''}`}
            style={{
              display: 'block',
              padding: '12px 16px',
              fontSize: '0.8rem',
              color: '#1E40AF',
              fontWeight: 700,
              textAlign: 'center',
              background: '#EFF6FF',
              textDecoration: 'none',
              transition: 'background 0.1s',
              borderTop: '1px solid #CBD5E1',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#DBEAFE'}
            onMouseLeave={e => e.currentTarget.style.background = '#EFF6FF'}
          >
            View all results for &ldquo;{query}&rdquo; →
          </a>
        </div>
      )}
    </div>
  );
}
