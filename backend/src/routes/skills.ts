import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', async (_, res) => {
  try {
    const categories = await prisma.skillCategory.findMany({
      orderBy: { order: 'asc' },
      include: { skills: { orderBy: { order: 'asc' } } },
    });
    res.json({ categories });
  } catch {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { name, level, category, categoryId, icon, order, isHighlighted } = req.body as {
      name?: string; level?: number; category?: string; categoryId?: string;
      icon?: string; order?: number; isHighlighted?: boolean;
    };
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });

    let resolvedCategory = category ?? '';
    if (categoryId) {
      const cat = await prisma.skillCategory.findUnique({ where: { id: categoryId } });
      if (cat) resolvedCategory = cat.name;
    }

    const skill = await prisma.skill.create({
      data: {
        name: name.trim(),
        level: level ?? 80,
        category: resolvedCategory,
        categoryId: categoryId ?? null,
        icon: icon ?? '',
        order: order ?? 0,
        isHighlighted: isHighlighted ?? false,
      },
    });
    res.status(201).json(skill);
  } catch {
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const id = req.params.id as string;
    const { name, level, category, categoryId, icon, order, isHighlighted } = req.body as {
      name?: string; level?: number; category?: string; categoryId?: string | null;
      icon?: string; order?: number; isHighlighted?: boolean;
    };

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name.trim();
    if (level !== undefined) data.level = Number(level);
    if (category !== undefined) data.category = category;
    if (categoryId !== undefined) data.categoryId = categoryId ?? null;
    if (icon !== undefined) data.icon = icon;
    if (order !== undefined) data.order = order;
    if (isHighlighted !== undefined) data.isHighlighted = isHighlighted;

    if (categoryId) {
      const cat = await prisma.skillCategory.findUnique({ where: { id: categoryId } });
      if (cat) data.category = cat.name;
    }

    const skill = await prisma.skill.update({ where: { id }, data });
    res.json(skill);
  } catch (err: unknown) {
    const prismaErr = err as { code?: string };
    if (prismaErr.code === 'P2025') return res.status(404).json({ error: 'Skill not found' });
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const id = req.params.id as string;
    await prisma.skill.delete({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (err: unknown) {
    const prismaErr = err as { code?: string };
    if (prismaErr.code === 'P2025') return res.status(404).json({ error: 'Skill not found' });
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

export default router;
