import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Research from '@/components/sections/Research';
import Stats from '@/components/sections/Stats';
import Projects from '@/components/sections/Projects';
import Skills from '@/components/sections/Skills';
import Certifications from '@/components/sections/Certifications';
import Achievements from '@/components/sections/Achievements';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/Footer';
import type {
  HeroContent, SocialLink, HeroBadge, Project, Research as ResearchItem,
  Certification, Achievement, Skill, Stat, SiteSettings, HeroConfig,
} from '@/lib/types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
const BUILD_FETCH_TIMEOUT_MS = 5000;

export const dynamic = 'force-dynamic';

async function fetchData<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API}${path}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(BUILD_FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return fallback;
    return res.json();
  } catch {
    return fallback;
  }
}

const DEFAULT_HERO: HeroContent = {
  id: '1',
  name: 'Abir Barman',
  tagline: 'I build intelligent systems that turn data into real-world impact.',
  roles: ['Data Scientist', 'ML Engineer', 'Researcher'],
  bio: 'Specializing in machine learning, data pipelines, and applied AI research. I turn messy data into decisions and prototypes into production systems.',
  resumeUrl: '',
  avatarUrl: '',
};

const DEFAULT_HERO_CONFIG: HeroConfig = {
  backgroundType: 'gradient',
  backgroundValue: '',
  profileImage: '',
  themeImages: {},
  linkedMode: true,
};

const DEFAULT_SETTINGS: SiteSettings = {
  id: '',
  defaultTheme: 'dark',
  accentColor: '#6366f1',
  metaTitle: 'Abir Barman | Data Scientist',
  metaDesc: 'Portfolio of Abir Barman - Data Scientist & Full Stack Developer',
  ogImageUrl: '',
  heroConfig: DEFAULT_HERO_CONFIG,
};

const DEFAULT_CERTS: Certification[] = [];

export default async function HomePage() {
  const [hero, socials, heroBadges, settings, projects, papers, skills, certs, achievements, stats] = await Promise.all([
    fetchData<HeroContent>('/hero', DEFAULT_HERO),
    fetchData<SocialLink[]>('/social', []),
    fetchData<HeroBadge[]>('/hero-badges', []),
    fetchData<SiteSettings>('/settings', DEFAULT_SETTINGS),
    fetchData<Project[]>('/projects/featured', []),
    fetchData<ResearchItem[]>('/research/featured', []),
    fetchData<Skill[]>('/skills', []),
    fetchData<Certification[]>('/certifications/featured', DEFAULT_CERTS),
    fetchData<Achievement[]>('/achievements/featured', []),
    fetchData<Stat[]>('/stats', []),
  ]);

  return (
    <>
      <Navbar />
      <main>
        {/* 1. Hero */}
        <Hero hero={hero} socials={socials} badges={heroBadges} heroConfig={settings.heroConfig} />

        {/* 2. About Me */}
        <About />

        {/* Stats strip — proof of work, no nav anchor */}
        <Stats stats={stats} />

        {/* 3. Projects */}
        <Projects projects={projects} />

        {/* Skills — supporting content, no nav anchor */}
        <Skills skills={skills} />

        {/* 4. Research */}
        <Research papers={papers} />

        {/* 5. Certifications */}
        <Certifications certs={certs} />

        {/* 6. Achievements */}
        <Achievements achievements={achievements} />

        {/* 7. Contact */}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
