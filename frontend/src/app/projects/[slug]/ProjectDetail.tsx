'use client';

import Link from 'next/link';
import { ArrowLeft, GitFork, ExternalLink, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Project } from '@/lib/types';

export default function ProjectDetail({ project }: { project: Project }) {
  const displayDate =
    project.date ||
    new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '60px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>

          {/* Back */}
          <Link
            href="/projects"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '2.5rem', padding: '0.4rem 0.875rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', transition: 'border-color 0.15s, color 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)'; }}
          >
            <ArrowLeft size={14} /> All Projects
          </Link>

          {/* Hero image */}
          {project.imageUrl && (
            <div style={{ height: '320px', borderRadius: '16px', overflow: 'hidden', background: 'var(--bg-3)', marginBottom: '2.5rem', border: '1px solid var(--border)', position: 'relative' }}>
              <img src={project.imageUrl} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              {project.featured && (
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.3rem 0.75rem', borderRadius: '6px', background: 'var(--accent)', color: 'white', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                  FEATURED
                </div>
              )}
            </div>
          )}

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              {!project.imageUrl && project.featured && (
                <span style={{ display: 'inline-block', fontSize: '0.67rem', fontWeight: 700, letterSpacing: '0.07em', color: 'var(--accent)', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', padding: '0.2rem 0.6rem', borderRadius: '5px', marginBottom: '0.75rem' }}>
                  FEATURED
                </span>
              )}
              <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', fontWeight: 900, color: 'var(--text)', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
                {project.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-3)', fontSize: '0.82rem' }}>
                <Calendar size={12} />
                {displayDate}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.625rem', flexShrink: 0 }}>
              {project.githubUrl && (
                <a
                  href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1.1rem', borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, transition: 'border-color 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  <GitFork size={14} /> Code
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1.1rem', borderRadius: '9px', border: 'none', background: 'var(--accent)', color: 'white', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
                >
                  <ExternalLink size={14} /> Live Demo
                </a>
              )}
            </div>
          </div>

          {/* Tech stack */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '2.5rem' }}>
            {(project.techStack ?? []).map((tech) => <span key={tech} className="tag">{tech}</span>)}
          </div>

          {/* Problem / Result */}
          {(project.problem || project.result) && (
            <div
              style={{ display: 'grid', gridTemplateColumns: project.problem && project.result ? '1fr 1fr' : '1fr', gap: '1rem', marginBottom: '2rem' }}
              className="detail-pr-grid"
            >
              {project.problem && (
                <div className="card" style={{ padding: '1.5rem' }}>
                  <span style={{ display: 'inline-block', fontSize: '0.63rem', fontWeight: 800, color: '#ef4444', background: '#ef444412', padding: '0.18rem 0.45rem', borderRadius: '4px', letterSpacing: '0.07em', marginBottom: '0.875rem' }}>PROBLEM</span>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.75 }}>{project.problem}</p>
                </div>
              )}
              {project.result && (
                <div className="card" style={{ padding: '1.5rem' }}>
                  <span style={{ display: 'inline-block', fontSize: '0.63rem', fontWeight: 800, color: '#10b981', background: '#10b98112', padding: '0.18rem 0.45rem', borderRadius: '4px', letterSpacing: '0.07em', marginBottom: '0.875rem' }}>RESULT</span>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.75 }}>{project.result}</p>
                </div>
              )}
            </div>
          )}

          {/* Overview */}
          {(project.longDesc || project.description) && (
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem', letterSpacing: '-0.01em' }}>Overview</h2>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.85, fontSize: '0.925rem' }}>
                {project.longDesc || project.description}
              </p>
            </div>
          )}

          {/* Screenshots */}
          {(project.screenshots ?? []).length > 0 && (
            <div>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>Screenshots</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.875rem' }}>
                {project.screenshots.map((src, i) => (
                  <div key={i} style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src={src} alt={`Screenshot ${i + 1}`} style={{ width: '100%', display: 'block' }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <style>{`
        @media (max-width: 640px) { .detail-pr-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
