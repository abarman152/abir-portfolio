import nodemailer from 'nodemailer';
import twilio from 'twilio';
import prisma from './prisma';

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: Date;
}

function buildEmailHtml(p: ContactPayload): string {
  const ts = p.timestamp.toUTCString();
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:system-ui,sans-serif">
<div style="max-width:580px;margin:40px auto;background:#1a1a1a;border-radius:12px;overflow:hidden;border:1px solid #2a2a2a">
  <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:28px 32px">
    <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700">New Contact Message</h1>
    <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:13px">From your portfolio — ${ts}</p>
  </div>
  <div style="padding:28px 32px">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:10px 0;color:#888;font-size:13px;width:80px;vertical-align:top">Name</td>
          <td style="padding:10px 0;color:#fff;font-size:14px;font-weight:600">${p.name}</td></tr>
      <tr><td style="padding:10px 0;color:#888;font-size:13px;border-top:1px solid #2a2a2a;vertical-align:top">Email</td>
          <td style="padding:10px 0;border-top:1px solid #2a2a2a"><a href="mailto:${p.email}" style="color:#6366f1;font-size:14px;font-weight:600;text-decoration:none">${p.email}</a></td></tr>
      <tr><td style="padding:10px 0;color:#888;font-size:13px;border-top:1px solid #2a2a2a;vertical-align:top">Subject</td>
          <td style="padding:10px 0;color:#fff;font-size:14px;font-weight:600;border-top:1px solid #2a2a2a">${p.subject}</td></tr>
    </table>
    <div style="margin-top:20px;padding:18px;background:#111;border-radius:8px;border-left:3px solid #6366f1">
      <p style="margin:0 0 6px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.06em">Message</p>
      <p style="margin:0;color:#e5e5e5;font-size:14px;line-height:1.7;white-space:pre-wrap">${p.message}</p>
    </div>
    <a href="mailto:${p.email}?subject=Re: ${encodeURIComponent(p.subject)}"
       style="display:inline-block;margin-top:20px;padding:10px 20px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600">
      Reply to ${p.name}
    </a>
  </div>
</div>
</body>
</html>`;
}

function buildWhatsAppBody(p: ContactPayload): string {
  return (
    `🔔 *New Contact Message*\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `👤 *Name:* ${p.name}\n` +
    `📧 *Email:* ${p.email}\n` +
    `📌 *Subject:* ${p.subject}\n` +
    `🕐 *Time:* ${p.timestamp.toUTCString()}\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `💬 *Message:*\n${p.message}`
  );
}

async function sendEmails(payload: ContactPayload, recipients: string[]): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn('[notifications] SMTP env vars not configured — skipping email');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await Promise.allSettled(
    recipients.map((to) =>
      transporter.sendMail({
        from: `"Abir Barman Portfolio" <${SMTP_FROM || SMTP_USER}>`,
        to,
        subject: `[Contact] ${payload.subject} — from ${payload.name}`,
        html: buildEmailHtml(payload),
        text: buildWhatsAppBody(payload),
      }).catch((err) => console.error(`[notifications] email to ${to} failed:`, err))
    )
  );
}

async function sendWhatsAppMessages(payload: ContactPayload, numbers: string[]): Promise<void> {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
    console.warn('[notifications] Twilio env vars not configured — skipping WhatsApp');
    return;
  }

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  const body = buildWhatsAppBody(payload);

  await Promise.allSettled(
    numbers.map((to) =>
      client.messages
        .create({
          from: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
          to: `whatsapp:${to}`,
          body,
        })
        .catch((err) => console.error(`[notifications] WhatsApp to ${to} failed:`, err))
    )
  );
}

export async function sendContactNotifications(payload: ContactPayload): Promise<void> {
  try {
    const settings = await prisma.notificationSettings.findFirst();
    if (!settings) return;

    const tasks: Promise<void>[] = [];

    if (settings.emailEnabled && settings.emailRecipients.length > 0) {
      tasks.push(sendEmails(payload, settings.emailRecipients));
    }
    if (settings.whatsappEnabled && settings.whatsappNumbers.length > 0) {
      tasks.push(sendWhatsAppMessages(payload, settings.whatsappNumbers));
    }

    await Promise.allSettled(tasks);
  } catch (err) {
    console.error('[notifications] sendContactNotifications error:', err);
  }
}
