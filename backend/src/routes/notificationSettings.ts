import { Router } from 'express';
import { sendTestEmail } from '../lib/notifications';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

async function getOrCreate() {
  const existing = await prisma.notificationSettings.findFirst();
  if (existing) return existing;
  return prisma.notificationSettings.create({ data: {} });
}

function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

router.get('/', authenticate, async (_, res) => {
  try {
    res.json(await getOrCreate());
  } catch (err) {
    console.error('[notificationSettings] GET error:', err);
    res.status(500).json({ error: 'Failed to fetch notification settings' });
  }
});

router.put('/', authenticate, async (req, res) => {
  try {
    const {
      emailEnabled,
      emailRecipients,
      notificationEmail,
      backupNotificationEmail,
      resendEnabled,
      resendFromEmail,
      resendReplyTo,
      autoReplyEnabled,
    } = req.body as {
      emailEnabled?: boolean;
      emailRecipients?: string[];
      notificationEmail?: string;
      backupNotificationEmail?: string;
      resendEnabled?: boolean;
      resendFromEmail?: string;
      resendReplyTo?: string;
      autoReplyEnabled?: boolean;
    };

    const data: Record<string, unknown> = {};

    if (emailEnabled !== undefined) data.emailEnabled = Boolean(emailEnabled);
    if (resendEnabled !== undefined) data.resendEnabled = Boolean(resendEnabled);
    if (autoReplyEnabled !== undefined) data.autoReplyEnabled = Boolean(autoReplyEnabled);

    if (Array.isArray(emailRecipients)) {
      data.emailRecipients = emailRecipients.map((e) => e.trim()).filter(isValidEmail);
    }
    if (notificationEmail !== undefined) {
      data.notificationEmail = notificationEmail && isValidEmail(notificationEmail) ? notificationEmail.trim() : null;
    }
    if (backupNotificationEmail !== undefined) {
      data.backupNotificationEmail = backupNotificationEmail && isValidEmail(backupNotificationEmail) ? backupNotificationEmail.trim() : null;
    }
    if (resendFromEmail !== undefined) {
      data.resendFromEmail = resendFromEmail?.trim() || null;
    }
    if (resendReplyTo !== undefined) {
      data.resendReplyTo = resendReplyTo && isValidEmail(resendReplyTo) ? resendReplyTo.trim() : null;
    }

    const existing = await getOrCreate();
    const updated = await prisma.notificationSettings.update({ where: { id: existing.id }, data });
    res.json(updated);
  } catch (err) {
    console.error('[notificationSettings] PUT error:', err);
    res.status(500).json({ error: 'Failed to save notification settings' });
  }
});

router.post('/test', authenticate, async (_req, res) => {
  try {
    const result = await sendTestEmail();
    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }
    res.json({ message: result.message });
  } catch (err) {
    console.error('[notificationSettings] test error:', err);
    res.status(500).json({ error: 'Failed to send test notification' });
  }
});

export default router;
