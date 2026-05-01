'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, Calendar, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { Certification } from '@/lib/types';
import { fmtMonthYearShort } from '@/lib/date';

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

function CertCard({ cert }: { cert: Certification }) {
  const hasSlug = !!cert.slug;
  const href    = hasSlug ? `/certifications/${cert.slug}` : null;

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="card"
      tabIndex={href ? -1 : undefined}
      style={{
        padding: '1.25rem', overflow: 'hidden', position: 'relative',
        cursor: href ? 'pointer' : 'default', outline: 'none',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
    >
      {/* Top accent bar */}
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
          {cert.badgeImageUrl
            ? <img src={cert.badgeImageUrl} alt={cert.issuer} style={{ width: 24, height: 24, objectFit: 'contain' }} loading="lazy" />
            : <Award size={18} style={{ color: cert.featured ? '#f59e0b' : 'var(--accent)' }} />
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {cert.featured && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
              padding: '0.15rem 0.45rem', borderRadius: '4px',
              background: '#f59e0b15', border: '1px solid #f59e0b33',
              color: '#f59e0b', fontSize: '0.65rem', fontWeight: 700,
              marginBottom: '0.3rem',
            }}>
              <Star size={8} /> Featured
            </span>
          )}
          <h3 style={{
            fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)',
            lineHeight: 1.35, display: 'block',
          }}>
            {cert.title}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, marginTop: '0.2rem' }}>
            {cert.issuer}
          </p>
        </div>
      </div>

      {/* Description */}
      {cert.description && (
        <p style={{
          fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.65,
          marginTop: '0.875rem',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {cert.description}
        </p>
      )}

      {/* Tags */}
      {cert.tags && cert.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.875rem' }}>
          {cert.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag" style={{ fontSize: '0.68rem' }}>{tag}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-3)', fontSize: '0.78rem' }}>
          <Calendar size={11} />
          {fmtMonthYearShort(cert.issueDate)}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="tag" style={{ fontSize: '0.68rem', color: 'var(--accent)' }}>{cert.category}</span>
          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ color: 'var(--text-3)', transition: 'color 0.15s', position: 'relative', zIndex: 1 }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--accent)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-3)')}
              title="View Credential"
            >
              <ExternalLink size={13} />
            </a>
          )}
          {href && (
            <span
              style={{ color: 'var(--text-3)', transition: 'color 0.15s', display: 'flex', alignItems: 'center' }}
            >
              <ArrowRight size={13} />
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <Link
        href={href}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block', outline: 'none' }}
        aria-label={`${cert.title} — view credential`}
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
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

        {/* Category filter tabs */}
        {categories.length > 2 && (
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
                  cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}
          >
            {filtered.map((cert) => <CertCard key={cert.id} cert={cert} />)}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-3)', padding: '3rem', fontSize: '0.9rem' }}>
            No certifications in this category yet.
          </p>
        )}

        {/* View All button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.15, ease: EASE }}
          style={{ textAlign: 'center', marginTop: '2.5rem' }}
        >
          <Link
            href="/certifications"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
              padding: '0.65rem 1.5rem', borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text-2)', textDecoration: 'none',
              fontSize: '0.875rem', fontWeight: 600,
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
              (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-2)';
            }}
          >
            View All Certifications <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
