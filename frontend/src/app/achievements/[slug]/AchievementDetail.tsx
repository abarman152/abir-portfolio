'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, Star, Trophy, GraduationCap, Zap, Users, X, ChevronLeft, ChevronRight, Building2, Maximize2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Achievement } from '@/lib/types';
import { fmtFullDate } from '@/lib/date';

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

const TYPE_ICON: Record<string, React.ElementType> = {
  Award: Trophy,
  Academic: GraduationCap,
  Competition: Star,
  Professional: Users,
  Other: Zap,
};

const TYPE_COLOR: Record<string, string> = {
  Award: 'var(--accent)',
  Academic: '#8b5cf6',
  Competition: '#f59e0b',
  Professional: '#06b6d4',
  Other: 'var(--accent)',
};

function Md({ children }: { children: string }) {
  return (
    <div className="md-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}


function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
      <span style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--accent)', background: 'rgba(99,102,241,0.1)', padding: '0.2rem 0.55rem', borderRadius: '4px', letterSpacing: '0.07em', flexShrink: 0 }}>
        {children}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
    </div>
  );
}

/* ── Sticky Gallery (Right Column) ──────────────────────────── */
function StickyGallery({ images, title }: { images: string[]; title: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightbox, setLightbox]   = useState<number | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (lightbox === null) return;
    if (e.key === 'Escape') setLightbox(null);
    if (e.key === 'ArrowRight') setLightbox((lightbox + 1) % images.length);
    if (e.key === 'ArrowLeft') setLightbox((lightbox - 1 + images.length) % images.length);
  }, [lightbox, images.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!images.length) return null;

  return (
    <>
      <div style={{ position: 'sticky', top: '84px' }}>
        {/* Hero / main preview image */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: EASE }}
          style={{ position: 'relative', marginBottom: '0.75rem' }}
        >
          <button
            onClick={() => setLightbox(activeIdx)}
            style={{
              display: 'block', width: '100%', padding: 0,
              border: '1px solid var(--border)', borderRadius: '14px',
              overflow: 'hidden', cursor: 'pointer', background: 'var(--bg-2)',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
            aria-label="View fullscreen"
          >
            <img
              key={activeIdx}
              src={images[activeIdx]}
              alt={`${title} — image ${activeIdx + 1}`}
              style={{
                width: '100%', aspectRatio: '4/3', objectFit: 'cover',
                display: 'block',
              }}
            />
          </button>

          {/* Expand indicator */}
          <div style={{
            position: 'absolute', bottom: '0.75rem', right: '0.75rem',
            width: 32, height: 32, borderRadius: '8px',
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <Maximize2 size={14} color="white" />
          </div>
        </motion.div>

        {/* Thumbnail grid */}
        {images.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15, ease: EASE }}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(images.length, 4)}, 1fr)`,
              gap: '0.5rem',
            }}
          >
            {images.map((url, i) => (
              <button
                key={url}
                onClick={() => setActiveIdx(i)}
                style={{
                  padding: 0,
                  border: i === activeIdx ? '2px solid var(--accent)' : '1px solid var(--border)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: 'var(--bg-2)',
                  opacity: i === activeIdx ? 1 : 0.7,
                  transition: 'opacity 0.15s, border-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (i !== activeIdx) (e.currentTarget as HTMLElement).style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  if (i !== activeIdx) (e.currentTarget as HTMLElement).style.opacity = '0.7';
                }}
                aria-label={`View image ${i + 1}`}
              >
                <img
                  src={url}
                  alt={`${title} — thumbnail ${i + 1}`}
                  style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                />
              </button>
            ))}
          </motion.div>
        )}

        {/* Image count */}
        {images.length > 1 && (
          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-3)', marginTop: '0.625rem' }}>
            {activeIdx + 1} of {images.length} images
          </p>
        )}
      </div>

      {/* ── Fullscreen Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightbox(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 300,
              background: 'rgba(0,0,0,0.9)',
              backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              style={{
                position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 301,
                width: 40, height: 40, borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                color: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)')}
            >
              <X size={18} />
            </button>

            {/* Prev */}
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + images.length) % images.length); }}
                style={{
                  position: 'absolute', left: '1.5rem', zIndex: 301,
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white', cursor: 'pointer',
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
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={images[lightbox]}
              alt={`${title} — image ${lightbox + 1}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '90vw', maxHeight: '85vh',
                objectFit: 'contain', borderRadius: '12px',
                cursor: 'default',
              }}
            />

            {/* Next */}
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % images.length); }}
                style={{
                  position: 'absolute', right: '1.5rem', zIndex: 301,
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)')}
              >
                <ChevronRight size={22} />
              </button>
            )}

            {/* Index indicator */}
            {images.length > 1 && (
              <div style={{
                position: 'absolute', bottom: '1.5rem',
                padding: '0.4rem 1rem', borderRadius: '20px',
                background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'white', fontSize: '0.82rem', fontWeight: 600,
              }}>
                {lightbox + 1} / {images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Main Detail Component ─────────────────────────────────── */
export default function AchievementDetail({ item }: { item: Achievement }) {
  const hasOverview    = (item.overviewMd   ?? '').trim().length > 0;
  const hasDescription = (item.description  ?? '').trim().length > 0;
  const hasTags        = (item.tags         ?? []).length > 0;
  const hasImages      = (item.images       ?? []).length > 0;

  const Icon  = TYPE_ICON[item.category] || Trophy;
  const color = item.featured ? '#f59e0b' : (TYPE_COLOR[item.category] || 'var(--accent)');

  return (
    <>
      <Navbar />

      {/* ── Hero Header (full-width) ── */}
      <section style={{
        paddingTop: '60px',
        background: 'var(--bg-2)', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 2rem 3rem' }}>
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <Link href="/achievements" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-3)',
              textDecoration: 'none', transition: 'color 0.15s', marginBottom: '1.75rem',
            }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--accent)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-3)')}
            >
              <ArrowLeft size={14} /> Back to Achievements
            </Link>
          </motion.div>

          {/* Icon + Title row */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.06, ease: EASE }}
              style={{
                width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                background: color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 0 3px var(--bg-2), 0 0 0 5px ${color}33`,
              }}
            >
              <Icon size={22} color="white" />
            </motion.div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Badges row */}
              <motion.div
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08, ease: EASE }}
                style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}
              >
                {item.featured && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                    padding: '0.2rem 0.55rem', borderRadius: '5px',
                    background: '#f59e0b15', border: '1px solid #f59e0b33',
                    color: '#f59e0b', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em',
                  }}>
                    <Star size={9} fill="currentColor" /> FEATURED
                  </span>
                )}
                <span style={{
                  padding: '0.2rem 0.55rem', borderRadius: '5px',
                  background: 'var(--accent-dim)', border: '1px solid var(--border)',
                  color, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em',
                }}>
                  {item.category}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 900,
                  color: 'var(--text)', letterSpacing: '-0.025em', lineHeight: 1.2,
                  marginBottom: '0.5rem',
                }}
              >
                {item.title}
              </motion.h1>

              {/* Meta row */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.15, ease: EASE }}
                style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}
              >
                {item.issuer && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 600, color }}>
                    <Building2 size={13} /> {item.issuer}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--text-3)' }}>
                  <Calendar size={12} /> {fmtFullDate(item.date)}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Tags */}
          {hasTags && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2, ease: EASE }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '1.25rem', marginLeft: '4rem' }}
            >
              {item.tags.map((tag) => (
                <span key={tag} className="tag" style={{ fontSize: '0.72rem' }}>{tag}</span>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Split Layout Body ── */}
      <main style={{ background: 'var(--bg)' }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem 4rem',
          display: 'grid',
          gridTemplateColumns: hasImages ? '1fr 380px' : '1fr',
          gap: '3rem',
          alignItems: 'start',
        }}>

          {/* ── LEFT COLUMN: Content ── */}
          <div style={{ minWidth: 0 }}>

            {/* Description (only if no overview) */}
            {hasDescription && !hasOverview && (
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{ marginBottom: '2.5rem' }}
              >
                <SectionLabel>ABOUT</SectionLabel>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-2)', lineHeight: 1.8 }}>
                  {item.description}
                </p>
              </motion.div>
            )}

            {/* Markdown overview */}
            {hasOverview && (
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05, ease: EASE }}
                style={{ marginBottom: '2.5rem' }}
              >
                <SectionLabel>OVERVIEW</SectionLabel>
                <Md>{item.overviewMd}</Md>
              </motion.div>
            )}

            {/* Details card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1, ease: EASE }}
            >
              <SectionLabel>DETAILS</SectionLabel>
              <div className="card" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem' }}>
                {item.issuer && (
                  <div>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>ORGANIZATION</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>{item.issuer}</p>
                  </div>
                )}
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>CATEGORY</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color }}>{item.category}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>DATE</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>{fmtFullDate(item.date)}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN: Sticky Gallery ── */}
          {hasImages && (
            <StickyGallery images={item.images} title={item.title} />
          )}
        </div>
      </main>

      {/* ── Responsive: mobile gallery-first reorder ── */}
      <style>{`
        @media (max-width: 768px) {
          main > div {
            grid-template-columns: 1fr !important;
          }
          main > div > div:last-child {
            order: -1;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          main > div {
            grid-template-columns: 1fr 320px !important;
            gap: 2rem !important;
          }
        }
      `}</style>

      <Footer />
    </>
  );
}
