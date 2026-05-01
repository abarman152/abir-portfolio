import { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';
import { sendContactNotifications } from '../lib/notifications';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many messages sent. Please try again in an hour.' },
  handler: (_req: Request, res: Response, _next: NextFunction, options: { message: unknown; statusCode: number }) => {
    res.status(options.statusCode).json(options.message);
  },
});

router.post('/', contactLimiter, async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body as {
      name?: string; email?: string; subject?: string; message?: string;
    };

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    if (name.trim().length > 100) return res.status(400).json({ error: 'Name too long (max 100 chars)' });
    if (subject.trim().length > 200) return res.status(400).json({ error: 'Subject too long (max 200 chars)' });
    if (message.trim().length > 5000) return res.status(400).json({ error: 'Message too long (max 5000 chars)' });

    const msg = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
      },
    });

    // Fire notifications async — never blocks or fails the response
    setImmediate(() => {
      sendContactNotifications({
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
        timestamp: msg.createdAt,
      }).catch((err) => console.error('[contact] notification dispatch error:', err));
    });

    res.status(201).json({ message: 'Message sent successfully', id: msg.id });
  } catch (err) {
    console.error('[contact] POST error:', err);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

router.get('/', authenticate, async (_: Request, res: Response) => {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(messages);
  } catch (err) {
    console.error('[contact] GET error:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.patch('/:id/read', authenticate, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const msg = await prisma.contactMessage.update({ where: { id }, data: { read: true } });
    res.json(msg);
  } catch (err) {
    console.error('[contact] PATCH error:', err);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.contactMessage.delete({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('[contact] DELETE error:', err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
