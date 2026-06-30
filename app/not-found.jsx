import Link from 'next/link';

export const metadata = {
  title: '404 — Page Not Found | SchoolsPedia',
  description: 'This page does not exist. Search for any school in India by name, UDISE code, village, or district.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '4rem',
          fontWeight: 900,
          color: '#1E40AF',
          fontFamily: 'var(--font-heading), sans-serif',
          lineHeight: 1,
          marginBottom: 8,
        }}>404</div>

        <h1 style={{
          fontSize: '1.4rem',
          fontWeight: 700,
          color: '#1E293B',
          marginBottom: 12,
        }}>
          Page not found
        </h1>

        <p style={{
          fontSize: '0.925rem',
          color: '#64748B',
          lineHeight: 1.7,
          maxWidth: 420,
          marginBottom: 32,
        }}>
          This page does not exist or was removed. If you were looking for a school, use the search below.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            href="/"
            style={{
              background: '#1E40AF',
              color: 'white',
              padding: '10px 22px',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Go to Homepage
          </Link>
          <Link
            href="/schools"
            style={{
              background: 'white',
              color: '#1E40AF',
              border: '1.5px solid #1E40AF',
              padding: '10px 22px',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Browse All States
          </Link>
        </div>
      </div>
    </>
  );
}
