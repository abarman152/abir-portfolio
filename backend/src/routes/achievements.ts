import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public: visible only, featured first then by date
router.get('/', async (_, res) => {
  const items = await prisma.achievement.findMany({
    where: { visible: true },
    orderBy: [{ featured: 'desc' }, { date: 'desc' }, { order: 'asc' }],
  });
  res.json(items);
});

router.post('/', authenticate, async (req, res) => {
  const { tags, ...rest } = req.body;
  const item = await prisma.achievement.create({
    data: { ...rest, tags: Array.isArray(tags) ? tags : [] },
  });
  res.status(201).json(item);
});

router.put('/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  const { tags, ...rest } = req.body;
  const item = await prisma.achievement.update({
    where: { id },
    data: { ...rest, tags: Array.isArray(tags) ? tags : [] },
  });
  res.json(item);
});

router.patch('/:id/visibility', authenticate, async (req, res) => {
  const id = req.params.id as string;
  const item = await prisma.achievement.update({
    where: { id },
    data: { visible: Boolean(req.body.visible) },
  });
  res.json(item);
});

router.delete('/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  await prisma.achievement.delete({ where: { id } });
  res.json({ message: 'Deleted' });
});

export default router;
