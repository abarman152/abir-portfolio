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
  HeroContent, SocialLink, Project, ResearchPaper,
  Certification, Achievement, Skill, Stat,
} from '@/lib/types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
const BUILD_FETCH_TIMEOUT_MS = 5000;

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

const DEFAULT_CERTS: Certification[] = [
  {
    id: 'oracle-oci-ai-2025',
    title: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
    issuer: 'Oracle',
    issueDate: '2026-02-01',
    expiryDate: undefined,
    credentialId: '103400391OCI25AICFA',
    credentialUrl: '',
    imageUrl: '',
    category: 'Cloud & AI',
    description: 'Foundational certification covering AI concepts, machine learning fundamentals, and OCI AI services.',
    tags: [],
    featured: true,
    visible: true,
  },
  {
    id: 'generative-ai-mastermind',
    title: 'Generative AI Mastermind Program',
    issuer: 'Outskill',
    issueDate: '2026-01-01',
    expiryDate: undefined,
    credentialId: '',
    credentialUrl: '',
    imageUrl: '',
    category: 'AI / Generative AI',
    description: 'Completed an advanced program focused on Generative AI concepts and real-world applications. Gained hands-on exposure to modern AI tools, model workflows, and practical implementation strategies. Mentored by Vaibhav Sisinty.',
    tags: ['Generative AI', 'LLMs', 'AI Systems'],
    featured: false,
    visible: true,
  },
];

export default async function HomePage() {
  const [hero, socials, projects, papers, skills, certs, achievements, stats] = await Promise.all([
    fetchData<HeroContent>('/hero', DEFAULT_HERO),
    fetchData<SocialLink[]>('/social', []),
    fetchData<Project[]>('/projects', []),
    fetchData<ResearchPaper[]>('/research', []),
    fetchData<Skill[]>('/skills', []),
    fetchData<Certification[]>('/certifications', DEFAULT_CERTS),
    fetchData<Achievement[]>('/achievements', []),
    fetchData<Stat[]>('/stats', []),
  ]);

  /* Merge default Oracle cert if not already present in API data */
  const displayCerts = certs.length > 0
    ? certs
    : DEFAULT_CERTS;

  return (
    <>
      <Navbar />
      <main>
        {/* 1. Hero */}
        <Hero hero={hero} socials={socials} />

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
        <Certifications certs={displayCerts} />

        {/* 6. Achievements */}
        <Achievements achievements={achievements} />

        {/* 7. Contact */}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
