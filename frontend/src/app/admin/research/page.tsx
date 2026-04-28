'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import AdminTable from '@/components/admin/AdminTable';
import Modal, { FormField, inputCss } from '@/components/admin/Modal';
import { api, authHeader } from '@/lib/api';
import type { ResearchPaper } from '@/lib/types';

const EMPTY: Partial<ResearchPaper> = {
  title: '', abstract: '', authors: [], journal: '', year: new Date().getFullYear(),
  doi: '', paperUrl: '', tags: [], featured: false,
};

export default function AdminResearch() {
  const [items, setItems] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Partial<ResearchPaper>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

  const load = async () => {
    setLoading(true);
    const data = await api.get<ResearchPaper[]>('/research', authHeader(token));
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal(true); };
  const openEdit = (p: ResearchPaper) => { setForm(p); setModal(true); };

  const parseArray = (val: unknown) =>
    typeof val === 'string' ? val.split(',').map((s) => s.trim()).filter(Boolean) : val as string[];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, authors: parseArray(form.authors), tags: parseArray(form.tags), year: Number(form.year) };
      if (form.id) await api.put(`/research/${form.id}`, payload, authHeader(token));
      else await api.post('/research', payload, authHeader(token));
      setModal(false);
      load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/research/${id}`, authHeader(token));
    load();
  };

  return (
    <AdminShell>
      <AdminTable
        title="Research Papers"
        data={items}
        loading={loading}
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'journal', label: 'Journal' },
          { key: 'year', label: 'Year' },
          { key: 'authors', label: 'Authors', render: (p) => p.authors.slice(0, 2).join(', ') },
        ]}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
      />

      <Modal open={modal} onClose={() => setModal(false)} title={form.id ? 'Edit Paper' : 'Add Paper'} onSubmit={handleSubmit} loading={saving}>
        <FormField label="Title" required>
          <input style={inputCss} value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </FormField>
        <FormField label="Abstract" required>
          <textarea style={{ ...inputCss, minHeight: '120px', resize: 'vertical' }} value={form.abstract || ''} onChange={(e) => setForm({ ...form, abstract: e.target.value })} required />
        </FormField>
        <FormField label="Authors (comma-separated)" required>
          <input style={inputCss} value={Array.isArray(form.authors) ? form.authors.join(', ') : form.authors || ''} onChange={(e) => setForm({ ...form, authors: e.target.value as unknown as string[] })} required />
        </FormField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormField label="Journal">
            <input style={inputCss} value={form.journal || ''} onChange={(e) => setForm({ ...form, journal: e.target.value })} />
          </FormField>
          <FormField label="Year" required>
            <input type="number" style={inputCss} value={form.year || ''} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} required />
          </FormField>
        </div>
        <FormField label="DOI">
          <input style={inputCss} value={form.doi || ''} onChange={(e) => setForm({ ...form, doi: e.target.value })} />
        </FormField>
        <FormField label="Paper URL">
          <input style={inputCss} value={form.paperUrl || ''} onChange={(e) => setForm({ ...form, paperUrl: e.target.value })} />
        </FormField>
        <FormField label="Tags (comma-separated)">
          <input style={inputCss} value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags || ''} onChange={(e) => setForm({ ...form, tags: e.target.value as unknown as string[] })} />
        </FormField>
      </Modal>
    </AdminShell>
  );
}
