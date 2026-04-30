import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

/* ── Public: active badges sorted by order ── */
router.get('/', async (_req, res) => {
  const badges = await prisma.heroBadge.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });
  res.json(badges);
});

/* ── Admin: all badges (including inactive) ── */
router.get('/all', authenticate, async (_req, res) => {
  const badges = await prisma.heroBadge.findMany({
    orderBy: { order: 'asc' },
  });
  res.json(badges);
});

/* ── Create ── */
router.post('/', authenticate, async (req, res) => {
  const { label, position, icon, isActive, order } = req.body;
  const badge = await prisma.heroBadge.create({
    data: {
      label: label || '',
      position: position || 'top-right',
      icon: icon || '',
      isActive: isActive !== false,
      order: Number(order) || 0,
    },
  });
  res.json(badge);
});

/* ── Update ── */
router.put('/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  const { label, position, icon, isActive, order } = req.body;
  const badge = await prisma.heroBadge.update({
    where: { id },
    data: {
      ...(label !== undefined && { label }),
      ...(position !== undefined && { position }),
      ...(icon !== undefined && { icon }),
      ...(isActive !== undefined && { isActive }),
      ...(order !== undefined && { order: Number(order) }),
    },
  });
  res.json(badge);
});

/* ── Toggle active ── */
router.patch('/:id/toggle', authenticate, async (req, res) => {
  const id = req.params.id as string;
  const existing = await prisma.heroBadge.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const badge = await prisma.heroBadge.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });
  res.json(badge);
});

/* ── Delete ── */
router.delete('/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  await prisma.heroBadge.delete({ where: { id } });
  res.json({ success: true });
});

export default router;
