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
  Certification, Achievement, SkillsResponse, Stat, SiteSettings, HeroConfig,
  AboutSectionData,
} from '@/lib/types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
const BUILD_FETCH_TIMEOUT_MS = 5000;

export const dynamic = 'force-dynamic';

async function fetchData<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API}${path}`, {
      cache: 'no-store',
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
  aboutConfig: { backgroundType: 'gradient', backgroundValue: '', profileImage: '', linkedMode: true },
};

const DEFAULT_ABOUT_SECTION: AboutSectionData = {
  id: '',
  headline: 'Turning raw data into',
  highlight: 'decisions that matter.',
  paragraphs: [
    "I'm a Data Scientist and ML Engineer who loves the full journey — from exploring messy datasets to shipping production systems that make a measurable difference.",
    "My work sits at the intersection of machine learning, research, and data storytelling. I build systems that don't just predict — they explain, alert, and act.",
    "Outside of professional work, I contribute to research in quantum computing, NLP, and evolutionary optimization, compete on platforms like LeetCode and Codeforces, and explore applied AI systems.",
  ],
  skills: ['Python', 'PyTorch', 'TensorFlow', 'scikit-learn', 'PostgreSQL', 'Docker', 'Airflow', 'Quantum ML'],
  categories: [
    { title: 'Machine Learning', description: 'Designing and deploying ML models that solve real problems — from NLP and computer vision to anomaly detection and forecasting.', icon: 'Brain', color: '#6366f1' },
    { title: 'Data Engineering', description: 'Building robust data pipelines, ETL systems, and analytics infrastructure that make data reliable and decision-ready.', icon: 'Database', color: '#8b5cf6' },
    { title: 'Research & Innovation', description: 'Published researcher in quantum-enhanced NLP, post-quantum cryptography, and evolutionary optimization bridging theory with production systems.', icon: 'Lightbulb', color: '#f59e0b' },
  ],
  updatedAt: '',
};

const DEFAULT_CERTS: Certification[] = [];

export default async function HomePage() {
  const [hero, socials, heroBadges, settings, projects, papers, skillsData, certs, achievements, stats, aboutSection] = await Promise.all([
    fetchData<HeroContent>('/hero', DEFAULT_HERO),
    fetchData<SocialLink[]>('/social', []),
    fetchData<HeroBadge[]>('/hero-badges', []),
    fetchData<SiteSettings>('/settings', DEFAULT_SETTINGS),
    fetchData<Project[]>('/projects/featured', []),
    fetchData<ResearchItem[]>('/research/featured', []),
    fetchData<SkillsResponse>('/skills', { categories: [] }),
    fetchData<Certification[]>('/certifications/featured', DEFAULT_CERTS),
    fetchData<Achievement[]>('/achievements/featured', []),
    fetchData<Stat[]>('/stats', []),
    fetchData<AboutSectionData>('/about/section', DEFAULT_ABOUT_SECTION),
  ]);

  return (
    <>
      <Navbar />
      <main>
        {/* 1. Hero */}
        <Hero hero={hero} socials={socials} badges={heroBadges} heroConfig={settings.heroConfig} />

        {/* 2. About Me */}
        <About section={aboutSection} />

        {/* Stats strip — proof of work, no nav anchor */}
        <Stats stats={stats} />

        {/* 3. Projects */}
        <Projects projects={projects} />

        {/* Skills — supporting content, no nav anchor */}
        <Skills categories={skillsData.categories} />

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
