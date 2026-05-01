'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code2, GitFork, Trophy, FileText, TrendingUp } from 'lucide-react';
import type { Stat } from '@/lib/types';

const ICON_MAP: Record<string, React.ElementType> = {
  Code2, Github: GitFork, GitFork, Trophy, FileText, TrendingUp,
};

const ENRICHED: Record<string, { sub: string; color: string }> = {
  'LeetCode Solved':    { sub: 'Algorithmic problems',     color: '#f59e0b' },
  'GitHub Repos':       { sub: 'Open source projects',     color: '#10b981' },
  'Codeforces Rating':  { sub: 'Competitive programming',  color: '#ef4444' },
  'Research Papers':    { sub: 'Peer-reviewed publications', color: '#6366f1' },
};

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const steps = 55; const dur = 1800; const inc = target / steps; let cur = 0;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { setCount(target); clearInterval(t); } else setCount(Math.floor(cur));
    }, dur / steps);
    return () => clearInterval(t);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString('en-US')}{suffix}</span>;
}

const DEFAULT_STATS: Stat[] = [
  { id: '1', label: 'LeetCode Solved',    value: 350,  suffix: '+', icon: 'Code2',    order: 1 },
  { id: '2', label: 'GitHub Repos',       value: 42,   suffix: '',  icon: 'GitFork',  order: 2 },
  { id: '3', label: 'Codeforces Rating',  value: 1450, suffix: '',  icon: 'Trophy',   order: 3 },
  { id: '4', label: 'Research Papers',    value: 3,    suffix: '',  icon: 'FileText', order: 4 },
];

export default function Stats({ stats }: { stats: Stat[] }) {
  const displayStats = stats.length ? stats : DEFAULT_STATS;

  return (
    <section
      id="stats"
      style={{
        padding: '4rem 2rem',
        background: 'var(--bg-2)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1px',
          background: 'var(--border)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          {displayStats.map((stat, i) => {
            const Icon = ICON_MAP[stat.icon] || TrendingUp;
            const enriched = ENRICHED[stat.label];
            const color = enriched?.color || 'var(--accent)';

            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] } }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                style={{
                  padding: '2rem 1.75rem',
                  background: 'var(--bg-card)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                  gap: '0.5rem',
                  transition: 'background 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--bg-3)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--bg-card)')}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: '10px',
                  background: color + '15',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={18} style={{ color }} />
                </div>

                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text)', lineHeight: 1, letterSpacing: '-0.03em' }}>
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>
                  {stat.label}
                </div>

                {enriched && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>{enriched.sub}</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
