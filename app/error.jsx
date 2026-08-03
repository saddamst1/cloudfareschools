'use client';

export default function Error({ error, reset }) {
  return (
    <div style={{ padding: '60px 24px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', color: '#1e293b', marginBottom: '12px' }}>Unable to load page content</h2>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>Please try again or refresh the page.</p>
      <button
        onClick={() => reset ? reset() : window.location.reload()}
        style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
      >
        Retry
      </button>
    </div>
  );
}
