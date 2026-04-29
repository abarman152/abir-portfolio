'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, GraduationCap, Zap, Users } from 'lucide-react';
import type { Achievement } from '@/lib/types';

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

function AchievementCard({ item, i }: { item: Achievement; i: number }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = TYPE_ICON[item.type] || Trophy;
  const color = item.featured ? '#f59e0b' : (TYPE_COLOR[item.type] || 'var(--accent)');
  const isLong = item.description && item.description.length > 160;

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
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
                <Star size={8} /> Featured
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
              {item.type}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <div style={{ marginTop: '0.625rem' }}>
            <p style={{
              fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.65,
              display: isLong && !expanded ? '-webkit-box' : 'block',
              WebkitLineClamp: isLong && !expanded ? 2 : undefined,
              WebkitBoxOrient: isLong && !expanded ? 'vertical' : undefined,
              overflow: isLong && !expanded ? 'hidden' : 'visible',
            }}>
              {item.description}
            </p>
            {isLong && (
              <button
                onClick={() => setExpanded((v) => !v)}
                style={{
                  marginTop: '0.25rem', background: 'none', border: 'none', padding: 0,
                  color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.875rem' }}>
            {item.tags.map((tag) => (
              <span key={tag} className="tag" style={{ fontSize: '0.68rem' }}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Achievements({ achievements }: { achievements: Achievement[] }) {
  return (
    <section id="achievements" className="section" style={{ background: 'var(--bg)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          style={{ marginBottom: '3rem' }}
        >
          <span className="eyebrow">Awards & Achievements</span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Recognition & <span style={{ color: 'var(--accent)' }}>Milestones</span>
          </h2>
          <p style={{ color: 'var(--text-2)', marginTop: '0.625rem', fontSize: '0.95rem' }}>
            Recognition and milestones along the journey
          </p>
        </motion.div>

        {achievements.length === 0 ? (
          <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
            Achievements coming soon.
          </p>
        ) : (
          <div style={{ position: 'relative' }}>
            {/* Vertical timeline line */}
            <div style={{
              position: 'absolute', left: '24px', top: 0, bottom: 0, width: '1px',
              background: 'var(--border)',
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingLeft: '4rem' }}>
              {achievements.map((item, i) => (
                <AchievementCard key={item.id} item={item} i={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
