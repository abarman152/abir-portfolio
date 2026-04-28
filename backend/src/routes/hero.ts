import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', async (_, res) => {
  let hero = await prisma.heroContent.findFirst();
  if (!hero) {
    hero = await prisma.heroContent.create({
      data: {
        name: 'Abir Barman',
        tagline: 'Data Scientist & Full Stack Developer',
        roles: ['Data Scientist', 'ML Engineer', 'Full Stack Developer', 'Researcher'],
        bio: 'Passionate about turning data into actionable insights and building scalable systems.',
        resumeUrl: '',
        avatarUrl: '',
      },
    });
  }
  res.json(hero);
});

router.put('/', authenticate, async (req, res) => {
  const existing = await prisma.heroContent.findFirst();
  if (existing) {
    const updated = await prisma.heroContent.update({ where: { id: existing.id }, data: req.body });
    return res.json(updated);
  }
  const created = await prisma.heroContent.create({ data: req.body });
  res.json(created);
});

export default router;
