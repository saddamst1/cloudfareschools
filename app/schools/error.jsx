'use client';
import Link from 'next/link';

export default function SchoolsError({ error, reset }) {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        background: 'white', border: '1px solid #E2E8F0', borderRadius: 16,
        padding: '40px 32px', maxWidth: 500, width: '100%', textAlign: 'center',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏫</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>
          Page temporarily unavailable
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 24 }}>
          We're having trouble loading this page right now. Please try again — it usually works on the second attempt.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => reset ? reset() : window.location.reload()}
            style={{
              background: '#1E40AF', color: 'white', border: 'none', padding: '10px 20px',
              borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem'
            }}
          >
            🔄 Try Again
          </button>
          <Link href="/schools" style={{
            background: '#F1F5F9', color: '#475569', padding: '10px 20px',
            borderRadius: 8, fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
            display: 'inline-block'
          }}>
            ← All States
          </Link>
        </div>
      </div>
    </div>
  );
}
