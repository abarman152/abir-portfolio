'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, Calendar, Star } from 'lucide-react';
import type { Certification } from '@/lib/types';

function CertCard({ cert }: { cert: Certification }) {
  const [expanded, setExpanded] = useState(false);
  const hasDescription = cert.description && cert.description.trim().length > 0;
  const isLong = hasDescription && cert.description.length > 120;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="card"
      style={{ padding: '1.25rem', overflow: 'hidden', position: 'relative' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
      }}
    >
      {/* Top accent bar — amber for featured, accent for others */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: cert.featured ? '#f59e0b' : 'var(--accent)',
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '10px', flexShrink: 0,
          background: cert.featured ? '#f59e0b15' : 'var(--accent-dim)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {cert.imageUrl
            ? <img src={cert.imageUrl} alt={cert.issuer} style={{ width: 24, height: 24, objectFit: 'contain' }} />
            : <Award size={18} style={{ color: cert.featured ? '#f59e0b' : 'var(--accent)' }} />
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', flexWrap: 'wrap' }}>
            {cert.featured && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                padding: '0.15rem 0.45rem', borderRadius: '4px',
                background: '#f59e0b15', border: '1px solid #f59e0b33',
                color: '#f59e0b', fontSize: '0.65rem', fontWeight: 700,
                flexShrink: 0, marginTop: '0.1rem',
              }}>
                <Star size={8} /> Featured
              </span>
            )}
          </div>
          <h3 style={{
            fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)',
            lineHeight: 1.35, marginTop: cert.featured ? '0.3rem' : 0,
          }}>
            {cert.title}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, marginTop: '0.2rem' }}>
            {cert.issuer}
          </p>
        </div>
      </div>

      {/* Description */}
      {hasDescription && (
        <div style={{ marginTop: '0.875rem' }}>
          <p style={{
            fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.65,
            display: isLong && !expanded ? '-webkit-box' : 'block',
            WebkitLineClamp: isLong && !expanded ? 2 : undefined,
            WebkitBoxOrient: isLong && !expanded ? 'vertical' : undefined,
            overflow: isLong && !expanded ? 'hidden' : 'visible',
          }}>
            {cert.description}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              style={{
                marginTop: '0.3rem', background: 'none', border: 'none', padding: 0,
                color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}

      {/* Tags */}
      {cert.tags && cert.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.875rem' }}>
          {cert.tags.map((tag) => (
            <span key={tag} className="tag" style={{ fontSize: '0.68rem' }}>{tag}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginTop: '1rem',
        paddingTop: (hasDescription || (cert.tags && cert.tags.length > 0)) ? '0.75rem' : 0,
        borderTop: (hasDescription || (cert.tags && cert.tags.length > 0)) ? '1px solid var(--border)' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-3)', fontSize: '0.78rem' }}>
          <Calendar size={11} />
          {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="tag" style={{ fontSize: '0.68rem', color: 'var(--accent)' }}>
            {cert.category}
          </span>
          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-3)', transition: 'color 0.15s' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--accent)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-3)')}
            >
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Certifications({ certs }: { certs: Certification[] }) {
  const categories = ['All', ...Array.from(new Set(certs.map((c) => c.category)))];
  const [active, setActive] = useState('All');

  const filtered = active === 'All' ? certs : certs.filter((c) => c.category === active);

  return (
    <section id="certifications" className="section" style={{ background: 'var(--bg-2)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '2.5rem' }}
        >
          <span className="eyebrow">Certifications</span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Professional <span style={{ color: 'var(--accent)' }}>Credentials</span>
          </h2>
          <p style={{ color: 'var(--text-2)', marginTop: '0.625rem', fontSize: '0.95rem' }}>
            Professional credentials and courses
          </p>
        </motion.div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                padding: '0.35rem 0.875rem', borderRadius: '7px', border: '1px solid',
                borderColor: active === cat ? 'var(--accent)' : 'var(--border)',
                background: active === cat ? 'var(--accent-dim)' : 'transparent',
                color: active === cat ? 'var(--accent)' : 'var(--text-2)',
                fontSize: '0.82rem', fontWeight: active === cat ? 600 : 400,
                cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {filtered.map((cert) => (
              <CertCard key={cert.id} cert={cert} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-3)', padding: '3rem', fontSize: '0.9rem' }}>
            No certifications in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
