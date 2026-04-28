import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', async (_, res) => {
  const papers = await prisma.researchPaper.findMany({ orderBy: [{ year: 'desc' }, { createdAt: 'desc' }] });
  res.json(papers);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id as string;
  const paper = await prisma.researchPaper.findUnique({ where: { id } });
  if (!paper) return res.status(404).json({ error: 'Not found' });
  res.json(paper);
});

router.post('/', authenticate, async (req, res) => {
  const paper = await prisma.researchPaper.create({ data: req.body });
  res.status(201).json(paper);
});

router.put('/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  const paper = await prisma.researchPaper.update({ where: { id }, data: req.body });
  res.json(paper);
});

router.delete('/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  await prisma.researchPaper.delete({ where: { id } });
  res.json({ message: 'Deleted' });
});

export default router;
