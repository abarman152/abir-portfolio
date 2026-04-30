import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

const DEFAULT_HERO_CONFIG = {
  backgroundType: 'gradient' as const,
  backgroundValue: '',
  profileImage: '',
  themeImages: {} as Record<string, string>,
  overlayStyle: '',
  linkedMode: true,
};

function ensureHeroConfig(raw: unknown): typeof DEFAULT_HERO_CONFIG {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_HERO_CONFIG };
  const obj = raw as Record<string, unknown>;
  return {
    backgroundType:
      obj.backgroundType === 'image' ? 'image' : 'gradient',
    backgroundValue:
      typeof obj.backgroundValue === 'string' ? obj.backgroundValue : '',
    profileImage:
      typeof obj.profileImage === 'string' ? obj.profileImage : '',
    themeImages:
      obj.themeImages && typeof obj.themeImages === 'object'
        ? (obj.themeImages as Record<string, string>)
        : {},
    overlayStyle:
      typeof obj.overlayStyle === 'string' ? obj.overlayStyle : '',
    linkedMode:
      typeof obj.linkedMode === 'boolean' ? obj.linkedMode : true,
  };
}

router.get('/', async (_, res) => {
  let settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: {} });
  }
  const heroConfig = ensureHeroConfig(settings.heroConfig);
  res.json({ ...settings, heroConfig });
});

router.put('/', authenticate, async (req, res) => {
  const { heroConfig: rawHeroConfig, ...rest } = req.body;

  let heroConfig: typeof DEFAULT_HERO_CONFIG | undefined;
  if (rawHeroConfig) {
    heroConfig = ensureHeroConfig(rawHeroConfig);

    if (heroConfig.linkedMode) {
      const resolvedProfile =
        heroConfig.themeImages?.dark ||
        heroConfig.profileImage;
      if (resolvedProfile) {
        heroConfig.profileImage = resolvedProfile;
      }
    }
  }

  const data: Record<string, unknown> = { ...rest };
  if (heroConfig) {
    data.heroConfig = heroConfig;
  }

  const existing = await prisma.siteSettings.findFirst();
  if (existing) {
    const updated = await prisma.siteSettings.update({
      where: { id: existing.id },
      data,
    });
    const safe = ensureHeroConfig(updated.heroConfig);
    return res.json({ ...updated, heroConfig: safe });
  }
  const created = await prisma.siteSettings.create({ data });
  const safe = ensureHeroConfig(created.heroConfig);
  res.json({ ...created, heroConfig: safe });
});

export default router;
