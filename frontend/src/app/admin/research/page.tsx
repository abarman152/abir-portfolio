'use client';

import { useEffect, useState } from 'react';
import { Star, Plus, Trash2 } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import AdminTable from '@/components/admin/AdminTable';
import Modal, { FormField, inputCss } from '@/components/admin/Modal';
import { api, authHeader } from '@/lib/api';
import type { Research, ResearchAuthor } from '@/lib/types';

const EMPTY_AUTHOR: ResearchAuthor = { name: '', role: '', isPrimary: false };

const EMPTY: Partial<Research> = {
  slug: '', title: '', abstract: '', overviewMd: '',
  authors: [],
  publishedAt: new Date().toISOString().slice(0, 10),
  publisher: '', publicationUrl: '', googleScholarUrl: '',
  tags: [], featured: false, order: 0,
};

function pubYear(iso: string): string {
  try { return new Date(iso).getFullYear().toString(); } catch { return ''; }
}

export default function AdminResearch() {
  const [items,   setItems]   = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState<Partial<Research>>(EMPTY);
  const [authors, setAuthors] = useState<ResearchAuthor[]>([]);
  const [saving,  setSaving]  = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get<{ items: Research[] }>('/research?limit=200', authHeader(token));
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm(EMPTY);
    setAuthors([{ ...EMPTY_AUTHOR }]);
    setModal(true);
  };

  const openEdit = (item: Research) => {
    setForm(item);
    setAuthors(Array.isArray(item.authors) && item.authors.length > 0
      ? item.authors.map((a) => ({ ...a }))
      : [{ ...EMPTY_AUTHOR }]);
    setModal(true);
  };

  const addAuthor    = () => setAuthors((prev) => [...prev, { ...EMPTY_AUTHOR }]);
  const removeAuthor = (i: number) => setAuthors((prev) => prev.filter((_, idx) => idx !== i));
  const updateAuthor = (i: number, patch: Partial<ResearchAuthor>) =>
    setAuthors((prev) => prev.map((a, idx) => idx === i ? { ...a, ...patch } : a));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const parseTags = (val: unknown) =>
        typeof val === 'string'
          ? val.split(',').map((s) => s.trim()).filter(Boolean)
          : (val as string[]) || [];

      const payload = {
        ...form,
        authors: authors.filter((a) => a.name.trim()),
        tags:    parseTags(form.tags),
        order:   Number(form.order) || 0,
        publishedAt: form.publishedAt
          ? new Date(form.publishedAt as string).toISOString()
          : new Date().toISOString(),
      };

      if (form.id) {
        await api.put(`/research/${form.id}`, payload, authHeader(token));
      } else {
        await api.post('/research', payload, authHeader(token));
      }
      setModal(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/research/${id}`, authHeader(token));
    load();
  };

  const toggleFeatured = async (item: Research) => {
    await api.put(`/research/${item.id}`, { ...item, featured: !item.featured }, authHeader(token));
    load();
  };

  const joinTags = (v: unknown) =>
    Array.isArray(v) ? (v as string[]).join(', ') : (v as string) || '';

  return (
    <AdminShell>
      <AdminTable
        title="Research & Publications"
        data={items}
        loading={loading}
        columns={[
          { key: 'title',     label: 'Title' },
          { key: 'publisher', label: 'Publisher' },
          {
            key: 'publishedAt', label: 'Year',
            render: (item) => pubYear(item.publishedAt) || <span style={{ color: 'var(--text-3)' }}>—</span>,
          },
          {
            key: 'authors', label: 'Authors',
            render: (item) => {
              const list = Array.isArray(item.authors) ? item.authors : [];
              return list.slice(0, 2).map((a: ResearchAuthor) => a.name).join(', ') || '—';
            },
          },
          {
            key: 'featured', label: 'Featured',
            render: (item) => (
              <button onClick={() => toggleFeatured(item)} title={item.featured ? 'Remove featured' : 'Mark featured'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: item.featured ? '#f59e0b' : 'var(--text-3)', transition: 'color 0.15s' }}>
                <Star size={15} fill={item.featured ? 'currentColor' : 'none'} />
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
        title={form.id ? 'Edit Research' : 'Add Research'}
        onSubmit={handleSubmit}
        loading={saving}
      >
        {/* ── Title + Slug ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
          <FormField label="Title" required>
            <input style={inputCss} value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </FormField>
          <FormField label="Slug" required>
            <input style={inputCss} value={form.slug || ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} required placeholder="quantum-bias-detection" />
          </FormField>
        </div>

        {/* ── Abstract ── */}
        <FormField label="Abstract" required>
          <textarea style={{ ...inputCss, minHeight: '90px', resize: 'vertical' }} value={form.abstract || ''} onChange={(e) => setForm({ ...form, abstract: e.target.value })} required placeholder="Short summary of the research…" />
        </FormField>

        {/* ── Overview (Markdown) ── */}
        <FormField label="Overview (Markdown supported)">
          <textarea
            style={{ ...inputCss, minHeight: '130px', resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
            value={form.overviewMd || ''}
            onChange={(e) => setForm({ ...form, overviewMd: e.target.value })}
            placeholder="## Overview&#10;&#10;Full details about the research…"
          />
        </FormField>

        {/* ── Authors (dynamic) ── */}
        <FormField label="Authors">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {authors.map((author, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  style={inputCss}
                  value={author.name}
                  onChange={(e) => updateAuthor(i, { name: e.target.value })}
                  placeholder="Author name"
                />
                <input
                  style={inputCss}
                  value={author.role || ''}
                  onChange={(e) => updateAuthor(i, { role: e.target.value })}
                  placeholder="Role (optional)"
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-2)', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!author.isPrimary} onChange={(e) => updateAuthor(i, { isPrimary: e.target.checked })} style={{ accentColor: 'var(--accent)', cursor: 'pointer' }} />
                  Primary
                </label>
                <button type="button" onClick={() => removeAuthor(i)} disabled={authors.length === 1}
                  style={{ background: 'none', border: 'none', cursor: authors.length === 1 ? 'not-allowed' : 'pointer', color: 'var(--text-3)', opacity: authors.length === 1 ? 0.3 : 1, display: 'flex', padding: '4px', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => { if (authors.length > 1) (e.currentTarget as HTMLElement).style.color = '#ef4444'; }}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--text-3)'}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button type="button" onClick={addAuthor}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.875rem', borderRadius: '8px', border: '1px dashed var(--border)', background: 'transparent', color: 'var(--text-3)', fontSize: '0.8rem', cursor: 'pointer', width: 'fit-content', transition: 'color 0.15s, border-color 0.15s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-3)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}>
              <Plus size={13} /> Add Author
            </button>
          </div>
        </FormField>

        {/* ── Publisher + Published Date ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
          <FormField label="Publisher / Journal">
            <input style={inputCss} value={form.publisher || ''} onChange={(e) => setForm({ ...form, publisher: e.target.value })} placeholder="IJFMR, IEEE, Nature…" />
          </FormField>
          <FormField label="Published Date">
            <input type="date" style={inputCss} value={(form.publishedAt as string)?.slice(0, 10) || ''} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} />
          </FormField>
        </div>

        {/* ── URLs ── */}
        <FormField label="Publication URL">
          <input style={inputCss} value={form.publicationUrl || ''} onChange={(e) => setForm({ ...form, publicationUrl: e.target.value })} placeholder="https://…" />
        </FormField>
        <FormField label="Google Scholar URL">
          <input style={inputCss} value={form.googleScholarUrl || ''} onChange={(e) => setForm({ ...form, googleScholarUrl: e.target.value })} placeholder="https://scholar.google.com/…" />
        </FormField>

        {/* ── Tags + Order ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.875rem', alignItems: 'end' }}>
          <FormField label="Tags (comma-separated)">
            <input style={inputCss} value={joinTags(form.tags)} onChange={(e) => setForm({ ...form, tags: e.target.value as unknown as string[] })} placeholder="Quantum ML, NLP, Security" />
          </FormField>
          <FormField label="Order">
            <input type="number" style={{ ...inputCss, width: '90px' }} value={form.order ?? 0} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} min={0} />
          </FormField>
        </div>

        {/* ── Featured toggle ── */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-2)' }}>
          <input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ width: 15, height: 15, cursor: 'pointer', accentColor: 'var(--accent)' }} />
          Featured
        </label>
      </Modal>
    </AdminShell>
  );
}
