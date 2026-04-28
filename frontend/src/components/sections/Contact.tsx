'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { api } from '@/lib/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
    setTimeout(() => setStatus('idle'), 4000);
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    background: 'var(--bg-3)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.15s',
    fontFamily: 'inherit',
  } as React.CSSProperties;

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'var(--accent)';
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'var(--border)';
  };

  return (
    <section id="contact" className="section" style={{ background: 'var(--bg)' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '3rem' }}
        >
          <span className="eyebrow">Contact</span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Get In <span style={{ color: 'var(--accent)' }}>Touch</span>
          </h2>
          <p style={{ color: 'var(--text-2)', marginTop: '0.625rem', fontSize: '0.95rem' }}>
            Open for collaborations, opportunities, and interesting conversations.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>
              Let&apos;s work together
            </h3>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '2rem', fontSize: '0.9rem' }}>
              Whether you have a data science problem to solve, a project to build, or just want to connect — I&apos;m always happy to chat.
            </p>

            {[
              { icon: Mail,  label: 'Email',         value: 'abirbarman@proton.me' },
              { icon: Phone, label: 'Phone',         value: '+91 8670321835' },
              { icon: MapPin, label: 'Location',     value: 'Bengaluru, India' },
              { icon: Clock, label: 'Response Time', value: 'Within 24 hours' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ display: 'flex', gap: '0.875rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '9px',
                  background: 'var(--bg-3)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={15} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: 500 }}>{label}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text)', fontWeight: 600 }}>{value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-2)', fontWeight: 500, marginBottom: '0.35rem' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="John Doe"
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-2)', fontWeight: 500, marginBottom: '0.35rem' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    placeholder="john@example.com"
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-2)', fontWeight: 500, marginBottom: '0.35rem' }}>
                  Subject
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                  placeholder="Project collaboration"
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-2)', fontWeight: 500, marginBottom: '0.35rem' }}>
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  placeholder="Tell me about your project..."
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              <motion.button
                type="submit"
                disabled={status === 'loading'}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--accent)',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  opacity: status === 'loading' ? 0.7 : 1,
                  transition: 'opacity 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                {status === 'loading' ? (
                  <span style={{ display: 'flex', gap: '4px' }}>
                    {[0, 1, 2].map((i) => (
                      <span key={i} style={{
                        width: 5, height: 5, borderRadius: '50%', background: 'white',
                        animation: `bounce 0.8s ease infinite ${i * 0.16}s`,
                      }} />
                    ))}
                  </span>
                ) : status === 'success' ? (
                  <><CheckCircle size={15} /> Message Sent!</>
                ) : status === 'error' ? (
                  <><AlertCircle size={15} /> Failed to send</>
                ) : (
                  <><Send size={15} /> Send Message</>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </section>
  );
}
