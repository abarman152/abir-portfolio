import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

const DEFAULT_HERO_CONFIG = {
  backgroundType: 'gradient' as 'gradient' | 'image',
  backgroundValue: '',
  profileImage: '',
  themeImages: {} as Record<string, string>,
  overlayStyle: '',
  linkedMode: true,
};

const DEFAULT_ABOUT_CONFIG = {
  backgroundType: 'gradient' as 'gradient' | 'image',
  backgroundValue: '',
  profileImage: '',
  linkedMode: true,
};

function ensureHeroConfig(raw: unknown): typeof DEFAULT_HERO_CONFIG {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_HERO_CONFIG };
  const obj = raw as Record<string, unknown>;
  return {
    backgroundType: obj.backgroundType === 'image' ? 'image' : 'gradient',
    backgroundValue: typeof obj.backgroundValue === 'string' ? obj.backgroundValue : '',
    profileImage: typeof obj.profileImage === 'string' ? obj.profileImage : '',
    themeImages:
      obj.themeImages && typeof obj.themeImages === 'object'
        ? (obj.themeImages as Record<string, string>)
        : {},
    overlayStyle: typeof obj.overlayStyle === 'string' ? obj.overlayStyle : '',
    linkedMode: typeof obj.linkedMode === 'boolean' ? obj.linkedMode : true,
  };
}

function ensureAboutConfig(raw: unknown): typeof DEFAULT_ABOUT_CONFIG {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_ABOUT_CONFIG };
  const obj = raw as Record<string, unknown>;
  return {
    backgroundType: obj.backgroundType === 'image' ? 'image' : 'gradient',
    backgroundValue: typeof obj.backgroundValue === 'string' ? obj.backgroundValue : '',
    profileImage: typeof obj.profileImage === 'string' ? obj.profileImage : '',
    linkedMode: typeof obj.linkedMode === 'boolean' ? obj.linkedMode : true,
  };
}

router.get('/', async (_, res) => {
  let settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: {} });
  }
  const heroConfig = ensureHeroConfig(settings.heroConfig);
  const aboutConfig = ensureAboutConfig(settings.aboutConfig);
  res.json({ ...settings, heroConfig, aboutConfig });
});

router.put('/', authenticate, async (req, res) => {
  try {
    const { heroConfig: rawHeroConfig, aboutConfig: rawAboutConfig, id: _id, ...rest } = req.body;

    let heroConfig: typeof DEFAULT_HERO_CONFIG | undefined;
    if (rawHeroConfig) {
      heroConfig = ensureHeroConfig(rawHeroConfig);
      if (heroConfig.linkedMode) {
        const resolvedProfile = heroConfig.themeImages?.dark || heroConfig.profileImage;
        if (resolvedProfile) heroConfig.profileImage = resolvedProfile;
      }
    }

    let aboutConfig: typeof DEFAULT_ABOUT_CONFIG | undefined;
    if (rawAboutConfig) {
      aboutConfig = ensureAboutConfig(rawAboutConfig);
      if (aboutConfig.linkedMode && aboutConfig.backgroundType === 'image' && aboutConfig.backgroundValue) {
        aboutConfig.profileImage = aboutConfig.backgroundValue;
      }
    }

    const data: Record<string, unknown> = { ...rest };
    if (heroConfig) data.heroConfig = heroConfig;
    if (aboutConfig) data.aboutConfig = aboutConfig;

    const existing = await prisma.siteSettings.findFirst();
    if (existing) {
      const updated = await prisma.siteSettings.update({ where: { id: existing.id }, data });
      return res.json({
        ...updated,
        heroConfig: ensureHeroConfig(updated.heroConfig),
        aboutConfig: ensureAboutConfig(updated.aboutConfig),
      });
    }
    const created = await prisma.siteSettings.create({ data });
    res.json({
      ...created,
      heroConfig: ensureHeroConfig(created.heroConfig),
      aboutConfig: ensureAboutConfig(created.aboutConfig),
    });
  } catch (error) {
    console.error('Settings PUT error:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

export default router;
