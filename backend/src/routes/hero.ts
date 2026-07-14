import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', async (_, res) => {
  try {
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
  } catch (error) {
    // Surfaces the real cause (e.g. Prisma P2022/42703 column drift after a schema
    // change that was not followed by `prisma db push`) instead of an opaque 500.
    console.error('Hero GET error:', error);
    res.status(500).json({ error: 'Failed to load hero content' });
  }
});

const isHttpUrl = (value: unknown): boolean => {
  if (typeof value !== 'string') return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

router.put('/', authenticate, async (req, res) => {
  try {
    const { id: _id, updatedAt: _ts, ...data } = req.body;
    if (data.resumeUrl !== undefined && data.resumeUrl !== '' && !isHttpUrl(data.resumeUrl)) {
      return res.status(400).json({ error: 'resumeUrl must be a valid http(s) URL' });
    }
    if (data.resumePreviewUrl !== undefined && data.resumePreviewUrl !== '' && !isHttpUrl(data.resumePreviewUrl)) {
      return res.status(400).json({ error: 'resumePreviewUrl must be a valid http(s) URL' });
    }
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
