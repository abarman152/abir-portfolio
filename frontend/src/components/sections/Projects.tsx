'use client';

import { motion } from 'framer-motion';
import { GitFork, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Project } from '@/lib/types';

const PROJECT_META: Record<string, { problem: string; result: string; color: string }> = {
  'ml-sentiment-analyzer': {
    problem: 'Customer feedback was unstructured and manually reviewed — too slow to act on.',
    result: '94% accuracy on domain benchmark. Reduced review time by 80%.',
    color: '#6366f1',
  },
  'stock-predictor': {
    problem: 'Existing forecasts ignored multi-scale temporal dependencies in price movement.',
    result: 'LSTM model outperformed ARIMA baseline by 22%. Integrated backtesting dashboard.',
    color: '#10b981',
  },
  'data-pipeline-orchestrator': {
    problem: 'Ad-hoc ETL scripts were brittle, undocumented and caused silent failures in production.',
    result: 'Handles 10M+ events/day. 99.9% pipeline uptime. Automated quality checks.',
    color: '#f59e0b',
  },
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const meta = PROJECT_META[project.slug] || { problem: '', result: '', color: 'var(--accent)' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="card"
      style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      {/* Top accent line */}
      <div style={{ height: '3px', background: meta.color, flexShrink: 0 }} />

      <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '10px',
            background: meta.color + '15',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: 18, height: 18, borderRadius: '4px', background: meta.color + '80' }} />
          </div>
          {project.featured && (
            <span style={{
              padding: '0.2rem 0.55rem', borderRadius: '5px',
              background: meta.color + '15', border: `1px solid ${meta.color}33`,
              color: meta.color, fontSize: '0.67rem', fontWeight: 700, letterSpacing: '0.06em',
            }}>
              FEATURED
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>
          {project.title}
        </h3>

        {/* Problem / Result */}
        {meta.problem ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <span style={{
                fontSize: '0.63rem', fontWeight: 800, letterSpacing: '0.07em',
                color: '#ef4444', background: '#ef444412', padding: '0.15rem 0.4rem',
                borderRadius: '4px', flexShrink: 0, marginTop: '2px',
              }}>
                PROBLEM
              </span>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
                {meta.problem}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <span style={{
                fontSize: '0.63rem', fontWeight: 800, letterSpacing: '0.07em',
                color: '#10b981', background: '#10b98112', padding: '0.15rem 0.4rem',
                borderRadius: '4px', flexShrink: 0, marginTop: '2px',
              }}>
                RESULT
              </span>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
                {meta.result}
              </p>
            </div>
          </div>
        ) : (
          <p style={{
            fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.65,
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {project.description}
          </p>
        )}

        {/* Tech stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: 'auto' }}>
          {project.techStack.slice(0, 5).map((tech) => (
            <span key={tech} className="tag">{tech}</span>
          ))}
          {project.techStack.length > 5 && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-3)', padding: '0.22rem 0.4rem', alignSelf: 'center' }}>
              +{project.techStack.length - 5}
            </span>
          )}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex', gap: '1rem', alignItems: 'center',
          paddingTop: '0.75rem', borderTop: '1px solid var(--border)',
        }}>
          <Link
            href={`/projects/${project.slug}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              fontSize: '0.83rem', fontWeight: 600, color: meta.color, textDecoration: 'none',
            }}
          >
            Case Study <ArrowRight size={13} />
          </Link>
          <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Source Code"
                style={{ color: 'var(--text-3)', transition: 'color 0.15s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-3)')}
              >
                <GitFork size={16} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Live Demo"
                style={{ color: 'var(--text-3)', transition: 'color 0.15s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-3)')}
              >
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '3rem' }}
        >
          <span className="eyebrow">Projects</span>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800,
            color: 'var(--text)', letterSpacing: '-0.02em',
          }}>
            What I&apos;ve <span style={{ color: 'var(--accent)' }}>Built</span>
          </h2>
          <p style={{ color: 'var(--text-2)', marginTop: '0.75rem', maxWidth: '500px', lineHeight: 1.7, fontSize: '0.95rem' }}>
            Production systems with measurable outcomes — not toy demos.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.25rem',
        }}>
          {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}
