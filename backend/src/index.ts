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
import categoryRoutes from './routes/categories';
import statsRoutes from './routes/stats';
import socialRoutes from './routes/social';
import contactRoutes from './routes/contact';
import settingsRoutes from './routes/settings';
import aboutRoutes from './routes/about';
import heroBadgeRoutes from './routes/heroBadges';
import notificationSettingsRoutes from './routes/notificationSettings';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',').map((o) => o.trim());
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/certifications', certRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/hero-badges', heroBadgeRoutes);
app.use('/api/notification-settings', notificationSettingsRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

export default app;
