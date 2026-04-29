import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /research/featured  — homepage strip (featured only)
router.get('/featured', async (_req, res) => {
  const items = await prisma.research.findMany({
    where: { featured: true },
    orderBy: [{ order: 'asc' }, { publishedAt: 'desc' }],
  });
  res.json(items);
});

// GET /research  — paginated list with search/filter/sort
router.get('/', async (req, res) => {
  const {
    search   = '',
    tags     = '',
    year     = '',
    featured = '',
    sort     = 'newest',
    page     = '1',
    limit    = '9',
    admin    = '',
  } = req.query as Record<string, string>;

  const where: Record<string, unknown> = {};

  if (admin !== 'true' && featured !== 'all') {
    // no published filter for research — all items are shown publicly
  }
  if (featured === 'true') where.featured = true;

  if (search.trim()) {
    where.OR = [
      { title:     { contains: search, mode: 'insensitive' } },
      { abstract:  { contains: search, mode: 'insensitive' } },
      { publisher: { contains: search, mode: 'insensitive' } },
      { tags:      { hasSome: search.split(' ').filter(Boolean) } },
    ];
  }

  if (tags.trim()) {
    where.tags = { hasSome: tags.split(',').map((t) => t.trim()).filter(Boolean) };
  }

  if (year.trim()) {
    const y = parseInt(year);
    if (!isNaN(y)) {
      where.publishedAt = {
        gte: new Date(`${y}-01-01`),
        lt:  new Date(`${y + 1}-01-01`),
      };
    }
  }

  const orderBy =
    sort === 'oldest'
      ? [{ publishedAt: 'asc' as const }]
      : sort === 'featured'
        ? [{ featured: 'desc' as const }, { order: 'asc' as const }, { publishedAt: 'desc' as const }]
        : [{ publishedAt: 'desc' as const }];

  const pageNum  = Math.max(1, parseInt(page));
  const pageSize = Math.min(50, Math.max(1, parseInt(limit)));
  const skip     = (pageNum - 1) * pageSize;

  const [items, total] = await prisma.$transaction([
    prisma.research.findMany({ where, orderBy, skip, take: pageSize }),
    prisma.research.count({ where }),
  ]);

  res.json({
    items,
    total,
    page:       pageNum,
    totalPages: Math.ceil(total / pageSize),
  });
});

// GET /research/:slug  — single item by slug
router.get('/:slug', async (req, res) => {
  const slug = req.params.slug as string;
  const item = await prisma.research.findUnique({ where: { slug } });
  if (!item) return res.status(404).json({ error: 'Research item not found' });
  res.json(item);
});

// POST /research
router.post('/', authenticate, async (req, res) => {
  const item = await prisma.research.create({ data: req.body });
  res.status(201).json(item);
});

// PUT /research/:id
router.put('/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  const { id: _id, createdAt, updatedAt, ...data } = req.body;
  const item = await prisma.research.update({ where: { id }, data });
  res.json(item);
});

// DELETE /research/:id
router.delete('/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  await prisma.research.delete({ where: { id } });
  res.json({ message: 'Deleted' });
});

export default router;
