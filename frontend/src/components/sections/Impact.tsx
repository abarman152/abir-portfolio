'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Code2, BookOpen, Zap, Star, Target } from 'lucide-react';
import type { Achievement, Stat } from '@/lib/types';

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const steps = 50; const dur = 1600;
    const inc = to / steps; let cur = 0;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= to) { setN(to); clearInterval(t); } else setN(Math.floor(cur));
    }, dur / steps);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

const METRICS = [
  { icon: Code2,     value: 350,  suffix: '+', label: 'LeetCode Problems',   sub: 'Easy · Medium · Hard',        color: '#6366f1' },
  { icon: BookOpen,  value: 3,    suffix: '',  label: 'Research Papers',      sub: 'Peer-reviewed publications',  color: '#8b5cf6' },
  { icon: Trophy,    value: 1450, suffix: '',  label: 'Codeforces Rating',    sub: 'Competitive programming',     color: '#f59e0b' },
  { icon: Zap,       value: 42,   suffix: '+', label: 'GitHub Repositories',  sub: 'Open source projects',        color: '#10b981' },
];

export default function Impact({ achievements, stats }: { achievements: Achievement[]; stats: Stat[] }) {
  const mergedMetrics = METRICS.map((m) => {
    const live = stats.find((s) => s.label.toLowerCase().includes(m.label.toLowerCase().split(' ')[0]));
    return live ? { ...m, value: live.value, suffix: live.suffix } : m;
  });

  return (
    <section id="impact" className="section" style={{ background: 'var(--bg-2)' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '3rem' }}
        >
          <span className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Target size={10} /> Impact & Achievements
          </span>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800,
            color: 'var(--text)', letterSpacing: '-0.02em',
          }}>
            Numbers that{' '}
            <span style={{ color: 'var(--accent)' }}>tell the story.</span>
          </h2>
        </motion.div>

        {/* Metrics grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '3rem',
        }}>
          {mergedMetrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card"
              style={{
                padding: '1.75rem 1.5rem', textAlign: 'center',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = m.color + '55';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: m.color,
              }} />
              <div style={{
                width: 44, height: 44, borderRadius: '12px', margin: '0 auto 1rem',
                background: m.color + '15',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <m.icon size={20} style={{ color: m.color }} />
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text)', lineHeight: 1, marginBottom: '0.375rem', letterSpacing: '-0.03em' }}>
                <CountUp to={m.value} suffix={m.suffix} />
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem' }}>
                {m.label}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
                {m.sub}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievements timeline */}
        {achievements.length > 0 && (
          <div>
            <h3 style={{
              fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)',
              marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <Star size={14} style={{ color: '#f59e0b' }} /> Recognition & Awards
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.875rem' }}>
              {achievements.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    display: 'flex', gap: '0.875rem', alignItems: 'flex-start',
                  }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: '9px', flexShrink: 0,
                    background: a.type === 'Award' ? '#f59e0b15' : 'var(--accent-dim)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Trophy size={15} style={{ color: a.type === 'Award' ? '#f59e0b' : 'var(--accent)' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>{a.title}</p>
                    {a.issuer && <p style={{ fontSize: '0.78rem', color: 'var(--accent)', marginTop: '0.2rem' }}>{a.issuer}</p>}
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.2rem' }}>
                      {new Date(a.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
