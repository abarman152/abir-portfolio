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
  try {
    const { id: _id, updatedAt: _ts, ...data } = req.body;
    const existing = await prisma.heroContent.findFirst();
    if (existing) {
      const updated = await prisma.heroContent.update({ where: { id: existing.id }, data });
      return res.json(updated);
    }
    const created = await prisma.heroContent.create({ data });
    res.json(created);
  } catch (error) {
    console.error('Hero PUT error:', error);
    res.status(500).json({ error: 'Failed to save hero content' });
  }
});

export default router;
