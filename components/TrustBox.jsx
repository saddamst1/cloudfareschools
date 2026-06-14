import Link from 'next/link';

export default function TrustBox() {
  return (
    <section style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', padding: '36px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '24px 28px', display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* Avatar branding */}
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#EFF6FF', border: '2px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.05rem', fontWeight: 800, color: '#1E40AF', flexShrink: 0, fontFamily: 'Sora, sans-serif' }}>
            SP
          </div>
          
          {/* Content details */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>SchoolsPedia Editorial Team</h3>
              <span style={{ background: '#ECFDF5', color: '#047857', fontSize: '0.725rem', fontWeight: 750, padding: '3px 10px', borderRadius: 99, border: '1px solid #A7F3D0' }}>
                ✅ Sourced from UDISE+ Records
              </span>
            </div>
            
            <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.7, marginTop: 10, marginBottom: 0 }}>
              The SchoolsPedia team comprises education researchers, data analysts, and writers working to make school records simple and accessible. All statistics, UDISE codes, and facility reports are compiled directly from public releases of the **UDISE+ registry** (Ministry of Education, Government of India) and demographic data from the **Census of India**. We sync and verify updates periodically against official records to keep the directory reliable.
            </p>
            
            {/* Badges */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
              {['🗄️ Public UDISE+ Data Sync', '🛡️ Ministry of Education Data', '🔄 Periodically Verified', '🚩 Report Incorrect Data'].map(tag => {
                if (tag === '🚩 Report Incorrect Data') {
                  return (
                    <Link key={tag} href="/contact" style={{ background: '#FFF7ED', color: '#C2410C', fontSize: '0.7rem', padding: '4px 12px', borderRadius: 99, border: '1px solid #FDBA74', textDecoration: 'none', fontWeight: 600 }}>
                      {tag}
                    </Link>
                  );
                }
                return (
                  <span key={tag} style={{ background: '#F1F5F9', color: '#475569', fontSize: '0.7rem', padding: '4px 12px', borderRadius: 99, border: '1px solid #E2E8F0', fontWeight: 500 }}>
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
