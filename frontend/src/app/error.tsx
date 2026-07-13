'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1rem',
      background: 'var(--bg)', color: 'var(--text)', padding: '2rem', textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Something went wrong</h1>
      <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', maxWidth: '380px' }}>
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        style={{
          marginTop: '0.5rem', padding: '0.6rem 1.4rem', borderRadius: '10px',
          background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer',
          fontSize: '0.875rem', fontWeight: 600,
        }}
      >
        Try again
      </button>
    </main>
  );
}
