'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import AdminTable from '@/components/admin/AdminTable';
import Modal, { FormField, inputCss } from '@/components/admin/Modal';
import { api, authHeader } from '@/lib/api';
import type { Skill } from '@/lib/types';

const EMPTY: Partial<Skill> = { name: '', level: 80, category: 'Data Science', order: 0 };
const CATEGORIES = ['Data Science', 'ML', 'Backend', 'Frontend'];

export default function AdminSkills() {
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Partial<Skill>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

  const load = async () => {
    setLoading(true);
    const data = await api.get<Skill[]>('/skills', authHeader(token));
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, level: Number(form.level) };
      if (form.id) await api.put(`/skills/${form.id}`, payload, authHeader(token));
      else await api.post('/skills', payload, authHeader(token));
      setModal(false);
      load();
    } finally { setSaving(false); }
  };

  return (
    <AdminShell>
      <AdminTable
        title="Skills"
        data={items}
        loading={loading}
        columns={[
          { key: 'name', label: 'Skill' },
          { key: 'category', label: 'Category' },
          {
            key: 'level', label: 'Level',
            render: (s) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 80, height: 6, borderRadius: 3, background: 'var(--bg-3)', overflow: 'hidden' }}>
                  <div style={{ width: `${s.level}%`, height: '100%', background: 'var(--accent)', borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600 }}>{s.level}%</span>
              </div>
            ),
          },
        ]}
        onAdd={() => { setForm(EMPTY); setModal(true); }}
        onEdit={(s) => { setForm(s); setModal(true); }}
        onDelete={async (id) => { await api.delete(`/skills/${id}`, authHeader(token)); load(); }}
      />

      <Modal open={modal} onClose={() => setModal(false)} title={form.id ? 'Edit Skill' : 'Add Skill'} onSubmit={handleSubmit} loading={saving}>
        <FormField label="Skill Name" required>
          <input style={inputCss} value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </FormField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormField label="Category">
            <select style={inputCss} value={form.category || 'Data Science'} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </FormField>
          <FormField label={`Level: ${form.level}%`}>
            <input type="range" min={0} max={100} style={{ width: '100%', accentColor: 'var(--accent)' }}
              value={form.level || 80} onChange={(e) => setForm({ ...form, level: Number(e.target.value) })} />
          </FormField>
        </div>
      </Modal>
    </AdminShell>
  );
}
