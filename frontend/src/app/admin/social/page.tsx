'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import AdminTable from '@/components/admin/AdminTable';
import Modal, { FormField, inputCss } from '@/components/admin/Modal';
import { api, authHeader } from '@/lib/api';
import type { SocialLink } from '@/lib/types';

const EMPTY: Partial<SocialLink> = { platform: '', url: '', username: '', icon: '', order: 0, visible: true };

export default function AdminSocial() {
  const [items, setItems] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Partial<SocialLink>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

  const load = async () => {
    setLoading(true);
    const data = await api.get<SocialLink[]>('/social', authHeader(token));
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (form.id) await api.put(`/social/${form.id}`, form, authHeader(token));
      else await api.post('/social', form, authHeader(token));
      setModal(false);
      load();
    } finally { setSaving(false); }
  };

  return (
    <AdminShell>
      <AdminTable
        title="Social Links"
        data={items}
        loading={loading}
        columns={[
          { key: 'platform', label: 'Platform' },
          { key: 'username', label: 'Username' },
          { key: 'url', label: 'URL' },
          { key: 'visible', label: 'Visible', render: (s) => s.visible ? '✓' : '—' },
        ]}
        onAdd={() => { setForm(EMPTY); setModal(true); }}
        onEdit={(s) => { setForm(s); setModal(true); }}
        onDelete={async (id) => { await api.delete(`/social/${id}`, authHeader(token)); load(); }}
      />

      <Modal open={modal} onClose={() => setModal(false)} title={form.id ? 'Edit Link' : 'Add Link'} onSubmit={handleSubmit} loading={saving}>
        <FormField label="Platform" required>
          <input style={inputCss} value={form.platform || ''} onChange={(e) => setForm({ ...form, platform: e.target.value })} required placeholder="GitHub, LinkedIn..." />
        </FormField>
        <FormField label="URL" required>
          <input style={inputCss} value={form.url || ''} onChange={(e) => setForm({ ...form, url: e.target.value })} required />
        </FormField>
        <FormField label="Username">
          <input style={inputCss} value={form.username || ''} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        </FormField>
        <FormField label="Icon (Lucide name)">
          <input style={inputCss} value={form.icon || ''} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Github, Linkedin..." />
        </FormField>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" id="visible" checked={!!form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} style={{ width: 16, height: 16 }} />
          <label htmlFor="visible" style={{ fontSize: '0.875rem', color: 'var(--text-2)' }}>Visible on portfolio</label>
        </div>
      </Modal>
    </AdminShell>
  );
}
