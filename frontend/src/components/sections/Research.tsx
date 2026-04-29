'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Users, Calendar, Award, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Research } from '@/lib/types';

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];
const HOME_LIMIT = 3;

function pubYear(iso: string): string {
  try { return new Date(iso).getFullYear().toString(); } catch { return ''; }
}

function authorLine(authors: Research['authors']): string {
  if (!authors?.length) return '';
  const names = authors.map((a) => a.name);
  if (names.length <= 3) return names.join(', ');
  return `${names.slice(0, 3).join(', ')} +${names.length - 3} more`;
}

export default function ResearchSection({ papers }: { papers: Research[] }) {
  const displayed = papers.slice(0, HOME_LIMIT);

  return (
    <section id="research" className="section" style={{ background: 'var(--bg)' }}>
      <div className="container" style={{ maxWidth: '960px' }}>

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: EASE }}
          style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div>
            <span className="eyebrow">Research &amp; Publications</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Academic <span style={{ color: 'var(--accent)' }}>Contributions</span>
            </h2>
            <p style={{ color: 'var(--text-2)', marginTop: '0.75rem', fontSize: '0.95rem' }}>
              Peer-reviewed research at the intersection of AI, quantum computing, and security.
            </p>
          </div>

          <Link
            href="/research"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.83rem', fontWeight: 600, whiteSpace: 'nowrap', transition: 'border-color 0.15s, color 0.15s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'; }}
          >
            View All Research <ArrowRight size={13} />
          </Link>
        </motion.div>

        {/* ── Cards ── */}
        {displayed.length > 0 ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {displayed.map((paper, i) => (
                <ResearchCard key={paper.id} paper={paper} index={i} />
              ))}
            </div>

            {papers.length > HOME_LIMIT && (
              <motion.div
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.15, ease: EASE }}
                style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}
              >
                <Link
                  href="/research"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.5rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.18s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'; }}
                >
                  View All Research <ArrowRight size={14} />
                </Link>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.35, ease: EASE }}
            style={{ textAlign: 'center', padding: '3rem 2rem' }}
          >
            <p style={{ fontSize: '0.9rem', color: 'var(--text-3)' }}>Research papers coming soon.</p>
            <Link
              href="/research"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}
            >
              Browse all research <ArrowRight size={13} />
            </Link>
          </motion.div>
        )}

      </div>
    </section>
  );
}

/* ── Individual card ──────────────────────────────────────────── */
function ResearchCard({ paper, index }: { paper: Research; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: EASE }}
    >
      <Link
        href={`/research/${paper.slug}`}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <article
          className="card"
          style={{ padding: '1.75rem 1.75rem 1.75rem 2rem', position: 'relative', overflow: 'hidden', transition: 'border-color 0.18s' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
        >
          {/* Left accent bar */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: paper.featured ? '#f59e0b' : 'var(--accent)' }} />

          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.875rem' }}>
            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {paper.featured && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.55rem', borderRadius: '5px', background: '#f59e0b15', border: '1px solid #f59e0b33', color: '#f59e0b', fontSize: '0.68rem', fontWeight: 700 }}>
                  <Award size={9} /> Featured
                </span>
              )}
              {paper.publisher && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600 }}>
                  <BookOpen size={12} /> {paper.publisher}
                </span>
              )}
              {paper.publishedAt && (
                <span style={{ color: 'var(--text-3)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={11} /> {pubYear(paper.publishedAt)}
                </span>
              )}
            </div>

            {paper.publicationUrl && (
              <span
                onClick={(e) => { e.preventDefault(); window.open(paper.publicationUrl, '_blank', 'noopener,noreferrer'); }}
                className="btn-ghost"
                style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              >
                View <ExternalLink size={12} />
              </span>
            )}
          </div>

          {/* Title */}
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.45, marginBottom: '0.625rem' }}>
            {paper.title}
          </h3>

          {/* Abstract */}
          {paper.abstract && (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.75, marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {paper.abstract}
            </p>
          )}

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            {paper.authors?.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-3)', fontSize: '0.78rem' }}>
                <Users size={12} />
                <span>{authorLine(paper.authors)}</span>
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginLeft: 'auto' }}>
              {(paper.tags ?? []).slice(0, 4).map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
