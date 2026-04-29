'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Award, BookOpen, Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Research } from '@/lib/types';

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

function pubYear(iso: string): string {
  try { return new Date(iso).getFullYear().toString(); } catch { return ''; }
}

function authorSummary(authors: Research['authors']): string {
  if (!authors?.length) return '';
  const primary = authors.find((a) => a.isPrimary) ?? authors[0];
  const rest = authors.filter((a) => a !== primary);
  if (rest.length === 0) return primary.name;
  if (rest.length === 1) return `${primary.name} & ${rest[0].name}`;
  return `${primary.name} +${rest.length} more`;
}

interface PaperCardProps {
  paper: Research;
  index?: number;
  animate?: 'whileInView' | 'animate';
}

export default function PaperCard({ paper, index = 0, animate = 'whileInView' }: PaperCardProps) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const href = `/research/${paper.slug}`;

  const accentLine = paper.featured
    ? 'linear-gradient(180deg, #f59e0b, #f97316)'
    : 'linear-gradient(180deg, var(--accent), #8b5cf6)';

  const accentLineBright = paper.featured
    ? 'linear-gradient(180deg, #fbbf24, #fb923c)'
    : 'linear-gradient(180deg, #818cf8, #a78bfa)';

  const motionProps =
    animate === 'whileInView'
      ? {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.38, delay: index * 0.07, ease: EASE },
        }
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.32, delay: Math.min(index * 0.05, 0.25), ease: EASE },
        };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('a, button')) return;
    router.push(href);
  };

  return (
    <motion.div {...motionProps}>
      <div
        onClick={handleCardClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onKeyDown={(e) => { if (e.key === 'Enter') router.push(href); }}
        tabIndex={0}
        role="article"
        aria-label={`${paper.title} — view paper`}
        style={{
          display: 'flex',
          borderRadius: '14px',
          border: '1px solid var(--border)',
          background: 'var(--bg-card, var(--bg-2))',
          overflow: 'hidden',
          cursor: 'pointer',
          outline: 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
          borderColor: hovered ? 'var(--border-2)' : 'var(--border)',
          boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.12)' : 'none',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        {/* Left accent line */}
        <div
          style={{
            width: '3px',
            flexShrink: 0,
            background: hovered ? accentLineBright : accentLine,
            transition: 'background 0.2s ease',
          }}
        />

        {/* Card body */}
        <div style={{ flex: 1, padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: 0 }}>

          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {paper.featured && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                  padding: '0.18rem 0.55rem', borderRadius: '5px',
                  background: '#f59e0b15', border: '1px solid #f59e0b33',
                  color: '#f59e0b', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em',
                }}>
                  <Award size={9} /> FEATURED
                </span>
              )}
              {paper.publisher && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600 }}>
                  <BookOpen size={11} /> {paper.publisher}
                </span>
              )}
              {paper.publishedAt && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-3)', fontSize: '0.72rem' }}>
                  <Calendar size={10} /> {pubYear(paper.publishedAt)}
                </span>
              )}
            </div>

            {paper.publicationUrl && (
              <a
                href={paper.publicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View Publication"
                onClick={(e) => e.stopPropagation()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-3)', fontSize: '0.75rem', textDecoration: 'none', transition: 'color 0.15s', flexShrink: 0 }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-3)')}
              >
                <ExternalLink size={12} /> View
              </a>
            )}
          </div>

          {/* Title */}
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.45, margin: 0 }}>
            {paper.title}
          </h3>

          {/* Abstract */}
          {paper.abstract && (
            <p style={{
              fontSize: '0.855rem', color: 'var(--text-2)', lineHeight: 1.7, margin: 0,
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {paper.abstract}
            </p>
          )}

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
            {/* Authors */}
            {paper.authors?.length > 0 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
                {authorSummary(paper.authors)}
              </span>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
              {/* Tags */}
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                {(paper.tags ?? []).slice(0, 3).map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
                {(paper.tags ?? []).length > 3 && (
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-3)', padding: '0.2rem 0.35rem' }}>
                    +{paper.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Read link */}
              <Link
                href={href}
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                  fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', textDecoration: 'none',
                  whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                Read Paper <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
