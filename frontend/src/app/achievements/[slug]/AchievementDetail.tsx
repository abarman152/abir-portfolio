'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, Star, Trophy, GraduationCap, Zap, Users, X, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Achievement } from '@/lib/types';

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

function fmtDate(iso: string): string {
  try { return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
  catch { return iso; }
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
      <span style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--accent)', background: 'rgba(99,102,241,0.1)', padding: '0.2rem 0.55rem', borderRadius: '4px', letterSpacing: '0.07em', flexShrink: 0 }}>
        {children}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
    </div>
  );
}

/* ── Lightbox Gallery ──────────────────────────────────────── */
function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!images.length) return null;

  return (
    <>
      <SectionLabel>GALLERY</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: images.length === 1 ? '1fr' : 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
        {images.map((url, i) => (
          <motion.button
            key={url}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: i * 0.05, ease: EASE }}
            onClick={() => setLightbox(i)}
            style={{
              padding: 0, border: '1px solid var(--border)', borderRadius: '12px',
              overflow: 'hidden', cursor: 'pointer', background: 'var(--bg-2)',
              aspectRatio: i === 0 && images.length > 1 ? '16/10' : '4/3',
              gridColumn: i === 0 && images.length > 1 ? 'span 2' : undefined,
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
          >
            <img
              src={url}
              alt={`${title} — image ${i + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              loading="lazy"
            />
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightbox(null)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setLightbox(null);
              if (e.key === 'ArrowRight') setLightbox((lightbox + 1) % images.length);
              if (e.key === 'ArrowLeft') setLightbox((lightbox - 1 + images.length) % images.length);
            }}
            tabIndex={0}
            style={{
              position: 'fixed', inset: 0, zIndex: 300,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              style={{
                position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 301,
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)', border: 'none',
                color: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>

            {/* Prev */}
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + images.length) % images.length); }}
                style={{
                  position: 'absolute', left: '1.5rem', zIndex: 301,
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.12)', border: 'none',
                  color: 'white', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <ChevronLeft size={20} />
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
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.12)', border: 'none',
                  color: 'white', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <ChevronRight size={20} />
              </button>
            )}

            {/* Index indicator */}
            {images.length > 1 && (
              <div style={{
                position: 'absolute', bottom: '1.5rem',
                padding: '0.35rem 0.875rem', borderRadius: '20px',
                background: 'rgba(0,0,0,0.6)', color: 'white',
                fontSize: '0.82rem', fontWeight: 600,
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

      {/* ── Hero Header ── */}
      <section style={{
        paddingTop: '60px',
        background: 'var(--bg-2)', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 2rem 3rem' }}>
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
                  <Calendar size={12} /> {fmtDate(item.date)}
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

      {/* ── Body Content ── */}
      <main style={{ background: 'var(--bg)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem 4rem' }}>

          {/* Description */}
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

          {/* Details sidebar card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1, ease: EASE }}
            style={{ marginBottom: '2.5rem' }}
          >
            <SectionLabel>DETAILS</SectionLabel>
            <div className="card" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
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
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>{fmtDate(item.date)}</p>
              </div>
            </div>
          </motion.div>

          {/* Image Gallery */}
          {hasImages && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15, ease: EASE }}
            >
              <ImageGallery images={item.images} title={item.title} />
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
