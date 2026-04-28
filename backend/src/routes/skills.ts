import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', async (_, res) => {
  const skills = await prisma.skill.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] });
  res.json(skills);
});

router.post('/', authenticate, async (req, res) => {
  const skill = await prisma.skill.create({ data: req.body });
  res.status(201).json(skill);
});

router.put('/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  const skill = await prisma.skill.update({ where: { id }, data: req.body });
  res.json(skill);
});

router.delete('/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  await prisma.skill.delete({ where: { id } });
  res.json({ message: 'Deleted' });
});

export default router;
