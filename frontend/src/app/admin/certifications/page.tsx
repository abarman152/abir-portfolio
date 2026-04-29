'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff, Star } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import AdminTable from '@/components/admin/AdminTable';
import Modal, { FormField, inputCss } from '@/components/admin/Modal';
import { api, authHeader } from '@/lib/api';
import type { Certification } from '@/lib/types';

const EMPTY: Partial<Certification> = {
  slug: '', title: '', issuer: '', issueDate: '', category: 'General',
  credentialId: '', credentialUrl: '', imageUrl: '', badgeImageUrl: '',
  description: '', overviewMd: '', skills: [], tags: [],
  featured: false, visible: true, order: 0,
};

function joinArr(v: unknown): string {
  return Array.isArray(v) ? (v as string[]).join(', ') : (v as string) || '';
}

export default function AdminCerts() {
  const [items,        setItems]       = useState<Certification[]>([]);
  const [loading,      setLoading]     = useState(true);
  const [modal,        setModal]       = useState(false);
  const [form,         setForm]        = useState<Partial<Certification>>(EMPTY);
  const [tagsInput,    setTagsInput]   = useState('');
  const [skillsInput,  setSkillsInput] = useState('');
  const [saving,       setSaving]      = useState(false);
  const [preview,      setPreview]     = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get<Certification[]>('/certifications/all', authHeader(token));
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm(EMPTY);
    setTagsInput('');
    setSkillsInput('');
    setPreview(false);
    setModal(true);
  };

  const openEdit = (c: Certification) => {
    setForm({ ...c, issueDate: c.issueDate?.slice(0, 10) });
    setTagsInput(joinArr(c.tags));
    setSkillsInput(joinArr(c.skills));
    setPreview(false);
    setModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const tags   = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const skills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
    const payload = {
      ...form,
      tags,
      skills,
      order: Number(form.order) || 0,
    };
    try {
      if (form.id) await api.put(`/certifications/${form.id}`, payload, authHeader(token));
      else         await api.post('/certifications', payload, authHeader(token));
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

  const toggleFeatured = async (cert: Certification) => {
    await api.put(`/certifications/${cert.id}`, { ...cert, featured: !cert.featured }, authHeader(token));
    load();
  };

  return (
    <AdminShell>
      <AdminTable
        title="Certifications"
        data={items}
        loading={loading}
        columns={[
          { key: 'title',    label: 'Title' },
          { key: 'issuer',   label: 'Issuer' },
          { key: 'category', label: 'Category' },
          { key: 'slug',     label: 'Slug', render: (c) => c.slug ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{c.slug}</span> : <span style={{ color: 'var(--text-3)' }}>—</span> },
          { key: 'issueDate', label: 'Date', render: (c) => new Date(c.issueDate).toLocaleDateString() },
          {
            key: 'featured', label: 'Featured',
            render: (c) => (
              <button onClick={() => toggleFeatured(c)} title={c.featured ? 'Remove featured' : 'Mark featured'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: c.featured ? '#f59e0b' : 'var(--text-3)', transition: 'color 0.15s' }}>
                <Star size={15} fill={c.featured ? 'currentColor' : 'none'} />
              </button>
            ),
          },
          {
            key: 'visible', label: 'Visible',
            render: (c) => (
              <button onClick={() => toggleVisibility(c)} title={c.visible ? 'Click to hide' : 'Click to show'}
                style={{ width: 28, height: 28, borderRadius: '7px', border: 'none', cursor: 'pointer', background: c.visible ? 'rgba(99,102,241,0.12)' : 'var(--bg-3)', color: c.visible ? 'var(--accent)' : 'var(--text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {c.visible ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
            ),
          },
        ]}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
      />

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={form.id ? 'Edit Certification' : 'Add Certification'}
        onSubmit={handleSubmit}
        loading={saving}
      >
        {/* ── Title + Slug ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
          <FormField label="Title" required>
            <input style={inputCss} value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </FormField>
          <FormField label="Slug" required>
            <input style={inputCss} value={form.slug || ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} required placeholder="oracle-oci-ai-2025" />
          </FormField>
        </div>

        {/* ── Issuer + Category ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
          <FormField label="Issuer" required>
            <input style={inputCss} value={form.issuer || ''} onChange={(e) => setForm({ ...form, issuer: e.target.value })} required />
          </FormField>
          <FormField label="Category">
            <input style={inputCss} value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Cloud & AI, ML…" />
          </FormField>
        </div>

        {/* ── Issue Date + Credential ID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
          <FormField label="Issue Date" required>
            <input type="date" style={inputCss} value={form.issueDate || ''} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} required />
          </FormField>
          <FormField label="Credential ID">
            <input style={inputCss} value={form.credentialId || ''} onChange={(e) => setForm({ ...form, credentialId: e.target.value })} placeholder="e.g. 103400391…" />
          </FormField>
        </div>

        {/* ── Description ── */}
        <FormField label="Description (short)">
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
              placeholder={'## Overview\n\nFull details about the certification…'}
            />
          )}
        </FormField>

        {/* ── Skills + Tags ── */}
        <FormField label="Skills (comma-separated)">
          <input style={inputCss} value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="Machine Learning, Python, SQL…" />
        </FormField>
        <FormField label="Tags (comma-separated)">
          <input style={inputCss} value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Generative AI, LLMs, Cloud…" />
        </FormField>

        {/* ── URLs ── */}
        <FormField label="Credential URL">
          <input style={inputCss} value={form.credentialUrl || ''} onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })} placeholder="https://…" />
        </FormField>

        {/* ── Image URLs ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
          <FormField label="Certificate Image URL">
            <input style={inputCss} value={form.imageUrl || ''} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://res.cloudinary.com/…" />
          </FormField>
          <FormField label="Badge / Logo URL">
            <input style={inputCss} value={form.badgeImageUrl || ''} onChange={(e) => setForm({ ...form, badgeImageUrl: e.target.value })} placeholder="https://res.cloudinary.com/…" />
          </FormField>
        </div>

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
