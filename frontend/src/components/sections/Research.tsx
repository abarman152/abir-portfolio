'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Users, Calendar, Award, BookOpen } from 'lucide-react';
import type { ResearchPaper } from '@/lib/types';

const DEFAULT_PAPERS: ResearchPaper[] = [
  {
    id: '1',
    title: 'Bridging Quantum Computing and NLP: A Novel Framework for Advanced Bias Detection with Next-Generation Computing',
    abstract: 'Proposes a hybrid quantum-classical framework for bias detection in NLP using quantum embeddings and kernel methods. Demonstrates improved accuracy and sensitivity for complex linguistic bias patterns.',
    authors: [
      'Dr. M.K. Jayanthi Kannan',
      'Abir Barman',
      'Anjali Yadav',
      'Samikshya Pruseth',
      'Santosini Sahu',
    ],
    journal: 'IJFMR',
    year: 2025,
    doi: '',
    paperUrl: '#',
    tags: ['Quantum Computing', 'NLP', 'Bias Detection', 'Quantum ML'],
    featured: true,
  },
  {
    id: '2',
    title: 'LogiX: AI-Driven Secure Login System with Quantum-Resistant Algorithms and Multi-Factor Authentication',
    abstract: 'Introduces a secure authentication framework integrating post-quantum cryptography, anomaly detection, and adaptive multi-factor authentication to address evolving cybersecurity threats.',
    authors: [
      'Dr. M.K. Jayanthi Kannan',
      'Abir Barman',
      'Anjali Yadav',
      'Samikshya Pruseth',
      'Santosini Sahu',
    ],
    journal: 'IJARIIT',
    year: 2025,
    doi: '',
    paperUrl: '#',
    tags: ['Cybersecurity', 'Quantum Cryptography', 'AI Security', 'Authentication'],
    featured: false,
  },
  {
    id: '3',
    title: 'Classification Using Neural Network and Genetic Algorithm',
    abstract: 'Explores a hybrid AI approach combining neural networks and genetic algorithms to optimize model structure and weights. Addresses limitations of traditional backpropagation by improving convergence speed and classification accuracy through evolutionary optimization.',
    authors: ['Abir Barman', 'Muskan Sinha'],
    journal: 'New Delhi Publishers',
    year: 2025,
    doi: '',
    paperUrl: '',
    tags: ['Neural Networks', 'Genetic Algorithm', 'Optimization', 'Machine Learning'],
    featured: false,
  },
];

export default function Research({ papers }: { papers: ResearchPaper[] }) {
  const displayPapers = papers.length ? papers : DEFAULT_PAPERS;

  return (
    <section id="research" className="section" style={{ background: 'var(--bg)' }}>
      <div className="container" style={{ maxWidth: '960px' }}>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          style={{ marginBottom: '3rem' }}
        >
          <span className="eyebrow">Research & Publications</span>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800,
            color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.2,
          }}>
            Academic <span style={{ color: 'var(--accent)' }}>Contributions</span>
          </h2>
          <p style={{ color: 'var(--text-2)', marginTop: '0.75rem', fontSize: '0.95rem' }}>
            Peer-reviewed research at the intersection of AI, quantum computing, and security.
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {displayPapers.map((paper, i) => (
            <motion.article
              key={paper.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card"
              style={{
                padding: '1.75rem 1.75rem 1.75rem 2rem',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              }}
            >
              {/* Left accent bar */}
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
                background: paper.featured ? '#f59e0b' : 'var(--accent)',
              }} />

              {/* Top row */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', flexWrap: 'wrap',
                gap: '0.75rem', marginBottom: '0.875rem',
              }}>
                <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {paper.featured && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                      padding: '0.2rem 0.55rem', borderRadius: '5px',
                      background: '#f59e0b15', border: '1px solid #f59e0b33',
                      color: '#f59e0b', fontSize: '0.68rem', fontWeight: 700,
                    }}>
                      <Award size={9} /> Featured
                    </span>
                  )}
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                    color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600,
                  }}>
                    <BookOpen size={12} />
                    {paper.journal}
                  </span>
                  <span style={{
                    color: 'var(--text-3)', fontSize: '0.75rem',
                    display: 'flex', alignItems: 'center', gap: '0.25rem',
                  }}>
                    <Calendar size={11} /> {paper.year}
                  </span>
                </div>

                {paper.paperUrl && (
                  <a
                    href={paper.paperUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                    style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                  >
                    View Publication <ExternalLink size={12} />
                  </a>
                )}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '1rem', fontWeight: 700, color: 'var(--text)',
                lineHeight: 1.45, marginBottom: '0.625rem',
              }}>
                {paper.title}
              </h3>

              {/* Abstract */}
              <p style={{
                fontSize: '0.875rem', color: 'var(--text-2)',
                lineHeight: 1.75, marginBottom: '1.25rem',
                display: '-webkit-box', WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {paper.abstract}
              </p>

              {/* Footer */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-3)', fontSize: '0.78rem' }}>
                  <Users size={12} />
                  <span>{paper.authors.join(', ')}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {paper.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
