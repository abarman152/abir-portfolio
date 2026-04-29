'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PaperCard from '@/components/ui/PaperCard';
import type { Research } from '@/lib/types';

const API      = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
const PER_PAGE = 9;
const EASE     = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

function pubYear(iso: string): string {
  try { return new Date(iso).getFullYear().toString(); } catch { return ''; }
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function ResearchPage() {
  const [allItems, setAllItems] = useState<Research[]>([]);
  const [loading, setLoading]   = useState(true);

  const [search,      setSearch]      = useState('');
  const [tagFilter,   setTagFilter]   = useState<string[]>([]);
  const [yearFilter,  setYearFilter]  = useState('');
  const [featured,    setFeatured]    = useState(false);
  const [sort,        setSort]        = useState<'newest' | 'oldest' | 'featured'>('newest');
  const [page,        setPage]        = useState(1);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/research?limit=200`, { cache: 'no-store' });
        if (!res.ok) throw new Error();
        const json = await res.json();
        const list: Research[] = Array.isArray(json) ? json : (json.items ?? []);
        setAllItems(list);
      } catch {
        setAllItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    allItems.forEach((i) => (i.tags ?? []).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [allItems]);

  const allYears = useMemo(() => {
    const set = new Set<string>();
    allItems.forEach((i) => { if (i.publishedAt) set.add(pubYear(i.publishedAt)); });
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [allItems]);

  const filtered = useMemo(() => {
    let list = [...allItems];
    if (featured)        list = list.filter((i) => i.featured);
    if (yearFilter)      list = list.filter((i) => pubYear(i.publishedAt) === yearFilter);
    if (tagFilter.length > 0) list = list.filter((i) => tagFilter.every((t) => (i.tags ?? []).includes(t)));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((i) =>
        (i.title     ?? '').toLowerCase().includes(q) ||
        (i.abstract  ?? '').toLowerCase().includes(q) ||
        (i.publisher ?? '').toLowerCase().includes(q) ||
        (i.tags ?? []).some((t) => t.toLowerCase().includes(q)) ||
        (i.authors ?? []).some((a) => a.name.toLowerCase().includes(q))
      );
    }
    if (sort === 'oldest')   list.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
    else if (sort === 'featured') list.sort((a, b) => Number(b.featured) - Number(a.featured) || new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    else list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    return list;
  }, [allItems, search, tagFilter, yearFilter, featured, sort]);

  useEffect(() => { setPage(1); }, [search, tagFilter, yearFilter, featured, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const hasFilters = search || tagFilter.length > 0 || yearFilter || featured;

  const toggleTag = (t: string) =>
    setTagFilter((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const clearAll = () => { setSearch(''); setTagFilter([]); setYearFilter(''); setFeatured(false); setSort('newest'); };

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
              Portfolio · Research
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.06, ease: EASE }}
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '0.75rem' }}
            >
              Research &amp; Publications
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.12, ease: EASE }}
              style={{ fontSize: '0.95rem', color: 'var(--text-2)', lineHeight: 1.7, maxWidth: '520px' }}
            >
              Peer-reviewed research at the intersection of AI, quantum computing, and security.
            </motion.p>
          </div>
        </section>

        {/* ── Controls ── */}
        <section style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '1.25rem 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

            {/* Search + sort + year row */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{ position: 'relative', flex: '1 1 260px', minWidth: '200px' }}>
                <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search title, abstract, authors, tags…"
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

              {/* Year filter */}
              {allYears.length > 1 && (
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  style={{ padding: '0.6rem 0.875rem', borderRadius: '10px', border: `1px solid ${yearFilter ? 'rgba(99,102,241,0.5)' : 'var(--border)'}`, background: 'var(--bg-3)', color: yearFilter ? 'var(--accent)' : 'var(--text-2)', fontSize: '0.8rem', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  <option value="">All years</option>
                  {allYears.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              )}

              {/* Featured */}
              <button
                onClick={() => setFeatured((v) => !v)}
                style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: `1px solid ${featured ? 'rgba(99,102,241,0.5)' : 'var(--border)'}`, background: featured ? 'rgba(99,102,241,0.1)' : 'var(--bg-3)', color: featured ? 'var(--accent)' : 'var(--text-2)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
              >
                ★ Featured
              </button>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                style={{ padding: '0.6rem 0.875rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-3)', color: 'var(--text-2)', fontSize: '0.8rem', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="featured">Featured first</option>
              </select>

              {hasFilters && (
                <button onClick={clearAll} style={{ padding: '0.6rem 0.875rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-3)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'color 0.15s' }} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text)')} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-3)')}>
                  <X size={12} /> Clear
                </button>
              )}
            </div>

            {/* Tag filter chips */}
            {allTags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {allTags.map((t) => {
                  const active = tagFilter.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleTag(t)}
                      style={{ padding: '0.22rem 0.65rem', borderRadius: '6px', border: `1px solid ${active ? 'rgba(99,102,241,0.5)' : 'var(--border)'}`, background: active ? 'rgba(99,102,241,0.1)' : 'var(--bg-3)', color: active ? 'var(--accent)' : 'var(--text-3)', fontSize: '0.72rem', fontWeight: active ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── Grid ── */}
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>
              {loading ? 'Loading…' : `${filtered.length} paper${filtered.length !== 1 ? 's' : ''}${hasFilters ? ' found' : ''}`}
            </p>
            {totalPages > 1 && <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>Page {page} of {totalPages}</p>}
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ height: '140px', borderRadius: '14px', background: 'var(--bg-2)', border: '1px solid var(--border)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : paginated.length > 0 ? (
            <AnimatePresence mode="wait">
              <div key={`${search}-${tagFilter.join()}-${yearFilter}-${featured}-${sort}-${page}`} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {paginated.map((item, i) => <PaperCard key={item.id} paper={item} index={i} animate="animate" />)}
              </div>
            </AnimatePresence>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <p style={{ fontSize: '1rem', color: 'var(--text-3)', marginBottom: '0.5rem' }}>No papers found</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-3)' }}>Try adjusting your search or filters.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '3rem' }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                style={{ width: 36, height: 36, borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--bg-2)', color: page === 1 ? 'var(--text-3)' : 'var(--text-2)', cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === 1 ? 0.4 : 1 }}>
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)}
                  style={{ width: 36, height: 36, borderRadius: '9px', border: `1px solid ${n === page ? 'var(--accent)' : 'var(--border)'}`, background: n === page ? 'var(--accent)' : 'var(--bg-2)', color: n === page ? 'white' : 'var(--text-2)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: n === page ? 700 : 400 }}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ width: 36, height: 36, borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--bg-2)', color: page === totalPages ? 'var(--text-3)' : 'var(--text-2)', cursor: page === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === totalPages ? 0.4 : 1 }}>
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
