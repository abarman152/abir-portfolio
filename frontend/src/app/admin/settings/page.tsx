'use client';

import AdminShell from '@/components/admin/AdminShell';
import { FormField, inputCss } from '@/components/admin/Modal';
import { api, authHeader } from '@/lib/api';
import { isValidResumeUrl, previewUrlHint } from '@/lib/resume';
import type { HeroConfig, HeroContent, SiteSettings } from '@/lib/types';
import { motion } from 'framer-motion';
import { CheckCircle, Eye, EyeOff, Image as ImageIcon, Link2, Lock, Palette, Save, Shield, Unlink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const DEFAULT_HERO_CONFIG: HeroConfig = {
  backgroundType: 'gradient',
  backgroundValue: '',
  profileImage: '',
  themeImages: {},
  linkedMode: true,
};

export default function AdminSettings() {
  const router = useRouter();
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [hero, setHero] = useState<Partial<HeroContent>>({});
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(DEFAULT_HERO_CONFIG);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

  // Password change state
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwShow, setPwShow] = useState({ current: false, new: false, confirm: false });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess(false);

    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      setPwError('All fields are required');
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError('New password must be at least 8 characters');
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match');
      return;
    }
    if (pwForm.currentPassword === pwForm.newPassword) {
      setPwError('New password must be different from current password');
      return;
    }

    setPwSaving(true);
    try {
      await api.post<{ message: string }>('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      }, authHeader(token));

      setPwSuccess(true);
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });

      // Auto-logout after 2 seconds so admin sees the success message
      setTimeout(() => {
        localStorage.removeItem('admin_token');
        router.replace('/admin/login');
      }, 2000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update password';
      // Try to extract backend error message
      if (msg.includes('401')) {
        setPwError('Current password is incorrect');
      } else if (msg.includes('400')) {
        setPwError('Invalid request. Check your input.');
      } else {
        setPwError(msg);
      }
    } finally {
      setPwSaving(false);
    }
  };

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

  const resumeUrlInvalid = !!hero.resumeUrl && !isValidResumeUrl(hero.resumeUrl);
  const previewUrlInvalid = !!hero.resumePreviewUrl && !isValidResumeUrl(hero.resumePreviewUrl);
  const previewHint = hero.resumePreviewUrl ? previewUrlHint(hero.resumePreviewUrl) : null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resumeUrlInvalid) {
      setError('Resume URL must be a valid http(s) link');
      return;
    }
    if (previewUrlInvalid) {
      setError('Resume Preview URL must be a valid http(s) link');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const { heroConfig: _drop, id: _id, ...settingsRest } = settings as Record<string, unknown>;
      void _drop; void _id;
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
                <input
                  style={{ ...inputCss, ...(resumeUrlInvalid ? { borderColor: '#ef4444' } : {}) }}
                  value={hero.resumeUrl || ''}
                  onChange={(e) => setHero({ ...hero, resumeUrl: e.target.value.trim() })}
                  placeholder="https://res.cloudinary.com/…/resume.pdf"
                  aria-invalid={resumeUrlInvalid}
                  aria-describedby="resume-url-hint"
                />
                <div id="resume-url-hint" style={{ marginTop: '0.4rem', fontSize: '0.75rem' }}>
                  {resumeUrlInvalid ? (
                    <span style={{ color: '#ef4444' }}>Must be a valid http(s) URL</span>
                  ) : isValidResumeUrl(hero.resumeUrl) ? (
                    <a href={hero.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                      Open resume ↗
                    </a>
                  ) : (
                    <span style={{ color: 'var(--text-3)' }}>Used by the Download / Open buttons on the Hero and /resume page</span>
                  )}
                </div>
              </FormField>
              <FormField label="Resume Preview URL">
                <input
                  style={{ ...inputCss, ...(previewUrlInvalid ? { borderColor: '#ef4444' } : {}) }}
                  value={hero.resumePreviewUrl || ''}
                  onChange={(e) => setHero({ ...hero, resumePreviewUrl: e.target.value.trim() })}
                  placeholder="https://drive.google.com/file/d/…/preview"
                  aria-invalid={previewUrlInvalid}
                  aria-describedby="resume-preview-url-hint"
                />
                <div id="resume-preview-url-hint" style={{ marginTop: '0.4rem', fontSize: '0.75rem' }}>
                  {previewUrlInvalid ? (
                    <span style={{ color: '#ef4444' }}>Must be a valid http(s) URL</span>
                  ) : previewHint ? (
                    <span style={{ color: '#f59e0b' }}>{previewHint}</span>
                  ) : isValidResumeUrl(hero.resumePreviewUrl) ? (
                    <a href={hero.resumePreviewUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                      Open preview ↗
                    </a>
                  ) : (
                    <span style={{ color: 'var(--text-3)' }}>Embedded preview on the /resume page — independent from the download URL</span>
                  )}
                </div>
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
                  <ImageIcon size={14} style={{ color: 'var(--accent)' }} />
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

        {/* ─── Security: Change Password ─────────────────────── */}
        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
          <div style={cardStyle}>
            <h2 style={sectionTitle}>
              <Shield size={18} style={{ color: 'var(--accent)' }} />
              Security
            </h2>
            <p style={{ color: 'var(--text-3)', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
              Update your admin password. You will be logged out after a successful change.
            </p>

            {pwError && (
              <div style={{
                padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1rem',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444', fontSize: '0.85rem', fontWeight: 500,
              }}>
                {pwError}
              </div>
            )}

            {pwSuccess && (
              <div style={{
                padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1rem',
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                color: '#10b981', fontSize: '0.85rem', fontWeight: 500,
              }}>
                Password updated successfully. Redirecting to login...
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <FormField label="Current Password" required>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{
                    position: 'absolute', left: '0.75rem', top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none',
                  }} />
                  <input
                    type={pwShow.current ? 'text' : 'password'}
                    value={pwForm.currentPassword}
                    onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    style={{ ...inputCss, paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setPwShow({ ...pwShow, current: !pwShow.current })}
                    style={{
                      position: 'absolute', right: '0.75rem', top: '50%',
                      transform: 'translateY(-50%)', background: 'none',
                      border: 'none', cursor: 'pointer', color: 'var(--text-3)',
                    }}
                  >
                    {pwShow.current ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </FormField>

              <FormField label="New Password" required>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{
                    position: 'absolute', left: '0.75rem', top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none',
                  }} />
                  <input
                    type={pwShow.new ? 'text' : 'password'}
                    value={pwForm.newPassword}
                    onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                    placeholder="Minimum 8 characters"
                    style={{ ...inputCss, paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setPwShow({ ...pwShow, new: !pwShow.new })}
                    style={{
                      position: 'absolute', right: '0.75rem', top: '50%',
                      transform: 'translateY(-50%)', background: 'none',
                      border: 'none', cursor: 'pointer', color: 'var(--text-3)',
                    }}
                  >
                    {pwShow.new ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </FormField>

              <FormField label="Confirm New Password" required>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{
                    position: 'absolute', left: '0.75rem', top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none',
                  }} />
                  <input
                    type={pwShow.confirm ? 'text' : 'password'}
                    value={pwForm.confirmPassword}
                    onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                    placeholder="Re-enter new password"
                    style={{ ...inputCss, paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setPwShow({ ...pwShow, confirm: !pwShow.confirm })}
                    style={{
                      position: 'absolute', right: '0.75rem', top: '50%',
                      transform: 'translateY(-50%)', background: 'none',
                      border: 'none', cursor: 'pointer', color: 'var(--text-3)',
                    }}
                  >
                    {pwShow.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </FormField>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={pwSaving || pwSuccess}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '0.875rem 2rem', borderRadius: '12px', border: 'none',
              background: pwSuccess
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white', fontSize: '0.95rem', fontWeight: 600,
              cursor: (pwSaving || pwSuccess) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              alignSelf: 'flex-start',
              boxShadow: '0 4px 14px var(--border)',
              transition: 'background 0.3s',
              opacity: (pwSaving || pwSuccess) ? 0.7 : 1,
            }}
          >
            {pwSuccess
              ? <><CheckCircle size={16} /> Updated!</>
              : <><Shield size={16} /> {pwSaving ? 'Updating...' : 'Change Password'}</>}
          </motion.button>
        </form>
      </div>
    </AdminShell>
  );
}
