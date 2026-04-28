'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import AdminTable from '@/components/admin/AdminTable';
import Modal, { FormField, inputCss } from '@/components/admin/Modal';
import { api, authHeader } from '@/lib/api';
import type { Stat } from '@/lib/types';

const EMPTY: Partial<Stat> = { label: '', value: 0, suffix: '', icon: '', order: 0 };

export default function AdminStats() {
  const [items, setItems] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Partial<Stat>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

  const load = async () => {
    setLoading(true);
    const data = await api.get<Stat[]>('/stats', authHeader(token));
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, value: Number(form.value) };
      if (form.id) await api.put(`/stats/${form.id}`, payload, authHeader(token));
      else await api.post('/stats', payload, authHeader(token));
      setModal(false);
      load();
    } finally { setSaving(false); }
  };

  return (
    <AdminShell>
      <AdminTable
        title="Stats"
        data={items}
        loading={loading}
        columns={[
          { key: 'label', label: 'Label' },
          { key: 'value', label: 'Value' },
          { key: 'suffix', label: 'Suffix' },
          { key: 'icon', label: 'Icon' },
        ]}
        onAdd={() => { setForm(EMPTY); setModal(true); }}
        onEdit={(s) => { setForm(s); setModal(true); }}
        onDelete={async (id) => { await api.delete(`/stats/${id}`, authHeader(token)); load(); }}
      />

      <Modal open={modal} onClose={() => setModal(false)} title={form.id ? 'Edit Stat' : 'Add Stat'} onSubmit={handleSubmit} loading={saving}>
        <FormField label="Label" required>
          <input style={inputCss} value={form.label || ''} onChange={(e) => setForm({ ...form, label: e.target.value })} required placeholder="LeetCode Solved" />
        </FormField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormField label="Value" required>
            <input type="number" style={inputCss} value={form.value ?? 0} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} required />
          </FormField>
          <FormField label="Suffix">
            <input style={inputCss} value={form.suffix || ''} onChange={(e) => setForm({ ...form, suffix: e.target.value })} placeholder="+, k, %" />
          </FormField>
        </div>
        <FormField label="Icon (Lucide name)">
          <input style={inputCss} value={form.icon || ''} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Code2, Github, Trophy..." />
        </FormField>
      </Modal>
    </AdminShell>
  );
}
