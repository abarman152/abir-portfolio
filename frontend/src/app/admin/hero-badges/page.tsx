'use client';

import { useEffect, useState, useCallback } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import AdminTable from '@/components/admin/AdminTable';
import Modal, { FormField, inputCss } from '@/components/admin/Modal';
import { api, authHeader } from '@/lib/api';
import type { HeroBadge } from '@/lib/types';

const POSITIONS = ['top-right', 'top-left', 'bottom-left', 'bottom-right'];
const ICONS = ['Brain', 'FolderOpen', 'BookOpen', 'Star', 'Trophy', 'Zap', 'Award', 'GraduationCap', 'Code2'];

const EMPTY: Partial<HeroBadge> = {
  label: '', position: 'top-right', icon: 'Brain', isActive: true, order: 0,
};

function getToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('admin_token') || '';
}

export default function AdminHeroBadges() {
  const [items,   setItems]   = useState<HeroBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState<Partial<HeroBadge>>(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const flash = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 2500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<HeroBadge[]>('/hero-badges/all', authHeader(getToken()));
      setItems(data);
    } catch (err) {
      console.error('Failed to load hero badges:', err);
      setError('Failed to load badges. Check if the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setForm({ ...EMPTY });
    setModal(true);
  };

  const openEdit = (b: HeroBadge) => {
    setForm({ ...b });
    setModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      label: form.label,
      position: form.position,
      icon: form.icon,
      isActive: form.isActive,
      order: Number(form.order) || 0,
    };
    try {
      if (form.id) {
        await api.put(`/hero-badges/${form.id}`, payload, authHeader(getToken()));
        flash('Badge updated!');
      } else {
        await api.post('/hero-badges', payload, authHeader(getToken()));
        flash('Badge created!');
      }
      setModal(false);
      await load();
    } catch (err) {
      console.error('Save failed:', err);
      setError(`Save failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError('');
    try {
      await api.delete(`/hero-badges/${id}`, authHeader(getToken()));
      flash('Badge deleted');
      await load();
    } catch (err) {
      console.error('Delete failed:', err);
      setError(`Delete failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const toggleActive = async (item: HeroBadge) => {
    setError('');
    try {
      await api.patch(`/hero-badges/${item.id}/toggle`, {}, authHeader(getToken()));
      flash(`Badge ${item.isActive ? 'deactivated' : 'activated'}`);
      await load();
    } catch (err) {
      console.error('Toggle failed:', err);
      setError(`Toggle failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <AdminShell>
      {/* Success / Error banners */}
      {success && (
        <div style={{
          padding: '0.6rem 1rem', borderRadius: '10px', marginBottom: '1rem',
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
          color: '#10b981', fontSize: '0.85rem', fontWeight: 600,
        }}>
          ✓ {success}
        </div>
      )}
      {error && (
        <div style={{
          padding: '0.6rem 1rem', borderRadius: '10px', marginBottom: '1rem',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          color: '#ef4444', fontSize: '0.85rem', fontWeight: 600,
        }}>
          ✕ {error}
        </div>
      )}

      <AdminTable
        title="Hero Badges"
        data={items}
        loading={loading}
        columns={[
          { key: 'label', label: 'Label' },
          { key: 'icon', label: 'Icon', render: (b) => (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)' }}>{b.icon || '—'}</span>
          )},
          { key: 'position', label: 'Position', render: (b) => (
            <span style={{
              padding: '0.2rem 0.5rem', borderRadius: '5px',
              background: 'var(--bg-3)', border: '1px solid var(--border)',
              fontSize: '0.72rem', fontWeight: 600, fontFamily: 'var(--font-mono)',
            }}>
              {b.position}
            </span>
          )},
          { key: 'order', label: 'Order' },
          {
            key: 'isActive', label: 'Active',
            render: (b) => (
              <button
                onClick={(e) => { e.stopPropagation(); toggleActive(b); }}
                title={b.isActive ? 'Click to deactivate' : 'Click to activate'}
                style={{
                  width: 28, height: 28, borderRadius: '7px', border: 'none', cursor: 'pointer',
                  background: b.isActive ? 'rgba(99,102,241,0.12)' : 'var(--bg-3)',
                  color: b.isActive ? 'var(--accent)' : 'var(--text-3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {b.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
            ),
          },
        ]}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={form.id ? 'Edit Badge' : 'Add Badge'}
        onSubmit={handleSubmit}
        loading={saving}
      >
        {/* Label */}
        <FormField label="Label" required>
          <input style={inputCss} value={form.label || ''} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder='e.g. "40+ Projects"' required />
        </FormField>

        {/* Icon + Position */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
          <FormField label="Icon">
            <select style={inputCss} value={form.icon || 'Brain'} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
              {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </FormField>
          <FormField label="Position">
            <select style={inputCss} value={form.position || 'top-right'} onChange={(e) => setForm({ ...form, position: e.target.value })}>
              {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </FormField>
        </div>

        {/* Order */}
        <FormField label="Display Order">
          <input type="number" style={{ ...inputCss, width: '120px' }} value={form.order ?? 0} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} min={0} />
        </FormField>

        {/* Active toggle */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-2)' }}>
          <input type="checkbox" checked={form.isActive !== false} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} style={{ accentColor: 'var(--accent)', width: 15, height: 15 }} />
          Active on site
        </label>

        {/* Preview */}
        <div>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>PREVIEW</p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
            padding: '0.5rem 0.875rem', borderRadius: '10px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)', backdropFilter: 'blur(12px)',
            fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)',
          }}>
            <span style={{ color: 'var(--accent)', fontSize: '0.82rem' }}>✦</span>
            {form.label || 'Badge Label'}
          </div>
        </div>
      </Modal>
    </AdminShell>
  );
}
