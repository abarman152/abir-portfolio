'use client';

import { useEffect, useState } from 'react';
import { Star, Eye, EyeOff, AlertCircle } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import AdminTable from '@/components/admin/AdminTable';
import Modal, { FormField, inputCss } from '@/components/admin/Modal';
import { api, authHeader } from '@/lib/api';
import type { Project } from '@/lib/types';

const EMPTY: Partial<Project> = {
  slug: '', title: '', description: '', longDesc: '',
  problem: '', result: '',
  techStack: [], imageUrl: '', screenshots: [],
  githubUrl: '', liveUrl: '',
  featured: false, isPublished: true,
  date: '', order: 0,
  bannerImageUrl: '', resultImages: [], overviewMd: '',
  problemCharLimit: 0, resultCharLimit: 0,
};

function isValidLiveUrl(url: string): boolean {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function AdminProjects() {
  const [items,   setItems]   = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState<Partial<Project>>(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [urlError, setUrlError] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get<{ projects: Project[] }>('/projects?admin=true&limit=200', authHeader(token));
      setItems(data.projects || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setUrlError(''); setModal(true); };
  const openEdit = (p: Project) => { setForm(p); setUrlError(''); setModal(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.liveUrl && !isValidLiveUrl(form.liveUrl)) {
      setUrlError('Live URL must be a valid https:// link.');
      return;
    }
    setUrlError('');
    setSaving(true);
    try {
      const splitUrls = (val: unknown) =>
        typeof val === 'string'
          ? val.split(',').map((s) => s.trim()).filter(Boolean)
          : (val as string[]) || [];

      const payload = {
        ...form,
        techStack:   splitUrls(form.techStack),
        screenshots: splitUrls(form.screenshots),
        resultImages: splitUrls(form.resultImages),
        order:            Number(form.order)            || 0,
        problemCharLimit: Number(form.problemCharLimit) || 0,
        resultCharLimit:  Number(form.resultCharLimit)  || 0,
      };
      if (form.id) {
        await api.put(`/projects/${form.id}`, payload, authHeader(token));
      } else {
        await api.post('/projects', payload, authHeader(token));
      }
      setModal(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/projects/${id}`, authHeader(token));
    load();
  };

  const toggleField = async (p: Project, field: 'featured' | 'isPublished') => {
    await api.put(`/projects/${p.id}`, { ...p, [field]: !p[field] }, authHeader(token));
    load();
  };

  const joinArray = (v: unknown) =>
    Array.isArray(v) ? (v as string[]).join(', ') : (v as string) || '';

  return (
    <AdminShell>
      <AdminTable
        title="Projects"
        data={items}
        loading={loading}
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'slug',  label: 'Slug' },
          { key: 'techStack', label: 'Tech Stack', render: (p) => (p.techStack || []).slice(0, 3).join(', ') },
          { key: 'date',  label: 'Date',  render: (p) => p.date || <span style={{ color: 'var(--text-3)' }}>—</span> },
          {
            key: 'featured', label: 'Featured',
            render: (p) => (
              <button onClick={() => toggleField(p, 'featured')} title={p.featured ? 'Remove featured' : 'Mark featured'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: p.featured ? '#f59e0b' : 'var(--text-3)', transition: 'color 0.15s' }}>
                <Star size={15} fill={p.featured ? 'currentColor' : 'none'} />
              </button>
            ),
          },
          {
            key: 'isPublished', label: 'Published',
            render: (p) => (
              <button onClick={() => toggleField(p, 'isPublished')} title={p.isPublished ? 'Unpublish' : 'Publish'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: p.isPublished ? '#10b981' : 'var(--text-3)', transition: 'color 0.15s' }}>
                {p.isPublished ? <Eye size={15} /> : <EyeOff size={15} />}
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
        title={form.id ? 'Edit Project' : 'Add Project'}
        onSubmit={handleSubmit}
        loading={saving}
      >
        {/* ── Basic ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
          <FormField label="Title" required>
            <input style={inputCss} value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </FormField>
          <FormField label="Slug" required>
            <input style={inputCss} value={form.slug || ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} required placeholder="my-project" />
          </FormField>
        </div>

        <FormField label="Short Description" required>
          <textarea style={{ ...inputCss, minHeight: '68px', resize: 'vertical' }} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </FormField>

        {/* ── Overview (Markdown) ── */}
        <FormField label="Overview (Markdown supported)">
          <textarea
            style={{ ...inputCss, minHeight: '130px', resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
            value={form.overviewMd || ''}
            onChange={(e) => setForm({ ...form, overviewMd: e.target.value })}
            placeholder="## Overview&#10;&#10;Supports **bold**, _italic_, `code`, lists, and more."
          />
        </FormField>

        {/* ── Problem / Result + char limits ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.625rem', alignItems: 'end' }}>
          <FormField label="Problem Statement">
            <textarea style={{ ...inputCss, minHeight: '70px', resize: 'vertical' }} value={form.problem || ''} onChange={(e) => setForm({ ...form, problem: e.target.value })} placeholder="What problem did this solve?" />
          </FormField>
          <FormField label="Char limit">
            <input type="number" style={{ ...inputCss, width: '90px' }} value={form.problemCharLimit ?? 0} onChange={(e) => setForm({ ...form, problemCharLimit: parseInt(e.target.value) || 0 })} min={0} placeholder="0 = off" />
          </FormField>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.625rem', alignItems: 'end' }}>
          <FormField label="Result / Impact">
            <textarea style={{ ...inputCss, minHeight: '70px', resize: 'vertical' }} value={form.result || ''} onChange={(e) => setForm({ ...form, result: e.target.value })} placeholder="What was the measurable outcome?" />
          </FormField>
          <FormField label="Char limit">
            <input type="number" style={{ ...inputCss, width: '90px' }} value={form.resultCharLimit ?? 0} onChange={(e) => setForm({ ...form, resultCharLimit: parseInt(e.target.value) || 0 })} min={0} placeholder="0 = off" />
          </FormField>
        </div>

        {/* ── Tech stack ── */}
        <FormField label="Tech Stack (comma-separated)">
          <input style={inputCss} value={joinArray(form.techStack)} onChange={(e) => setForm({ ...form, techStack: e.target.value as unknown as string[] })} placeholder="Python, React, PostgreSQL" />
        </FormField>

        {/* ── Date / Order ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
          <FormField label="Date">
            <input style={inputCss} value={form.date || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g. March 2024" />
          </FormField>
          <FormField label="Order">
            <input type="number" style={inputCss} value={form.order ?? 0} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} min={0} />
          </FormField>
        </div>

        {/* ── Images ── */}
        <FormField label="Card Thumbnail URL">
          <input style={inputCss} value={form.imageUrl || ''} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="Cloudinary URL (used on listing cards)" />
        </FormField>

        <FormField label="Banner Image URL (detail page hero)">
          <input style={inputCss} value={form.bannerImageUrl || ''} onChange={(e) => setForm({ ...form, bannerImageUrl: e.target.value })} placeholder="Full-width hero image URL" />
        </FormField>

        <FormField label="Result Images (comma-separated URLs)">
          <input style={inputCss} value={joinArray(form.resultImages)} onChange={(e) => setForm({ ...form, resultImages: e.target.value as unknown as string[] })} placeholder="https://…, https://…" />
        </FormField>

        <FormField label="Screenshots (comma-separated URLs)">
          <input style={inputCss} value={joinArray(form.screenshots)} onChange={(e) => setForm({ ...form, screenshots: e.target.value as unknown as string[] })} placeholder="https://…, https://…" />
        </FormField>

        {/* ── Links ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
          <FormField label="GitHub URL">
            <input style={inputCss} value={form.githubUrl || ''} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
          </FormField>
          <FormField label="Live URL (https only)">
            <input
              style={{ ...inputCss, borderColor: urlError ? '#ef4444' : undefined }}
              value={form.liveUrl || ''}
              onChange={(e) => { setForm({ ...form, liveUrl: e.target.value }); setUrlError(''); }}
              placeholder="https://example.com"
            />
          </FormField>
        </div>
        {urlError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#ef4444', marginTop: '-0.25rem' }}>
            <AlertCircle size={13} /> {urlError}
          </div>
        )}

        {/* ── Toggles ── */}
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-2)' }}>
            <input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ width: 15, height: 15, cursor: 'pointer', accentColor: 'var(--accent)' }} />
            Featured
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-2)' }}>
            <input type="checkbox" checked={form.isPublished !== false} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} style={{ width: 15, height: 15, cursor: 'pointer', accentColor: 'var(--accent)' }} />
            Published
          </label>
        </div>
      </Modal>
    </AdminShell>
  );
}
