'use client';

import { useEffect, useState } from 'react';
import { Star, Eye, EyeOff } from 'lucide-react';
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
};

export default function AdminProjects() {
  const [items,  setItems]  = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal,  setModal]  = useState(false);
  const [form,   setForm]   = useState<Partial<Project>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

  const load = async () => {
    setLoading(true);
    try {
      // Admin fetches all (published + unpublished)
      const data = await api.get<{ projects: Project[] }>('/projects?admin=true&limit=200', authHeader(token));
      setItems(data.projects || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setModal(true); };
  const openEdit = (p: Project) => { setForm(p); setModal(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        techStack: typeof form.techStack === 'string'
          ? (form.techStack as string).split(',').map((s) => s.trim()).filter(Boolean)
          : form.techStack,
        screenshots: typeof form.screenshots === 'string'
          ? (form.screenshots as string).split(',').map((s) => s.trim()).filter(Boolean)
          : form.screenshots || [],
        order: Number(form.order) || 0,
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

  return (
    <AdminShell>
      <AdminTable
        title="Projects"
        data={items}
        loading={loading}
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'slug',  label: 'Slug' },
          {
            key: 'techStack', label: 'Tech Stack',
            render: (p) => (p.techStack || []).slice(0, 3).join(', '),
          },
          {
            key: 'date', label: 'Date',
            render: (p) => p.date || <span style={{ color: 'var(--text-3)' }}>—</span>,
          },
          {
            key: 'featured', label: 'Featured',
            render: (p) => (
              <button
                onClick={() => toggleField(p, 'featured')}
                title={p.featured ? 'Remove featured' : 'Mark featured'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: p.featured ? '#f59e0b' : 'var(--text-3)', transition: 'color 0.15s' }}
              >
                <Star size={15} fill={p.featured ? 'currentColor' : 'none'} />
              </button>
            ),
          },
          {
            key: 'isPublished', label: 'Published',
            render: (p) => (
              <button
                onClick={() => toggleField(p, 'isPublished')}
                title={p.isPublished ? 'Unpublish' : 'Publish'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: p.isPublished ? '#10b981' : 'var(--text-3)', transition: 'color 0.15s' }}
              >
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
        {/* Basic info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
          <FormField label="Title" required>
            <input style={inputCss} value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </FormField>
          <FormField label="Slug" required>
            <input style={inputCss} value={form.slug || ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} required placeholder="my-project" />
          </FormField>
        </div>

        <FormField label="Short Description" required>
          <textarea style={{ ...inputCss, minHeight: '70px', resize: 'vertical' }} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </FormField>

        <FormField label="Full Description">
          <textarea style={{ ...inputCss, minHeight: '90px', resize: 'vertical' }} value={form.longDesc || ''} onChange={(e) => setForm({ ...form, longDesc: e.target.value })} />
        </FormField>

        {/* Problem / Result */}
        <FormField label="Problem Statement">
          <textarea style={{ ...inputCss, minHeight: '70px', resize: 'vertical' }} value={form.problem || ''} onChange={(e) => setForm({ ...form, problem: e.target.value })} placeholder="What problem did this solve?" />
        </FormField>

        <FormField label="Result / Impact">
          <textarea style={{ ...inputCss, minHeight: '70px', resize: 'vertical' }} value={form.result || ''} onChange={(e) => setForm({ ...form, result: e.target.value })} placeholder="What was the measurable outcome?" />
        </FormField>

        <FormField label="Tech Stack (comma-separated)">
          <input style={inputCss} value={Array.isArray(form.techStack) ? form.techStack.join(', ') : form.techStack || ''} onChange={(e) => setForm({ ...form, techStack: e.target.value as unknown as string[] })} placeholder="Python, React, PostgreSQL" />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
          <FormField label="Date">
            <input style={inputCss} value={form.date || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g. March 2024" />
          </FormField>
          <FormField label="Order">
            <input type="number" style={inputCss} value={form.order ?? 0} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} min={0} />
          </FormField>
        </div>

        <FormField label="Image URL">
          <input style={inputCss} value={form.imageUrl || ''} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="Cloudinary URL" />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
          <FormField label="GitHub URL">
            <input style={inputCss} value={form.githubUrl || ''} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
          </FormField>
          <FormField label="Live URL">
            <input style={inputCss} value={form.liveUrl || ''} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
          </FormField>
        </div>

        {/* Toggles */}
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
