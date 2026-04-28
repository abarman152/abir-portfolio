'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MailOpen, Trash2, Check } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { api, authHeader } from '@/lib/api';
import type { ContactMessage } from '@/lib/types';

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

  const load = async () => {
    setLoading(true);
    const data = await api.get<ContactMessage[]>('/contact', authHeader(token));
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await api.patch(`/contact/${id}/read`, {}, authHeader(token));
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await api.delete(`/contact/${id}`, authHeader(token));
    if (selected?.id === id) setSelected(null);
    load();
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <AdminShell>
      <div>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>Messages</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            {messages.length} total · <span style={{ color: unread > 0 ? '#ef4444' : 'var(--text-3)' }}>{unread} unread</span>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.25rem', minHeight: '500px' }}>
          {/* List */}
          <div style={{
            borderRadius: '16px', overflow: 'hidden',
            border: '1px solid var(--border)', background: 'var(--bg-card)',
            display: 'flex', flexDirection: 'column',
          }}>
            {loading ? (
              <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-3)' }}>Loading...</p>
            ) : messages.length === 0 ? (
              <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-3)' }}>No messages yet</p>
            ) : (
              messages.map((m) => (
                <motion.div
                  key={m.id}
                  whileHover={{ x: 2 }}
                  onClick={() => { setSelected(m); if (!m.read) markRead(m.id); }}
                  style={{
                    padding: '1rem', borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    background: selected?.id === m.id ? 'var(--accent-dim)' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                      {m.read
                        ? <MailOpen size={14} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                        : <Mail size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                      }
                      <span style={{
                        fontWeight: m.read ? 400 : 700,
                        fontSize: '0.875rem', color: 'var(--text)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {m.name}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-3)', flexShrink: 0 }}>
                      {new Date(m.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '0.8rem', color: 'var(--text-2)', marginTop: '0.25rem',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {m.subject}
                  </p>
                </motion.div>
              ))
            )}
          </div>

          {/* Detail */}
          <div style={{
            borderRadius: '16px', border: '1px solid var(--border)',
            background: 'var(--bg-card)', padding: '1.75rem',
          }}>
            {selected ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>{selected.subject}</h2>
                    <p style={{ color: 'var(--text-2)', fontSize: '0.875rem', marginTop: '0.3rem' }}>
                      From: <strong>{selected.name}</strong> &lt;{selected.email}&gt;
                    </p>
                    <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                      {new Date(selected.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!selected.read && (
                      <button onClick={() => markRead(selected.id)} style={{
                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                        padding: '0.4rem 0.875rem', borderRadius: '8px', border: 'none',
                        background: 'var(--accent-dim)', color: 'var(--accent)',
                        fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600,
                      }}>
                        <Check size={13} /> Mark Read
                      </button>
                    )}
                    <button onClick={() => handleDelete(selected.id)} style={{
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                      padding: '0.4rem 0.875rem', borderRadius: '8px', border: 'none',
                      background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                      fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600,
                    }}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
                <div style={{
                  padding: '1.25rem', borderRadius: '12px',
                  background: 'var(--bg-3)', border: '1px solid var(--border)',
                  color: 'var(--text)', lineHeight: 1.7, fontSize: '0.9rem',
                  whiteSpace: 'pre-wrap',
                }}>
                  {selected.message}
                </div>
              </div>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)' }}>
                <div style={{ textAlign: 'center' }}>
                  <Mail size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                  <p>Select a message to read</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
