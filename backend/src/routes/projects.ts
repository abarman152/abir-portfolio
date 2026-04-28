import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  const featured = req.query.featured === 'true';
  const projects = await prisma.project.findMany({
    where: featured ? { featured: true } : {},
    orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
  });
  res.json(projects);
});

router.get('/:slug', async (req, res) => {
  const slug = req.params.slug as string;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

router.post('/', authenticate, async (req, res) => {
  const project = await prisma.project.create({ data: req.body });
  res.status(201).json(project);
});

router.put('/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  const project = await prisma.project.update({ where: { id }, data: req.body });
  res.json(project);
});

router.delete('/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  await prisma.project.delete({ where: { id } });
  res.json({ message: 'Deleted' });
});

export default router;
