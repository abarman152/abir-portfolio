import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

/* ── Profile ───────────────────────────────────────────────── */
router.get('/profile', async (_, res) => {
  let profile = await prisma.aboutProfile.findFirst();
  if (!profile) profile = await prisma.aboutProfile.create({ data: {} });
  res.json(profile);
});

router.put('/profile', authenticate, async (req, res) => {
  const existing = await prisma.aboutProfile.findFirst();
  if (existing) {
    const updated = await prisma.aboutProfile.update({ where: { id: existing.id }, data: req.body });
    return res.json(updated);
  }
  const created = await prisma.aboutProfile.create({ data: req.body });
  res.json(created);
});

/* ── Education ─────────────────────────────────────────────── */
router.get('/education', async (_, res) => {
  const items = await prisma.education.findMany({
    where: { visible: true },
    orderBy: { order: 'asc' },
  });
  res.json(items);
});

// Must be registered BEFORE /:id to avoid "all" being treated as an id
router.get('/education/all', authenticate, async (_, res) => {
  const items = await prisma.education.findMany({ orderBy: { order: 'asc' } });
  res.json(items);
});

router.post('/education', authenticate, async (req, res) => {
  const item = await prisma.education.create({ data: req.body });
  res.json(item);
});

router.patch('/education/:id/visibility', authenticate, async (req, res) => {
  const id = req.params.id as string;
  const item = await prisma.education.update({ where: { id }, data: { visible: req.body.visible } });
  res.json(item);
});

router.put('/education/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  const item = await prisma.education.update({ where: { id }, data: req.body });
  res.json(item);
});

router.delete('/education/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  await prisma.education.delete({ where: { id } });
  res.json({ success: true });
});

/* ── Skill Groups ──────────────────────────────────────────── */
router.get('/skills', async (_, res) => {
  const groups = await prisma.aboutSkillGroup.findMany({
    where: { visible: true },
    orderBy: { order: 'asc' },
  });
  res.json(groups);
});

router.get('/skills/all', authenticate, async (_, res) => {
  const groups = await prisma.aboutSkillGroup.findMany({ orderBy: { order: 'asc' } });
  res.json(groups);
});

router.post('/skills', authenticate, async (req, res) => {
  const { category, skills, highlightedSkills, order, visible } = req.body;
  const skillsArr = Array.isArray(skills)
    ? skills
    : typeof skills === 'string'
      ? skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];
  const highlightedArr = Array.isArray(highlightedSkills)
    ? highlightedSkills
    : typeof highlightedSkills === 'string'
      ? highlightedSkills.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];
  const group = await prisma.aboutSkillGroup.create({
    data: { category, skills: skillsArr, highlightedSkills: highlightedArr, order: order ?? 0, visible: visible !== false },
  });
  res.json(group);
});

router.patch('/skills/:id/visibility', authenticate, async (req, res) => {
  const id = req.params.id as string;
  const group = await prisma.aboutSkillGroup.update({ where: { id }, data: { visible: req.body.visible } });
  res.json(group);
});

router.put('/skills/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  const { category, skills, highlightedSkills, order, visible } = req.body;
  const skillsArr = Array.isArray(skills)
    ? skills
    : typeof skills === 'string'
      ? skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];
  const highlightedArr = Array.isArray(highlightedSkills)
    ? highlightedSkills
    : typeof highlightedSkills === 'string'
      ? highlightedSkills.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];
  const group = await prisma.aboutSkillGroup.update({
    where: { id },
    data: { category, skills: skillsArr, highlightedSkills: highlightedArr, order, visible },
  });
  res.json(group);
});

router.delete('/skills/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  await prisma.aboutSkillGroup.delete({ where: { id } });
  res.json({ success: true });
});

export default router;
