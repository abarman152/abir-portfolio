'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, GitFork, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Project, ProjectsResponse } from '@/lib/types';

const API   = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
const PER_PAGE = 9;
const EASE  = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];
const ACCENT_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

/* ─── Project card ─────────────────────────────────────────────────── */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const router = useRouter();
  const color  = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const href   = `/projects/${project.slug}`;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('a, button')) return;
    router.push(href);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: Math.min(index * 0.05, 0.25), ease: EASE }}
      className="card"
      onClick={handleCardClick}
      onKeyDown={(e) => { if (e.key === 'Enter') router.push(href); }}
      tabIndex={0}
      role="article"
      aria-label={`${project.title} — view case study`}
      style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', cursor: 'pointer', outline: 'none' }}
    >
      <div style={{ height: '3px', background: color }} />
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ width: 36, height: 36, borderRadius: '9px', background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 16, height: 16, borderRadius: '3px', background: color + '80' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            {project.featured && (
              <span style={{ padding: '0.18rem 0.5rem', borderRadius: '4px', background: color + '15', border: `1px solid ${color}33`, color, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em' }}>
                FEATURED
              </span>
            )}
            {project.date && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>{project.date}</span>
            )}
          </div>
        </div>

        <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>{project.title}</h3>

        {project.problem ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#ef4444', background: '#ef444412', padding: '0.12rem 0.35rem', borderRadius: '4px', flexShrink: 0, marginTop: '2px', letterSpacing: '0.06em' }}>PROBLEM</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.6 }}>{project.problem}</p>
            </div>
            {project.result && (
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#10b981', background: '#10b98112', padding: '0.12rem 0.35rem', borderRadius: '4px', flexShrink: 0, marginTop: '2px', letterSpacing: '0.06em' }}>RESULT</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.6 }}>{project.result}</p>
              </div>
            )}
          </div>
        ) : (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {project.description}
          </p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: 'auto' }}>
          {(project.techStack ?? []).slice(0, 5).map((t) => <span key={t} className="tag">{t}</span>)}
          {(project.techStack ?? []).length > 5 && <span style={{ fontSize: '0.7rem', color: 'var(--text-3)', padding: '0.2rem 0.35rem' }}>+{(project.techStack ?? []).length - 5}</span>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <Link href={`/projects/${project.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', fontWeight: 600, color, textDecoration: 'none' }}>
            Case Study <ArrowRight size={13} />
          </Link>
          <div style={{ display: 'flex', gap: '0.625rem', marginLeft: 'auto' }}>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" title="Source" style={{ color: 'var(--text-3)', transition: 'color 0.15s' }} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text)')} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-3)')}>
                <GitFork size={15} />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" title="Live" style={{ color: 'var(--text-3)', transition: 'color 0.15s' }} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text)')} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-3)')}>
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────── */
export default function ProjectsPage() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading]         = useState(true);

  const [search,   setSearch]   = useState('');
  const [techFilter, setTechFilter] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [sort,     setSort]     = useState<'newest' | 'oldest'>('newest');
  const [page,     setPage]     = useState(1);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/projects?limit=200`, { cache: 'no-store' });
        if (!res.ok) throw new Error();
        const json = await res.json();
        // Handle both response shapes: direct array (old) and {projects:[]} (new)
        const list: Project[] = Array.isArray(json) ? json : (json.projects ?? []);
        setAllProjects(list);
      } catch {
        setAllProjects([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // All unique tech tags for filter chips
  const allTechs = useMemo(() => {
    if (!allProjects?.length) return [];
    const set = new Set<string>();
    allProjects.forEach((p) => (p.techStack ?? []).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [allProjects]);

  // Client-side filter + search + sort
  const filtered = useMemo(() => {
    if (!allProjects?.length) return [];
    let list = [...allProjects];
    if (featured) list = list.filter((p) => p.featured);
    if (techFilter.length > 0) list = list.filter((p) => techFilter.every((t) => (p.techStack ?? []).includes(t)));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        (p.title        ?? '').toLowerCase().includes(q) ||
        (p.description  ?? '').toLowerCase().includes(q) ||
        (p.problem      ?? '').toLowerCase().includes(q) ||
        (p.result       ?? '').toLowerCase().includes(q) ||
        (p.techStack ?? []).some((t) => t.toLowerCase().includes(q))
      );
    }
    if (sort === 'oldest') list.reverse();
    return list;
  }, [allProjects, search, techFilter, featured, sort]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, techFilter, featured, sort]);

  const totalPages  = Math.ceil(filtered.length / PER_PAGE);
  const paginated   = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const hasFilters  = search || techFilter.length > 0 || featured;

  const toggleTech = (t: string) =>
    setTechFilter((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const clearAll = () => { setSearch(''); setTechFilter([]); setFeatured(false); setSort('newest'); };

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
              Portfolio · Projects
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.06, ease: EASE }}
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '0.75rem' }}
            >
              All Projects
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.12, ease: EASE }}
              style={{ fontSize: '0.95rem', color: 'var(--text-2)', lineHeight: 1.7, maxWidth: '520px' }}
            >
              Every project I&apos;ve shipped — searchable, filterable, and ready to explore.
            </motion.p>
          </div>
        </section>

        {/* ── Controls ── */}
        <section style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '1.25rem 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

            {/* Search + sort row */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{ position: 'relative', flex: '1 1 260px', minWidth: '200px' }}>
                <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects, tech, keywords…"
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

              {/* Featured toggle */}
              <button
                onClick={() => setFeatured((v) => !v)}
                style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: `1px solid ${featured ? 'rgba(99,102,241,0.5)' : 'var(--border)'}`, background: featured ? 'rgba(99,102,241,0.1)' : 'var(--bg-3)', color: featured ? 'var(--accent)' : 'var(--text-2)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
              >
                ★ Featured
              </button>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}
                style={{ padding: '0.6rem 0.875rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-3)', color: 'var(--text-2)', fontSize: '0.8rem', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>

              {/* Clear */}
              {hasFilters && (
                <button onClick={clearAll} style={{ padding: '0.6rem 0.875rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-3)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'color 0.15s' }} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text)')} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-3)')}>
                  <X size={12} /> Clear
                </button>
              )}
            </div>

            {/* Tech filter chips */}
            {allTechs.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {allTechs.map((t) => {
                  const active = techFilter.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleTech(t)}
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

        {/* ── Project grid ── */}
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 2rem' }}>

          {/* Result count */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>
              {loading ? 'Loading…' : `${filtered.length} project${filtered.length !== 1 ? 's' : ''}${hasFilters ? ' found' : ''}`}
            </p>
            {totalPages > 1 && (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>Page {page} of {totalPages}</p>
            )}
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ height: '280px', borderRadius: '16px', background: 'var(--bg-2)', border: '1px solid var(--border)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : paginated.length > 0 ? (
            <AnimatePresence mode="wait">
              <div key={`${search}-${techFilter.join()}-${featured}-${sort}-${page}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {paginated.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
              </div>
            </AnimatePresence>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <p style={{ fontSize: '1rem', color: 'var(--text-3)', marginBottom: '0.5rem' }}>No projects found</p>
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
