'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, GitFork, ExternalLink, Calendar, Star, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Project } from '@/lib/types';

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

function applyLimit(text: string, limit: number, expanded: boolean) {
  if (!limit || limit <= 0 || expanded || text.length <= limit) return { text, truncated: false };
  return { text: text.slice(0, limit).trimEnd() + '…', truncated: true };
}

/* ─── Shared markdown renderer ─────────────────────────── */
function Md({ children, className = 'md-body' }: { children: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

/* ─── Lightbox ──────────────────────────────────────────── */
function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: '1.25rem', right: '1.25rem',
          width: 40, height: 40, borderRadius: '10px',
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
          color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)')}
      >
        <X size={18} />
      </button>

      {/* Counter */}
      <div style={{
        position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', fontWeight: 500,
        letterSpacing: '0.04em',
      }}>
        {index + 1} / {images.length}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          style={{
            position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)',
            width: 44, height: 44, borderRadius: '12px',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)')}
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Image */}
      <motion.img
        key={index}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2, ease: EASE }}
        src={images[index]}
        alt={`Image ${index + 1}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '90vw', maxHeight: '85vh',
          objectFit: 'contain', borderRadius: '12px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      />

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          style={{
            position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)',
            width: 44, height: 44, borderRadius: '12px',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)')}
        >
          <ChevronRight size={22} />
        </button>
      )}
    </motion.div>
  );
}

/* ─── Main component ────────────────────────────────────── */
export default function ProjectDetail({ project }: { project: Project }) {
  const [problemExpanded, setProblemExpanded] = useState(false);
  const [resultExpanded,  setResultExpanded]  = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const displayDate = project.date || new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const bannerUrl   = project.bannerImageUrl || project.imageUrl || '';
  const gallery     = [...(project.resultImages ?? []), ...(project.screenshots ?? [])];

  const overviewContent = project.overviewMd || project.longDesc || project.description || '';
  const hasOverview     = overviewContent.trim().length > 0;
  const hasProblem      = (project.problem ?? '').trim().length > 0;
  const hasResult       = (project.result  ?? '').trim().length > 0;

  const prob = applyLimit(project.problem ?? '', project.problemCharLimit ?? 0, problemExpanded);
  const res  = applyLimit(project.result  ?? '', project.resultCharLimit  ?? 0, resultExpanded);

  /* keyboard nav for lightbox */
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prevImage     = useCallback(() => setLightbox((p) => ((p ?? 0) - 1 + gallery.length) % gallery.length), [gallery.length]);
  const nextImage     = useCallback(() => setLightbox((p) => ((p ?? 0) + 1) % gallery.length), [gallery.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')   prevImage();
      if (e.key === 'ArrowRight')  nextImage();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, closeLightbox, prevImage, nextImage]);

  /* lock scroll when lightbox open */
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  return (
    <>
      <Navbar />

      {/* ══════════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        minHeight: bannerUrl ? '480px' : '260px',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        overflow: 'hidden',
        marginTop: '60px',
      }}>
        {bannerUrl ? (
          <img src={bannerUrl} alt={project.title} loading="eager"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-2)' }} />
        )}

        <div style={{
          position: 'absolute', inset: 0,
          background: bannerUrl
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.52) 55%, rgba(0,0,0,0.88) 100%)'
            : 'none',
        }} />

        {/* Back */}
        <div style={{ position: 'absolute', top: '1.5rem', left: 0, right: 0, padding: '0 2rem', maxWidth: '1100px', margin: '0 auto', zIndex: 10 }}>
          <Link href="/projects" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.38rem 0.875rem', borderRadius: '8px',
            border: `1px solid ${bannerUrl ? 'rgba(255,255,255,0.22)' : 'var(--border)'}`,
            background: bannerUrl ? 'rgba(255,255,255,0.1)' : 'var(--bg-card)',
            backdropFilter: 'blur(8px)',
            color: bannerUrl ? 'rgba(255,255,255,0.88)' : 'var(--text-2)',
            textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500,
          }}>
            <ArrowLeft size={13} /> All Projects
          </Link>
        </div>

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '0 2rem 2.5rem' }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease: EASE }}>
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
              fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em',
              color: bannerUrl ? '#fff' : 'var(--text)',
              marginBottom: '1.125rem', maxWidth: '760px',
            }}>
              {project.title}
            </h1>

            <div className="hero-meta-row" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: bannerUrl ? 'rgba(255,255,255,0.65)' : 'var(--text-3)' }}>
                <Calendar size={12} />{displayDate}
              </span>

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

              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.42rem 0.95rem', borderRadius: '8px', border: `1px solid ${bannerUrl ? 'rgba(255,255,255,0.22)' : 'var(--border)'}`, background: bannerUrl ? 'rgba(255,255,255,0.1)' : 'var(--bg-card)', color: bannerUrl ? '#fff' : 'var(--text)', backdropFilter: 'blur(6px)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, transition: 'background 0.15s' }}>
                    <GitFork size={13} /> Code
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.42rem 0.95rem', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: '#fff', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}>
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

          {/* ── 1. PROBLEM ──────────────────────────── */}
          {hasProblem && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.35, ease: EASE }}
              style={{ padding: '3.5rem 0', borderBottom: '1px solid var(--border)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#ef4444', background: '#ef444412', padding: '0.2rem 0.55rem', borderRadius: '4px', letterSpacing: '0.07em', flexShrink: 0 }}>
                  PROBLEM
                </span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              </div>
              <div style={{ maxWidth: '740px' }}>
                <Md>{prob.text}</Md>
              </div>
              {prob.truncated && (
                <button onClick={() => setProblemExpanded(true)}
                  style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                  Read more
                </button>
              )}
            </motion.div>
          )}

          {/* ── 2. RESULT ───────────────────────────── */}
          {hasResult && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.35, ease: EASE }}
              style={{ padding: '3.5rem 0', borderBottom: hasOverview || gallery.length > 0 ? '1px solid var(--border)' : 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#10b981', background: '#10b98112', padding: '0.2rem 0.55rem', borderRadius: '4px', letterSpacing: '0.07em', flexShrink: 0 }}>
                  RESULT
                </span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              </div>
              <div style={{ maxWidth: '740px' }}>
                <Md>{res.text}</Md>
              </div>
              {res.truncated && (
                <button onClick={() => setResultExpanded(true)}
                  style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                  Read more
                </button>
              )}
            </motion.div>
          )}

          {/* ── 3. OVERVIEW (two-col: content + meta) ── */}
          {hasOverview && (
            <div className="proj-body-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '4.5rem', padding: '3.5rem 0', borderBottom: gallery.length > 0 ? '1px solid var(--border)' : 'none' }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.35, ease: EASE }}
              >
                <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                  Overview
                </p>
                <Md>{overviewContent}</Md>
              </motion.div>

              {/* Sidebar */}
              <motion.aside
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.08, ease: EASE }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingTop: '2.25rem' }}
              >
                <div>
                  <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Tech Stack</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {(project.techStack ?? []).map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>

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

                <div>
                  <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Date</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-2)' }}>{displayDate}</p>
                </div>
              </motion.aside>
            </div>
          )}

          {/* ── 4. GALLERY ──────────────────────────── */}
          {gallery.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.35, ease: EASE }}
              style={{ paddingTop: '3.5rem' }}
            >
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                Gallery
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: gallery.length === 1 ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '0.875rem',
              }}>
                {gallery.map((src, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.24), ease: EASE }}
                    onClick={() => setLightbox(i)}
                    style={{
                      borderRadius: '10px', overflow: 'hidden',
                      border: '1px solid var(--border)',
                      lineHeight: 0, cursor: 'zoom-in',
                      background: 'none', padding: 0,
                      display: 'block', width: '100%',
                      transition: 'border-color 0.18s, transform 0.18s cubic-bezier(0.25,0.46,0.45,0.94)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)';
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1.015)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                    }}
                  >
                    <img src={src} alt={`${project.title} — image ${i + 1}`}
                      style={{ width: '100%', display: 'block' }} loading="lazy" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </main>

      <Footer />

      {/* ── Lightbox ──────────────────────────────── */}
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            images={gallery}
            index={lightbox}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 860px) {
          .proj-body-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .hero-meta-row  { gap: 0.625rem !important; }
        }

        /* ─── Markdown body ──────────────────────── */
        .md-body {
          color: var(--text-2);
          font-size: 0.975rem;
          line-height: 1.85;
        }
        .md-body > * + * { margin-top: 0.875rem; }
        .md-body h1, .md-body h2, .md-body h3, .md-body h4 {
          color: var(--text);
          font-weight: 700;
          letter-spacing: -0.015em;
          line-height: 1.25;
          margin: 1.75rem 0 0.625rem;
        }
        .md-body h1 { font-size: 1.45rem; }
        .md-body h2 { font-size: 1.15rem; }
        .md-body h3 { font-size: 1rem; }
        .md-body h4 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-3); }
        .md-body p  { margin: 0 0 0.875rem; }
        .md-body ul, .md-body ol { padding-left: 1.5rem; margin: 0 0 0.875rem; }
        .md-body ul { list-style: disc; }
        .md-body ol { list-style: decimal; }
        .md-body li { margin-bottom: 0.35rem; padding-left: 0.25rem; }
        .md-body li::marker { color: var(--accent); }
        .md-body strong { color: var(--text); font-weight: 700; }
        .md-body em { font-style: italic; color: var(--text); }
        .md-body a { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; }
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
          background: none; border: none; padding: 0;
          color: var(--text); font-size: 0.83rem; line-height: 1.7;
        }
        .md-body blockquote {
          border-left: 3px solid var(--accent);
          padding: 0.25rem 0 0.25rem 1.125rem;
          margin: 0 0 0.875rem;
          color: var(--text-3); font-style: italic;
        }
        .md-body hr { border: none; border-top: 1px solid var(--border); margin: 1.75rem 0; }
        .md-body table { width: 100%; border-collapse: collapse; margin: 0.875rem 0; font-size: 0.875rem; }
        .md-body th { text-align: left; padding: 0.5rem 0.75rem; background: var(--bg-3); border: 1px solid var(--border); color: var(--text); font-weight: 600; }
        .md-body td { padding: 0.5rem 0.75rem; border: 1px solid var(--border); }
      `}</style>
    </>
  );
}
