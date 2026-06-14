export default function DistrictStats({ stats, districtName }) {
  if (!stats) return null;
  const fmt = (n) => n ? Number(n).toLocaleString('en-IN') : '—';
  const fmtPct = (n) => n ? `${Number(n).toFixed(1)}%` : '—';
  const fmtPop = (n) => {
    if (!n) return '—';
    if (n >= 10000000) return `${(n/10000000).toFixed(1)} Cr`;
    if (n >= 100000)   return `${(n/100000).toFixed(1)} Lakh`;
    return n.toLocaleString('en-IN');
  };

  const litRate = stats.dist_literacy_pct || 0;
  const nationalAvg = 74.04;
  const isAboveAverage = litRate >= nationalAvg;
  const progressColor = isAboveAverage ? '#10B981' : '#F97316';

  return (
    <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: 14 }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
        📊 {districtName} District Data
      </div>

      {/* Literacy Rate Progress Bar */}
      {stats.dist_literacy_pct && (
        <div style={{ margin: '8px 0 14px 0', padding: '10px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 650, color: '#475569', marginBottom: 6 }}>
            <span>Literacy: {litRate.toFixed(1)}%</span>
            <span style={{ color: progressColor, fontWeight: 700 }}>
              {isAboveAverage ? 'Above National Avg' : 'Below National Avg'}
            </span>
          </div>
          {/* Progress bar track */}
          <div style={{ width: '100%', height: 8, background: '#E2E8F0', borderRadius: 99, overflow: 'hidden', position: 'relative' }}>
            {/* National average line indicator */}
            <div style={{ position: 'absolute', left: `${nationalAvg}%`, top: 0, bottom: 0, width: 2, background: '#EF4444', zIndex: 1 }} title="National Avg: 74.04%" />
            {/* District value fill */}
            <div style={{ width: `${litRate}%`, height: '100%', background: progressColor, borderRadius: 99 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94A3B8', marginTop: 4 }}>
            <span>0%</span>
            <span style={{ color: '#EF4444' }}>National Avg (74.0%)</span>
            <span>100%</span>
          </div>
        </div>
      )}

      {/* School split progress bar */}
      {stats.dist_govt_schools && stats.dist_private_schools && stats.total_schools && (
        <div style={{ margin: '8px 0 14px 0', padding: '10px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 650, color: '#475569', marginBottom: 6 }}>
            <span>School Distribution</span>
            <span>Govt vs Private</span>
          </div>
          {/* Stacked bar */}
          <div style={{ width: '100%', height: 8, background: '#E2E8F0', borderRadius: 99, overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${(stats.dist_govt_schools / stats.total_schools) * 100}%`, height: '100%', background: '#16A34A' }} title={`Govt: ${fmt(stats.dist_govt_schools)}`} />
            <div style={{ width: `${(stats.dist_private_schools / stats.total_schools) * 100}%`, height: '100%', background: '#E11D48' }} title={`Private: ${fmt(stats.dist_private_schools)}`} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748B', marginTop: 6 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
              Govt ({((stats.dist_govt_schools / stats.total_schools) * 100).toFixed(0)}%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E11D48', display: 'inline-block' }} />
              Private ({((stats.dist_private_schools / stats.total_schools) * 100).toFixed(0)}%)
            </span>
          </div>
        </div>
      )}

      {[
        ['Literacy Rate', fmtPct(stats.dist_literacy_pct), '#0D9488'],
        ['Total Schools', fmt(stats.total_schools), '#1E40AF'],
        ['Govt. Schools', fmt(stats.dist_govt_schools), '#16A34A'],
        ['Private Schools', fmt(stats.dist_private_schools), '#E11D48'],
        ['Population', fmtPop(stats.dist_population), '#1E293B'],
        ['Sex Ratio', stats.dist_sex_ratio ? `${Math.round(stats.dist_sex_ratio)}/1000` : '—', '#7C3AED'],
        ['SC Population', fmtPct(stats.dist_sc_pct), '#475569'],
        ['ST Population', fmtPct(stats.dist_st_pct), '#475569'],
      ].map(([label, val, color]) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #F1F5F9', fontSize: '0.8rem' }}>
          <span style={{ color: '#64748B', fontSize: '0.775rem' }}>{label}</span>
          <span style={{ color, fontWeight: 700 }}>{val}</span>
        </div>
      ))}

      {stats.dist_avg_lat && (
        <div style={{ marginTop: 10, padding: '8px 10px', background: '#EFF6FF', borderRadius: 6, fontSize: '0.75rem', color: '#3B82F6' }}>
          📍 {Number(stats.dist_avg_lat).toFixed(4)}°N, {Number(stats.dist_avg_long).toFixed(4)}°E
          {stats.dist_sample_pin ? ` · PIN: ${stats.dist_sample_pin}` : ''}
        </div>
      )}
    </div>
  );
}
