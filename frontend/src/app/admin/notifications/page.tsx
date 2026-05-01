'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Mail, Phone, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { api, authHeader } from '@/lib/api';
import type { NotificationSettings } from '@/lib/types';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';
}

const card: React.CSSProperties = {
  background: 'var(--bg-2)', border: '1px solid var(--border)',
  borderRadius: '12px', padding: '1.5rem', marginBottom: '1.25rem',
};

const sectionTitle: React.CSSProperties = {
  fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem',
};

const sectionDesc: React.CSSProperties = {
  fontSize: '0.8rem', color: 'var(--text-3)', marginBottom: '1.25rem',
};

const inputCss: React.CSSProperties = {
  width: '100%', padding: '0.6rem 0.875rem', borderRadius: '8px',
  background: 'var(--bg-3)', border: '1px solid var(--border)',
  color: 'var(--text)', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit',
};

const tagStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
  padding: '0.3rem 0.7rem', borderRadius: '6px',
  background: 'var(--bg-3)', border: '1px solid var(--border)',
  fontSize: '0.82rem', color: 'var(--text-2)',
};

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      style={{
        width: 42, height: 24, borderRadius: 12,
        background: on ? 'var(--accent)' : 'var(--bg-3)',
        border: '1px solid var(--border)',
        position: 'relative', cursor: 'pointer',
        transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: on ? 20 : 3,
        width: 16, height: 16, borderRadius: '50%',
        background: on ? 'white' : 'var(--text-3)',
        transition: 'left 0.2s',
      }} />
    </button>
  );
}

type ToastState = { type: 'success' | 'error'; msg: string } | null;

function Toast({ toast }: { toast: ToastState }) {
  if (!toast) return null;
  const ok = toast.type === 'success';
  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000,
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      padding: '0.75rem 1.125rem', borderRadius: '10px',
      background: ok ? '#16a34a15' : '#ef444415',
      border: `1px solid ${ok ? '#16a34a' : '#ef4444'}`,
      color: ok ? '#16a34a' : '#ef4444', fontSize: '0.875rem', fontWeight: 500,
    }}>
      {ok ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {toast.msg}
    </div>
  );
}

export default function AdminNotifications() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testingWA, setTestingWA] = useState(false);

  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<NotificationSettings>('/notification-settings', authHeader(getToken()));
      setSettings(data);
    } catch {
      showToast('error', 'Failed to load notification settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (patch: Partial<NotificationSettings>) => {
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await api.put<NotificationSettings>(
        '/notification-settings',
        { ...settings, ...patch },
        authHeader(getToken()),
      );
      setSettings(updated);
      showToast('success', 'Settings saved');
    } catch {
      showToast('error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const addEmail = async () => {
    const v = emailInput.trim();
    if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      showToast('error', 'Enter a valid email address');
      return;
    }
    if (settings?.emailRecipients.includes(v)) {
      showToast('error', 'Email already added');
      return;
    }
    setEmailInput('');
    await save({ emailRecipients: [...(settings?.emailRecipients ?? []), v] });
  };

  const removeEmail = async (email: string) => {
    await save({ emailRecipients: settings?.emailRecipients.filter((e) => e !== email) ?? [] });
  };

  const addPhone = async () => {
    const v = phoneInput.trim().replace(/\s/g, '');
    if (!v || !/^\+?[1-9]\d{6,14}$/.test(v)) {
      showToast('error', 'Enter a valid phone number with country code (e.g. +919876543210)');
      return;
    }
    if (settings?.whatsappNumbers.includes(v)) {
      showToast('error', 'Number already added');
      return;
    }
    setPhoneInput('');
    await save({ whatsappNumbers: [...(settings?.whatsappNumbers ?? []), v] });
  };

  const removePhone = async (num: string) => {
    await save({ whatsappNumbers: settings?.whatsappNumbers.filter((n) => n !== num) ?? [] });
  };

  const sendTest = async (channel: 'email' | 'whatsapp') => {
    const setTesting = channel === 'email' ? setTestingEmail : setTestingWA;
    setTesting(true);
    try {
      await api.post('/notification-settings/test', { channel }, authHeader(getToken()));
      showToast('success', `Test ${channel === 'email' ? 'email' : 'WhatsApp'} sent successfully`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to send test';
      showToast('error', msg);
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: 'var(--text-3)' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div style={{ maxWidth: 680 }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
            Contact Notifications
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-3)', marginTop: '0.25rem' }}>
            Forward new contact messages to email and WhatsApp. All settings are admin-controlled.
          </p>
        </div>

        {saving && (
          <div style={{ fontSize: '0.78rem', color: 'var(--accent)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Saving…
          </div>
        )}

        {/* ── EMAIL ── */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Mail size={16} style={{ color: 'var(--accent)' }} />
              <div>
                <p style={sectionTitle}>Email Notifications</p>
                <p style={{ ...sectionDesc, margin: 0 }}>
                  Send an email when a contact form message is received.
                </p>
              </div>
            </div>
            <Toggle
              on={settings?.emailEnabled ?? false}
              onChange={(v) => save({ emailEnabled: v })}
            />
          </div>

          {/* recipient tags */}
          {(settings?.emailRecipients ?? []).length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.875rem' }}>
              {settings!.emailRecipients.map((email) => (
                <span key={email} style={tagStyle}>
                  {email}
                  <button
                    onClick={() => removeEmail(email)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 0, display: 'flex' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* add email */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="email"
              placeholder="Add email address…"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addEmail()}
              style={{ ...inputCss, flex: 1 }}
            />
            <button
              onClick={addEmail}
              style={{
                padding: '0.6rem 0.875rem', borderRadius: '8px',
                background: 'var(--accent)', border: 'none', cursor: 'pointer',
                color: 'white', display: 'flex', alignItems: 'center', gap: '0.35rem',
                fontSize: '0.8rem', fontWeight: 600, flexShrink: 0,
              }}
            >
              <Plus size={14} /> Add
            </button>
          </div>

          {/* SMTP hint */}
          <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.75rem' }}>
            Configure <code style={{ background: 'var(--bg-3)', padding: '1px 5px', borderRadius: '4px' }}>SMTP_HOST</code>,{' '}
            <code style={{ background: 'var(--bg-3)', padding: '1px 5px', borderRadius: '4px' }}>SMTP_USER</code>, and{' '}
            <code style={{ background: 'var(--bg-3)', padding: '1px 5px', borderRadius: '4px' }}>SMTP_PASS</code> in your server environment variables.
          </p>

          {settings?.emailEnabled && settings.emailRecipients.length > 0 && (
            <button
              onClick={() => sendTest('email')}
              disabled={testingEmail}
              style={{
                marginTop: '0.75rem', padding: '0.5rem 0.875rem', borderRadius: '8px',
                background: 'var(--bg-3)', border: '1px solid var(--border)',
                cursor: testingEmail ? 'not-allowed' : 'pointer',
                color: 'var(--text-2)', fontSize: '0.8rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                opacity: testingEmail ? 0.6 : 1,
              }}
            >
              {testingEmail ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={13} />}
              {testingEmail ? 'Sending…' : 'Send Test Email'}
            </button>
          )}
        </div>

        {/* ── WHATSAPP ── */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Phone size={16} style={{ color: '#25d366' }} />
              <div>
                <p style={sectionTitle}>WhatsApp Notifications</p>
                <p style={{ ...sectionDesc, margin: 0 }}>
                  Send a WhatsApp message via Twilio when a contact form message is received.
                </p>
              </div>
            </div>
            <Toggle
              on={settings?.whatsappEnabled ?? false}
              onChange={(v) => save({ whatsappEnabled: v })}
            />
          </div>

          {/* number tags */}
          {(settings?.whatsappNumbers ?? []).length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.875rem' }}>
              {settings!.whatsappNumbers.map((num) => (
                <span key={num} style={tagStyle}>
                  {num}
                  <button
                    onClick={() => removePhone(num)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 0, display: 'flex' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* add phone */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="tel"
              placeholder="Add phone with country code (e.g. +919876543210)…"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPhone()}
              style={{ ...inputCss, flex: 1 }}
            />
            <button
              onClick={addPhone}
              style={{
                padding: '0.6rem 0.875rem', borderRadius: '8px',
                background: '#25d366', border: 'none', cursor: 'pointer',
                color: 'white', display: 'flex', alignItems: 'center', gap: '0.35rem',
                fontSize: '0.8rem', fontWeight: 600, flexShrink: 0,
              }}
            >
              <Plus size={14} /> Add
            </button>
          </div>

          {/* Twilio hint */}
          <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.75rem' }}>
            Requires{' '}
            <code style={{ background: 'var(--bg-3)', padding: '1px 5px', borderRadius: '4px' }}>TWILIO_ACCOUNT_SID</code>,{' '}
            <code style={{ background: 'var(--bg-3)', padding: '1px 5px', borderRadius: '4px' }}>TWILIO_AUTH_TOKEN</code>, and{' '}
            <code style={{ background: 'var(--bg-3)', padding: '1px 5px', borderRadius: '4px' }}>TWILIO_WHATSAPP_FROM</code> in your server environment variables.
          </p>

          {settings?.whatsappEnabled && settings.whatsappNumbers.length > 0 && (
            <button
              onClick={() => sendTest('whatsapp')}
              disabled={testingWA}
              style={{
                marginTop: '0.75rem', padding: '0.5rem 0.875rem', borderRadius: '8px',
                background: 'var(--bg-3)', border: '1px solid var(--border)',
                cursor: testingWA ? 'not-allowed' : 'pointer',
                color: 'var(--text-2)', fontSize: '0.8rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                opacity: testingWA ? 0.6 : 1,
              }}
            >
              {testingWA ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={13} />}
              {testingWA ? 'Sending…' : 'Send Test WhatsApp'}
            </button>
          )}
        </div>

        {/* ── ENV VAR GUIDE ── */}
        <div style={{
          ...card,
          background: 'var(--bg)',
          border: '1px dashed var(--border)',
        }}>
          <p style={{ ...sectionTitle, marginBottom: '0.75rem' }}>Environment Variables Required</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { key: 'SMTP_HOST', example: 'smtp.gmail.com', group: 'Email' },
              { key: 'SMTP_PORT', example: '587', group: 'Email' },
              { key: 'SMTP_USER', example: 'you@gmail.com', group: 'Email' },
              { key: 'SMTP_PASS', example: 'your-app-password', group: 'Email' },
              { key: 'SMTP_FROM', example: 'you@gmail.com (optional)', group: 'Email' },
              { key: 'TWILIO_ACCOUNT_SID', example: 'ACxxxxxxxx', group: 'WhatsApp' },
              { key: 'TWILIO_AUTH_TOKEN', example: 'your-auth-token', group: 'WhatsApp' },
              { key: 'TWILIO_WHATSAPP_FROM', example: '+14155238886', group: 'WhatsApp' },
            ].map(({ key, example, group }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 600, padding: '1px 6px', borderRadius: '4px',
                  background: group === 'Email' ? '#6366f115' : '#25d36615',
                  color: group === 'Email' ? 'var(--accent)' : '#25d366',
                  flexShrink: 0,
                }}>{group}</span>
                <code style={{ fontSize: '0.8rem', color: 'var(--text)', background: 'var(--bg-3)', padding: '1px 6px', borderRadius: '4px' }}>{key}</code>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{example}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Toast toast={toast} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AdminShell>
  );
}
