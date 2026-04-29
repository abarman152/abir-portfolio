'use client';

import { motion } from 'framer-motion';
import { Brain, Database, Code2 } from 'lucide-react';
import type { Skill } from '@/lib/types';

const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  'Data Science': { label: 'Data Science',      color: '#6366f1', icon: Brain },
  'ML':           { label: 'Machine Learning',  color: '#8b5cf6', icon: Brain },
  'Backend':      { label: 'MLOps',             color: '#06b6d4', icon: Database },
};

const SKILL_PROJECTS: Record<string, string> = {
  'Python':              'ml-sentiment-analyzer',
  'TensorFlow / PyTorch': 'ml-sentiment-analyzer',
  'NLP':                 'ml-sentiment-analyzer',
  'Scikit-learn':        'stock-predictor',
  'PostgreSQL':          'data-pipeline-orchestrator',
  'Docker':              'data-pipeline-orchestrator',
};

const DEFAULT_SKILLS: Skill[] = [
  { id: '1',  name: 'Python',                 level: 95, category: 'Data Science', icon: '', order: 1 },
  { id: '2',  name: 'Pandas / NumPy',         level: 92, category: 'Data Science', icon: '', order: 2 },
  { id: '3',  name: 'Data Visualization',     level: 88, category: 'Data Science', icon: '', order: 3 },
  { id: '4',  name: 'SQL',                    level: 85, category: 'Data Science', icon: '', order: 4 },
  { id: '5',  name: 'Statistics & Probability', level: 82, category: 'Data Science', icon: '', order: 5 },
  { id: '6',  name: 'TensorFlow / PyTorch',   level: 85, category: 'ML', icon: '', order: 1 },
  { id: '7',  name: 'Scikit-learn',           level: 92, category: 'ML', icon: '', order: 2 },
  { id: '8',  name: 'NLP',                   level: 80, category: 'ML', icon: '', order: 3 },
  { id: '9',  name: 'Computer Vision',        level: 78, category: 'ML', icon: '', order: 4 },
  { id: '10', name: 'Federated Learning',     level: 75, category: 'ML', icon: '', order: 5 },
  { id: '11', name: 'REST APIs',         level: 90, category: 'Backend', icon: '', order: 1 },
  { id: '12', name: 'Docker',           level: 85, category: 'Backend', icon: '', order: 2 },
  { id: '13', name: 'PostgreSQL',       level: 82, category: 'Backend', icon: '', order: 3 },
  { id: '14', name: 'CI/CD',           level: 75, category: 'Backend', icon: '', order: 4 },
  { id: '15', name: 'Model Deployment', level: 78, category: 'Backend', icon: '', order: 5 },
];

export default function Skills({ skills }: { skills: Skill[] }) {
  const displaySkills = skills.length ? skills : DEFAULT_SKILLS;

  const grouped: Record<string, Skill[]> = {};
  displaySkills.forEach((s) => {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  });

  const catOrder = ['Data Science', 'ML', 'Backend'];
  const sorted = catOrder.filter((c) => grouped[c]).map((c) => [c, grouped[c]] as [string, Skill[]]);

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
          <span className="eyebrow">Skills & Tools</span>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800,
            color: 'var(--text)', letterSpacing: '-0.02em',
          }}>
            Technical <span style={{ color: 'var(--accent)' }}>Toolkit</span>
          </h2>
          <p style={{ color: 'var(--text-2)', marginTop: '0.625rem', fontSize: '0.9rem' }}>
            Skills with a{' '}
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>coloured dot</span>
            {' '}are linked to a project where they were applied in production.
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {sorted.map(([cat, catSkills], catIdx) => {
            const cfg = CATEGORY_CONFIG[cat] || { label: cat, color: 'var(--accent)', icon: Code2 };
            const CatIcon = cfg.icon;
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIdx * 0.08 }}
                className="card"
                style={{ padding: '1.5rem' }}
              >
                {/* Category header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: '9px',
                    background: cfg.color + '15',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CatIcon size={16} style={{ color: cfg.color }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)' }}>
                      {cfg.label}
                    </h3>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>
                      {catSkills.length} skills
                    </p>
                  </div>
                </div>

                {/* Skill tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {catSkills
                    .sort((a, b) => b.level - a.level)
                    .map((skill) => {
                      const linkedSlug = SKILL_PROJECTS[skill.name];
                      return (
                        <span
                          key={skill.id}
                          className="tag"
                          title={linkedSlug ? `Used in: ${linkedSlug.replace(/-/g, ' ')}` : undefined}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          {skill.name}
                          {linkedSlug && (
                            <span style={{
                              width: 5, height: 5, borderRadius: '50%',
                              background: cfg.color, flexShrink: 0,
                            }} />
                          )}
                        </span>
                      );
                    })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
