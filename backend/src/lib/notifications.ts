import { Resend } from 'resend';
import prisma from './prisma';

export interface ContactPayload {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: Date;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[notifications] RESEND_API_KEY not configured — skipping email');
    return null;
  }
  return new Resend(apiKey);
}

function getFromEmail(settings: { resendFromEmail?: string | null }): string {
  return settings.resendFromEmail || process.env.RESEND_FROM_EMAIL || 'Abir Barman Portfolio <onboarding@resend.dev>';
}

function buildAdminEmailHtml(p: ContactPayload): string {
  const ts = p.timestamp.toUTCString();
  const name = escapeHtml(p.name);
  const email = escapeHtml(p.email);
  const subject = escapeHtml(p.subject);
  const message = escapeHtml(p.message);

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:580px;margin:40px auto;background:#1a1a1a;border-radius:12px;overflow:hidden;border:1px solid #2a2a2a">
  <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:28px 32px">
    <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700">New Contact Message</h1>
    <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:13px">From your portfolio &mdash; ${ts}</p>
  </div>
  <div style="padding:28px 32px">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:10px 0;color:#888;font-size:13px;width:80px;vertical-align:top">Name</td>
          <td style="padding:10px 0;color:#fff;font-size:14px;font-weight:600">${name}</td></tr>
      <tr><td style="padding:10px 0;color:#888;font-size:13px;border-top:1px solid #2a2a2a;vertical-align:top">Email</td>
          <td style="padding:10px 0;border-top:1px solid #2a2a2a"><a href="mailto:${email}" style="color:#6366f1;font-size:14px;font-weight:600;text-decoration:none">${email}</a></td></tr>
      <tr><td style="padding:10px 0;color:#888;font-size:13px;border-top:1px solid #2a2a2a;vertical-align:top">Subject</td>
          <td style="padding:10px 0;color:#fff;font-size:14px;font-weight:600;border-top:1px solid #2a2a2a">${subject}</td></tr>
    </table>
    <div style="margin-top:20px;padding:18px;background:#111;border-radius:8px;border-left:3px solid #6366f1">
      <p style="margin:0 0 6px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.06em">Message</p>
      <p style="margin:0;color:#e5e5e5;font-size:14px;line-height:1.7;white-space:pre-wrap">${message}</p>
    </div>
    <a href="mailto:${email}?subject=Re: ${encodeURIComponent(p.subject)}"
       style="display:inline-block;margin-top:20px;padding:10px 20px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600">
      Reply to ${name}
    </a>
  </div>
  <div style="padding:16px 32px;border-top:1px solid #2a2a2a;text-align:center">
    <p style="margin:0;color:#555;font-size:11px">Sent via Resend &bull; Portfolio Notification System</p>
  </div>
</div>
</body>
</html>`;
}

function buildAutoReplyHtml(name: string): string {
  const safeName = escapeHtml(name);
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:580px;margin:40px auto;background:#1a1a1a;border-radius:12px;overflow:hidden;border:1px solid #2a2a2a">
  <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:28px 32px">
    <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700">Thank You for Reaching Out!</h1>
  </div>
  <div style="padding:28px 32px">
    <p style="margin:0 0 16px;color:#e5e5e5;font-size:14px;line-height:1.7">Hi ${safeName},</p>
    <p style="margin:0 0 16px;color:#e5e5e5;font-size:14px;line-height:1.7">
      Thank you for getting in touch. I&rsquo;ve received your message and will get back to you
      within <strong style="color:#fff">24&ndash;48 hours</strong>.
    </p>
    <p style="margin:0 0 16px;color:#e5e5e5;font-size:14px;line-height:1.7">
      In the meantime, feel free to explore my portfolio or connect with me on LinkedIn.
    </p>
    <p style="margin:0;color:#888;font-size:13px;line-height:1.6">
      Best regards,<br/>
      <strong style="color:#fff">Abir Barman</strong><br/>
      <span style="color:#6366f1">Data Scientist &amp; Full Stack Developer</span>
    </p>
  </div>
  <div style="padding:16px 32px;border-top:1px solid #2a2a2a;text-align:center">
    <a href="https://abirbarman.com" style="color:#6366f1;font-size:12px;text-decoration:none;font-weight:500">abirbarman.com</a>
  </div>
</div>
</body>
</html>`;
}

function buildPlainText(p: ContactPayload): string {
  return (
    `New Contact Message\n` +
    `--------------------\n` +
    `Name: ${p.name}\n` +
    `Email: ${p.email}\n` +
    `Subject: ${p.subject}\n` +
    `Time: ${p.timestamp.toUTCString()}\n` +
    `--------------------\n` +
    `Message:\n${p.message}`
  );
}

export interface SendResult {
  emailSent: boolean;
  emailSentAt: Date | null;
  resendMessageId: string | null;
  notificationStatus: string;
  adminNotified: boolean;
}

export async function sendContactNotifications(payload: ContactPayload): Promise<SendResult> {
  const result: SendResult = {
    emailSent: false,
    emailSentAt: null,
    resendMessageId: null,
    notificationStatus: 'pending',
    adminNotified: false,
  };

  try {
    const settings = await prisma.notificationSettings.findFirst();
    if (!settings) {
      result.notificationStatus = 'no_settings';
      return result;
    }

    if (!settings.emailEnabled && !settings.resendEnabled) {
      result.notificationStatus = 'disabled';
      return result;
    }

    const resend = getResendClient();
    if (!resend) {
      result.notificationStatus = 'no_api_key';
      return result;
    }

    const from = getFromEmail(settings);
    const replyTo = settings.resendReplyTo || undefined;
    const recipients = [...settings.emailRecipients];
    if (settings.notificationEmail && !recipients.includes(settings.notificationEmail)) {
      recipients.unshift(settings.notificationEmail);
    }
    if (settings.backupNotificationEmail && !recipients.includes(settings.backupNotificationEmail)) {
      recipients.push(settings.backupNotificationEmail);
    }

    if (recipients.length === 0) {
      result.notificationStatus = 'no_recipients';
      return result;
    }

    // Send admin notification
    const { data, error } = await resend.emails.send({
      from,
      to: recipients,
      replyTo: replyTo || payload.email,
      subject: `[Contact] ${payload.subject} — from ${payload.name}`,
      html: buildAdminEmailHtml(payload),
      text: buildPlainText(payload),
    });

    if (error) {
      console.error('[notifications] Resend admin email error:', error);
      result.notificationStatus = `error: ${error.message}`;
    } else {
      result.emailSent = true;
      result.emailSentAt = new Date();
      result.resendMessageId = data?.id || null;
      result.notificationStatus = 'sent';
      result.adminNotified = true;
      console.log('[notifications] Admin email sent, id:', data?.id);
    }

    // Send auto-reply if enabled
    if (settings.autoReplyEnabled && payload.email) {
      try {
        await resend.emails.send({
          from,
          to: [payload.email],
          subject: `Thank you for reaching out, ${payload.name}!`,
          html: buildAutoReplyHtml(payload.name),
        });
        console.log('[notifications] Auto-reply sent to:', payload.email);
      } catch (autoReplyErr) {
        console.error('[notifications] Auto-reply failed:', autoReplyErr);
      }
    }

    // Update DB record
    await prisma.contactMessage.update({
      where: { id: payload.id },
      data: {
        emailSent: result.emailSent,
        emailSentAt: result.emailSentAt,
        resendMessageId: result.resendMessageId,
        notificationStatus: result.notificationStatus,
        adminNotified: result.adminNotified,
      },
    });
  } catch (err) {
    console.error('[notifications] sendContactNotifications error:', err);
    result.notificationStatus = 'error';

    try {
      await prisma.contactMessage.update({
        where: { id: payload.id },
        data: { notificationStatus: 'error' },
      });
    } catch (dbErr) {
      console.error('[notifications] failed to update status in DB:', dbErr);
    }
  }

  return result;
}

export async function sendTestEmail(): Promise<{ success: boolean; message: string }> {
  try {
    const settings = await prisma.notificationSettings.findFirst();
    if (!settings) return { success: false, message: 'No notification settings found' };

    const resend = getResendClient();
    if (!resend) return { success: false, message: 'RESEND_API_KEY not configured' };

    const from = getFromEmail(settings);
    const recipients = [...settings.emailRecipients];
    if (settings.notificationEmail && !recipients.includes(settings.notificationEmail)) {
      recipients.unshift(settings.notificationEmail);
    }

    if (recipients.length === 0) {
      return { success: false, message: 'No email recipients configured' };
    }

    const { error } = await resend.emails.send({
      from,
      to: recipients,
      subject: '[Test] Portfolio Notification System',
      html: buildAdminEmailHtml({
        id: 'test',
        name: 'Admin Test',
        email: 'test@abirbarman.dev',
        subject: 'Test Notification',
        message: 'This is a test notification sent from your portfolio admin panel. If you received this, email notifications are working correctly.',
        timestamp: new Date(),
      }),
      text: 'This is a test notification from your portfolio admin panel.',
    });

    if (error) {
      console.error('[notifications] test email error:', error);
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Test email sent successfully' };
  } catch (err) {
    console.error('[notifications] sendTestEmail error:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, message: msg };
  }
}
