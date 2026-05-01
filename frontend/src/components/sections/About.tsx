'use client';

import { motion } from 'framer-motion';
import {
  Brain, Database, Lightbulb, ArrowRight, Code2, BarChart3,
  Globe, Cpu, Layers, Rocket, Server, Shield, Zap, BookOpen,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import type { AboutSectionData } from '@/lib/types';

/* Map icon-name strings (stored in DB) → Lucide components */
const ICON_MAP: Record<string, LucideIcon> = {
  Brain, Database, Lightbulb, Code2, BarChart3,
  Globe, Cpu, Layers, Rocket, Server, Shield, Zap, BookOpen,
};

interface Props {
  section: AboutSectionData;
}

export default function About({ section }: Props) {
  const { headline, highlight, paragraphs, skills, categories } = section;

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
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          >
            <span className="eyebrow">About Me</span>

            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', fontWeight: 800,
              color: 'var(--text)', lineHeight: 1.25,
              letterSpacing: '-0.02em', marginBottom: '1.5rem',
            }}>
              {headline}{' '}
              <span style={{ color: 'var(--accent)' }}>{highlight}</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {paragraphs.map((text, i) => (
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
              {skills.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>

            {/* View More */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 }}
              style={{ marginTop: '2rem' }}
            >
              <Link
                href="/about"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.65rem 1.4rem',
                  borderRadius: '9px',
                  border: '1px solid var(--border)',
                  background: 'transparent', color: 'var(--text)',
                  fontSize: '0.875rem', fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text)';
                }}
              >
                View Full Profile <ArrowRight size={14} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right — Pillars (dynamic category cards) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {categories.map((cat, i) => {
              const IconComponent = ICON_MAP[cat.icon] || Brain;
              const color = cat.color || '#6366f1';

              return (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="card"
                  style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = color + '44';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: '10px', flexShrink: 0,
                    background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <IconComponent size={17} style={{ color }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.375rem' }}>
                      {cat.title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.65 }}>
                      {cat.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
