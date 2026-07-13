export default function Loading() {
  return (
    <main style={{
      minHeight: '100vh', background: 'var(--bg)', padding: '6rem 1.5rem',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem',
    }}>
      <div style={{ width: 'min(720px, 100%)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ height: '2.25rem', width: '55%', borderRadius: '8px', background: 'var(--bg-2)' }} />
        <div style={{ height: '1rem', width: '80%', borderRadius: '6px', background: 'var(--bg-2)' }} />
        <div style={{ height: '1rem', width: '70%', borderRadius: '6px', background: 'var(--bg-2)' }} />
        <div style={{ height: '14rem', width: '100%', borderRadius: '16px', background: 'var(--bg-2)', marginTop: '1rem' }} />
      </div>
    </main>
  );
}
