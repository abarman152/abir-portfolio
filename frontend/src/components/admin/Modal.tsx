'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  loading?: boolean;
}

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

export default function Modal({ open, onClose, title, children, onSubmit, submitLabel = 'Save', loading }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay — light dim, subtle blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
            }}
          />

          {/* Centering shell — static, never animated */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 201,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
            pointerEvents: 'none',
          }}>
          {/* Modal panel — animated independently */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.22, ease: EASE }}
            style={{
              pointerEvents: 'auto',
              width: '100%', maxWidth: '540px',
              maxHeight: '90vh', overflowY: 'auto',
              borderRadius: '18px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-2)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              position: 'sticky', top: 0,
              background: 'var(--bg-card)',
              borderRadius: '18px 18px 0 0',
              zIndex: 1,
            }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>{title}</h2>
              <button
                onClick={onClose}
                style={{
                  width: 30, height: 30, borderRadius: '8px', border: '1px solid var(--border)',
                  background: 'var(--bg-2)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-2)', flexShrink: 0,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'; }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={onSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {children}

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '0.55rem 1.2rem', borderRadius: '9px',
                    border: '1px solid var(--border)', background: 'var(--bg-2)',
                    color: 'var(--text-2)', cursor: 'pointer',
                    fontSize: '0.85rem', fontWeight: 500,
                    transition: 'border-color 0.15s, color 0.15s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'; }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '0.55rem 1.4rem', borderRadius: '9px', border: 'none',
                    background: 'var(--accent)',
                    color: 'white', cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '0.85rem', fontWeight: 600,
                    opacity: loading ? 0.65 : 1,
                    transition: 'opacity 0.15s, filter 0.15s',
                  }}
                  onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = ''; }}
                >
                  {loading ? 'Saving…' : submitLabel}
                </button>
              </div>
            </form>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export function FormField({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: '0.8rem', fontWeight: 600,
        color: 'var(--text-2)', marginBottom: '0.4rem',
      }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export const inputCss: React.CSSProperties = {
  width: '100%', padding: '0.65rem 0.875rem',
  borderRadius: '9px',
  background: 'var(--bg-2)',
  border: '1px solid var(--border-2)',
  color: 'var(--text)',
  fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit',
  transition: 'border-color 0.15s',
};
