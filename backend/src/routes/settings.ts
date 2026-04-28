import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', async (_, res) => {
  let settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: {} });
  }
  res.json(settings);
});

router.put('/', authenticate, async (req, res) => {
  const existing = await prisma.siteSettings.findFirst();
  if (existing) {
    const updated = await prisma.siteSettings.update({ where: { id: existing.id }, data: req.body });
    return res.json(updated);
  }
  const created = await prisma.siteSettings.create({ data: req.body });
  res.json(created);
});

export default router;
