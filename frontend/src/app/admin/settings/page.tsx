'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { FormField, inputCss } from '@/components/admin/Modal';
import { api, authHeader } from '@/lib/api';
import type { SiteSettings, HeroContent } from '@/lib/types';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [hero, setHero] = useState<Partial<HeroContent>>({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

  useEffect(() => {
    const headers = authHeader(token);
    Promise.all([
      api.get<SiteSettings>('/settings', headers),
      api.get<HeroContent>('/hero', headers),
    ]).then(([s, h]) => {
      setSettings(s);
      setHero(h);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await Promise.all([
        api.put('/settings', settings, authHeader(token)),
        api.put('/hero', hero, authHeader(token)),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  return (
    <AdminShell>
      <div style={{ maxWidth: '700px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>Settings</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Site configuration and hero content
          </p>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Hero Section */}
          <div style={{ padding: '1.75rem', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.5rem' }}>
              Hero Content
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <FormField label="Full Name">
                <input style={inputCss} value={hero.name || ''} onChange={(e) => setHero({ ...hero, name: e.target.value })} />
              </FormField>
              <FormField label="Tagline">
                <input style={inputCss} value={hero.tagline || ''} onChange={(e) => setHero({ ...hero, tagline: e.target.value })} />
              </FormField>
              <FormField label="Typing Roles (pipe-separated)">
                <input style={inputCss}
                  value={Array.isArray(hero.roles) ? hero.roles.join(' | ') : hero.roles || ''}
                  onChange={(e) => setHero({ ...hero, roles: e.target.value.split('|').map((s) => s.trim()) })}
                  placeholder="Data Scientist | ML Engineer | Full Stack Developer"
                />
              </FormField>
              <FormField label="Bio">
                <textarea style={{ ...inputCss, minHeight: '100px', resize: 'vertical' }}
                  value={hero.bio || ''} onChange={(e) => setHero({ ...hero, bio: e.target.value })} />
              </FormField>
              <FormField label="Resume URL">
                <input style={inputCss} value={hero.resumeUrl || ''} onChange={(e) => setHero({ ...hero, resumeUrl: e.target.value })} />
              </FormField>
              <FormField label="Avatar URL">
                <input style={inputCss} value={hero.avatarUrl || ''} onChange={(e) => setHero({ ...hero, avatarUrl: e.target.value })} />
              </FormField>
            </div>
          </div>

          {/* Site Settings */}
          <div style={{ padding: '1.75rem', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.5rem' }}>
              Site Settings
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <FormField label="Meta Title">
                <input style={inputCss} value={settings.metaTitle || ''} onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })} />
              </FormField>
              <FormField label="Meta Description">
                <textarea style={{ ...inputCss, minHeight: '80px', resize: 'vertical' }}
                  value={settings.metaDesc || ''} onChange={(e) => setSettings({ ...settings, metaDesc: e.target.value })} />
              </FormField>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormField label="Default Theme">
                  <select style={inputCss} value={settings.defaultTheme || 'dark'} onChange={(e) => setSettings({ ...settings, defaultTheme: e.target.value })}>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </FormField>
                <FormField label="Accent Color">
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="color" value={settings.accentColor || '#6366f1'} onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                      style={{ width: 40, height: 38, borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', background: 'none', padding: '2px' }} />
                    <input style={{ ...inputCss, flex: 1 }} value={settings.accentColor || ''} onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })} />
                  </div>
                </FormField>
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={saving}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '0.875rem 2rem', borderRadius: '12px', border: 'none',
              background: saved
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, var(--accent), var(--accent))',
              color: 'white', fontSize: '0.95rem', fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              alignSelf: 'flex-start',
              boxShadow: '0 4px 14px var(--border)',
              transition: 'background 0.3s',
            }}
          >
            {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}</>}
          </motion.button>
        </form>
      </div>
    </AdminShell>
  );
}
