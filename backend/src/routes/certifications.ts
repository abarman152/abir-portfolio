import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let candidate = base;
  let suffix = 1;
  while (true) {
    const existing = await prisma.certification.findUnique({ where: { slug: candidate } });
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

// GET /certifications/featured — home page strip (featured + visible only)
router.get('/featured', async (_req, res) => {
  const certs = await prisma.certification.findMany({
    where: { featured: true, visible: true },
    orderBy: [{ order: 'asc' }, { issueDate: 'desc' }],
  });
  res.json(certs);
});

// GET /certifications/all — admin: all certs including hidden
router.get('/all', authenticate, async (_req, res) => {
  const certs = await prisma.certification.findMany({
    orderBy: [{ order: 'asc' }, { issueDate: 'desc' }],
  });
  res.json(certs);
});

// GET /certifications — paginated public list with search/filter/sort
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
      { skills:      { hasSome: [search] } },
    ];
  }

  const orderBy =
    sort === 'featured'
      ? [{ featured: 'desc' as const }, { order: 'asc' as const }, { issueDate: 'desc' as const }]
      : sort === 'oldest'
        ? [{ issueDate: 'asc' as const }]
        : [{ featured: 'desc' as const }, { issueDate: 'desc' as const }];

  const pageNum  = Math.max(1, parseInt(page));
  const pageSize = Math.min(200, Math.max(1, parseInt(limit)));
  const skip     = (pageNum - 1) * pageSize;

  const [certs, total] = await prisma.$transaction([
    prisma.certification.findMany({ where, orderBy, skip, take: pageSize }),
    prisma.certification.count({ where }),
  ]);

  res.json({
    items: certs,
    total,
    page:       pageNum,
    totalPages: Math.ceil(total / pageSize),
  });
});

// GET /certifications/:slug — public detail by slug
router.get('/:slug', async (req, res) => {
  const slug = req.params.slug as string;
  const cert = await prisma.certification.findUnique({ where: { slug } });
  if (!cert || !cert.visible) return res.status(404).json({ error: 'Not found' });
  res.json(cert);
});

// POST /certifications — admin create
router.post('/', authenticate, async (req, res) => {
  try {
    const { id: _id, createdAt, updatedAt, tags, skills, issueDate, expiryDate, slug, ...rest } = req.body;

    const parsedIssueDate = toDatetime(issueDate);
    if (!parsedIssueDate) {
      return res.status(400).json({ error: 'Invalid or missing issueDate' });
    }

    const baseSlug = slug?.trim() ? slugify(slug) : slugify(rest.title || '');
    if (!baseSlug) {
      return res.status(400).json({ error: 'Title is required to generate a slug' });
    }
    const finalSlug = await uniqueSlug(baseSlug);

    const cert = await prisma.certification.create({
      data: {
        ...rest,
        slug:       finalSlug,
        issueDate:  parsedIssueDate,
        expiryDate: toDatetime(expiryDate) ?? null,
        tags:       Array.isArray(tags)   ? tags   : [],
        skills:     Array.isArray(skills) ? skills : [],
      },
    });
    res.status(201).json(cert);
  } catch (err) {
    console.error('POST /certifications error:', err);
    res.status(500).json({ error: 'Failed to create certification' });
  }
});

// PUT /certifications/:id — admin update
router.put('/:id', authenticate, async (req, res) => {
  try {
    const id = req.params.id as string;
    const { id: _id, createdAt, updatedAt, tags, skills, issueDate, expiryDate, slug, ...rest } = req.body;

    const data: Record<string, unknown> = {
      ...rest,
      tags:   Array.isArray(tags)   ? tags   : [],
      skills: Array.isArray(skills) ? skills : [],
    };

    if (issueDate) {
      const parsed = toDatetime(issueDate);
      if (!parsed) return res.status(400).json({ error: 'Invalid issueDate' });
      data.issueDate = parsed;
    }

    if (expiryDate !== undefined) {
      data.expiryDate = toDatetime(expiryDate) ?? null;
    }

    if (slug !== undefined) {
      const baseSlug = slug?.trim() ? slugify(slug) : slugify(rest.title || '');
      if (baseSlug) {
        data.slug = await uniqueSlug(baseSlug, id);
      }
    }

    const cert = await prisma.certification.update({
      where: { id },
      data,
    });
    res.json(cert);
  } catch (err) {
    console.error('PUT /certifications/:id error:', err);
    res.status(500).json({ error: 'Failed to update certification' });
  }
});

// PATCH /certifications/:id/visibility — toggle visibility
router.patch('/:id/visibility', authenticate, async (req, res) => {
  const id = req.params.id as string;
  const { visible } = req.body;
  const cert = await prisma.certification.update({
    where: { id },
    data: { visible: Boolean(visible) },
  });
  res.json(cert);
});

// DELETE /certifications/:id
router.delete('/:id', authenticate, async (req, res) => {
  const id = req.params.id as string;
  await prisma.certification.delete({ where: { id } });
  res.json({ message: 'Deleted' });
});

export default router;
