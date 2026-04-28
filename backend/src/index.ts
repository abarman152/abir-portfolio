import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import heroRoutes from './routes/hero';
import projectRoutes from './routes/projects';
import researchRoutes from './routes/research';
import certRoutes from './routes/certifications';
import achievementRoutes from './routes/achievements';
import skillRoutes from './routes/skills';
import statsRoutes from './routes/stats';
import socialRoutes from './routes/social';
import contactRoutes from './routes/contact';
import settingsRoutes from './routes/settings';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/certifications', certRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

export default app;
