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

export default function Modal({ open, onClose, title, children, onSubmit, submitLabel = 'Save', loading }: Props) {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{
              position: 'fixed', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 201, width: '100%', maxWidth: '540px',
              maxHeight: '90vh', overflowY: 'auto',
              borderRadius: '20px',
              background: 'var(--bg-2)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-lg)',
              margin: '1rem',
            }}
          >
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              position: 'sticky', top: 0, background: 'var(--bg-2)', zIndex: 1,
            }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>{title}</h2>
              <button
                onClick={onClose}
                style={{
                  width: 32, height: 32, borderRadius: '8px', border: 'none',
                  background: 'var(--bg-3)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-2)',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={onSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {children}

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '0.6rem 1.25rem', borderRadius: '10px',
                    border: '1px solid var(--border)', background: 'transparent',
                    color: 'var(--text-2)', cursor: 'pointer',
                    fontSize: '0.875rem', fontWeight: 500,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '0.6rem 1.5rem', borderRadius: '10px', border: 'none',
                    background: 'linear-gradient(135deg, var(--accent), var(--accent))',
                    color: 'white', cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem', fontWeight: 600, opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? 'Saving...' : submitLabel}
                </button>
              </div>
            </form>
          </motion.div>
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
  width: '100%', padding: '0.7rem 0.875rem',
  borderRadius: '10px', background: 'var(--bg-3)',
  border: '1px solid var(--border)', color: 'var(--text)',
  fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit',
};
