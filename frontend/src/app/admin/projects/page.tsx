'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import AdminTable from '@/components/admin/AdminTable';
import Modal, { FormField, inputCss } from '@/components/admin/Modal';
import { api, authHeader } from '@/lib/api';
import type { Project } from '@/lib/types';

const EMPTY: Partial<Project> = {
  slug: '', title: '', description: '', longDesc: '',
  techStack: [], imageUrl: '', githubUrl: '', liveUrl: '',
  featured: false, order: 0, screenshots: [],
};

export default function AdminProjects() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Partial<Project>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

  const load = async () => {
    setLoading(true);
    const data = await api.get<Project[]>('/projects', authHeader(token));
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal(true); };
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

  return (
    <AdminShell>
      <AdminTable
        title="Projects"
        data={items}
        loading={loading}
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'slug', label: 'Slug' },
          {
            key: 'techStack', label: 'Tech Stack',
            render: (p) => (p.techStack || []).slice(0, 3).join(', '),
          },
          {
            key: 'featured', label: 'Featured',
            render: (p) => p.featured
              ? <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Yes</span>
              : <span style={{ color: 'var(--text-3)' }}>No</span>,
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
        <FormField label="Title" required>
          <input style={inputCss} value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </FormField>
        <FormField label="Slug" required>
          <input style={inputCss} value={form.slug || ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} required placeholder="my-project" />
        </FormField>
        <FormField label="Short Description" required>
          <textarea style={{ ...inputCss, minHeight: '80px', resize: 'vertical' }} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </FormField>
        <FormField label="Full Description">
          <textarea style={{ ...inputCss, minHeight: '120px', resize: 'vertical' }} value={form.longDesc || ''} onChange={(e) => setForm({ ...form, longDesc: e.target.value })} />
        </FormField>
        <FormField label="Tech Stack (comma-separated)">
          <input style={inputCss} value={Array.isArray(form.techStack) ? form.techStack.join(', ') : form.techStack || ''} onChange={(e) => setForm({ ...form, techStack: e.target.value as unknown as string[] })} placeholder="Python, React, PostgreSQL" />
        </FormField>
        <FormField label="Image URL">
          <input style={inputCss} value={form.imageUrl || ''} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        </FormField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormField label="GitHub URL">
            <input style={inputCss} value={form.githubUrl || ''} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
          </FormField>
          <FormField label="Live URL">
            <input style={inputCss} value={form.liveUrl || ''} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
          </FormField>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" id="featured" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ width: 16, height: 16, cursor: 'pointer' }} />
          <label htmlFor="featured" style={{ fontSize: '0.875rem', color: 'var(--text-2)', cursor: 'pointer' }}>Featured project</label>
        </div>
      </Modal>
    </AdminShell>
  );
}
