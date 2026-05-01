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

/* ── Home-page About Section (singleton) ───────────────────── */
router.get('/section', async (_, res) => {
  try {
    let section = await prisma.aboutSection.findFirst();
    if (!section) section = await prisma.aboutSection.create({ data: {} });
    res.json(section);
  } catch (err) {
    console.error('GET /about/section error:', err);
    res.status(500).json({ error: 'Failed to fetch about section' });
  }
});

router.put('/section', authenticate, async (req, res) => {
  try {
    const { headline, highlight, paragraphs, skills, categories } = req.body;

    // Validation
    if (!headline || typeof headline !== 'string' || !headline.trim()) {
      return res.status(400).json({ error: 'Headline is required' });
    }
    if (!Array.isArray(paragraphs) || paragraphs.length === 0) {
      return res.status(400).json({ error: 'At least one paragraph is required' });
    }
    if (categories && Array.isArray(categories)) {
      for (const cat of categories) {
        if (!cat.title || !cat.description) {
          return res.status(400).json({ error: 'Each category must have a title and description' });
        }
      }
    }

    const existing = await prisma.aboutSection.findFirst();
    const data = {
      headline: headline.trim(),
      highlight: (highlight || '').trim(),
      paragraphs: paragraphs,
      skills: Array.isArray(skills) ? skills : [],
      categories: Array.isArray(categories) ? categories : [],
    };

    if (existing) {
      const updated = await prisma.aboutSection.update({ where: { id: existing.id }, data });
      return res.json(updated);
    }
    const created = await prisma.aboutSection.create({ data });
    res.json(created);
  } catch (err) {
    console.error('PUT /about/section error:', err);
    res.status(500).json({ error: 'Failed to update about section' });
  }
});

export default router;
