import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  res.json({ token, admin: { id: admin.id, email: admin.email } });
});

router.post('/setup', async (req, res) => {
  const count = await prisma.admin.count();
  if (count > 0) return res.status(403).json({ error: 'Admin already exists' });

  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 12);
  const admin = await prisma.admin.create({ data: { email, password: hashed } });
  res.json({ message: 'Admin created', id: admin.id });
});

export default router;
