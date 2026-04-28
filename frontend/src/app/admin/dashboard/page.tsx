'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, BookOpen, Award, Trophy, MessageSquare, TrendingUp, Users, Eye } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { api, authHeader } from '@/lib/api';
import Link from 'next/link';

interface Counts {
  projects: number;
  papers: number;
  certs: number;
  achievements: number;
  messages: number;
  unread: number;
}

const CARDS = [
  { key: 'projects', label: 'Projects', icon: FolderOpen, href: '/admin/projects', color: '#6366f1' },
  { key: 'papers', label: 'Research Papers', icon: BookOpen, href: '/admin/research', color: '#8b5cf6' },
  { key: 'certs', label: 'Certifications', icon: Award, href: '/admin/certifications', color: '#06b6d4' },
  { key: 'achievements', label: 'Achievements', icon: Trophy, href: '/admin/achievements', color: '#f59e0b' },
  { key: 'messages', label: 'Messages', icon: MessageSquare, href: '/admin/messages', color: '#10b981' },
  { key: 'unread', label: 'Unread Messages', icon: TrendingUp, href: '/admin/messages', color: '#ef4444' },
];

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts>({ projects: 0, papers: 0, certs: 0, achievements: 0, messages: 0, unread: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token') || '';
    const headers = authHeader(token);

    Promise.all([
      api.get<unknown[]>('/projects', headers),
      api.get<unknown[]>('/research', headers),
      api.get<unknown[]>('/certifications', headers),
      api.get<unknown[]>('/achievements', headers),
      api.get<{ read: boolean }[]>('/contact', headers),
    ]).then(([projects, papers, certs, achievements, messages]) => {
      setCounts({
        projects: projects.length,
        papers: papers.length,
        certs: certs.length,
        achievements: achievements.length,
        messages: messages.length,
        unread: messages.filter((m) => !m.read).length,
      });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell>
      <div style={{ maxWidth: '1000px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-2)', marginTop: '0.25rem' }}>Overview of your portfolio content</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {CARDS.map(({ key, label, icon: Icon, href, color }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Link href={href} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  style={{
                    padding: '1.5rem', borderRadius: '16px',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.75rem',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: '12px',
                    background: `${color}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 500 }}>{label}</p>
                    <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.1 }}>
                      {loading ? '—' : counts[key as keyof Counts]}
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={16} style={{ color: 'var(--accent)' }} /> Quick Actions
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {[
              { href: '/admin/projects', label: '+ New Project' },
              { href: '/admin/research', label: '+ New Paper' },
              { href: '/admin/certifications', label: '+ Certification' },
              { href: '/admin/achievements', label: '+ Achievement' },
              { href: '/', label: '↗ View Portfolio', target: '_blank' },
            ].map(({ href, label, target }) => (
              <Link
                key={href + label}
                href={href}
                target={target}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-2)',
                  color: 'var(--text)', textDecoration: 'none',
                  fontSize: '0.85rem', fontWeight: 500,
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Info */}
        <div style={{
          marginTop: '1.5rem', padding: '1rem 1.5rem', borderRadius: '12px',
          background: 'var(--accent-dim)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
        }}>
          <Users size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>
            Logged in as admin. All changes are reflected on the portfolio immediately.
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
