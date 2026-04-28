import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, GitFork, ExternalLink, Calendar } from 'lucide-react';
import type { Project } from '@/lib/types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

async function getProject(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(`${API}/projects/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 2rem' }}>
        <Link
          href="/#projects"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            color: 'var(--text-2)', textDecoration: 'none',
            fontSize: '0.875rem', marginBottom: '2rem',
            padding: '0.4rem 0.875rem', borderRadius: '8px',
            border: '1px solid var(--border)', background: 'var(--bg-card)',
            transition: 'border-color 0.15s, color 0.15s',
          }}
        >
          <ArrowLeft size={15} /> Back to Projects
        </Link>

        {/* Hero image */}
        <div style={{
          height: '300px', borderRadius: '16px', overflow: 'hidden',
          background: 'var(--bg-3)',
          marginBottom: '2rem', position: 'relative',
        }}>
          {project.imageUrl && (
            <img src={project.imageUrl} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          {project.featured && (
            <div style={{
              position: 'absolute', top: '1rem', right: '1rem',
              padding: '0.3rem 0.75rem', borderRadius: '6px',
              background: 'var(--accent)', color: 'white',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em',
            }}>
              FEATURED
            </div>
          )}
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              {project.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', color: 'var(--text-3)', fontSize: '0.85rem' }}>
              <Calendar size={12} />
              {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.5rem 1rem', borderRadius: '8px',
                  border: '1px solid var(--border)', background: 'var(--bg-card)',
                  color: 'var(--text)', textDecoration: 'none',
                  fontSize: '0.85rem', fontWeight: 600,
                }}
              >
                <GitFork size={14} /> Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.5rem 1rem', borderRadius: '8px',
                  background: 'var(--accent)',
                  color: 'white', textDecoration: 'none',
                  fontSize: '0.85rem', fontWeight: 600,
                }}
              >
                <ExternalLink size={14} /> Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Tech stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '2rem' }}>
          {project.techStack.map((tech) => (
            <span key={tech} className="tag">{tech}</span>
          ))}
        </div>

        {/* Description */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            Overview
          </h2>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.8, fontSize: '0.95rem' }}>
            {project.longDesc || project.description}
          </p>
        </div>

        {/* Screenshots */}
        {project.screenshots.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.25rem' }}>
              Screenshots
            </h2>
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
  );
}
