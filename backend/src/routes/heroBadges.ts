import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

/* ── Public: active badges sorted by order ── */
router.get('/', async (_req, res) => {
  try {
    const badges = await prisma.heroBadge.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    res.json(badges);
  } catch (err) {
    console.error('GET /hero-badges error:', err);
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
});

/* ── Admin: all badges (including inactive) ── */
router.get('/all', authenticate, async (_req, res) => {
  try {
    const badges = await prisma.heroBadge.findMany({
      orderBy: { order: 'asc' },
    });
    res.json(badges);
  } catch (err) {
    console.error('GET /hero-badges/all error:', err);
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
});

/* ── Create ── */
router.post('/', authenticate, async (req, res) => {
  try {
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
  } catch (err) {
    console.error('POST /hero-badges error:', err);
    res.status(500).json({ error: 'Failed to create badge' });
  }
});

/* ── Update ── */
router.put('/:id', authenticate, async (req, res) => {
  try {
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
  } catch (err) {
    console.error('PUT /hero-badges/:id error:', err);
    res.status(500).json({ error: 'Failed to update badge' });
  }
});

/* ── Toggle active ── */
router.patch('/:id/toggle', authenticate, async (req, res) => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.heroBadge.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Badge not found' });
    const badge = await prisma.heroBadge.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });
    res.json(badge);
  } catch (err) {
    console.error('PATCH /hero-badges/:id/toggle error:', err);
    res.status(500).json({ error: 'Failed to toggle badge' });
  }
});

/* ── Delete ── */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const id = req.params.id as string;
    await prisma.heroBadge.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /hero-badges/:id error:', err);
    res.status(500).json({ error: 'Failed to delete badge' });
  }
});

export default router;
