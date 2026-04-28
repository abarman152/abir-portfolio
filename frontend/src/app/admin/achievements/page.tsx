'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import AdminTable from '@/components/admin/AdminTable';
import Modal, { FormField, inputCss } from '@/components/admin/Modal';
import { api, authHeader } from '@/lib/api';
import type { Achievement } from '@/lib/types';

const EMPTY: Partial<Achievement> = {
  title: '', description: '', date: '', issuer: '',
  type: 'Award', tags: [], featured: false, visible: true, order: 0,
};

const TYPES = ['Award', 'Academic', 'Competition', 'Professional', 'Other'];

export default function AdminAchievements() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Partial<Achievement>>(EMPTY);
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

  const load = async () => {
    setLoading(true);
    const data = await api.get<Achievement[]>('/achievements', authHeader(token));
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm(EMPTY);
    setTagsInput('');
    setModal(true);
  };

  const openEdit = (a: Achievement) => {
    setForm({ ...a, date: a.date?.slice(0, 10) });
    setTagsInput(Array.isArray(a.tags) ? a.tags.join(', ') : '');
    setModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const payload = { ...form, tags };
    try {
      if (form.id) await api.put(`/achievements/${form.id}`, payload, authHeader(token));
      else await api.post('/achievements', payload, authHeader(token));
      setModal(false);
      load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/achievements/${id}`, authHeader(token));
    load();
  };

  const toggleVisibility = async (item: Achievement) => {
    await api.patch(`/achievements/${item.id}/visibility`, { visible: !item.visible }, authHeader(token));
    load();
  };

  return (
    <AdminShell>
      <AdminTable
        title="Achievements"
        data={items}
        loading={loading}
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'issuer', label: 'Organization' },
          { key: 'type', label: 'Type' },
          { key: 'featured', label: 'Featured', render: (a) => a.featured ? '★' : '—' },
          { key: 'date', label: 'Date', render: (a) => new Date(a.date).toLocaleDateString() },
          {
            key: 'visible',
            label: 'Visible',
            render: (a) => (
              <button
                onClick={() => toggleVisibility(a)}
                title={a.visible ? 'Click to hide' : 'Click to show'}
                style={{
                  width: 28, height: 28, borderRadius: '7px', border: 'none', cursor: 'pointer',
                  background: a.visible ? 'rgba(99,102,241,0.12)' : 'var(--bg-3)',
                  color: a.visible ? 'var(--accent)' : 'var(--text-3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {a.visible ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
            ),
          },
        ]}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
      />

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={form.id ? 'Edit Achievement' : 'Add Achievement'}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <FormField label="Title" required>
          <input style={inputCss} value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </FormField>

        <FormField label="Organization / Issuer">
          <input style={inputCss} value={form.issuer || ''} onChange={(e) => setForm({ ...form, issuer: e.target.value })} placeholder="e.g. Asia Research Awards" />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormField label="Date" required>
            <input type="date" style={inputCss} value={form.date || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          </FormField>
          <FormField label="Type / Category">
            <select style={inputCss} value={form.type || 'Award'} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </FormField>
        </div>

        <FormField label="Description">
          <textarea
            rows={4}
            style={{ ...inputCss, resize: 'vertical' }}
            value={form.description || ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the achievement…"
          />
        </FormField>

        <FormField label="Tags (comma-separated)">
          <input
            style={inputCss}
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. AI Security, Quantum Computing, Research Award"
          />
        </FormField>

        {/* Toggles */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-2)' }}>
            <input
              type="checkbox"
              checked={!!form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              style={{ accentColor: 'var(--accent)', width: 15, height: 15 }}
            />
            Featured
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-2)' }}>
            <input
              type="checkbox"
              checked={form.visible !== false}
              onChange={(e) => setForm({ ...form, visible: e.target.checked })}
              style={{ accentColor: 'var(--accent)', width: 15, height: 15 }}
            />
            Visible on site
          </label>
        </div>
      </Modal>
    </AdminShell>
  );
}
