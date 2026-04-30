'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Award, Calendar, Star, ExternalLink, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Certification } from '@/lib/types';

const API      = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
const PER_PAGE = 9;
const EASE     = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

function fmtDate(iso: string): string {
  try { return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); } catch { return ''; }
}

/* ─── Certification card ─────────────────────────────────── */
function CertCard({ cert, index }: { cert: Certification; index: number }) {
  const hasSlug = !!cert.slug;
  const href    = hasSlug ? `/certifications/${cert.slug}` : null;

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: Math.min(index * 0.05, 0.25), ease: EASE }}
      className="card"
      tabIndex={href ? -1 : undefined}
      style={{
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        cursor: href ? 'pointer' : 'default', outline: 'none',
      }}
      onMouseEnter={(e) => { if (href) (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
    >
      {/* Top accent bar */}
      <div style={{ height: '2px', background: cert.featured ? '#f59e0b' : 'var(--accent)', flexShrink: 0 }} />

      <div style={{ padding: '1.375rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '11px', flexShrink: 0,
            background: cert.featured ? '#f59e0b12' : 'var(--accent-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {cert.badgeImageUrl
              ? <img src={cert.badgeImageUrl} alt={cert.issuer} style={{ width: 26, height: 26, objectFit: 'contain' }} loading="lazy" />
              : <Award size={20} style={{ color: cert.featured ? '#f59e0b' : 'var(--accent)' }} />
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
              {cert.featured && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                  padding: '0.15rem 0.45rem', borderRadius: '4px',
                  background: '#f59e0b15', border: '1px solid #f59e0b33',
                  color: '#f59e0b', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.05em',
                }}>
                  <Star size={8} fill="currentColor" /> FEATURED
                </span>
              )}
              <span style={{ fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 600, background: 'var(--accent-dim)', padding: '0.12rem 0.45rem', borderRadius: '4px' }}>
                {cert.category}
              </span>
            </div>
            <h3 style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.35 }}>
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
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {cert.description}
          </p>
        )}

        {/* Skills + tags */}
        {((cert.skills?.length ?? 0) > 0 || (cert.tags?.length ?? 0) > 0) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: 'auto' }}>
            {[...(cert.skills ?? []), ...(cert.tags ?? [])].slice(0, 5).map((t) => (
              <span key={t} className="tag" style={{ fontSize: '0.68rem' }}>{t}</span>
            ))}
            {((cert.skills?.length ?? 0) + (cert.tags?.length ?? 0)) > 5 && (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-3)', padding: '0.2rem 0.35rem' }}>
                +{(cert.skills?.length ?? 0) + (cert.tags?.length ?? 0) - 5}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: '0.75rem', borderTop: '1px solid var(--border)', marginTop: 'auto',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-3)' }}>
            <Calendar size={11} /> {fmtDate(cert.issueDate)}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {cert.credentialUrl && (
              <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ color: 'var(--text-3)', transition: 'color 0.15s', display: 'flex', position: 'relative', zIndex: 1 }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--accent)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-3)')}
                title="View Credential">
                <ExternalLink size={13} />
              </a>
            )}
            {href && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)' }}>
                Details <ArrowRight size={12} />
              </span>
            )}
          </div>
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

/* ─── Main page ──────────────────────────────────────────── */
export default function CertificationsPage() {
  const [allCerts, setAllCerts] = useState<Certification[]>([]);
  const [loading, setLoading]   = useState(true);

  const [search,      setSearch]      = useState('');
  const [catFilter,   setCatFilter]   = useState('All');
  const [tagFilter,   setTagFilter]   = useState<string[]>([]);
  const [issuerFilter, setIssuerFilter] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort,        setSort]        = useState<'latest' | 'oldest' | 'featured'>('latest');
  const [page,        setPage]        = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/certifications?limit=200`, { cache: 'no-store' });
        if (!res.ok) throw new Error();
        const json = await res.json();
        const list: Certification[] = Array.isArray(json) ? json : (json.items ?? []);
        setAllCerts(list);
      } catch {
        setAllCerts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    allCerts.forEach((c) => set.add(c.category));
    return Array.from(set).sort();
  }, [allCerts]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    allCerts.forEach((c) => {
      (c.tags ?? []).forEach((t) => set.add(t));
      (c.skills ?? []).forEach((s) => set.add(s));
    });
    return Array.from(set).sort();
  }, [allCerts]);

  const allIssuers = useMemo(() => {
    const set = new Set<string>();
    allCerts.forEach((c) => set.add(c.issuer));
    return Array.from(set).sort();
  }, [allCerts]);

  const filtered = useMemo(() => {
    let list = [...allCerts];
    if (catFilter !== 'All') list = list.filter((c) => c.category === catFilter);
    if (featuredOnly)        list = list.filter((c) => c.featured);
    if (issuerFilter)        list = list.filter((c) => c.issuer === issuerFilter);
    if (tagFilter.length > 0) {
      list = list.filter((c) =>
        tagFilter.every((t) => (c.tags ?? []).includes(t) || (c.skills ?? []).includes(t))
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        (c.title       ?? '').toLowerCase().includes(q) ||
        (c.issuer      ?? '').toLowerCase().includes(q) ||
        (c.description ?? '').toLowerCase().includes(q) ||
        (c.category    ?? '').toLowerCase().includes(q) ||
        (c.skills ?? []).some((s) => s.toLowerCase().includes(q)) ||
        (c.tags   ?? []).some((t) => t.toLowerCase().includes(q))
      );
    }
    if (sort === 'oldest')   list.sort((a, b) => new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime());
    else if (sort === 'featured') list.sort((a, b) => Number(b.featured) - Number(a.featured) || new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
    else list.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
    return list;
  }, [allCerts, search, catFilter, tagFilter, issuerFilter, featuredOnly, sort]);

  useEffect(() => { setPage(1); }, [search, catFilter, tagFilter, issuerFilter, featuredOnly, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const hasFilters = search || catFilter !== 'All' || tagFilter.length > 0 || issuerFilter || featuredOnly;

  const toggleTag = (t: string) =>
    setTagFilter((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const clearAll = () => {
    setSearch(''); setCatFilter('All'); setTagFilter([]);
    setIssuerFilter(''); setFeaturedOnly(false); setSort('latest');
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '60px', minHeight: '100vh', background: 'var(--bg)' }}>

        {/* ── Page header ── */}
        <section style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '3.5rem 0 3rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
            <motion.span
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}
              style={{ display: 'inline-block', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.875rem' }}
            >
              Portfolio · Certifications
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.06, ease: EASE }}
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '0.75rem' }}
            >
              Professional Credentials
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.12, ease: EASE }}
              style={{ fontSize: '0.95rem', color: 'var(--text-2)', lineHeight: 1.7, maxWidth: '520px' }}
            >
              Verified certifications and professional credentials across AI, cloud, and data science.
            </motion.p>
          </div>
        </section>

        {/* ── Controls ── */}
        <section style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '1.25rem 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

            {/* Search + featured + sort row */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{ position: 'relative', flex: '1 1 260px', minWidth: '200px' }}>
                <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search title, issuer, skills…"
                  style={{ width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.25rem', borderRadius: '10px', background: 'var(--bg-3)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s', boxSizing: 'border-box' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-2)')}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', padding: '2px' }}>
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Featured toggle */}
              <button
                onClick={() => setFeaturedOnly((v) => !v)}
                style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: `1px solid ${featuredOnly ? 'rgba(99,102,241,0.5)' : 'var(--border)'}`, background: featuredOnly ? 'rgba(99,102,241,0.1)' : 'var(--bg-3)', color: featuredOnly ? 'var(--accent)' : 'var(--text-2)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
              >
                ★ Featured
              </button>

              {/* Advanced toggle */}
              <button
                onClick={() => setShowAdvanced((v) => !v)}
                style={{ padding: '0.6rem 0.875rem', borderRadius: '10px', border: '1px solid var(--border)', background: showAdvanced ? 'var(--bg-3)' : 'transparent', color: 'var(--text-2)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
              >
                Filters {showAdvanced ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>

              {/* Clear */}
              {hasFilters && (
                <button onClick={clearAll} style={{ padding: '0.6rem 0.875rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-3)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-3)')}>
                  <X size={12} /> Clear
                </button>
              )}
            </div>

            {/* Category chips (always visible) */}
            {allCategories.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {['All', ...allCategories].map((cat) => {
                  const active = catFilter === cat;
                  return (
                    <button key={cat} onClick={() => setCatFilter(cat)}
                      style={{ padding: '0.22rem 0.65rem', borderRadius: '6px', border: `1px solid ${active ? 'rgba(99,102,241,0.5)' : 'var(--border)'}`, background: active ? 'rgba(99,102,241,0.1)' : 'var(--bg-3)', color: active ? 'var(--accent)' : 'var(--text-3)', fontSize: '0.72rem', fontWeight: active ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
                      {cat}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Advanced filters */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.875rem', borderRadius: '10px', background: 'var(--bg-3)', border: '1px solid var(--border)' }}>

                    {/* Sort + Issuer row */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}
                        style={{ padding: '0.55rem 0.875rem', borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--bg-2)', color: 'var(--text-2)', fontSize: '0.8rem', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                        <option value="latest">Latest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="featured">Featured first</option>
                      </select>

                      {allIssuers.length > 1 && (
                        <select value={issuerFilter} onChange={(e) => setIssuerFilter(e.target.value)}
                          style={{ padding: '0.55rem 0.875rem', borderRadius: '9px', border: `1px solid ${issuerFilter ? 'rgba(99,102,241,0.5)' : 'var(--border)'}`, background: 'var(--bg-2)', color: issuerFilter ? 'var(--accent)' : 'var(--text-2)', fontSize: '0.8rem', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                          <option value="">All issuers</option>
                          {allIssuers.map((i) => <option key={i} value={i}>{i}</option>)}
                        </select>
                      )}
                    </div>

                    {/* Tag / skill chips */}
                    {allTags.length > 0 && (
                      <div>
                        <p style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Skills & Tags</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                          {allTags.map((t) => {
                            const active = tagFilter.includes(t);
                            return (
                              <button key={t} onClick={() => toggleTag(t)}
                                style={{ padding: '0.22rem 0.65rem', borderRadius: '6px', border: `1px solid ${active ? 'rgba(99,102,241,0.5)' : 'var(--border)'}`, background: active ? 'rgba(99,102,241,0.1)' : 'var(--bg-2)', color: active ? 'var(--accent)' : 'var(--text-3)', fontSize: '0.72rem', fontWeight: active ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── Grid ── */}
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>
              {loading ? 'Loading…' : `${filtered.length} credential${filtered.length !== 1 ? 's' : ''}${hasFilters ? ' found' : ''}`}
            </p>
            {totalPages > 1 && <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>Page {page} of {totalPages}</p>}
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ height: '240px', borderRadius: '16px', background: 'var(--bg-2)', border: '1px solid var(--border)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : paginated.length > 0 ? (
            <AnimatePresence mode="wait">
              <div key={`${search}-${catFilter}-${tagFilter.join()}-${issuerFilter}-${featuredOnly}-${sort}-${page}`}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {paginated.map((c, i) => <CertCard key={c.id} cert={c} index={i} />)}
              </div>
            </AnimatePresence>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <p style={{ fontSize: '1rem', color: 'var(--text-3)', marginBottom: '0.5rem' }}>No credentials found</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-3)' }}>Try adjusting your search or filters.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '3rem' }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                style={{ width: 36, height: 36, borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--bg-2)', color: page === 1 ? 'var(--text-3)' : 'var(--text-2)', cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === 1 ? 0.4 : 1 }}>
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)}
                  style={{ width: 36, height: 36, borderRadius: '9px', border: `1px solid ${n === page ? 'var(--accent)' : 'var(--border)'}`, background: n === page ? 'var(--accent)' : 'var(--bg-2)', color: n === page ? 'white' : 'var(--text-2)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: n === page ? 700 : 400 }}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ width: 36, height: 36, borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--bg-2)', color: page === totalPages ? 'var(--text-3)' : 'var(--text-2)', cursor: page === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === totalPages ? 0.4 : 1 }}>
                ›
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
      <style>{`@keyframes pulse { 0%,100% { opacity:0.5 } 50% { opacity:1 } }`}</style>
    </>
  );
}
