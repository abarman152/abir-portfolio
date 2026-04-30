import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

/* ── Helpers ──────────────────────────────────────────────── */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let candidate = base;
  let suffix = 1;
  while (true) {
    const existing = await prisma.achievement.findUnique({ where: { slug: candidate } });
    if (!existing || (excludeId && existing.id === excludeId)) return candidate;
    suffix++;
    candidate = `${base}-${suffix}`;
  }
}

function toDatetime(val: unknown): Date | undefined {
  if (!val) return undefined;
  const str = String(val);
  const d = new Date(str.length === 10 ? `${str}T00:00:00Z` : str);
  return isNaN(d.getTime()) ? undefined : d;
}

/* ── Public routes ────────────────────────────────────────── */

// GET /achievements/featured — home page (featured + visible only)
router.get('/featured', async (_req, res) => {
  const items = await prisma.achievement.findMany({
    where: { featured: true, visible: true },
    orderBy: [{ order: 'asc' }, { date: 'desc' }],
  });
  res.json(items);
});

// GET /achievements/all — admin: all including hidden
router.get('/all', authenticate, async (_req, res) => {
  const items = await prisma.achievement.findMany({
    orderBy: [{ order: 'asc' }, { date: 'desc' }],
  });
  res.json(items);
});

// GET /achievements — paginated public list with search/filter/sort
router.get('/', async (req, res) => {
  const {
    search   = '',
    category = '',
    tags     = '',
    issuer   = '',
    featured = '',
    sort     = 'latest',
    page     = '1',
    limit    = '200',
  } = req.query as Record<string, string>;

  const where: Record<string, unknown> = { visible: true };

  if (category.trim()) where.category = category;
  if (featured === 'true') where.featured = true;

  if (issuer.trim()) {
    where.issuer = { contains: issuer, mode: 'insensitive' };
  }

  if (tags.trim()) {
    where.tags = { hasSome: tags.split(',').map((t) => t.trim()).filter(Boolean) };
  }

  if (search.trim()) {
    where.OR = [
      { title:       { contains: search, mode: 'insensitive' } },
      { issuer:      { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category:    { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderBy =
    sort === 'featured'
      ? [{ featured: 'desc' as const }, { order: 'asc' as const }, { date: 'desc' as const }]
      : sort === 'oldest'
        ? [{ date: 'asc' as const }]
        : [{ featured: 'desc' as const }, { date: 'desc' as const }];

  const pageNum  = Math.max(1, parseInt(page));
  const pageSize = Math.min(200, Math.max(1, parseInt(limit)));
  const skip     = (pageNum - 1) * pageSize;

  const [items, total] = await prisma.$transaction([
    prisma.achievement.findMany({ where, orderBy, skip, take: pageSize }),
    prisma.achievement.count({ where }),
  ]);

  res.json({
    items,
    total,
    page:       pageNum,
    totalPages: Math.ceil(total / pageSize),
  });
});

// GET /achievements/:slug — public detail by slug
router.get('/:slug', async (req, res) => {
  const slug = req.params.slug as string;
  const item = await prisma.achievement.findUnique({ where: { slug } });
  if (!item || !item.visible) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

/* ── Admin routes ─────────────────────────────────────────── */

// POST /achievements — create
router.post('/', authenticate, async (req, res) => {
  try {
    const { id: _id, createdAt, updatedAt, tags, images, date, slug, ...rest } = req.body;

    const parsedDate = toDatetime(date);
    if (!parsedDate) {
      return res.status(400).json({ error: 'Invalid or missing date' });
    }

    const baseSlug = slug?.trim() ? slugify(slug) : slugify(rest.title || '');
    if (!baseSlug) {
      return res.status(400).json({ error: 'Title is required to generate a slug' });
    }
    const finalSlug = await uniqueSlug(baseSlug);

    const item = await prisma.achievement.create({
      data: {
        ...rest,
        slug:   finalSlug,
        date:   parsedDate,
        tags:   Array.isArray(tags)   ? tags   : [],
        images: Array.isArray(images) ? images : [],
      },
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('POST /achievements error:', err);
    res.status(500).json({ error: 'Failed to create achievement' });
  }
});

// PUT /achievements/:id — update
router.put('/:id', authenticate, async (req, res) => {
  try {
    const id = req.params.id as string;
    const { id: _id, createdAt, updatedAt, tags, images, date, slug, ...rest } = req.body;

    const data: Record<string, unknown> = {
      ...rest,
      tags:   Array.isArray(tags)   ? tags   : [],
      images: Array.isArray(images) ? images : [],
    };

    if (date) {
      const parsed = toDatetime(date);
      if (!parsed) return res.status(400).json({ error: 'Invalid date' });
      data.date = parsed;
    }

    if (slug !== undefined) {
      const baseSlug = slug?.trim() ? slugify(slug) : slugify(rest.title || '');
      if (baseSlug) {
        data.slug = await uniqueSlug(baseSlug, id);
      }
    }

    const item = await prisma.achievement.update({
      where: { id },
      data,
    });
    res.json(item);
  } catch (err) {
    console.error('PUT /achievements/:id error:', err);
    res.status(500).json({ error: 'Failed to update achievement' });
  }
});

// PATCH /achievements/:id/visibility — toggle visibility
router.patch('/:id/visibility', authenticate, async (req, res) => {
  const id = req.params.id as string;
  const item = await prisma.achievement.update({
    where: { id },
    data: { visible: Boolean(req.body.visible) },
  });
  res.json(item);
});

// DELETE /achievements/:id
router.delete('/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  await prisma.achievement.delete({ where: { id } });
  res.json({ message: 'Deleted' });
});

export default router;
