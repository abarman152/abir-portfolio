import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /admin/dashboard — aggregated counts for admin dashboard
router.get('/', authenticate, async (_req, res) => {
  try {
    const [projects, papers, certs, achievements, messages, unread] =
      await Promise.all([
        prisma.project.count(),
        prisma.research.count(),
        prisma.certification.count(),
        prisma.achievement.count(),
        prisma.contactMessage.count(),
        prisma.contactMessage.count({ where: { read: false } }),
      ]);

    res.json({ projects, papers, certs, achievements, messages, unread });
  } catch (err) {
    console.error('[dashboard] aggregation error:', err);
    res.json({
      projects: 0,
      papers: 0,
      certs: 0,
      achievements: 0,
      messages: 0,
      unread: 0,
    });
  }
});

export default router;
