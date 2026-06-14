import Link from 'next/link';

const stateAbbr = {
  'Uttar Pradesh': 'UP', 'Maharashtra': 'MH', 'Madhya Pradesh': 'MP', 'Rajasthan': 'RJ',
  'West Bengal': 'WB', 'Karnataka': 'KA', 'Gujarat': 'GJ', 'Bihar': 'BR',
  'Andhra Pradesh': 'AP', 'Tamil Nadu': 'TN', 'Odisha': 'OD', 'Telangana': 'TS',
  'Jharkhand': 'JH', 'Kerala': 'KL', 'Assam': 'AS', 'Haryana': 'HR',
  'Chhattisgarh': 'CG', 'Punjab': 'PB', 'Delhi': 'DL', 'Uttarakhand': 'UK',
  'Himachal Pradesh': 'HP', 'Jammu & Kashmir': 'JK', 'Goa': 'GA',
  'Manipur': 'MN', 'Meghalaya': 'ML', 'Tripura': 'TR', 'Nagaland': 'NL',
  'Mizoram': 'MZ', 'Arunachal Pradesh': 'AR', 'Sikkim': 'SK', 'Ladakh': 'LA',
  'Puducherry': 'PY', 'Chandigarh': 'CH', 'Lakshadweep': 'LD',
  'Andaman & Nicobar Islands': 'AN', 'Dadra & Nagar Haveli and Daman & Diu': 'DN',
};

const colors = [
  { bg: '#EFF6FF', color: '#1E40AF' }, { bg: '#F0FDFA', color: '#0F766E' },
  { bg: '#FFF7ED', color: '#C2410C' }, { bg: '#F5F3FF', color: '#6D28D9' },
  { bg: '#FFF1F2', color: '#BE123C' }, { bg: '#F0FDF4', color: '#166534' },
];

export default function StateCard({ state, index = 0 }) {
  const clr = colors[index % colors.length];
  const abbr = stateAbbr[state.state_name] || state.state_name.slice(0, 2).toUpperCase();
  const count = state.total_schools?.toLocaleString('en-IN') || '0';

  return (
    <Link href={`/schools/${state.state_slug}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ padding: '14px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: clr.bg, color: clr.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, marginBottom: 8 }}>
          {abbr}
        </div>
        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', marginBottom: 3 }}>{state.state_name}</div>
        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{count} schools</div>
        <div style={{ fontSize: '0.75rem', color: '#3B82F6', marginTop: 6, fontWeight: 500 }}>View schools →</div>
      </div>
    </Link>
  );
}
