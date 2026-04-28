import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', async (_, res) => {
  const stats = await prisma.stat.findMany({ orderBy: { order: 'asc' } });
  res.json(stats);
});

router.post('/', authenticate, async (req, res) => {
  const stat = await prisma.stat.create({ data: req.body });
  res.status(201).json(stat);
});

router.put('/:id', authenticate, async (req, res) => {
  const stat = await prisma.stat.update({ where: { id: req.params.id }, data: req.body });
  res.json(stat);
});

router.delete('/:id', authenticate, async (req, res) => {
  await prisma.stat.delete({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
});

export default router;
