import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields required' });
  }
  const msg = await prisma.contactMessage.create({ data: { name, email, subject, message } });
  res.status(201).json({ message: 'Message sent', id: msg.id });
});

router.get('/', authenticate, async (_, res) => {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(messages);
});

router.patch('/:id/read', authenticate, async (req, res) => {
  const id = req.params.id as string;
  const msg = await prisma.contactMessage.update({ where: { id }, data: { read: true } });
  res.json(msg);
});

router.delete('/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  await prisma.contactMessage.delete({ where: { id } });
  res.json({ message: 'Deleted' });
});

export default router;
