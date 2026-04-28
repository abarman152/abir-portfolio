'use client';

import { motion } from 'framer-motion';
import { Brain, Database, Lightbulb } from 'lucide-react';

const PILLARS = [
  {
    icon: Brain,
    title: 'Machine Learning',
    desc: 'Designing and deploying ML models that solve real problems — from NLP and computer vision to anomaly detection and forecasting.',
    color: '#6366f1',
  },
  {
    icon: Database,
    title: 'Data Engineering',
    desc: 'Building robust data pipelines, ETL systems, and analytics infrastructure that make data reliable and decision-ready.',
    color: '#8b5cf6',
  },
  {
    icon: Lightbulb,
    title: 'Research & Innovation',
    desc: 'Published researcher in quantum-enhanced NLP, post-quantum cryptography, and evolutionary optimization bridging theory with production systems.',
    color: '#f59e0b',
  },
];

export default function About() {
  return (
    <section id="about" className="section" style={{ background: 'var(--bg-2)' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '4rem',
            alignItems: 'start',
          }}
          className="about-grid"
        >
          {/* Left — Story */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="eyebrow">About Me</span>

            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', fontWeight: 800,
              color: 'var(--text)', lineHeight: 1.25,
              letterSpacing: '-0.02em', marginBottom: '1.5rem',
            }}>
              Turning raw data into{' '}
              <span style={{ color: 'var(--accent)' }}>decisions that matter.</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                "I'm a Data Scientist and ML Engineer who loves the full journey — from exploring messy datasets to shipping production systems that make a measurable difference.",
                "My work sits at the intersection of machine learning, research, and data storytelling. I build systems that don't just predict — they explain, alert, and act.",
                "Outside of professional work, I contribute to research in quantum computing, NLP, and evolutionary optimization, compete on platforms like LeetCode and Codeforces, and explore applied AI systems.",
              ].map((text, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  style={{ color: 'var(--text-2)', lineHeight: 1.85, fontSize: '0.95rem' }}
                >
                  {text}
                </motion.p>
              ))}
            </div>

            {/* Tech tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.75rem' }}>
              {['Python', 'PyTorch', 'TensorFlow', 'scikit-learn', 'PostgreSQL', 'Docker', 'Airflow', 'Quantum ML'].map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </motion.div>

          {/* Right — Pillars (3 cards, stacked column) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="card"
                style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = p.color + '44';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: '10px', flexShrink: 0,
                  background: p.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <p.icon size={17} style={{ color: p.color }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.375rem' }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.65 }}>
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
