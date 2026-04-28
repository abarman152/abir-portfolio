import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public: only visible certs, featured first
router.get('/', async (req, res) => {
  const { category } = req.query;
  const where: Record<string, unknown> = { visible: true };
  if (category) where.category = category as string;
  const certs = await prisma.certification.findMany({
    where,
    orderBy: [{ featured: 'desc' }, { issueDate: 'desc' }],
  });
  res.json(certs);
});

// Admin: get single (includes hidden)
router.get('/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  const cert = await prisma.certification.findUnique({ where: { id } });
  if (!cert) return res.status(404).json({ error: 'Not found' });
  res.json(cert);
});

router.post('/', authenticate, async (req, res) => {
  const { tags, ...rest } = req.body;
  const cert = await prisma.certification.create({
    data: { ...rest, tags: Array.isArray(tags) ? tags : [] },
  });
  res.status(201).json(cert);
});

router.put('/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  const { tags, ...rest } = req.body;
  const cert = await prisma.certification.update({
    where: { id },
    data: { ...rest, tags: Array.isArray(tags) ? tags : [] },
  });
  res.json(cert);
});

// Toggle visibility
router.patch('/:id/visibility', authenticate, async (req, res) => {
  const id = req.params.id as string;
  const { visible } = req.body;
  const cert = await prisma.certification.update({
    where: { id },
    data: { visible: Boolean(visible) },
  });
  res.json(cert);
});

router.delete('/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  await prisma.certification.delete({ where: { id } });
  res.json({ message: 'Deleted' });
});

export default router;
