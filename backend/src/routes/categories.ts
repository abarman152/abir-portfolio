import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', async (_, res) => {
  try {
    const categories = await prisma.skillCategory.findMany({
      orderBy: { order: 'asc' },
    });
    res.json(categories);
  } catch {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { name, order } = req.body as { name?: string; order?: number };
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });
    const cat = await prisma.skillCategory.create({
      data: { name: name.trim(), order: order ?? 0 },
    });
    res.status(201).json(cat);
  } catch (err: unknown) {
    const prismaErr = err as { code?: string };
    if (prismaErr.code === 'P2002') return res.status(409).json({ error: 'Category name already exists' });
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, order } = req.body as { name?: string; order?: number };
    const data: { name?: string; order?: number } = {};
    if (name !== undefined) data.name = name.trim();
    if (order !== undefined) data.order = order;

    const cat = await prisma.skillCategory.update({ where: { id }, data });

    if (name !== undefined) {
      await prisma.skill.updateMany({
        where: { categoryId: id },
        data: { category: name.trim() },
      });
    }

    res.json(cat);
  } catch (err: unknown) {
    const prismaErr = err as { code?: string };
    if (prismaErr.code === 'P2025') return res.status(404).json({ error: 'Category not found' });
    res.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.skill.updateMany({ where: { categoryId: id }, data: { categoryId: null } });
    await prisma.skillCategory.delete({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (err: unknown) {
    const prismaErr = err as { code?: string };
    if (prismaErr.code === 'P2025') return res.status(404).json({ error: 'Category not found' });
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
