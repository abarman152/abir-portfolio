'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Trophy, Star, GraduationCap, Zap, Users, ArrowRight, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Achievement } from '@/lib/types';

const API      = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
const PER_PAGE = 10;
const EASE     = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

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

/* ─── Timeline Achievement Card ──────────────────────────── */
function AchievementCard({ item, i }: { item: Achievement; i: number }) {
  const Icon  = TYPE_ICON[item.category] || Trophy;
  const color = item.featured ? '#f59e0b' : (TYPE_COLOR[item.category] || 'var(--accent)');
  const hasSlug = !!item.slug;
  const href    = hasSlug ? `/achievements/${item.slug}` : null;

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(i * 0.06, 0.3), ease: EASE }}
      style={{ position: 'relative' }}
    >
      {/* Timeline dot */}
      <div style={{
        position: 'absolute', left: '-3.25rem', top: '1rem',
        width: 40, height: 40, borderRadius: '50%',
        background: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '3px solid var(--bg)',
        boxShadow: item.featured ? `0 0 0 2px ${color}33` : 'none',
      }}>
        <Icon size={16} color="white" />
      </div>

      <div
        className="card"
        style={{
          padding: '1.25rem 1.5rem',
          borderLeft: item.featured ? `3px solid ${color}` : '1px solid var(--border)',
          transition: 'border-color 0.15s',
          cursor: href ? 'pointer' : 'default',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = item.featured ? color : 'var(--border-2)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = item.featured ? color : 'var(--border)';
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {item.featured && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                padding: '0.15rem 0.5rem', borderRadius: '4px',
                background: '#f59e0b15', border: '1px solid #f59e0b33',
                color: '#f59e0b', fontSize: '0.65rem', fontWeight: 700,
                marginBottom: '0.4rem',
              }}>
                <Star size={8} fill="currentColor" /> FEATURED
              </span>
            )}
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.35 }}>
              {item.title}
            </h3>
            {item.issuer && (
              <p style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '0.2rem', color }}>
                {item.issuer}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem', flexShrink: 0 }}>
            <span className="tag" style={{ fontSize: '0.68rem', color }}>
              {item.category}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-3)' }}>
              <Calendar size={11} />
              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <p style={{
            fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.65,
            marginTop: '0.625rem',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {item.description}
          </p>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.875rem' }}>
            {item.tags.slice(0, 5).map((tag) => (
              <span key={tag} className="tag" style={{ fontSize: '0.68rem' }}>{tag}</span>
            ))}
            {item.tags.length > 5 && (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-3)', padding: '0.2rem 0.35rem' }}>+{item.tags.length - 5}</span>
            )}
          </div>
        )}

        {/* Footer */}
        {href && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
            marginTop: '0.875rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', fontWeight: 600, color }}>
              View Details <ArrowRight size={13} />
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <Link
        href={href}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block', outline: 'none' }}
        aria-label={`${item.title} — view details`}
      >
        {cardContent}
      </Link>
    );
  }
  return cardContent;
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function AchievementsPage() {
  const [allItems, setAllItems] = useState<Achievement[]>([]);
  const [loading, setLoading]   = useState(true);

  const [search,      setSearch]      = useState('');
  const [catFilter,   setCatFilter]   = useState<string[]>([]);
  const [featured,    setFeatured]    = useState(false);
  const [sort,        setSort]        = useState<'newest' | 'oldest'>('newest');
  const [page,        setPage]        = useState(1);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/achievements?limit=200`, { cache: 'no-store' });
        if (!res.ok) throw new Error();
        const json = await res.json();
        const list: Achievement[] = Array.isArray(json) ? json : (json.items ?? []);
        setAllItems(list);
      } catch {
        setAllItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const allCategories = useMemo(() => {
    if (!allItems?.length) return [];
    const set = new Set<string>();
    allItems.forEach((a) => { if (a.category) set.add(a.category); });
    return Array.from(set).sort();
  }, [allItems]);

  const filtered = useMemo(() => {
    if (!allItems?.length) return [];
    let list = [...allItems];
    if (featured) list = list.filter((a) => a.featured);
    if (catFilter.length > 0) list = list.filter((a) => catFilter.includes(a.category));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) =>
        (a.title       ?? '').toLowerCase().includes(q) ||
        (a.issuer      ?? '').toLowerCase().includes(q) ||
        (a.description ?? '').toLowerCase().includes(q) ||
        (a.category    ?? '').toLowerCase().includes(q) ||
        (a.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    }
    list.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sort === 'oldest' ? da - db : db - da;
    });
    return list;
  }, [allItems, search, catFilter, featured, sort]);

  useEffect(() => { setPage(1); }, [search, catFilter, featured, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const hasFilters = search || catFilter.length > 0 || featured;

  const toggleCat = (c: string) =>
    setCatFilter((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  const clearAll = () => { setSearch(''); setCatFilter([]); setFeatured(false); setSort('newest'); };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '60px', minHeight: '100vh', background: 'var(--bg)' }}>

        {/* ── Page Header ── */}
        <section style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '3.5rem 0 3rem' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
            <motion.span
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}
              style={{ display: 'inline-block', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.875rem' }}
            >
              Awards & Recognition
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.06, ease: EASE }}
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '0.75rem' }}
            >
              Recognition & Milestones
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.12, ease: EASE }}
              style={{ fontSize: '0.95rem', color: 'var(--text-2)', lineHeight: 1.7, maxWidth: '520px' }}
            >
              Awards, competitions, and professional milestones along the journey.
            </motion.p>
          </div>
        </section>

        {/* ── Controls ── */}
        <section style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '1.25rem 0' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

            {/* Search + sort row */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1 1 260px', minWidth: '200px' }}>
                <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search achievements, organizations…"
                  style={{ width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.25rem', borderRadius: '10px', background: 'var(--bg-3)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s', boxSizing: 'border-box' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-2)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', padding: '2px' }}>
                    <X size={13} />
                  </button>
                )}
              </div>

              <button
                onClick={() => setFeatured((v) => !v)}
                style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: `1px solid ${featured ? 'rgba(99,102,241,0.5)' : 'var(--border)'}`, background: featured ? 'rgba(99,102,241,0.1)' : 'var(--bg-3)', color: featured ? 'var(--accent)' : 'var(--text-2)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
              >
                ★ Featured
              </button>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}
                style={{ padding: '0.6rem 0.875rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-3)', color: 'var(--text-2)', fontSize: '0.8rem', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>

              {hasFilters && (
                <button onClick={clearAll} style={{ padding: '0.6rem 0.875rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-3)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-3)')}
                >
                  <X size={12} /> Clear
                </button>
              )}
            </div>

            {/* Category filter chips */}
            {allCategories.length > 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {allCategories.map((c) => {
                  const active = catFilter.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => toggleCat(c)}
                      style={{ padding: '0.22rem 0.65rem', borderRadius: '6px', border: `1px solid ${active ? 'rgba(99,102,241,0.5)' : 'var(--border)'}`, background: active ? 'rgba(99,102,241,0.1)' : 'var(--bg-3)', color: active ? 'var(--accent)' : 'var(--text-3)', fontSize: '0.72rem', fontWeight: active ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── Timeline list ── */}
        <section style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 2rem' }}>

          {/* Result count */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>
              {loading ? 'Loading…' : `${filtered.length} achievement${filtered.length !== 1 ? 's' : ''}${hasFilters ? ' found' : ''}`}
            </p>
            {totalPages > 1 && (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>Page {page} of {totalPages}</p>
            )}
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingLeft: '4rem' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ height: '120px', borderRadius: '16px', background: 'var(--bg-2)', border: '1px solid var(--border)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : paginated.length > 0 ? (
            <AnimatePresence mode="wait">
              <div key={`${search}-${catFilter.join()}-${featured}-${sort}-${page}`} style={{ position: 'relative' }}>
                {/* Vertical timeline line */}
                <div style={{
                  position: 'absolute', left: '24px', top: 0, bottom: 0, width: '1px',
                  background: 'var(--border)',
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingLeft: '4rem' }}>
                  {paginated.map((item, i) => (
                    <AchievementCard key={item.id} item={item} i={i} />
                  ))}
                </div>
              </div>
            </AnimatePresence>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <p style={{ fontSize: '1rem', color: 'var(--text-3)', marginBottom: '0.5rem' }}>No achievements found</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-3)' }}>Try adjusting your search or filters.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '3rem' }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ width: 36, height: 36, borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--bg-2)', color: page === 1 ? 'var(--text-3)' : 'var(--text-2)', cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', opacity: page === 1 ? 0.4 : 1 }}
              >
                <ChevronLeft size={15} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  style={{ width: 36, height: 36, borderRadius: '9px', border: `1px solid ${n === page ? 'var(--accent)' : 'var(--border)'}`, background: n === page ? 'var(--accent)' : 'var(--bg-2)', color: n === page ? 'white' : 'var(--text-2)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: n === page ? 700 : 400, transition: 'all 0.15s' }}
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ width: 36, height: 36, borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--bg-2)', color: page === totalPages ? 'var(--text-3)' : 'var(--text-2)', cursor: page === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', opacity: page === totalPages ? 0.4 : 1 }}
              >
                <ChevronRight size={15} />
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
