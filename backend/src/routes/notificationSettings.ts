import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';
import { sendContactNotifications } from '../lib/notifications';

const router = Router();

async function getOrCreate() {
  const existing = await prisma.notificationSettings.findFirst();
  if (existing) return existing;
  return prisma.notificationSettings.create({ data: {} });
}

function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function isValidPhone(v: string): boolean {
  return /^\+?[1-9]\d{6,14}$/.test(v.trim().replace(/\s/g, ''));
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
    const { emailEnabled, emailRecipients, whatsappEnabled, whatsappNumbers } = req.body as {
      emailEnabled?: boolean;
      emailRecipients?: string[];
      whatsappEnabled?: boolean;
      whatsappNumbers?: string[];
    };

    const data: Record<string, unknown> = {};

    if (emailEnabled !== undefined) data.emailEnabled = Boolean(emailEnabled);
    if (Array.isArray(emailRecipients)) {
      const valid = emailRecipients.map((e) => e.trim()).filter(isValidEmail);
      data.emailRecipients = valid;
    }
    if (whatsappEnabled !== undefined) data.whatsappEnabled = Boolean(whatsappEnabled);
    if (Array.isArray(whatsappNumbers)) {
      const valid = whatsappNumbers.map((n) => n.trim().replace(/\s/g, '')).filter(isValidPhone);
      data.whatsappNumbers = valid;
    }

    const existing = await getOrCreate();
    const updated = await prisma.notificationSettings.update({ where: { id: existing.id }, data });
    res.json(updated);
  } catch (err) {
    console.error('[notificationSettings] PUT error:', err);
    res.status(500).json({ error: 'Failed to save notification settings' });
  }
});

router.post('/test', authenticate, async (req, res) => {
  try {
    const { channel } = req.body as { channel?: 'email' | 'whatsapp' | 'all' };
    const settings = await getOrCreate();

    if (channel === 'email' || channel === 'all') {
      if (!settings.emailEnabled || settings.emailRecipients.length === 0) {
        return res.status(400).json({ error: 'Email not enabled or no recipients configured' });
      }
    }
    if (channel === 'whatsapp' || channel === 'all') {
      if (!settings.whatsappEnabled || settings.whatsappNumbers.length === 0) {
        return res.status(400).json({ error: 'WhatsApp not enabled or no numbers configured' });
      }
    }

    await sendContactNotifications({
      name: 'Admin Test',
      email: 'test@abirbarman.dev',
      subject: 'Test Notification',
      message: 'This is a test notification sent from your portfolio admin panel. If you received this, notifications are working correctly.',
      timestamp: new Date(),
    });

    res.json({ message: 'Test notification sent successfully' });
  } catch (err) {
    console.error('[notificationSettings] test error:', err);
    res.status(500).json({ error: 'Failed to send test notification' });
  }
});

export default router;
