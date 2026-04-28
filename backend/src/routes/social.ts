import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', async (_, res) => {
  const links = await prisma.socialLink.findMany({ where: { visible: true }, orderBy: { order: 'asc' } });
  res.json(links);
});

router.post('/', authenticate, async (req, res) => {
  const link = await prisma.socialLink.create({ data: req.body });
  res.status(201).json(link);
});

router.put('/:id', authenticate, async (req, res) => {
  const link = await prisma.socialLink.update({ where: { id: req.params.id }, data: req.body });
  res.json(link);
});

router.delete('/:id', authenticate, async (req, res) => {
  await prisma.socialLink.delete({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
});

export default router;
