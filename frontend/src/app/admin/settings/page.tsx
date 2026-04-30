'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle, Link2, Unlink, Image, Palette } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { FormField, inputCss } from '@/components/admin/Modal';
import { api, authHeader } from '@/lib/api';
import type { SiteSettings, HeroContent, HeroConfig } from '@/lib/types';

const DEFAULT_HERO_CONFIG: HeroConfig = {
  backgroundType: 'gradient',
  backgroundValue: '',
  profileImage: '',
  themeImages: {},
  linkedMode: true,
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [hero, setHero] = useState<Partial<HeroContent>>({});
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(DEFAULT_HERO_CONFIG);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

  useEffect(() => {
    const headers = authHeader(token);
    Promise.all([
      api.get<SiteSettings>('/settings', headers),
      api.get<HeroContent>('/hero', headers),
    ]).then(([s, h]) => {
      setSettings(s);
      setHero(h);
      if (s.heroConfig) {
        setHeroConfig({ ...DEFAULT_HERO_CONFIG, ...s.heroConfig });
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { heroConfig: _drop, id: _id, ...settingsRest } = settings as Record<string, unknown>;
      await Promise.all([
        api.put('/settings', { ...settingsRest, heroConfig }, authHeader(token)),
        api.put('/hero', hero, authHeader(token)),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      setError(msg);
      console.error('Settings save error:', err);
    } finally { setSaving(false); }
  };

  const updateHeroConfig = (patch: Partial<HeroConfig>) => {
    setHeroConfig((prev) => ({ ...prev, ...patch }));
  };

  const updateThemeImages = (key: 'light' | 'dark', value: string) => {
    setHeroConfig((prev) => ({
      ...prev,
      themeImages: { ...prev.themeImages, [key]: value },
    }));
  };

  const cardStyle: React.CSSProperties = {
    padding: '1.75rem',
    borderRadius: '16px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const previewBox: React.CSSProperties = {
    width: '100%',
    height: 120,
    borderRadius: '12px',
    border: '1px solid var(--border)',
    overflow: 'hidden',
    background: 'var(--bg-3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    color: 'var(--text-3)',
    fontWeight: 500,
  };

  const toggleStyle = (active: boolean): React.CSSProperties => ({
    width: 44,
    height: 24,
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    background: active
      ? 'linear-gradient(135deg, var(--accent), var(--accent))'
      : 'var(--bg-3)',
    transition: 'background 0.2s',
    flexShrink: 0,
  });

  const toggleKnob = (active: boolean): React.CSSProperties => ({
    position: 'absolute',
    top: 3,
    left: active ? 22 : 3,
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: 'white',
    transition: 'left 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  });

  return (
    <AdminShell>
      <div style={{ maxWidth: '700px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>Settings</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Site configuration, hero content, and hero appearance
          </p>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Error banner */}
          {error && (
            <div style={{
              padding: '0.875rem 1.25rem', borderRadius: '12px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#ef4444', fontSize: '0.875rem', fontWeight: 500,
            }}>
              ⚠ {error}
            </div>
          )}

          {/* Hero Content */}
          <div style={cardStyle}>
            <h2 style={sectionTitle}>Hero Content</h2>
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
              <FormField label="Avatar URL (legacy fallback)">
                <input style={inputCss} value={hero.avatarUrl || ''} onChange={(e) => setHero({ ...hero, avatarUrl: e.target.value })} />
              </FormField>
            </div>
          </div>

          {/* ─── Hero Appearance (NEW) ─────────────────────── */}
          <div style={cardStyle}>
            <h2 style={sectionTitle}>
              <Palette size={18} style={{ color: 'var(--accent)' }} />
              Hero Appearance
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Linked Mode Toggle */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.875rem 1rem', borderRadius: '12px',
                background: heroConfig.linkedMode ? 'var(--accent-dim)' : 'var(--bg-3)',
                border: `1px solid ${heroConfig.linkedMode ? 'var(--accent)' : 'var(--border)'}`,
                transition: 'all 0.2s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {heroConfig.linkedMode
                    ? <Link2 size={15} style={{ color: 'var(--accent)' }} />
                    : <Unlink size={15} style={{ color: 'var(--text-3)' }} />}
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                      Linked Mode
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: '1px' }}>
                      {heroConfig.linkedMode
                        ? 'Background + profile image treated as a pair'
                        : 'Edit background and profile image independently'}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  style={toggleStyle(heroConfig.linkedMode)}
                  onClick={() => updateHeroConfig({ linkedMode: !heroConfig.linkedMode })}
                >
                  <span style={toggleKnob(heroConfig.linkedMode)} />
                </button>
              </div>

              {/* Background Type */}
              <FormField label="Background Type">
                <select
                  style={inputCss}
                  value={heroConfig.backgroundType}
                  onChange={(e) => updateHeroConfig({
                    backgroundType: e.target.value as 'gradient' | 'image',
                  })}
                >
                  <option value="gradient">Gradient / CSS</option>
                  <option value="image">Image URL</option>
                </select>
              </FormField>

              {/* Background Value */}
              <FormField label={heroConfig.backgroundType === 'gradient' ? 'Gradient CSS Value' : 'Background Image URL'}>
                <input
                  style={inputCss}
                  value={heroConfig.backgroundValue}
                  onChange={(e) => updateHeroConfig({ backgroundValue: e.target.value })}
                  placeholder={heroConfig.backgroundType === 'gradient'
                    ? 'e.g. linear-gradient(135deg, #0b0f17, #1a1a2e)'
                    : 'https://res.cloudinary.com/...'}
                />
              </FormField>

              {/* Background Preview */}
              {heroConfig.backgroundValue && (
                <div style={{
                  ...previewBox,
                  height: 80,
                  ...(heroConfig.backgroundType === 'gradient'
                    ? { background: heroConfig.backgroundValue }
                    : {
                        backgroundImage: `url(${heroConfig.backgroundValue})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }),
                }}>
                  {heroConfig.backgroundType === 'image' && (
                    <span style={{ background: 'rgba(0,0,0,0.5)', padding: '0.25rem 0.5rem', borderRadius: 6, color: '#fff' }}>
                      Background Preview
                    </span>
                  )}
                </div>
              )}

              {/* Default Profile Image */}
              <FormField label="Default Profile Image URL">
                <input
                  style={inputCss}
                  value={heroConfig.profileImage}
                  onChange={(e) => updateHeroConfig({ profileImage: e.target.value })}
                  placeholder="https://res.cloudinary.com/..."
                />
              </FormField>

              {/* Theme Images */}
              <div style={{
                padding: '1rem 1.25rem', borderRadius: '12px',
                background: 'var(--bg-2)', border: '1px solid var(--border)',
              }}>
                <div style={{
                  fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)',
                  marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
                }}>
                  <Image size={14} style={{ color: 'var(--accent)' }} />
                  Theme-Specific Images
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {/* Dark Theme */}
                  <div>
                    <FormField label="Dark Theme Image">
                      <input
                        style={inputCss}
                        value={heroConfig.themeImages?.dark || ''}
                        onChange={(e) => updateThemeImages('dark', e.target.value)}
                        placeholder="URL for dark mode"
                      />
                    </FormField>
                    <div style={{ ...previewBox, marginTop: '0.5rem', background: '#0b0f17' }}>
                      {heroConfig.themeImages?.dark ? (
                        <img
                          src={heroConfig.themeImages.dark}
                          alt="Dark theme preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <span>No dark image</span>
                      )}
                    </div>
                  </div>

                  {/* Light Theme */}
                  <div>
                    <FormField label="Light Theme Image">
                      <input
                        style={inputCss}
                        value={heroConfig.themeImages?.light || ''}
                        onChange={(e) => updateThemeImages('light', e.target.value)}
                        placeholder="URL for light mode"
                      />
                    </FormField>
                    <div style={{ ...previewBox, marginTop: '0.5rem', background: '#f3f4f6' }}>
                      {heroConfig.themeImages?.light ? (
                        <img
                          src={heroConfig.themeImages.light}
                          alt="Light theme preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <span style={{ color: '#9ca3af' }}>No light image</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Overlay Style (optional) */}
              <FormField label="Overlay Style (optional CSS)">
                <input
                  style={inputCss}
                  value={heroConfig.overlayStyle || ''}
                  onChange={(e) => updateHeroConfig({ overlayStyle: e.target.value })}
                  placeholder="e.g. rgba(0,0,0,0.4)"
                />
              </FormField>
            </div>
          </div>

          {/* Site Settings */}
          <div style={cardStyle}>
            <h2 style={sectionTitle}>Site Settings</h2>
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
