import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /projects/featured  — homepage strip (published + featured only)
router.get('/featured', async (_req, res) => {
  const projects = await prisma.project.findMany({
    where: { isPublished: true, featured: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
  res.json(projects);
});

// GET /projects  — paginated list with search/filter for the /projects page
router.get('/', async (req, res) => {
  const {
    search   = '',
    tech     = '',
    featured = '',
    sort     = 'newest',
    page     = '1',
    limit    = '9',
    admin    = '',
  } = req.query as Record<string, string>;

  const where: Record<string, unknown> = {};

  // Admin bypass — return all (published + unpublished)
  if (admin !== 'true') where.isPublished = true;
  if (featured === 'true') where.featured = true;

  // Full-text search across title, description, problem, result, techStack
  if (search.trim()) {
    where.OR = [
      { title:       { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { problem:     { contains: search, mode: 'insensitive' } },
      { result:      { contains: search, mode: 'insensitive' } },
      { techStack:   { hasSome: search.split(' ').filter(Boolean) } },
    ];
  }

  // Tech stack filter (comma-separated)
  if (tech.trim()) {
    where.techStack = { hasSome: tech.split(',').map((t) => t.trim()).filter(Boolean) };
  }

  const orderBy =
    sort === 'oldest'
      ? [{ createdAt: 'asc'  as const }]
      : [{ featured: 'desc' as const }, { order: 'asc' as const }, { createdAt: 'desc' as const }];

  const pageNum  = Math.max(1, parseInt(page));
  const pageSize = Math.min(50, Math.max(1, parseInt(limit)));
  const skip     = (pageNum - 1) * pageSize;

  const [projects, total] = await prisma.$transaction([
    prisma.project.findMany({ where, orderBy, skip, take: pageSize }),
    prisma.project.count({ where }),
  ]);

  res.json({
    projects,
    total,
    page:       pageNum,
    totalPages: Math.ceil(total / pageSize),
  });
});

// GET /projects/:slug  — single project detail
router.get('/:slug', async (req, res) => {
  const slug = req.params.slug as string;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

// POST /projects
router.post('/', authenticate, async (req, res) => {
  const project = await prisma.project.create({ data: req.body });
  res.status(201).json(project);
});

// PUT /projects/:id
router.put('/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  const { id: _id, createdAt, updatedAt, ...data } = req.body;
  const project = await prisma.project.update({ where: { id }, data });
  res.json(project);
});

// DELETE /projects/:id
router.delete('/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  await prisma.project.delete({ where: { id } });
  res.json({ message: 'Deleted' });
});

export default router;
