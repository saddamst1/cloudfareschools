'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function DistrictsDirectory({ districts }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedStates, setExpandedStates] = useState({});

  // Group districts by state
  const grouped = useMemo(() => {
    const groups = {};
    districts.forEach(d => {
      if (!groups[d.state_name]) {
        groups[d.state_name] = {
          stateSlug: d.state_slug,
          districtsList: [],
        };
      }
      groups[d.state_name].districtsList.push(d);
    });
    return groups;
  }, [districts]);

  const stateNames = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  // Handle accordion toggle
  const toggleState = (stateName) => {
    setExpandedStates(prev => ({
      ...prev,
      [stateName]: !prev[stateName],
    }));
  };

  // Filter districts based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return { grouped, stateNames };

    const query = searchQuery.toLowerCase().trim();
    const filteredGroups = {};
    const filteredNames = [];

    stateNames.forEach(stateName => {
      const stateInfo = grouped[stateName];
      const matchingDistricts = stateInfo.districtsList.filter(d => 
        d.district_name.toLowerCase().includes(query) ||
        stateName.toLowerCase().includes(query)
      );

      if (matchingDistricts.length > 0) {
        filteredGroups[stateName] = {
          stateSlug: stateInfo.stateSlug,
          districtsList: matchingDistricts,
        };
        filteredNames.push(stateName);
      }
    });

    return { grouped: filteredGroups, stateNames: filteredNames };
  }, [searchQuery, grouped, stateNames]);

  // Auto-expand states if there is a search query active
  const isSearching = searchQuery.trim().length > 0;

  const fmt = (n) => n ? Number(n).toLocaleString('en-IN') : '0';

  return (
    <div>
      {/* Live Search Bar */}
      <div style={{ maxWidth: 640, margin: '0 auto 28px', position: 'relative' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="🔍 Search district name (e.g. Lucknow, Agra, Thane)..."
          style={{
            width: '100%',
            padding: '14px 20px 14px 44px',
            borderRadius: 12,
            border: '2px solid #E2E8F0',
            background: 'white',
            color: '#1E293B',
            fontSize: '0.95rem',
            outline: 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            fontFamily: 'inherit',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)'
          }}
          onFocus={e => { e.target.style.borderColor = '#3B82F6'; e.target.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.08)'; }}
          onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.03)'; }}
        />
        <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', color: '#94A3B8', pointerEvents: 'none' }}>
          🔍
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: 24,
              height: 24,
              cursor: 'pointer',
              fontSize: '0.75rem',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Accordion Directory List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredData.stateNames.length === 0 ? (
          <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '40px 24px', textAlign: 'center', color: '#64748B' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: '0.95rem', margin: 0 }}>No districts found matching "{searchQuery}"</p>
            <p style={{ fontSize: '0.825rem', color: '#94A3B8', marginTop: 4 }}>Try typing a different name or checking spelling.</p>
          </div>
        ) : (
          filteredData.stateNames.map(stateName => {
            const stateInfo = filteredData.grouped[stateName];
            const stateDistricts = stateInfo.districtsList;
            const isExpanded = isSearching || expandedStates[stateName];
            
            return (
              <div 
                key={stateName} 
                style={{ 
                  background: 'white', 
                  border: '1px solid #E2E8F0', 
                  borderRadius: 12, 
                  overflow: 'hidden',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                  boxShadow: isExpanded ? '0 4px 12px rgba(15, 23, 42, 0.03)' : 'none'
                }}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => !isSearching && toggleState(stateName)}
                  disabled={isSearching}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: isSearching ? 'default' : 'pointer',
                    textAlign: 'left',
                    outline: 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.1rem' }}>📍</span>
                    <h2 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                      {stateName}
                    </h2>
                    <span style={{ fontSize: '0.7rem', background: '#EFF6FF', color: '#1E40AF', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>
                      {stateDistricts.length} {stateDistricts.length === 1 ? 'District' : 'Districts'}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <Link 
                      href={`/schools/${stateInfo.stateSlug}`}
                      onClick={e => e.stopPropagation()} // Stop accordion toggle when clicking Link
                      style={{ fontSize: '0.775rem', color: '#0D9488', fontWeight: 700, textDecoration: 'none', zIndex: 10 }}
                      className="state-explore-link"
                    >
                      Explore State →
                    </Link>
                    {!isSearching && (
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>
                        ▼
                      </span>
                    )}
                  </div>
                </button>

                {/* Accordion Content */}
                {isExpanded && (
                  <div style={{ 
                    padding: '0 20px 20px', 
                    borderTop: '1px solid #F8FAFC',
                    background: '#FAFBFD'
                  }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 16 }}>
                      {stateDistricts.map(d => (
                        <Link 
                          key={d.district_slug} 
                          href={`/schools/${stateInfo.stateSlug}/${d.district_slug}`} 
                          className="district-tag"
                        >
                          {d.district_name}
                          <span style={{ color: '#94A3B8', fontSize: '0.7rem', marginLeft: 4, fontWeight: 500 }}>({fmt(d.total_schools)})</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .district-tag {
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 0.825rem;
          color: #334155 !important;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }
        .district-tag:hover {
          background: #EFF6FF;
          border-color: #3B82F6;
          color: #1E40AF !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(30, 64, 175, 0.05);
        }
        .state-explore-link:hover {
          text-decoration: underline !important;
        }
      `}</style>
    </div>
  );
}
