import Link from 'next/link';
import { t } from '../lib/translate.js';

const categoryColors = {
  'Primary':          { bg: '#EFF6FF', color: '#1E40AF' },
  'Upper Primary':    { bg: '#F0FDFA', color: '#0D9488' },
  'Secondary':        { bg: '#FFF7ED', color: '#F97316' },
  'Higher Secondary': { bg: '#F5F3FF', color: '#7C3AED' },
  'default':          { bg: '#F1F5F9', color: '#475569' },
};
const mgmtColors = {
  'Department of Education': { bg: '#F0FDF4', color: '#166534' },
  'Private Unaided':         { bg: '#FFF1F2', color: '#BE123C' },
  'Private Aided':           { bg: '#FEF3C7', color: '#B45309' },
  'KVS':                     { bg: '#EFF6FF', color: '#1E40AF' },
  'NVS':                     { bg: '#F5F3FF', color: '#6D28D9' },
  'default':                 { bg: '#F1F5F9', color: '#475569' },
};

export default function SchoolCard({ school, lang = 'en' }) {
  const cat  = categoryColors[school.school_category] || categoryColors.default;
  const mgmt = mgmtColors[school.national_mgmt] || mgmtColors.default;
  const isOperational = school.school_status === 'Operational';

  const pathPrefix = lang === 'hi' ? '/hi' : '';
  const resolvedUrl = school.url ? `${pathPrefix}${school.url}` : '#';

  const catName = t(school.school_category, lang);
  const mgmtName = t(school.national_mgmt, lang);
  const typeName = t(school.school_type, lang);
  const statusName = t(isOperational ? 'Operational' : 'Closed', lang);
  const distName = school.district_slug ? (t(school.district_slug, lang) || school.district) : school.district;

  return (
    <Link
      href={resolvedUrl}
      style={{ display: 'block', textDecoration: 'none' }}
    >
      <div className="card" style={{ padding: '14px 16px', cursor: 'pointer' }}>
        {/* School Name */}
        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', marginBottom: 6, lineHeight: 1.35 }}>
          {school.school_name}
        </div>

        {/* Village */}
        <div style={{ fontSize: '0.775rem', color: '#64748B', marginBottom: 10 }}>
          📍 {school.village}{distName ? `, ${distName}` : ''}
        </div>

        {/* Badges row */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ background: cat.bg, color: cat.color, fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: 99 }}>
            {catName}
          </span>
          <span style={{ background: mgmt.bg, color: mgmt.color, fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: 99 }}>
            {mgmtName?.replace('Department of Education', lang === 'hi' ? 'सरकारी' : 'Govt.').replace('Private Unaided', lang === 'hi' ? 'निजी' : 'Private')}
          </span>
          <span style={{ background: school.school_type === 'Co-educational' ? '#F0FDFA' : '#FFF7ED', color: school.school_type === 'Co-educational' ? '#0D9488' : '#C2410C', fontSize: '0.7rem', fontWeight: 500, padding: '2px 8px', borderRadius: 99 }}>
            {typeName}
          </span>
        </div>

        {/* UDISE + Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#94A3B8' }}>
            UDISE: {String(school.udise_code).padStart(11, '0')}
          </span>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: isOperational ? '#10B981' : '#EF4444' }}>
            ● {statusName}
          </span>
        </div>
      </div>
    </Link>
  );
}
