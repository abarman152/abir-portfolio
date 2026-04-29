'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ExternalLink, Calendar, Star, BookOpen, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Research, ResearchAuthor } from '@/lib/types';

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

function Md({ children }: { children: string }) {
  return (
    <div className="md-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

function AuthorBadge({ author }: { author: ResearchAuthor }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '0.2rem',
      padding: '0.75rem 1rem', borderRadius: '10px',
      background: author.isPrimary ? 'rgba(99,102,241,0.07)' : 'var(--bg-3)',
      border: `1px solid ${author.isPrimary ? 'rgba(99,102,241,0.25)' : 'var(--border)'}`,
    }}>
      <span style={{
        fontSize: '0.875rem', fontWeight: author.isPrimary ? 700 : 500,
        color: author.isPrimary ? 'var(--accent)' : 'var(--text)',
      }}>
        {author.name}
        {author.isPrimary && (
          <span style={{ marginLeft: '0.4rem', fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.05em' }}>YOU</span>
        )}
      </span>
      {author.role && (
        <span style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>{author.role}</span>
      )}
    </div>
  );
}

export default function ResearchDetail({ item }: { item: Research }) {
  const hasOverview = (item.overviewMd ?? '').trim().length > 0;
  const hasAbstract = (item.abstract  ?? '').trim().length > 0;
  const authors     = Array.isArray(item.authors) ? item.authors : [];

  return (
    <>
      <Navbar />

      {/* ══════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════ */}
      <section style={{
        background: 'var(--bg-2)',
        borderBottom: '1px solid var(--border)',
        paddingTop: '60px',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 2rem 0' }}>
          {/* Back */}
          <Link href="/research" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.38rem 0.875rem', borderRadius: '8px',
            border: '1px solid var(--border)', background: 'var(--bg-card)',
            color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500,
            marginBottom: '2rem',
          }}>
            <ArrowLeft size={13} /> All Research
          </Link>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 3rem' }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease: EASE }}>

            {/* Featured badge */}
            {item.featured && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                padding: '0.18rem 0.55rem', borderRadius: '5px',
                background: 'rgba(245,158,11,0.18)', border: '1px solid rgba(245,158,11,0.32)',
                color: '#f59e0b', fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.07em',
                marginBottom: '1rem',
              }}>
                <Star size={9} fill="currentColor" /> FEATURED
              </span>
            )}

            {/* Title */}
            <h1 style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
              fontWeight: 900, lineHeight: 1.2, letterSpacing: '-0.025em',
              color: 'var(--text)', marginBottom: '1.5rem', maxWidth: '820px',
            }}>
              {item.title}
            </h1>

            {/* Meta row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              {item.publishedAt && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-3)' }}>
                  <Calendar size={12} /> {formatDate(item.publishedAt)}
                </span>
              )}
              {item.publisher && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600 }}>
                  <BookOpen size={12} /> {item.publisher}
                </span>
              )}
              {authors.length > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-3)' }}>
                  <Users size={12} />
                  {authors.map((a) => a.name).slice(0, 2).join(', ')}
                  {authors.length > 2 && ` +${authors.length - 2} more`}
                </span>
              )}
            </div>

            {/* Tags */}
            {item.tags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.75rem' }}>
                {item.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {item.publicationUrl && (
                <a href={item.publicationUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 1.125rem', borderRadius: '9px', background: 'var(--accent)', color: 'white', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, transition: 'opacity 0.15s' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}>
                  <ExternalLink size={14} /> View Publication
                </a>
              )}
              {item.googleScholarUrl && (
                <a href={item.googleScholarUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 1.125rem', borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, transition: 'border-color 0.15s' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}>
                  Google Scholar
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BODY
      ══════════════════════════════════════════ */}
      <main style={{ background: 'var(--bg)', paddingBottom: '6rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>

          {/* ── 1. ABSTRACT ── */}
          {hasAbstract && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.35, ease: EASE }}
              style={{ padding: '3.5rem 0', borderBottom: '1px solid var(--border)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--accent)', background: 'rgba(99,102,241,0.1)', padding: '0.2rem 0.55rem', borderRadius: '4px', letterSpacing: '0.07em', flexShrink: 0 }}>
                  ABSTRACT
                </span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              </div>
              <p style={{ fontSize: '0.975rem', color: 'var(--text-2)', lineHeight: 1.85, maxWidth: '740px' }}>
                {item.abstract}
              </p>
            </motion.div>
          )}

          {/* ── 2. OVERVIEW (two-col: content + meta) ── */}
          {hasOverview && (
            <div className="research-body-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '4rem', padding: '3.5rem 0', borderBottom: authors.length > 0 ? '1px solid var(--border)' : 'none' }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.35, ease: EASE }}
              >
                <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                  Overview
                </p>
                <Md>{item.overviewMd}</Md>
              </motion.div>

              {/* Sidebar meta */}
              <motion.aside
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.08, ease: EASE }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingTop: '2.25rem' }}
              >
                {item.publisher && (
                  <div>
                    <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Publisher</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--accent)', fontWeight: 600 }}>{item.publisher}</p>
                  </div>
                )}
                {item.publishedAt && (
                  <div>
                    <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Published</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-2)' }}>{formatDate(item.publishedAt)}</p>
                  </div>
                )}
                {item.tags?.length > 0 && (
                  <div>
                    <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Topics</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {item.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </div>
                )}
                {(item.publicationUrl || item.googleScholarUrl) && (
                  <div>
                    <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Links</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                      {item.publicationUrl && (
                        <a href={item.publicationUrl} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.83rem', color: 'var(--text-2)', textDecoration: 'none', transition: 'color 0.15s' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}>
                          <ExternalLink size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} /> Publication
                        </a>
                      )}
                      {item.googleScholarUrl && (
                        <a href={item.googleScholarUrl} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.83rem', color: 'var(--text-2)', textDecoration: 'none', transition: 'color 0.15s' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}>
                          <ExternalLink size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} /> Google Scholar
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </motion.aside>
            </div>
          )}

          {/* ── 3. AUTHORS ── */}
          {authors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.35, ease: EASE }}
              style={{ paddingTop: '3.5rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--text-3)', background: 'var(--bg-3)', padding: '0.2rem 0.55rem', borderRadius: '4px', letterSpacing: '0.07em', flexShrink: 0 }}>
                  AUTHORS
                </span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {authors.map((author, i) => <AuthorBadge key={i} author={author} />)}
              </div>
            </motion.div>
          )}

        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 860px) {
          .research-body-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
        .md-body {
          color: var(--text-2);
          font-size: 0.975rem;
          line-height: 1.85;
        }
        .md-body > * + * { margin-top: 0.875rem; }
        .md-body h1, .md-body h2, .md-body h3, .md-body h4 {
          color: var(--text); font-weight: 700;
          letter-spacing: -0.015em; line-height: 1.25;
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
          font-family: var(--font-mono); font-size: 0.82em;
          background: var(--bg-3); border: 1px solid var(--border);
          padding: 0.1em 0.38em; border-radius: 4px; color: var(--accent);
        }
        .md-body pre {
          background: var(--bg-3); border: 1px solid var(--border);
          border-radius: 10px; padding: 1.25rem 1.5rem; overflow-x: auto; margin: 1.25rem 0;
        }
        .md-body pre code { background: none; border: none; padding: 0; color: var(--text); font-size: 0.83rem; line-height: 1.7; }
        .md-body blockquote {
          border-left: 3px solid var(--accent); padding: 0.25rem 0 0.25rem 1.125rem;
          margin: 0 0 0.875rem; color: var(--text-3); font-style: italic;
        }
        .md-body hr { border: none; border-top: 1px solid var(--border); margin: 1.75rem 0; }
        .md-body table { width: 100%; border-collapse: collapse; margin: 0.875rem 0; font-size: 0.875rem; }
        .md-body th { text-align: left; padding: 0.5rem 0.75rem; background: var(--bg-3); border: 1px solid var(--border); color: var(--text); font-weight: 600; }
        .md-body td { padding: 0.5rem 0.75rem; border: 1px solid var(--border); }
      `}</style>
    </>
  );
}
