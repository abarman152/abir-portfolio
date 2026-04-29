'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GitFork, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Project } from '@/lib/types';

const ACCENT_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.07, 0.28), ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      className="card"
      onClick={handleCardClick}
      onKeyDown={(e) => { if (e.key === 'Enter') router.push(href); }}
      tabIndex={0}
      role="article"
      aria-label={`${project.title} — view case study`}
      style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', cursor: 'pointer', outline: 'none' }}
    >
      <div style={{ height: '3px', background: color, flexShrink: 0 }} />

      <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ width: 40, height: 40, borderRadius: '10px', background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 18, height: 18, borderRadius: '4px', background: color + '80' }} />
          </div>
          {project.featured && (
            <span style={{ padding: '0.2rem 0.55rem', borderRadius: '5px', background: color + '15', border: `1px solid ${color}33`, color, fontSize: '0.67rem', fontWeight: 700, letterSpacing: '0.06em' }}>
              FEATURED
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>
          {project.title}
        </h3>

        {/* Problem / Result from DB */}
        {project.problem ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.63rem', fontWeight: 800, letterSpacing: '0.07em', color: '#ef4444', background: '#ef444412', padding: '0.15rem 0.4rem', borderRadius: '4px', flexShrink: 0, marginTop: '2px' }}>PROBLEM</span>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.6 }}>{project.problem}</p>
            </div>
            {project.result && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.63rem', fontWeight: 800, letterSpacing: '0.07em', color: '#10b981', background: '#10b98112', padding: '0.15rem 0.4rem', borderRadius: '4px', flexShrink: 0, marginTop: '2px' }}>RESULT</span>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.6 }}>{project.result}</p>
              </div>
            )}
          </div>
        ) : (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {project.description}
          </p>
        )}

        {/* Tech stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: 'auto' }}>
          {(project.techStack ?? []).slice(0, 5).map((tech) => (
            <span key={tech} className="tag">{tech}</span>
          ))}
          {(project.techStack ?? []).length > 5 && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-3)', padding: '0.22rem 0.4rem', alignSelf: 'center' }}>
              +{(project.techStack ?? []).length - 5}
            </span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <Link href={`/projects/${project.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.83rem', fontWeight: 600, color, textDecoration: 'none' }}>
            Case Study <ArrowRight size={13} />
          </Link>
          <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" title="Source Code" style={{ color: 'var(--text-3)', transition: 'color 0.15s' }} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text)')} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-3)')}>
                <GitFork size={16} />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" title="Live Demo" style={{ color: 'var(--text-3)', transition: 'color 0.15s' }} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text)')} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-3)')}>
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="section" style={{ background: 'var(--bg)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div>
            <span className="eyebrow">Featured Projects</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              What I&apos;ve <span style={{ color: 'var(--accent)' }}>Built</span>
            </h2>
            <p style={{ color: 'var(--text-2)', marginTop: '0.75rem', maxWidth: '500px', lineHeight: 1.7, fontSize: '0.95rem' }}>
              Production systems with measurable outcomes — not toy demos.
            </p>
          </div>
          <Link
            href="/projects"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent)',
              textDecoration: 'none', padding: '0.55rem 1.1rem',
              borderRadius: '10px', border: '1px solid rgba(99,102,241,0.3)',
              background: 'rgba(99,102,241,0.06)', transition: 'background 0.15s, border-color 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.12)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.5)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.3)'; }}
          >
            View All Projects <ArrowRight size={14} />
          </Link>
        </motion.div>

        {projects.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-3)' }}>
            <p style={{ fontSize: '0.95rem' }}>No featured projects yet. Add some in the admin panel.</p>
          </div>
        )}
      </div>
    </section>
  );
}
