'use client';

import { motion } from 'framer-motion';
import { Calendar, Download, ExternalLink, FileText, Mail, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { fmtFullDate } from '@/lib/date';
import { isValidResumeUrl, resumeDownloadUrl, useResume } from '@/lib/resume';

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

const primaryBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
  padding: '0.7rem 1.5rem',
  borderRadius: '9px', border: 'none',
  background: 'var(--accent)', color: 'white',
  fontSize: '0.9rem', fontWeight: 600,
  textDecoration: 'none', cursor: 'pointer',
  transition: 'opacity 0.15s, transform 0.15s',
};

const outlineBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
  padding: '0.7rem 1.5rem',
  borderRadius: '9px',
  border: '1px solid var(--border)',
  background: 'transparent', color: 'var(--text)',
  fontSize: '0.9rem', fontWeight: 500,
  textDecoration: 'none', cursor: 'pointer',
  transition: 'border-color 0.15s, transform 0.15s',
};

function liftOn(e: React.SyntheticEvent<HTMLElement>) {
  const el = e.currentTarget as HTMLElement;
  el.style.transform = 'translateY(-1px)';
  if (el.style.background === 'transparent') el.style.borderColor = 'var(--border-2)';
  else el.style.opacity = '0.88';
}

function liftOff(e: React.SyntheticEvent<HTMLElement>) {
  const el = e.currentTarget as HTMLElement;
  el.style.transform = 'none';
  if (el.style.background === 'transparent') el.style.borderColor = 'var(--border)';
  else el.style.opacity = '1';
}

function PageHeader({ subtitle }: { subtitle: string }) {
  return (
    <section style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '3.5rem 0 3rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
        <motion.span
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}
          style={{ display: 'inline-block', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.875rem' }}
        >
          Portfolio · Resume
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.06, ease: EASE }}
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '0.75rem' }}
        >
          Resume
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.12, ease: EASE }}
          style={{ fontSize: '0.95rem', color: 'var(--text-2)', lineHeight: 1.7, maxWidth: '520px' }}
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
}

function StatusCard({ icon, title, message, children }: {
  icon: React.ReactNode; title: string; message: string; children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}
      className="card"
      style={{ maxWidth: '480px', margin: '0 auto', padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem' }}
      role="status"
    >
      <div style={{
        width: 52, height: 52, borderRadius: '14px',
        background: 'var(--accent-dim)', color: 'var(--accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>{title}</h2>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.7 }}>{message}</p>
      {children}
    </motion.div>
  );
}

function PreviewFallback({ message }: { message: string }) {
  return (
    <div
      role="status"
      style={{
        height: 'min(40vh, 420px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '0.75rem', padding: '2rem', textAlign: 'center',
      }}
    >
      <FileText size={28} style={{ color: 'var(--text-3)' }} aria-hidden="true" />
      <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.7, maxWidth: '320px' }}>
        {message}
      </p>
    </div>
  );
}

const PREVIEW_TIMEOUT_MS = 15000;

function ResumePreview({ previewUrl }: { previewUrl: string }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');

  useEffect(() => {
    if (status !== 'loading') return;
    const timer = setTimeout(
      () => setStatus((s) => (s === 'loading' ? 'failed' : s)),
      PREVIEW_TIMEOUT_MS
    );
    return () => clearTimeout(timer);
  }, [status]);

  // The iframe fires `load` even for network-error pages, so a blank panel
  // would otherwise read as "ready". An opaque no-cors probe rejects only on
  // genuine network failures (DNS, refused connection), catching that case.
  useEffect(() => {
    if (!isValidResumeUrl(previewUrl)) return;
    let active = true;
    fetch(previewUrl, { method: 'HEAD', mode: 'no-cors' }).catch(() => {
      if (active) setStatus('failed');
    });
    return () => {
      active = false;
    };
  }, [previewUrl]);

  if (!isValidResumeUrl(previewUrl)) {
    return <PreviewFallback message="No inline preview has been set up yet. Use the buttons to open or download the resume." />;
  }
  if (status === 'failed') {
    return <PreviewFallback message="The preview couldn't be loaded. Use the buttons to open or download the resume." />;
  }

  return (
    <div style={{ position: 'relative' }}>
      {status === 'loading' && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            background: 'var(--bg-3)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      )}
      <iframe
        src={previewUrl}
        title="Resume preview"
        loading="lazy"
        allow="autoplay"
        onLoad={() => setStatus('ready')}
        onError={() => setStatus('failed')}
        style={{ width: '100%', height: 'min(65vh, 720px)', border: 'none', display: 'block', background: 'var(--bg-3)' }}
      />
    </div>
  );
}

export default function ResumeClient() {
  const { hero, loading, error, retry } = useResume();

  const resumeUrl = hero?.resumeUrl ?? '';
  const hasResume = isValidResumeUrl(resumeUrl);
  const subtitle = hero?.name
    ? `${hero.name} — ${Array.isArray(hero.roles) && hero.roles.length > 0 ? hero.roles.join(' · ') : 'Data Scientist'}`
    : 'Professional experience, skills, and education in one document.';

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '60px', minHeight: '100vh', background: 'var(--bg)' }}>
        <PageHeader subtitle={subtitle} />

        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>
          {loading ? (
            <div className="resume-grid" aria-busy="true" aria-label="Loading resume">
              <div style={{ height: 'min(65vh, 720px)', borderRadius: '16px', background: 'var(--bg-2)', border: '1px solid var(--border)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ height: '260px', borderRadius: '16px', background: 'var(--bg-2)', border: '1px solid var(--border)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            </div>
          ) : error ? (
            <StatusCard
              icon={<RefreshCw size={22} />}
              title="Couldn't load the resume"
              message="Something went wrong while fetching the resume. Check your connection and try again."
            >
              <button onClick={retry} style={{ ...primaryBtn, marginTop: '0.25rem' }} onMouseEnter={liftOn} onMouseLeave={liftOff} onFocus={liftOn} onBlur={liftOff}>
                <RefreshCw size={15} /> Try again
              </button>
            </StatusCard>
          ) : !hasResume ? (
            <StatusCard
              icon={<FileText size={22} />}
              title="Resume not available yet"
              message="The resume hasn't been published here yet. Feel free to reach out and I'll send over the latest copy."
            >
              <Link href="/#contact" style={{ ...outlineBtn, marginTop: '0.25rem' }} onMouseEnter={liftOn} onMouseLeave={liftOff} onFocus={liftOn} onBlur={liftOff}>
                <Mail size={15} /> Contact me
              </Link>
            </StatusCard>
          ) : (
            <div className="resume-grid">
              {/* ── Preview ── */}
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}
                className="card"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <ResumePreview previewUrl={hero?.resumePreviewUrl ?? ''} />
              </motion.div>

              {/* ── Actions & metadata ── */}
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08, ease: EASE }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              >
                <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>Get the resume</h2>
                  <a
                    href={resumeDownloadUrl(resumeUrl)}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download resume"
                    style={primaryBtn}
                    onMouseEnter={liftOn} onMouseLeave={liftOff} onFocus={liftOn} onBlur={liftOff}
                  >
                    <Download size={15} /> Download Resume
                  </a>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open resume in a new tab"
                    style={outlineBtn}
                    onMouseEnter={liftOn} onMouseLeave={liftOff} onFocus={liftOn} onBlur={liftOff}
                  >
                    <ExternalLink size={15} /> Open in New Tab
                  </a>
                </div>

                {hero?.updatedAt && (
                  <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={13} style={{ color: 'var(--text-3)', flexShrink: 0 }} aria-hidden="true" />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>
                      Last updated {fmtFullDate(hero.updatedAt)}
                    </span>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </section>
      </main>
      <Footer />
      <style>{`
        @keyframes pulse { 0%,100% { opacity:0.5 } 50% { opacity:1 } }
        .resume-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 1.5rem; align-items: start; }
        @media (max-width: 768px) { .resume-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
