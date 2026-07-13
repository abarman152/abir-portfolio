import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1rem',
      background: 'var(--bg)', color: 'var(--text)', padding: '2rem', textAlign: 'center',
    }}>
      <p style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--accent)' }}>404</p>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Page not found</h1>
      <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', maxWidth: '380px' }}>
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        href="/"
        style={{
          marginTop: '0.5rem', padding: '0.6rem 1.4rem', borderRadius: '10px',
          background: 'var(--accent)', color: '#fff', textDecoration: 'none',
          fontSize: '0.875rem', fontWeight: 600,
        }}
      >
        Back to home
      </Link>
    </main>
  );
}
