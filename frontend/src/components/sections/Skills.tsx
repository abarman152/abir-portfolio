'use client';

import { motion } from 'framer-motion';
import { Brain, Database, Code2, Layers, Cpu } from 'lucide-react';
import type { SkillCategoryWithSkills } from '@/lib/types';

const ICON_MAP: Record<string, React.ElementType> = {
  'Data Science': Brain,
  'ML':           Brain,
  'Backend':      Database,
  'Frontend':     Code2,
  'MLOps':        Cpu,
};

const PALETTE = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const DEFAULT_CATEGORIES: SkillCategoryWithSkills[] = [
  {
    id: '1', name: 'Data Science', order: 0, createdAt: '',
    skills: [
      { id: '1',  name: 'Python',                   level: 95, category: 'Data Science', icon: '', order: 1, isHighlighted: true  },
      { id: '2',  name: 'Pandas / NumPy',           level: 92, category: 'Data Science', icon: '', order: 2, isHighlighted: false },
      { id: '3',  name: 'Data Visualization',       level: 88, category: 'Data Science', icon: '', order: 3, isHighlighted: false },
      { id: '4',  name: 'SQL',                      level: 85, category: 'Data Science', icon: '', order: 4, isHighlighted: false },
      { id: '5',  name: 'Statistics & Probability', level: 82, category: 'Data Science', icon: '', order: 5, isHighlighted: false },
    ],
  },
  {
    id: '2', name: 'ML', order: 1, createdAt: '',
    skills: [
      { id: '6',  name: 'TensorFlow / PyTorch', level: 85, category: 'ML', icon: '', order: 1, isHighlighted: true  },
      { id: '7',  name: 'Scikit-learn',         level: 92, category: 'ML', icon: '', order: 2, isHighlighted: true  },
      { id: '8',  name: 'NLP',                  level: 80, category: 'ML', icon: '', order: 3, isHighlighted: true  },
      { id: '9',  name: 'Computer Vision',      level: 78, category: 'ML', icon: '', order: 4, isHighlighted: false },
      { id: '10', name: 'Federated Learning',   level: 75, category: 'ML', icon: '', order: 5, isHighlighted: false },
    ],
  },
  {
    id: '3', name: 'Backend', order: 2, createdAt: '',
    skills: [
      { id: '11', name: 'REST APIs',        level: 90, category: 'Backend', icon: '', order: 1, isHighlighted: false },
      { id: '12', name: 'Docker',           level: 85, category: 'Backend', icon: '', order: 2, isHighlighted: true  },
      { id: '13', name: 'PostgreSQL',       level: 82, category: 'Backend', icon: '', order: 3, isHighlighted: true  },
      { id: '14', name: 'CI/CD',            level: 75, category: 'Backend', icon: '', order: 4, isHighlighted: false },
      { id: '15', name: 'Model Deployment', level: 78, category: 'Backend', icon: '', order: 5, isHighlighted: false },
    ],
  },
];

export default function Skills({ categories }: { categories: SkillCategoryWithSkills[] }) {
  const display = categories.length ? categories : DEFAULT_CATEGORIES;

  return (
    <section id="skills" className="section" style={{ background: 'var(--bg)' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          style={{ marginBottom: '3rem' }}
        >
          <span className="eyebrow">Skills &amp; Tools</span>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800,
            color: 'var(--text)', letterSpacing: '-0.02em',
          }}>
            Technical <span style={{ color: 'var(--accent)' }}>Toolkit</span>
          </h2>
          <p style={{ color: 'var(--text-2)', marginTop: '0.625rem', fontSize: '0.9rem' }}>
            Skills with a{' '}
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>coloured dot</span>
            {' '}are highlighted as key competencies.
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {display.map((cat, idx) => {
            const CatIcon = ICON_MAP[cat.name] ?? Layers;
            const color = PALETTE[idx % PALETTE.length];
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="card"
                style={{ padding: '1.5rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: '9px',
                    background: color + '15',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CatIcon size={16} style={{ color }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)' }}>
                      {cat.name}
                    </h3>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>
                      {cat.skills.length} skills
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {[...cat.skills]
                    .sort((a, b) => b.level - a.level)
                    .map((skill) => (
                      <span
                        key={skill.id}
                        className="tag"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        {skill.name}
                        {skill.isHighlighted && (
                          <span style={{
                            width: 5, height: 5, borderRadius: '50%',
                            background: color, flexShrink: 0,
                          }} />
                        )}
                      </span>
                    ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
