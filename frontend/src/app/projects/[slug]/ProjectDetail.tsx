'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, GitFork, ExternalLink, Calendar, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Project } from '@/lib/types';

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

function truncated(text: string, limit: number, expanded: boolean) {
  if (!limit || limit <= 0 || expanded || text.length <= limit) return { display: text, isTruncated: false };
  return { display: text.slice(0, limit).trimEnd() + '…', isTruncated: true };
}

export default function ProjectDetail({ project }: { project: Project }) {
  const [problemExpanded, setProblemExpanded] = useState(false);
  const [resultExpanded, setResultExpanded]   = useState(false);

  const displayDate   = project.date || new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const bannerUrl     = project.bannerImageUrl || project.imageUrl || '';
  const overviewMd    = project.overviewMd || '';
  const overviewPlain = !overviewMd ? (project.longDesc || project.description || '') : '';
  const hasOverview   = !!(overviewMd || overviewPlain);
  const gallery       = [...(project.resultImages ?? []), ...(project.screenshots ?? [])];

  const prob = truncated(project.problem ?? '', project.problemCharLimit ?? 0, problemExpanded);
  const res  = truncated(project.result  ?? '', project.resultCharLimit  ?? 0, resultExpanded);

  return (
    <>
      <Navbar />

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          minHeight: bannerUrl ? '480px' : '260px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          overflow: 'hidden',
          marginTop: '60px',
        }}
      >
        {/* Background — image or colour */}
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={project.title}
            loading="eager"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-2)' }} />
        )}

        {/* Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: bannerUrl
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.52) 55%, rgba(0,0,0,0.86) 100%)'
            : 'none',
        }} />

        {/* Back button */}
        <div style={{ position: 'absolute', top: '1.5rem', left: 0, right: 0, padding: '0 2rem', maxWidth: '1100px', margin: '0 auto', zIndex: 10 }}>
          <Link
            href="/projects"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.38rem 0.875rem', borderRadius: '8px',
              border: `1px solid ${bannerUrl ? 'rgba(255,255,255,0.22)' : 'var(--border)'}`,
              background: bannerUrl ? 'rgba(255,255,255,0.1)' : 'var(--bg-card)',
              backdropFilter: 'blur(8px)',
              color: bannerUrl ? 'rgba(255,255,255,0.88)' : 'var(--text-2)',
              textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500,
              transition: 'background 0.15s',
            }}
          >
            <ArrowLeft size={13} /> All Projects
          </Link>
        </div>

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '0 2rem 2.5rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: EASE }}
          >
            {project.featured && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                padding: '0.18rem 0.55rem', borderRadius: '5px',
                background: 'rgba(245,158,11,0.18)', border: '1px solid rgba(245,158,11,0.32)',
                color: '#f59e0b', fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.07em',
                marginBottom: '0.875rem',
              }}>
                <Star size={9} fill="currentColor" /> FEATURED
              </span>
            )}

            <h1 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              fontWeight: 900, lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: bannerUrl ? '#fff' : 'var(--text)',
              marginBottom: '1.125rem', maxWidth: '760px',
            }}>
              {project.title}
            </h1>

            {/* Meta row */}
            <div className="hero-meta-row" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                fontSize: '0.82rem',
                color: bannerUrl ? 'rgba(255,255,255,0.65)' : 'var(--text-3)',
              }}>
                <Calendar size={12} />{displayDate}
              </span>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {(project.techStack ?? []).slice(0, 6).map((tech) => (
                  <span key={tech} style={{
                    padding: '0.18rem 0.55rem', borderRadius: '5px',
                    background: bannerUrl ? 'rgba(255,255,255,0.11)' : 'var(--bg-3)',
                    border: `1px solid ${bannerUrl ? 'rgba(255,255,255,0.18)' : 'var(--border)'}`,
                    color: bannerUrl ? 'rgba(255,255,255,0.82)' : 'var(--text-2)',
                    fontSize: '0.69rem', fontWeight: 500,
                    backdropFilter: bannerUrl ? 'blur(4px)' : 'none',
                  }}>
                    {tech}
                  </span>
                ))}
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.42rem 0.95rem', borderRadius: '8px',
                      border: `1px solid ${bannerUrl ? 'rgba(255,255,255,0.22)' : 'var(--border)'}`,
                      background: bannerUrl ? 'rgba(255,255,255,0.1)' : 'var(--bg-card)',
                      color: bannerUrl ? '#fff' : 'var(--text)',
                      backdropFilter: 'blur(6px)',
                      textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600,
                      transition: 'background 0.15s',
                    }}
                  >
                    <GitFork size={13} /> Code
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.42rem 0.95rem', borderRadius: '8px',
                      border: 'none', background: 'var(--accent)', color: '#fff',
                      textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600,
                    }}
                  >
                    <ExternalLink size={13} /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BODY
      ══════════════════════════════════════════ */}
      <main style={{ background: 'var(--bg)', paddingBottom: '6rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>

          {/* ── TWO-COLUMN: Overview + Meta sidebar ───── */}
          {hasOverview && (
            <div
              className="proj-body-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 280px',
                gap: '4.5rem',
                padding: '3.5rem 0 3rem',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {/* Left — overview */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                  Overview
                </p>
                {overviewMd ? (
                  <div className="md-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{overviewMd}</ReactMarkdown>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.975rem', color: 'var(--text-2)', lineHeight: 1.85, maxWidth: '680px' }}>
                    {overviewPlain}
                  </p>
                )}
              </motion.div>

              {/* Right — meta sidebar */}
              <motion.aside
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.08, ease: EASE }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingTop: '2.25rem' }}
              >
                {/* Tech stack */}
                <div>
                  <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Tech Stack</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {(project.techStack ?? []).map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>

                {/* Links */}
                {(project.githubUrl || project.liveUrl) && (
                  <div>
                    <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Links</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.83rem', color: 'var(--text-2)', textDecoration: 'none', transition: 'color 0.15s' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}>
                          <GitFork size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} /> Source Code
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.83rem', color: 'var(--text-2)', textDecoration: 'none', transition: 'color 0.15s' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}>
                          <ExternalLink size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Date */}
                <div>
                  <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Date</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-2)' }}>{displayDate}</p>
                </div>
              </motion.aside>
            </div>
          )}

          {/* ── PROBLEM → RESULT (storytelling) ───── */}
          {(prob.display || res.display) && (
            <div style={{ padding: hasOverview ? '3.5rem 0' : '3.5rem 0 0' }}>

              {prob.display && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, ease: EASE }}
                  style={{ marginBottom: res.display ? '3rem' : 0 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#ef4444', background: '#ef444412', padding: '0.2rem 0.55rem', borderRadius: '4px', letterSpacing: '0.07em', flexShrink: 0 }}>
                      PROBLEM
                    </span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                  </div>
                  <p style={{ fontSize: '1rem', color: 'var(--text-2)', lineHeight: 1.85, maxWidth: '720px' }}>
                    {prob.display}
                  </p>
                  {prob.isTruncated && (
                    <button onClick={() => setProblemExpanded(true)}
                      style={{ marginTop: '0.625rem', background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                      Read more
                    </button>
                  )}
                </motion.div>
              )}

              {res.display && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.07, ease: EASE }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#10b981', background: '#10b98112', padding: '0.2rem 0.55rem', borderRadius: '4px', letterSpacing: '0.07em', flexShrink: 0 }}>
                      RESULT
                    </span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                  </div>
                  <p style={{ fontSize: '1rem', color: 'var(--text-2)', lineHeight: 1.85, maxWidth: '720px' }}>
                    {res.display}
                  </p>
                  {res.isTruncated && (
                    <button onClick={() => setResultExpanded(true)}
                      style={{ marginTop: '0.625rem', background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                      Read more
                    </button>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {/* ── GALLERY ───────────────────────────────── */}
          {gallery.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease: EASE }}
              style={{ borderTop: '1px solid var(--border)', paddingTop: '3.5rem' }}
            >
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                Gallery
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: gallery.length === 1
                  ? '1fr'
                  : 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '0.875rem',
              }}>
                {gallery.map((src, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.24), ease: EASE }}
                    style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)', lineHeight: 0 }}
                  >
                    <img
                      src={src}
                      alt={`${project.title} — image ${i + 1}`}
                      style={{ width: '100%', display: 'block' }}
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 860px) {
          .proj-body-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .hero-meta-row  { gap: 0.625rem !important; }
        }

        /* ── Markdown body ─────────────────────────── */
        .md-body {
          color: var(--text-2);
          font-size: 0.95rem;
          line-height: 1.85;
        }
        .md-body > * + * { margin-top: 1rem; }
        .md-body h1, .md-body h2, .md-body h3, .md-body h4 {
          color: var(--text);
          font-weight: 700;
          letter-spacing: -0.01em;
          margin-top: 2rem;
          margin-bottom: 0.625rem;
          line-height: 1.25;
        }
        .md-body h1 { font-size: 1.45rem; }
        .md-body h2 { font-size: 1.15rem; }
        .md-body h3 { font-size: 1rem; }
        .md-body h4 { font-size: 0.9rem; }
        .md-body p  { margin: 0 0 0.875rem; }
        .md-body ul, .md-body ol { padding-left: 1.5rem; margin: 0 0 0.875rem; }
        .md-body li { margin-bottom: 0.3rem; }
        .md-body li + li { margin-top: 0.2rem; }
        .md-body strong { color: var(--text); font-weight: 700; }
        .md-body em { font-style: italic; }
        .md-body a  { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; }
        .md-body code {
          font-family: var(--font-mono);
          font-size: 0.82em;
          background: var(--bg-3);
          border: 1px solid var(--border);
          padding: 0.1em 0.38em;
          border-radius: 4px;
          color: var(--accent);
        }
        .md-body pre {
          background: var(--bg-3);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 1.25rem 1.5rem;
          overflow-x: auto;
          margin: 1.25rem 0;
        }
        .md-body pre code {
          background: none;
          border: none;
          padding: 0;
          color: var(--text);
          font-size: 0.83rem;
          line-height: 1.7;
        }
        .md-body blockquote {
          border-left: 3px solid var(--accent);
          padding: 0.125rem 0 0.125rem 1.125rem;
          margin: 0 0 0.875rem;
          color: var(--text-3);
          font-style: italic;
        }
        .md-body hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 1.75rem 0;
        }
        .md-body table {
          width: 100%;
          border-collapse: collapse;
          margin: 0.875rem 0;
          font-size: 0.875rem;
        }
        .md-body th {
          text-align: left;
          padding: 0.5rem 0.75rem;
          background: var(--bg-3);
          border: 1px solid var(--border);
          color: var(--text);
          font-weight: 600;
        }
        .md-body td {
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--border);
        }
      `}</style>
    </>
  );
}
