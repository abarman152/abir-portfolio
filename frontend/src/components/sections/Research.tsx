'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Research } from '@/lib/types';
import PaperCard from '@/components/ui/PaperCard';

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];
const HOME_LIMIT = 3;

export default function ResearchSection({ papers }: { papers: Research[] }) {
  const displayed = papers.slice(0, HOME_LIMIT);

  return (
    <section id="research" className="section" style={{ background: 'var(--bg)' }}>
      <div className="container" style={{ maxWidth: '960px' }}>

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: EASE }}
          style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div>
            <span className="eyebrow">Research &amp; Publications</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Academic <span style={{ color: 'var(--accent)' }}>Contributions</span>
            </h2>
            <p style={{ color: 'var(--text-2)', marginTop: '0.75rem', fontSize: '0.95rem' }}>
              Peer-reviewed research at the intersection of AI, quantum computing, and security.
            </p>
          </div>

          <Link
            href="/research"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.83rem', fontWeight: 600, whiteSpace: 'nowrap', transition: 'border-color 0.15s, color 0.15s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'; }}
          >
            View All Research <ArrowRight size={13} />
          </Link>
        </motion.div>

        {/* ── Cards ── */}
        {displayed.length > 0 ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {displayed.map((paper, i) => (
                <PaperCard key={paper.id} paper={paper} index={i} animate="whileInView" />
              ))}
            </div>

            {papers.length > HOME_LIMIT && (
              <motion.div
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.15, ease: EASE }}
                style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}
              >
                <Link
                  href="/research"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.5rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.18s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'; }}
                >
                  View All Research <ArrowRight size={14} />
                </Link>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.35, ease: EASE }}
            style={{ textAlign: 'center', padding: '3rem 2rem' }}
          >
            <p style={{ fontSize: '0.9rem', color: 'var(--text-3)' }}>Research papers coming soon.</p>
            <Link
              href="/research"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}
            >
              Browse all research <ArrowRight size={13} />
            </Link>
          </motion.div>
        )}

      </div>
    </section>
  );
}
