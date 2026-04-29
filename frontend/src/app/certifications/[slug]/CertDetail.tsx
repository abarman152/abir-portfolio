'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ExternalLink, Calendar, Star, Award, Hash, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Certification } from '@/lib/types';

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

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

export default function CertDetail({ cert }: { cert: Certification }) {
  const hasOverview    = (cert.overviewMd   ?? '').trim().length > 0;
  const hasDescription = (cert.description  ?? '').trim().length > 0;
  const hasSkills      = (cert.skills       ?? []).length > 0;
  const hasTags        = (cert.tags         ?? []).length > 0;
  const hasImage       = !!cert.imageUrl;
  const hasBadge       = !!cert.badgeImageUrl;

  return (
    <>
      <Navbar />

      {/* ══════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════ */}
      <section style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', paddingTop: '60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 2rem 0' }}>
          <Link href="/certifications" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.38rem 0.875rem', borderRadius: '8px',
            border: '1px solid var(--border)', background: 'var(--bg-card)',
            color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500,
            marginBottom: '2rem',
          }}>
            <ArrowLeft size={13} /> All Credentials
          </Link>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 3rem' }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease: EASE }}>

            {cert.featured && (
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

            <h1 style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
              fontWeight: 900, lineHeight: 1.2, letterSpacing: '-0.025em',
              color: 'var(--text)', marginBottom: '1rem', maxWidth: '780px',
            }}>
              {cert.title}
            </h1>

            {/* Meta row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
                <Award size={13} /> {cert.issuer}
              </span>
              {cert.issueDate && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-3)' }}>
                  <Calendar size={12} /> {fmtDate(cert.issueDate)}
                </span>
              )}
              <span style={{ padding: '0.2rem 0.6rem', borderRadius: '5px', fontSize: '0.75rem', fontWeight: 600, background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.2)' }}>
                {cert.category}
              </span>
            </div>

            {/* Tags */}
            {(hasSkills || hasTags) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.75rem' }}>
                {[...(cert.skills ?? []), ...(cert.tags ?? [])].map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {cert.credentialUrl && (
                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 1.125rem', borderRadius: '9px', background: 'var(--accent)', color: 'white', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, transition: 'opacity 0.15s' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}>
                  <ExternalLink size={14} /> View Credential
                </a>
              )}
              {cert.credentialId && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 1.125rem', borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-2)', fontSize: '0.85rem', fontWeight: 500 }}>
                  <Hash size={13} /> {cert.credentialId}
                </span>
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

          {/* ── 1. CERTIFICATE IMAGE + SIDEBAR SPLIT ── */}
          {(hasImage || hasDescription || hasBadge || cert.credentialId || cert.credentialUrl) && (
            <div className="cert-hero-grid" style={{ display: 'grid', gridTemplateColumns: hasImage ? '1fr 320px' : '1fr', gap: '3.5rem', padding: '3.5rem 0', borderBottom: (hasOverview || hasSkills) ? '1px solid var(--border)' : 'none' }}>

              {/* Left: certificate image */}
              {hasImage && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.38, ease: EASE }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                  <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Certificate
                  </p>
                  <div style={{
                    borderRadius: '14px', overflow: 'hidden',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  }}>
                    <img
                      src={cert.imageUrl}
                      alt={`${cert.title} certificate`}
                      style={{ width: '100%', display: 'block', objectFit: 'contain' }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Right: details sidebar */}
              <motion.aside
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, delay: hasImage ? 0.08 : 0, ease: EASE }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingTop: hasImage ? '2.25rem' : 0 }}
              >
                {/* Badge */}
                {hasBadge && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase' }}>Badge</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={cert.badgeImageUrl} alt={`${cert.issuer} badge`}
                        style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-2)', padding: '4px' }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>{cert.issuer}</span>
                    </div>
                  </div>
                )}

                {/* Issuer */}
                <div>
                  <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Issuer</p>
                  <p style={{ fontSize: '0.925rem', color: 'var(--accent)', fontWeight: 700 }}>{cert.issuer}</p>
                </div>

                {/* Issue date */}
                <div>
                  <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Issued</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    {fmtDate(cert.issueDate)}
                  </p>
                </div>

                {/* Credential ID */}
                {cert.credentialId && (
                  <div>
                    <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Credential ID</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <Hash size={12} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                      {cert.credentialId}
                    </p>
                  </div>
                )}

                {/* Verification link */}
                {cert.credentialUrl && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase' }}>Verification</p>
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.83rem', color: 'var(--text-2)', textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}>
                      <Shield size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} /> Verify Credential
                    </a>
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.83rem', color: 'var(--text-2)', textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}>
                      <ExternalLink size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} /> View Certificate
                    </a>
                  </div>
                )}
              </motion.aside>
            </div>
          )}

          {/* ── 2. DESCRIPTION ── */}
          {hasDescription && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.35, ease: EASE }}
              style={{ padding: '3.5rem 0', borderBottom: (hasOverview || hasSkills || hasTags) ? '1px solid var(--border)' : 'none' }}
            >
              <SectionLabel>DESCRIPTION</SectionLabel>
              <p style={{ fontSize: '0.975rem', color: 'var(--text-2)', lineHeight: 1.85, maxWidth: '740px' }}>
                {cert.description}
              </p>
            </motion.div>
          )}

          {/* ── 3. OVERVIEW (Markdown) ── */}
          {hasOverview && (
            <div className="cert-body-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '4rem', padding: '3.5rem 0', borderBottom: (hasSkills || hasTags) ? '1px solid var(--border)' : 'none' }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.35, ease: EASE }}
              >
                <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                  Overview
                </p>
                <Md>{cert.overviewMd}</Md>
              </motion.div>

              {/* Sidebar meta */}
              <motion.aside
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.08, ease: EASE }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingTop: '2.25rem' }}
              >
                <div>
                  <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Issuer</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--accent)', fontWeight: 600 }}>{cert.issuer}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Category</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-2)' }}>{cert.category}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Issued</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-2)' }}>{fmtDate(cert.issueDate)}</p>
                </div>
                {cert.credentialUrl && (
                  <div>
                    <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Links</p>
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.83rem', color: 'var(--text-2)', textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}>
                      <ExternalLink size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} /> Credential
                    </a>
                  </div>
                )}
              </motion.aside>
            </div>
          )}

          {/* ── 4. SKILLS COVERED ── */}
          {(hasSkills || hasTags) && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.35, ease: EASE }}
              style={{ padding: '3.5rem 0', borderBottom: '1px solid var(--border)' }}
            >
              <SectionLabel>SKILLS COVERED</SectionLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxWidth: '740px' }}>
                {[...(cert.skills ?? []), ...(cert.tags ?? [])].map((t) => (
                  <span key={t} style={{
                    padding: '0.35rem 0.875rem', borderRadius: '7px',
                    background: 'var(--bg-2)', border: '1px solid var(--border)',
                    color: 'var(--text-2)', fontSize: '0.85rem', fontWeight: 500,
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── 5. CREDENTIAL INFO ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.35, ease: EASE }}
            style={{ padding: '3.5rem 0' }}
          >
            <SectionLabel>CREDENTIAL INFO</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem', maxWidth: '740px' }}>
              <div style={{ padding: '1.125rem', borderRadius: '12px', background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Issuer</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--accent)', fontWeight: 700 }}>{cert.issuer}</p>
              </div>
              <div style={{ padding: '1.125rem', borderRadius: '12px', background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Issued On</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text)', fontWeight: 500 }}>{fmtDate(cert.issueDate)}</p>
              </div>
              {cert.credentialId && (
                <div style={{ padding: '1.125rem', borderRadius: '12px', background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Credential ID</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{cert.credentialId}</p>
                </div>
              )}
              {cert.credentialUrl && (
                <div style={{ padding: '1.125rem', borderRadius: '12px', background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Verification</p>
                  <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: '0.875rem', color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', transition: 'opacity 0.15s' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.75')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}>
                    <Shield size={13} /> Verify <ExternalLink size={11} />
                  </a>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 860px) {
          .cert-hero-grid  { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .cert-body-grid  { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
        .md-body {
          color: var(--text-2); font-size: 0.975rem; line-height: 1.85;
        }
        .md-body > * + * { margin-top: 0.875rem; }
        .md-body h1, .md-body h2, .md-body h3, .md-body h4 {
          color: var(--text); font-weight: 700; letter-spacing: -0.015em; line-height: 1.25;
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
