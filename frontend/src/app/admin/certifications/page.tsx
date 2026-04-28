'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import AdminTable from '@/components/admin/AdminTable';
import Modal, { FormField, inputCss } from '@/components/admin/Modal';
import { api, authHeader } from '@/lib/api';
import type { Certification } from '@/lib/types';

const EMPTY: Partial<Certification> = {
  title: '', issuer: '', issueDate: '', category: 'General',
  credentialId: '', credentialUrl: '', imageUrl: '',
  description: '', tags: [], featured: false, visible: true,
};

export default function AdminCerts() {
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Partial<Certification>>(EMPTY);
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

  const load = async () => {
    setLoading(true);
    // Admin fetches all certs (no visibility filter) via a workaround: fetch with auth
    // The public GET filters visible=true, so we use a direct approach
    const data = await api.get<Certification[]>('/certifications', authHeader(token));
    // Note: public route only returns visible=true; for admin we may see all
    // For now, show all that come back (admin can toggle visibility to see effect)
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm(EMPTY);
    setTagsInput('');
    setModal(true);
  };

  const openEdit = (c: Certification) => {
    setForm({ ...c, issueDate: c.issueDate?.slice(0, 10) });
    setTagsInput(Array.isArray(c.tags) ? c.tags.join(', ') : '');
    setModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const payload = { ...form, tags };
    try {
      if (form.id) await api.put(`/certifications/${form.id}`, payload, authHeader(token));
      else await api.post('/certifications', payload, authHeader(token));
      setModal(false);
      load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/certifications/${id}`, authHeader(token));
    load();
  };

  const toggleVisibility = async (cert: Certification) => {
    await api.patch(`/certifications/${cert.id}/visibility`, { visible: !cert.visible }, authHeader(token));
    load();
  };

  return (
    <AdminShell>
      <AdminTable
        title="Certifications"
        data={items}
        loading={loading}
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'issuer', label: 'Issuer' },
          { key: 'category', label: 'Category' },
          { key: 'featured', label: 'Featured', render: (c) => c.featured ? '★' : '—' },
          { key: 'issueDate', label: 'Date', render: (c) => new Date(c.issueDate).toLocaleDateString() },
          {
            key: 'visible',
            label: 'Visible',
            render: (c) => (
              <button
                onClick={() => toggleVisibility(c)}
                title={c.visible ? 'Click to hide' : 'Click to show'}
                style={{
                  width: 28, height: 28, borderRadius: '7px', border: 'none', cursor: 'pointer',
                  background: c.visible ? 'rgba(99,102,241,0.12)' : 'var(--bg-3)',
                  color: c.visible ? 'var(--accent)' : 'var(--text-3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {c.visible ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
            ),
          },
        ]}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
      />

      <Modal open={modal} onClose={() => setModal(false)} title={form.id ? 'Edit Certification' : 'Add Certification'} onSubmit={handleSubmit} loading={saving}>
        <FormField label="Title" required>
          <input style={inputCss} value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormField label="Issuer" required>
            <input style={inputCss} value={form.issuer || ''} onChange={(e) => setForm({ ...form, issuer: e.target.value })} required />
          </FormField>
          <FormField label="Category">
            <input style={inputCss} value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Cloud & AI, ML…" />
          </FormField>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormField label="Issue Date" required>
            <input type="date" style={inputCss} value={form.issueDate || ''} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} required />
          </FormField>
          <FormField label="Credential ID">
            <input style={inputCss} value={form.credentialId || ''} onChange={(e) => setForm({ ...form, credentialId: e.target.value })} placeholder="e.g. 103400391…" />
          </FormField>
        </div>

        <FormField label="Description">
          <textarea
            rows={3}
            style={{ ...inputCss, resize: 'vertical' }}
            value={form.description || ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Short description of the certification…"
          />
        </FormField>

        <FormField label="Tags (comma-separated)">
          <input
            style={inputCss}
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. Generative AI, LLMs, AI Systems"
          />
        </FormField>

        <FormField label="Credential URL">
          <input style={inputCss} value={form.credentialUrl || ''} onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })} placeholder="https://…" />
        </FormField>

        <FormField label="Image URL">
          <input style={inputCss} value={form.imageUrl || ''} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://…" />
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
