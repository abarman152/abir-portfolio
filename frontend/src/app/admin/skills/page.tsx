'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import Modal, { FormField, inputCss } from '@/components/admin/Modal';
import { api, authHeader } from '@/lib/api';
import type { SkillCategory, SkillCategoryWithSkills, Skill } from '@/lib/types';

// ─── helpers ────────────────────────────────────────────────────────────────

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';
}

const sectionTitle: React.CSSProperties = {
  fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem',
};

const cardStyle: React.CSSProperties = {
  background: 'var(--bg-2)', border: '1px solid var(--border)',
  borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem',
};

const rowStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.75rem',
  padding: '0.5rem 0.75rem', borderRadius: '8px',
  background: 'var(--bg-3)', marginBottom: '0.5rem',
};

const iconBtn = (color = 'var(--text-3)'): React.CSSProperties => ({
  background: 'none', border: 'none', cursor: 'pointer',
  color, padding: '0.25rem', borderRadius: '6px', display: 'flex',
  alignItems: 'center',
});

// ─── toggle switch ───────────────────────────────────────────────────────────

function HighlightToggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      title={on ? 'Highlighted — click to remove' : 'Not highlighted — click to enable'}
      style={{
        width: 38, height: 22, borderRadius: 11,
        background: on ? 'var(--accent)' : 'var(--bg-3)',
        border: '1px solid var(--border)',
        position: 'relative', cursor: 'pointer',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 2,
        left: on ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%',
        background: on ? 'white' : 'var(--text-3)',
        transition: 'left 0.2s',
      }} />
    </button>
  );
}

// ─── inline rename for categories ───────────────────────────────────────────

function InlineRename({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => {
    if (draft.trim() && draft.trim() !== value) onSave(draft.trim());
    setEditing(false);
  };

  if (!editing) {
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.875rem' }}>{value}</span>
        <button style={iconBtn()} onClick={() => { setDraft(value); setEditing(true); }} title="Rename">
          <Pencil size={13} />
        </button>
      </span>
    );
  }

  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      <input
        style={{ ...inputCss, padding: '0.25rem 0.5rem', fontSize: '0.875rem', width: 160 }}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
        autoFocus
      />
      <button style={iconBtn('#22c55e')} onClick={commit} title="Save"><Check size={13} /></button>
      <button style={iconBtn('#ef4444')} onClick={() => setEditing(false)} title="Cancel"><X size={13} /></button>
    </span>
  );
}

// ─── types ───────────────────────────────────────────────────────────────────

type SkillForm = { id?: string; name: string; level: number; categoryId: string; order: number; isHighlighted: boolean };

const EMPTY_SKILL = (categoryId: string): SkillForm => ({
  name: '', level: 80, categoryId, order: 0, isHighlighted: false,
});

// ─── page ────────────────────────────────────────────────────────────────────

export default function AdminSkills() {
  const [categories, setCategories] = useState<SkillCategoryWithSkills[]>([]);
  const [loading, setLoading] = useState(true);

  const [catModal, setCatModal] = useState(false);
  const [catForm, setCatForm] = useState<Partial<SkillCategory>>({ name: '' });
  const [catSaving, setCatSaving] = useState(false);

  const [skillModal, setSkillModal] = useState(false);
  const [skillForm, setSkillForm] = useState<SkillForm>(EMPTY_SKILL(''));
  const [skillSaving, setSkillSaving] = useState(false);

  const [deleting, setDeleting] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await api.get<{ categories: SkillCategoryWithSkills[] }>('/skills', authHeader(getToken()));
      setCategories(data.categories ?? []);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load skills data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── category CRUD ──────────────────────────────────────────────────────────

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name?.trim()) return;
    setCatSaving(true);
    try {
      if (catForm.id) {
        await api.put(`/categories/${catForm.id}`, { name: catForm.name }, authHeader(getToken()));
      } else {
        const maxOrder = categories.length ? Math.max(...categories.map((c) => c.order)) + 1 : 0;
        await api.post('/categories', { name: catForm.name, order: maxOrder }, authHeader(getToken()));
      }
      setCatModal(false);
      load();
    } finally { setCatSaving(false); }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category? Skills inside will become uncategorised.')) return;
    setDeleting(id);
    try {
      await api.delete(`/categories/${id}`, authHeader(getToken()));
      load();
    } finally { setDeleting(null); }
  };

  const renameCategory = async (id: string, name: string) => {
    await api.put(`/categories/${id}`, { name }, authHeader(getToken()));
    load();
  };

  // ── skill CRUD ────────────────────────────────────────────────────────────

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name.trim() || !skillForm.categoryId) return;
    setSkillSaving(true);
    try {
      const payload = { ...skillForm, level: Number(skillForm.level) };
      if (skillForm.id) {
        await api.put(`/skills/${skillForm.id}`, payload, authHeader(getToken()));
      } else {
        await api.post('/skills', payload, authHeader(getToken()));
      }
      setSkillModal(false);
      load();
    } finally { setSkillSaving(false); }
  };

  const deleteSkill = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    setDeleting(id);
    try {
      await api.delete(`/skills/${id}`, authHeader(getToken()));
      load();
    } finally { setDeleting(null); }
  };

  const toggleHighlight = async (skill: Skill) => {
    await api.put(`/skills/${skill.id}`, { isHighlighted: !skill.isHighlighted }, authHeader(getToken()));
    load();
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <AdminShell>
      <div style={{ maxWidth: 760 }}>

        {/* ── page header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
              Skills Management
            </h1>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-3)', marginTop: '0.25rem' }}>
              Manage categories and skill highlights displayed on the portfolio.
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ color: 'var(--text-3)', padding: '2rem', textAlign: 'center' }}>Loading…</div>
        ) : loadError ? (
          <div style={{
            padding: '1rem 1.25rem', borderRadius: '10px',
            background: '#ef444415', border: '1px solid #ef4444',
            color: '#ef4444', fontSize: '0.875rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
          }}>
            <span>Error: {loadError}</span>
            <button
              onClick={load}
              style={{
                padding: '0.35rem 0.75rem', borderRadius: '7px',
                background: '#ef4444', border: 'none', cursor: 'pointer',
                color: 'white', fontSize: '0.8rem', fontWeight: 600, flexShrink: 0,
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* ════════════════════════════════════════
                SECTION 1 — CATEGORY MANAGEMENT
            ════════════════════════════════════════ */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <p style={sectionTitle}>Categories</p>
                <button
                  onClick={() => { setCatForm({ name: '' }); setCatModal(true); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.45rem 0.875rem', borderRadius: '8px',
                    background: 'var(--accent)', border: 'none', cursor: 'pointer',
                    color: 'white', fontSize: '0.8rem', fontWeight: 600,
                  }}
                >
                  <Plus size={14} /> Add Category
                </button>
              </div>

              {categories.length === 0 && (
                <p style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>
                  No categories yet. Add one above.
                </p>
              )}

              {categories.map((cat) => (
                <div key={cat.id} style={rowStyle}>
                  <InlineRename value={cat.name} onSave={(name) => renameCategory(cat.id, name)} />
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
                      {cat.skills.length} skill{cat.skills.length !== 1 ? 's' : ''}
                    </span>
                    <button
                      style={iconBtn('#ef4444')}
                      onClick={() => deleteCategory(cat.id)}
                      disabled={deleting === cat.id}
                      title="Delete category"
                    >
                      <Trash2 size={14} />
                    </button>
                  </span>
                </div>
              ))}
            </div>

            {/* ════════════════════════════════════════
                SECTION 2 — SKILLS BY CATEGORY
            ════════════════════════════════════════ */}
            <p style={{ ...sectionTitle, marginTop: '1.5rem' }}>Skills by Category</p>

            {categories.map((cat) => (
              <div key={cat.id} style={{ ...cardStyle, marginBottom: '1.25rem' }}>
                {/* category header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '0.825rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {cat.name}
                  </span>
                  <button
                    onClick={() => { setSkillForm(EMPTY_SKILL(cat.id)); setSkillModal(true); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.35rem',
                      padding: '0.35rem 0.7rem', borderRadius: '7px',
                      background: 'var(--bg-3)', border: '1px solid var(--border)',
                      cursor: 'pointer', color: 'var(--text-2)', fontSize: '0.78rem',
                    }}
                  >
                    <Plus size={12} /> Add Skill
                  </button>
                </div>

                {cat.skills.length === 0 && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>No skills yet.</p>
                )}

                {cat.skills.map((skill) => (
                  <div key={skill.id} style={{ ...rowStyle, marginBottom: '0.4rem' }}>
                    {/* skill name */}
                    <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text)', fontWeight: 500 }}>
                      {skill.name}
                    </span>

                    {/* level badge */}
                    <span style={{
                      fontSize: '0.72rem', color: 'var(--accent)',
                      background: 'var(--accent-dim)', borderRadius: '5px',
                      padding: '0.1rem 0.4rem', fontWeight: 600,
                    }}>
                      {skill.level}%
                    </span>

                    {/* highlight toggle */}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>
                        {skill.isHighlighted ? 'Highlighted' : 'Normal'}
                      </span>
                      <HighlightToggle
                        on={skill.isHighlighted}
                        onChange={() => toggleHighlight(skill)}
                      />
                    </span>

                    {/* edit */}
                    <button
                      style={iconBtn()}
                      title="Edit skill"
                      onClick={() => {
                        setSkillForm({
                          id: skill.id,
                          name: skill.name,
                          level: skill.level,
                          categoryId: cat.id,
                          order: skill.order,
                          isHighlighted: skill.isHighlighted,
                        });
                        setSkillModal(true);
                      }}
                    >
                      <Pencil size={14} />
                    </button>

                    {/* delete */}
                    <button
                      style={iconBtn('#ef4444')}
                      title="Delete skill"
                      disabled={deleting === skill.id}
                      onClick={() => deleteSkill(skill.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ))}

            {categories.length === 0 && (
              <p style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>
                Add categories first, then add skills to them.
              </p>
            )}
          </>
        )}
      </div>

      {/* ── Category Modal ── */}
      <Modal
        open={catModal}
        onClose={() => setCatModal(false)}
        title={catForm.id ? 'Rename Category' : 'Add Category'}
        onSubmit={handleCatSubmit}
        loading={catSaving}
      >
        <FormField label="Category Name" required>
          <input
            style={inputCss}
            value={catForm.name || ''}
            onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
            placeholder="e.g. Data Science"
            required
            autoFocus
          />
        </FormField>
      </Modal>

      {/* ── Skill Modal ── */}
      <Modal
        open={skillModal}
        onClose={() => setSkillModal(false)}
        title={skillForm.id ? 'Edit Skill' : 'Add Skill'}
        onSubmit={handleSkillSubmit}
        loading={skillSaving}
      >
        <FormField label="Skill Name" required>
          <input
            style={inputCss}
            value={skillForm.name}
            onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
            required
            autoFocus
          />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormField label="Category">
            <select
              style={inputCss}
              value={skillForm.categoryId}
              onChange={(e) => setSkillForm({ ...skillForm, categoryId: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </FormField>

          <FormField label={`Level: ${skillForm.level}%`}>
            <input
              type="range" min={0} max={100}
              style={{ width: '100%', accentColor: 'var(--accent)', marginTop: '0.5rem' }}
              value={skillForm.level}
              onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })}
            />
          </FormField>
        </div>

        <FormField label="Highlighted">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.25rem' }}>
            <HighlightToggle
              on={skillForm.isHighlighted}
              onChange={(v) => setSkillForm({ ...skillForm, isHighlighted: v })}
            />
            <span style={{ fontSize: '0.825rem', color: 'var(--text-2)' }}>
              {skillForm.isHighlighted
                ? 'Will show a coloured dot on the portfolio'
                : 'Will appear as a normal tag'}
            </span>
          </div>
        </FormField>
      </Modal>
    </AdminShell>
  );
}
