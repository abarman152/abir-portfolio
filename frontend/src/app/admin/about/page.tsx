'use client';

import { useEffect, useState } from 'react';
import { Save, CheckCircle, Plus, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import Modal, { FormField, inputCss } from '@/components/admin/Modal';
import { api, authHeader } from '@/lib/api';
import type { AboutProfile, Education, AboutSkillGroup } from '@/lib/types';

type Tab = 'profile' | 'education' | 'skills';

const EMPTY_EDU: Partial<Education> = {
  degree: '', institution: '', location: '', startDate: '', endDate: '', description: '', order: 0, visible: true,
};
const EMPTY_SKILL: Partial<AboutSkillGroup> = {
  category: '', skills: [], order: 0, visible: true,
};

const tabBtn = (active: boolean): React.CSSProperties => ({
  padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
  background: active ? 'var(--accent)' : 'var(--bg-3)',
  color: active ? 'white' : 'var(--text-2)',
  fontSize: '0.875rem', fontWeight: active ? 600 : 400,
  transition: 'all 0.15s',
});

export default function AdminAbout() {
  const [tab, setTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState<Partial<AboutProfile>>({});
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<AboutSkillGroup[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [eduModal, setEduModal] = useState(false);
  const [eduForm, setEduForm] = useState<Partial<Education>>(EMPTY_EDU);

  const [skillModal, setSkillModal] = useState(false);
  const [skillForm, setSkillForm] = useState<Partial<AboutSkillGroup>>(EMPTY_SKILL);
  const [skillInput, setSkillInput] = useState('');

  const [savingEdu, setSavingEdu] = useState(false);
  const [savingSkill, setSavingSkill] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';
  const hdrs = authHeader(token);

  const load = async () => {
    const [p, e, s] = await Promise.all([
      api.get<AboutProfile>('/about/profile', hdrs),
      api.get<Education[]>('/about/education/all', hdrs),
      api.get<AboutSkillGroup[]>('/about/skills/all', hdrs),
    ]);
    setProfile(p);
    setEducation(e);
    setSkills(s);
  };

  useEffect(() => { load(); }, []);

  /* ── Profile save ── */
  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/about/profile', profile, hdrs);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  /* ── Education CRUD ── */
  const openAddEdu = () => { setEduForm(EMPTY_EDU); setEduModal(true); };
  const openEditEdu = (e: Education) => { setEduForm({ ...e }); setEduModal(true); };

  const submitEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEdu(true);
    try {
      if (eduForm.id) await api.put(`/about/education/${eduForm.id}`, eduForm, hdrs);
      else await api.post('/about/education', eduForm, hdrs);
      setEduModal(false);
      load();
    } finally { setSavingEdu(false); }
  };

  const deleteEdu = async (id: string) => {
    if (!confirm('Delete this education entry?')) return;
    await api.delete(`/about/education/${id}`, hdrs);
    load();
  };

  const toggleEduVis = async (item: Education) => {
    await api.patch(`/about/education/${item.id}/visibility`, { visible: !item.visible }, hdrs);
    load();
  };

  /* ── Skills CRUD ── */
  const openAddSkill = () => { setSkillForm(EMPTY_SKILL); setSkillInput(''); setSkillModal(true); };
  const openEditSkill = (s: AboutSkillGroup) => {
    setSkillForm({ ...s });
    setSkillInput(s.skills.join(', '));
    setSkillModal(true);
  };

  const submitSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSkill(true);
    const skills = skillInput.split(',').map(s => s.trim()).filter(Boolean);
    try {
      if (skillForm.id) await api.put(`/about/skills/${skillForm.id}`, { ...skillForm, skills }, hdrs);
      else await api.post('/about/skills', { ...skillForm, skills }, hdrs);
      setSkillModal(false);
      load();
    } finally { setSavingSkill(false); }
  };

  const deleteSkill = async (id: string) => {
    if (!confirm('Delete this skill group?')) return;
    await api.delete(`/about/skills/${id}`, hdrs);
    load();
  };

  const toggleSkillVis = async (item: AboutSkillGroup) => {
    await api.patch(`/about/skills/${item.id}/visibility`, { visible: !item.visible }, hdrs);
    load();
  };

  const toggleStyle: React.CSSProperties = { accentColor: 'var(--accent)', width: 15, height: 15 };
  const checkLabel: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-2)' };

  return (
    <AdminShell>
      <div style={{ maxWidth: '760px' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>About Page</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Manage your profile, education, and skills
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {(['profile', 'education', 'skills'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={tabBtn(tab === t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* ── PROFILE TAB ─────────────────────────────── */}
        {tab === 'profile' && (
          <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Identity */}
            <div style={{ padding: '1.5rem', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.25rem' }}>Identity</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <FormField label="Full Name">
                    <input style={inputCss} value={profile.name || ''} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                  </FormField>
                  <FormField label="Professional Title">
                    <input style={inputCss} value={profile.title || ''} onChange={e => setProfile({ ...profile, title: e.target.value })} />
                  </FormField>
                </div>
                <FormField label="Subtitle / Specialisations">
                  <input style={inputCss} value={profile.subtitle || ''} onChange={e => setProfile({ ...profile, subtitle: e.target.value })} placeholder="e.g. Data Collection & Preparation | Reporting & Insights" />
                </FormField>
              </div>
            </div>

            {/* Contact */}
            <div style={{ padding: '1.5rem', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.25rem' }}>Contact Info</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <FormField label="Phone">
                    <input style={inputCss} value={profile.phone || ''} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="+91 XXXXXXXXXX" />
                  </FormField>
                  <FormField label="Email">
                    <input style={inputCss} value={profile.email || ''} onChange={e => setProfile({ ...profile, email: e.target.value })} />
                  </FormField>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <FormField label="LinkedIn URL">
                    <input style={inputCss} value={profile.linkedinUrl || ''} onChange={e => setProfile({ ...profile, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/..." />
                  </FormField>
                  <FormField label="GitHub URL">
                    <input style={inputCss} value={profile.githubUrl || ''} onChange={e => setProfile({ ...profile, githubUrl: e.target.value })} placeholder="https://github.com/..." />
                  </FormField>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <FormField label="Location">
                    <input style={inputCss} value={profile.location || ''} onChange={e => setProfile({ ...profile, location: e.target.value })} />
                  </FormField>
                </div>
              </div>
            </div>

            {/* Photos */}
            <div style={{ padding: '1.5rem', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.25rem' }}>Photos</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <FormField label="Primary Photo URL">
                  <input style={inputCss} value={profile.primaryPhoto || ''} onChange={e => setProfile({ ...profile, primaryPhoto: e.target.value })} placeholder="Cloudinary URL for main profile photo" />
                </FormField>
                <FormField label="Secondary Photo URL (shown in summary section)">
                  <input style={inputCss} value={profile.secondaryPhoto || ''} onChange={e => setProfile({ ...profile, secondaryPhoto: e.target.value })} placeholder="Optional secondary photo URL" />
                </FormField>
              </div>
            </div>

            {/* Summary */}
            <div style={{ padding: '1.5rem', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.25rem' }}>Professional Summary</h2>
              <textarea
                rows={6}
                style={{ ...inputCss, resize: 'vertical', lineHeight: 1.7 }}
                value={profile.summary || ''}
                onChange={e => setProfile({ ...profile, summary: e.target.value })}
                placeholder="Write your professional summary…"
              />
            </div>

            {/* Section visibility */}
            <div style={{ padding: '1.5rem', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.25rem' }}>Section Visibility</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                {[
                  { key: 'showSummary', label: 'Show Summary' },
                  { key: 'showEducation', label: 'Show Education' },
                  { key: 'showAchievements', label: 'Show Achievements' },
                  { key: 'showSkills', label: 'Show Skills' },
                ].map(({ key, label }) => (
                  <label key={key} style={checkLabel}>
                    <input type="checkbox" style={toggleStyle}
                      checked={!!profile[key as keyof AboutProfile]}
                      onChange={e => setProfile({ ...profile, [key]: e.target.checked })}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{ padding: '0.875rem 2rem', borderRadius: '12px', border: 'none', background: saved ? '#10b981' : 'var(--accent)', color: 'white', fontSize: '0.95rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start', transition: 'background 0.3s' }}
            >
              {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> {saving ? 'Saving…' : 'Save Changes'}</>}
            </button>
          </form>
        )}

        {/* ── EDUCATION TAB ────────────────────────────── */}
        {tab === 'education' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <p style={{ color: 'var(--text-2)', fontSize: '0.875rem' }}>{education.length} entr{education.length === 1 ? 'y' : 'ies'}</p>
              <button onClick={openAddEdu} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: 'white', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Plus size={15} /> Add Education
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {education.map(edu => (
                <div key={edu.id} style={{ padding: '1.25rem', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.2rem' }}>{edu.degree}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>{edu.institution}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.15rem' }}>{edu.location} · {edu.startDate} – {edu.endDate}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                    <button onClick={() => toggleEduVis(edu)} title={edu.visible ? 'Hide' : 'Show'} style={{ width: 30, height: 30, borderRadius: '7px', border: 'none', cursor: 'pointer', background: edu.visible ? 'rgba(99,102,241,0.12)' : 'var(--bg-3)', color: edu.visible ? 'var(--accent)' : 'var(--text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {edu.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>
                    <button onClick={() => openEditEdu(edu)} style={{ width: 30, height: 30, borderRadius: '7px', border: 'none', cursor: 'pointer', background: 'var(--bg-3)', color: 'var(--text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => deleteEdu(edu.id)} style={{ width: 30, height: 30, borderRadius: '7px', border: 'none', cursor: 'pointer', background: 'rgba(239,68,68,0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
              {education.length === 0 && <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>No education entries yet.</p>}
            </div>
          </div>
        )}

        {/* ── SKILLS TAB ──────────────────────────────── */}
        {tab === 'skills' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <p style={{ color: 'var(--text-2)', fontSize: '0.875rem' }}>{skills.length} group{skills.length !== 1 ? 's' : ''}</p>
              <button onClick={openAddSkill} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: 'white', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Plus size={15} /> Add Group
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {skills.map(sg => (
                <div key={sg.id} style={{ padding: '1.25rem', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>{sg.category}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {sg.skills.map(s => (
                        <span key={s} className="tag" style={{ fontSize: '0.75rem' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                    <button onClick={() => toggleSkillVis(sg)} title={sg.visible ? 'Hide' : 'Show'} style={{ width: 30, height: 30, borderRadius: '7px', border: 'none', cursor: 'pointer', background: sg.visible ? 'rgba(99,102,241,0.12)' : 'var(--bg-3)', color: sg.visible ? 'var(--accent)' : 'var(--text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {sg.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>
                    <button onClick={() => openEditSkill(sg)} style={{ width: 30, height: 30, borderRadius: '7px', border: 'none', cursor: 'pointer', background: 'var(--bg-3)', color: 'var(--text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => deleteSkill(sg.id)} style={{ width: 30, height: 30, borderRadius: '7px', border: 'none', cursor: 'pointer', background: 'rgba(239,68,68,0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
              {skills.length === 0 && <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>No skill groups yet.</p>}
            </div>
          </div>
        )}
      </div>

      {/* Education modal */}
      <Modal open={eduModal} onClose={() => setEduModal(false)} title={eduForm.id ? 'Edit Education' : 'Add Education'} onSubmit={submitEdu} loading={savingEdu}>
        <FormField label="Degree / Qualification" required>
          <input style={inputCss} value={eduForm.degree || ''} onChange={e => setEduForm({ ...eduForm, degree: e.target.value })} required placeholder="e.g. Master of Computer Applications (MCA)" />
        </FormField>
        <FormField label="Institution" required>
          <input style={inputCss} value={eduForm.institution || ''} onChange={e => setEduForm({ ...eduForm, institution: e.target.value })} required placeholder="e.g. VIT Bhopal University" />
        </FormField>
        <FormField label="Location">
          <input style={inputCss} value={eduForm.location || ''} onChange={e => setEduForm({ ...eduForm, location: e.target.value })} placeholder="e.g. Bhopal, Madhya Pradesh" />
        </FormField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
          <FormField label="Start Date" required>
            <input style={inputCss} value={eduForm.startDate || ''} onChange={e => setEduForm({ ...eduForm, startDate: e.target.value })} required placeholder="e.g. 08/2024" />
          </FormField>
          <FormField label="End Date">
            <input style={inputCss} value={eduForm.endDate || ''} onChange={e => setEduForm({ ...eduForm, endDate: e.target.value })} placeholder="e.g. 06/2026 or Present" />
          </FormField>
        </div>
        <FormField label="Description (optional)">
          <textarea rows={3} style={{ ...inputCss, resize: 'vertical' }} value={eduForm.description || ''} onChange={e => setEduForm({ ...eduForm, description: e.target.value })} />
        </FormField>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <FormField label="Order">
            <input type="number" style={{ ...inputCss, width: '80px' }} value={eduForm.order ?? 0} onChange={e => setEduForm({ ...eduForm, order: Number(e.target.value) })} />
          </FormField>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-2)', marginTop: '1.4rem' }}>
            <input type="checkbox" checked={eduForm.visible !== false} onChange={e => setEduForm({ ...eduForm, visible: e.target.checked })} style={{ accentColor: 'var(--accent)' }} />
            Visible on site
          </label>
        </div>
      </Modal>

      {/* Skill group modal */}
      <Modal open={skillModal} onClose={() => setSkillModal(false)} title={skillForm.id ? 'Edit Skill Group' : 'Add Skill Group'} onSubmit={submitSkill} loading={savingSkill}>
        <FormField label="Category Name" required>
          <input style={inputCss} value={skillForm.category || ''} onChange={e => setSkillForm({ ...skillForm, category: e.target.value })} required placeholder="e.g. Programming, Analytics Tools" />
        </FormField>
        <FormField label="Skills (comma-separated)" required>
          <input style={inputCss} value={skillInput} onChange={e => setSkillInput(e.target.value)} required placeholder="e.g. Python, SQL, Pandas" />
        </FormField>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <FormField label="Order">
            <input type="number" style={{ ...inputCss, width: '80px' }} value={skillForm.order ?? 0} onChange={e => setSkillForm({ ...skillForm, order: Number(e.target.value) })} />
          </FormField>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-2)', marginTop: '1.4rem' }}>
            <input type="checkbox" checked={skillForm.visible !== false} onChange={e => setSkillForm({ ...skillForm, visible: e.target.checked })} style={{ accentColor: 'var(--accent)' }} />
            Visible on site
          </label>
        </div>
      </Modal>
    </AdminShell>
  );
}
