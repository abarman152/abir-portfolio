'use client';

import { useState, useEffect, useRef } from 'react';
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
  Certification, Achievement, SkillsResponse, Stat, SiteSettings,
  AboutSectionData,
} from '@/lib/types';

export interface HomePageData {
  hero: HeroContent;
  socials: SocialLink[];
  heroBadges: HeroBadge[];
  settings: SiteSettings;
  projects: Project[];
  papers: ResearchItem[];
  skillsData: SkillsResponse;
  certs: Certification[];
  achievements: Achievement[];
  stats: Stat[];
  aboutSection: AboutSectionData;
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

async function clientFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API}${path}`);
    if (!res.ok) return fallback;
    return res.json();
  } catch {
    return fallback;
  }
}

/**
 * Detects whether server-side data fetch likely failed (backend cold start).
 * The DEFAULT_SETTINGS fallback in page.tsx has id: '' — a real DB record
 * always has a CUID. This is a reliable cold-start indicator.
 */
function isDataStale(data: HomePageData): boolean {
  return !data.settings.id;
}

export default function HomePageClient({ serverData }: { serverData: HomePageData }) {
  const [data, setData] = useState(serverData);
  const refetchAttempted = useRef(false);

  useEffect(() => {
    if (!isDataStale(data) || refetchAttempted.current) return;
    refetchAttempted.current = true;

    // Delay gives the backend time to finish waking from the server-side requests
    const timer = setTimeout(async () => {
      const [hero, socials, heroBadges, settings, projects, papers, skillsData, certs, achievements, stats, aboutSection] = await Promise.all([
        clientFetch<HeroContent>('/hero', data.hero),
        clientFetch<SocialLink[]>('/social', data.socials),
        clientFetch<HeroBadge[]>('/hero-badges', data.heroBadges),
        clientFetch<SiteSettings>('/settings', data.settings),
        clientFetch<Project[]>('/projects/featured', data.projects),
        clientFetch<ResearchItem[]>('/research/featured', data.papers),
        clientFetch<SkillsResponse>('/skills', data.skillsData),
        clientFetch<Certification[]>('/certifications/featured', data.certs),
        clientFetch<Achievement[]>('/achievements/featured', data.achievements),
        clientFetch<Stat[]>('/stats', data.stats),
        clientFetch<AboutSectionData>('/about/section', data.aboutSection),
      ]);
      setData({ hero, socials, heroBadges, settings, projects, papers, skillsData, certs, achievements, stats, aboutSection });
    }, 3000);

    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Navbar />
      <main>
        <Hero hero={data.hero} socials={data.socials} badges={data.heroBadges} heroConfig={data.settings.heroConfig} />
        <About section={data.aboutSection} />
        <Stats stats={data.stats} />
        <Projects projects={data.projects} />
        <Skills categories={data.skillsData.categories} />
        <Research papers={data.papers} />
        <Certifications certs={data.certs} />
        <Achievements achievements={data.achievements} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
