import { t } from '../lib/translate.js';

export default function DistrictStats({ stats, districtName, lang = 'en' }) {
  if (!stats) return null;
  const fmt = (n) => n ? Number(n).toLocaleString('en-IN') : '—';
  const fmtPct = (n) => n ? `${Number(n).toFixed(1)}%` : '—';
  const fmtPop = (n) => {
    if (!n) return '—';
    if (n >= 10000000) return `${(n/10000000).toFixed(1)} ${lang === 'hi' ? 'करोड़' : 'Cr'}`;
    if (n >= 100000)   return `${(n/100000).toFixed(1)} ${lang === 'hi' ? 'लाख' : 'Lakh'}`;
    return n.toLocaleString('en-IN');
  };

  const litRate = stats.dist_literacy_pct || 0;
  const nationalAvg = 74.04;
  const isAboveAverage = litRate >= nationalAvg;
  const progressColor = isAboveAverage ? '#10B981' : '#F97316';

  const labels = lang === 'hi' ? {
    districtData: 'जिला डेटा',
    literacy: 'साक्षरता',
    aboveAvg: 'राष्ट्रीय औसत से अधिक',
    belowAvg: 'राष्ट्रीय औसत से कम',
    nationalAvgLabel: 'राष्ट्रीय औसत (74.0%)',
    distribution: 'स्कूलों का वितरण',
    govtVsPvt: 'सरकारी बनाम निजी',
    govt: 'सरकारी',
    pvt: 'निजी',
    litRate: 'साक्षरता दर',
    totalSchools: 'कुल स्कूल',
    govtSchools: 'सरकारी स्कूल',
    pvtSchools: 'निजी स्कूल',
    population: 'जनसंख्या',
    sexRatio: 'लिंगानुपात',
    scPop: 'अनुसूचित जाति (SC) %',
    stPop: 'अनुसूचित जनजाति (ST) %',
  } : {
    districtData: 'District Data',
    literacy: 'Literacy',
    aboveAvg: 'Above National Avg',
    belowAvg: 'Below National Avg',
    nationalAvgLabel: 'National Avg (74.0%)',
    distribution: 'School Distribution',
    govtVsPvt: 'Govt vs Private',
    govt: 'Govt',
    pvt: 'Private',
    litRate: 'Literacy Rate',
    totalSchools: 'Total Schools',
    govtSchools: 'Govt. Schools',
    pvtSchools: 'Private Schools',
    population: 'Population',
    sexRatio: 'Sex Ratio',
    scPop: 'SC Population',
    stPop: 'ST Population',
  };

  return (
    <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: 14 }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
        📊 {districtName} {labels.districtData}
      </div>

      {/* Literacy Rate Progress Bar */}
      {stats.dist_literacy_pct && (
        <div style={{ margin: '8px 0 14px 0', padding: '10px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 650, color: '#475569', marginBottom: 6 }}>
            <span>{labels.literacy}: {litRate.toFixed(1)}%</span>
            <span style={{ color: progressColor, fontWeight: 700 }}>
              {isAboveAverage ? labels.aboveAvg : labels.belowAvg}
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
            <span style={{ color: '#EF4444' }}>{labels.nationalAvgLabel}</span>
            <span>100%</span>
          </div>
        </div>
      )}

      {/* School split progress bar */}
      {stats.dist_govt_schools && stats.dist_private_schools && stats.total_schools && (
        <div style={{ margin: '8px 0 14px 0', padding: '10px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 650, color: '#475569', marginBottom: 6 }}>
            <span>{labels.distribution}</span>
            <span>{labels.govtVsPvt}</span>
          </div>
          {/* Stacked bar */}
          <div style={{ width: '100%', height: 8, background: '#E2E8F0', borderRadius: 99, overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${(stats.dist_govt_schools / stats.total_schools) * 100}%`, height: '100%', background: '#16A34A' }} title={`Govt: ${fmt(stats.dist_govt_schools)}`} />
            <div style={{ width: `${(stats.dist_private_schools / stats.total_schools) * 100}%`, height: '100%', background: '#E11D48' }} title={`Private: ${fmt(stats.dist_private_schools)}`} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748B', marginTop: 6 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
              {labels.govt} ({((stats.dist_govt_schools / stats.total_schools) * 100).toFixed(0)}%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E11D48', display: 'inline-block' }} />
              {labels.pvt} ({((stats.dist_private_schools / stats.total_schools) * 100).toFixed(0)}%)
            </span>
          </div>
        </div>
      )}

      {[
        [labels.litRate, fmtPct(stats.dist_literacy_pct), '#0D9488'],
        [labels.totalSchools, fmt(stats.total_schools), '#1E40AF'],
        [labels.govtSchools, fmt(stats.dist_govt_schools), '#16A34A'],
        [labels.pvtSchools, fmt(stats.dist_private_schools), '#E11D48'],
        [labels.population, fmtPop(stats.dist_population), '#1E293B'],
        [labels.sexRatio, stats.dist_sex_ratio ? `${Math.round(stats.dist_sex_ratio)}/1000` : '—', '#7C3AED'],
        [labels.scPop, fmtPct(stats.dist_sc_pct), '#475569'],
        [labels.stPop, fmtPct(stats.dist_st_pct), '#475569'],
      ].filter(([, val]) => val && val !== '—').map(([label, val, color]) => (
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
