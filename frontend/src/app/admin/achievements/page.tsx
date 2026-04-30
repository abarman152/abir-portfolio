'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff, Star, AlertCircle } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import AdminTable from '@/components/admin/AdminTable';
import Modal, { FormField, inputCss } from '@/components/admin/Modal';
import { api, authHeader } from '@/lib/api';
import type { Achievement } from '@/lib/types';

const EMPTY: Partial<Achievement> = {
  title: '', description: '', overviewMd: '', date: '', issuer: '',
  badgeIcon: '', images: [], category: 'Award', tags: [],
  featured: false, visible: true, order: 0,
};

const CATEGORIES = ['Award', 'Academic', 'Competition', 'Professional', 'Other'];

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function joinArr(v: unknown): string {
  return Array.isArray(v) ? (v as string[]).join(', ') : (v as string) || '';
}

export default function AdminAchievements() {
  const [items,        setItems]        = useState<Achievement[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [modal,        setModal]        = useState(false);
  const [form,         setForm]         = useState<Partial<Achievement>>(EMPTY);
  const [tagsInput,    setTagsInput]    = useState('');
  const [imagesInput,  setImagesInput]  = useState('');
  const [saving,       setSaving]       = useState(false);
  const [preview,      setPreview]      = useState(false);
  const [slugManual,   setSlugManual]   = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get<Achievement[]>('/achievements/all', authHeader(token));
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm(EMPTY);
    setTagsInput('');
    setImagesInput('');
    setPreview(false);
    setSlugManual(false);
    setError(null);
    setModal(true);
  };

  const openEdit = (a: Achievement) => {
    setForm({ ...a, date: a.date?.slice(0, 10) });
    setTagsInput(joinArr(a.tags));
    setImagesInput(joinArr(a.images));
    setPreview(false);
    setSlugManual(true);
    setError(null);
    setModal(true);
  };

  const handleTitleChange = (title: string) => {
    const updated: Partial<Achievement> = { ...form, title };
    if (!slugManual) {
      (updated as Record<string, unknown>).slug = slugify(title);
    }
    setForm(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const tags   = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const images = imagesInput.split(',').map((s) => s.trim()).filter(Boolean);
    const payload = {
      ...form,
      tags,
      images,
      order: Number(form.order) || 0,
    };
    try {
      if (form.id) await api.put(`/achievements/${form.id}`, payload, authHeader(token));
      else         await api.post('/achievements', payload, authHeader(token));
      setModal(false);
      load();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Save failed. Please try again.';
      setError(message);
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

  const toggleFeatured = async (item: Achievement) => {
    await api.put(`/achievements/${item.id}`, { ...item, featured: !item.featured }, authHeader(token));
    load();
  };

  return (
    <AdminShell>
      <AdminTable
        title="Achievements"
        data={items}
        loading={loading}
        columns={[
          { key: 'title',    label: 'Title' },
          { key: 'issuer',   label: 'Organization' },
          { key: 'category', label: 'Category' },
          { key: 'slug',     label: 'Slug', render: (a) => a.slug ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{a.slug}</span> : <span style={{ color: 'var(--text-3)' }}>—</span> },
          { key: 'date',     label: 'Date', render: (a) => new Date(a.date).toLocaleDateString() },
          {
            key: 'featured', label: 'Featured',
            render: (a) => (
              <button onClick={() => toggleFeatured(a)} title={a.featured ? 'Remove featured' : 'Mark featured'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: a.featured ? '#f59e0b' : 'var(--text-3)', transition: 'color 0.15s' }}>
                <Star size={15} fill={a.featured ? 'currentColor' : 'none'} />
              </button>
            ),
          },
          {
            key: 'visible', label: 'Visible',
            render: (a) => (
              <button onClick={() => toggleVisibility(a)} title={a.visible ? 'Click to hide' : 'Click to show'}
                style={{ width: 28, height: 28, borderRadius: '7px', border: 'none', cursor: 'pointer', background: a.visible ? 'rgba(99,102,241,0.12)' : 'var(--bg-3)', color: a.visible ? 'var(--accent)' : 'var(--text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        {/* ── Error feedback ── */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1rem', borderRadius: '9px',
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
            color: '#ef4444', fontSize: '0.82rem', fontWeight: 500,
          }}>
            <AlertCircle size={14} style={{ flexShrink: 0 }} />
            {error}
          </div>
        )}

        {/* ── Title + Slug ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
          <FormField label="Title" required>
            <input style={inputCss} value={form.title || ''} onChange={(e) => handleTitleChange(e.target.value)} required />
          </FormField>
          <FormField label="Slug">
            <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
              <input
                style={{
                  ...inputCss, flex: 1,
                  fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                  color: slugManual ? 'var(--text)' : 'var(--text-3)',
                  background: slugManual ? 'var(--bg-2)' : 'var(--bg-3)',
                }}
                value={form.slug || ''}
                onChange={(e) => setForm({ ...form, slug: e.target.value } as Partial<Achievement>)}
                readOnly={!slugManual}
                placeholder="auto-generated"
              />
              <button
                type="button"
                onClick={() => {
                  if (slugManual) {
                    setForm({ ...form, slug: slugify(form.title || '') } as Partial<Achievement>);
                  }
                  setSlugManual(!slugManual);
                }}
                style={{
                  padding: '0.4rem 0.6rem', borderRadius: '7px', border: '1px solid var(--border)',
                  background: slugManual ? 'var(--accent-dim)' : 'var(--bg-3)',
                  color: slugManual ? 'var(--accent)' : 'var(--text-3)',
                  fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer',
                  whiteSpace: 'nowrap', transition: 'all 0.15s',
                }}
                title={slugManual ? 'Switch to auto-slug' : 'Edit slug manually'}
              >
                {slugManual ? 'Auto' : 'Edit'}
              </button>
            </div>
          </FormField>
        </div>

        {/* ── Issuer + Category ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
          <FormField label="Organization / Issuer">
            <input style={inputCss} value={form.issuer || ''} onChange={(e) => setForm({ ...form, issuer: e.target.value })} placeholder="e.g. Asia Research Awards" />
          </FormField>
          <FormField label="Category">
            <select style={inputCss} value={form.category || 'Award'} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </FormField>
        </div>

        {/* ── Date + Badge Icon ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
          <FormField label="Date" required>
            <input type="date" style={inputCss} value={form.date || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          </FormField>
          <FormField label="Badge Icon (name)">
            <input style={inputCss} value={form.badgeIcon || ''} onChange={(e) => setForm({ ...form, badgeIcon: e.target.value })} placeholder="e.g. Trophy, Star, GraduationCap" />
          </FormField>
        </div>

        {/* ── Description ── */}
        <FormField label="Short Description">
          <textarea rows={3} style={{ ...inputCss, resize: 'vertical' }} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description shown on cards…" />
        </FormField>

        {/* ── Overview Markdown ── */}
        <FormField label="Overview (Markdown)">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <button type="button" onClick={() => setPreview(false)}
              style={{ padding: '0.25rem 0.625rem', borderRadius: '6px', border: `1px solid ${!preview ? 'var(--accent)' : 'var(--border)'}`, background: !preview ? 'var(--accent-dim)' : 'transparent', color: !preview ? 'var(--accent)' : 'var(--text-3)', fontSize: '0.75rem', cursor: 'pointer' }}>
              Edit
            </button>
            <button type="button" onClick={() => setPreview(true)}
              style={{ padding: '0.25rem 0.625rem', borderRadius: '6px', border: `1px solid ${preview ? 'var(--accent)' : 'var(--border)'}`, background: preview ? 'var(--accent-dim)' : 'transparent', color: preview ? 'var(--accent)' : 'var(--text-3)', fontSize: '0.75rem', cursor: 'pointer' }}>
              Preview
            </button>
          </div>
          {preview ? (
            <div className="md-body" style={{ minHeight: '120px', padding: '0.875rem', borderRadius: '9px', background: 'var(--bg-3)', border: '1px solid var(--border)', fontSize: '0.875rem', lineHeight: 1.7 }}>
              {form.overviewMd ? form.overviewMd : <span style={{ color: 'var(--text-3)' }}>No content yet…</span>}
            </div>
          ) : (
            <textarea
              rows={6}
              style={{ ...inputCss, resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
              value={form.overviewMd || ''}
              onChange={(e) => setForm({ ...form, overviewMd: e.target.value })}
              placeholder={'## Overview\n\nFull details about the achievement…'}
            />
          )}
        </FormField>

        {/* ── Tags ── */}
        <FormField label="Tags (comma-separated)">
          <input style={inputCss} value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="AI Security, Quantum Computing, Research Award" />
        </FormField>

        {/* ── Images ── */}
        <FormField label="Images (comma-separated Cloudinary URLs)">
          <textarea rows={2} style={{ ...inputCss, resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} value={imagesInput} onChange={(e) => setImagesInput(e.target.value)} placeholder="https://res.cloudinary.com/…, https://…" />
        </FormField>

        {/* ── Order ── */}
        <FormField label="Display Order">
          <input type="number" style={{ ...inputCss, width: '120px' }} value={form.order ?? 0} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} min={0} />
        </FormField>

        {/* ── Toggles ── */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-2)' }}>
            <input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ accentColor: 'var(--accent)', width: 15, height: 15 }} />
            Featured
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-2)' }}>
            <input type="checkbox" checked={form.visible !== false} onChange={(e) => setForm({ ...form, visible: e.target.checked })} style={{ accentColor: 'var(--accent)', width: 15, height: 15 }} />
            Visible on site
          </label>
        </div>
      </Modal>
    </AdminShell>
  );
}
