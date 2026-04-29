import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutPageContent from '@/components/sections/AboutPageContent';
import type { AboutProfile, Education, AboutSkillGroup, Achievement } from '@/lib/types';

export const metadata: Metadata = {
  title: 'About — Abir Barman',
  description: 'Data Analytics Professional skilled in Python, SQL, Power BI, and data-driven insights.',
};

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
export const dynamic = 'force-dynamic';

async function safe<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return fallback;
    return res.json();
  } catch { return fallback; }
}

const DEFAULT_PROFILE: AboutProfile = {
  id: '1',
  name: 'Abir Barman',
  title: 'Data Analytics Professional',
  subtitle: 'Data Collection & Preparation | Reporting & Insights Generation',
  summary: 'Data analytics professional experienced in collecting, integrating, and preparing data using Python, SQL, and Microsoft Excel to support data-driven campaigns.\n\nDesigned and delivered insights through Microsoft Power BI dashboards, supporting business teams with Agile project execution and cross-functional collaboration.\n\nSkilled in critical thinking, problem-solving, and adaptability. Committed to continuous learning and improving analytics processes.',
  phone: '+91 8670321835',
  email: 'abirbarman@proton.me',
  linkedinUrl: 'https://linkedin.com/in/abir-barman',
  githubUrl: 'https://github.com/abirbarman',
  location: 'India',
  primaryPhoto: '',
  secondaryPhoto: '',
  showSummary: true,
  showEducation: true,
  showAchievements: true,
  showSkills: true,
};

const DEFAULT_EDUCATION: Education[] = [
  { id: 'e1', degree: 'Master of Computer Applications (MCA)', institution: 'VIT Bhopal University', location: 'Bhopal, Madhya Pradesh', startDate: '08/2024', endDate: '06/2026', description: '', order: 1, visible: true },
  { id: 'e2', degree: 'B.Sc. Computer Science Honours', institution: 'Kalyani Mahavidyalaya', location: 'Kalyani, West Bengal', startDate: '08/2021', endDate: '06/2024', description: '', order: 2, visible: true },
];

const DEFAULT_SKILL_GROUPS: AboutSkillGroup[] = [
  { id: 's1', category: 'Programming', skills: ['Python', 'SQL'], order: 1, visible: true },
  { id: 's2', category: 'Data Processing', skills: ['Data Cleaning', 'Data Transformation', 'Data Validation', 'CSV/JSON'], order: 2, visible: true },
  { id: 's3', category: 'Analytics Tools', skills: ['Microsoft Excel', 'Power BI'], order: 3, visible: true },
  { id: 's4', category: 'Databases', skills: ['PostgreSQL', 'RDBMS fundamentals'], order: 4, visible: true },
  { id: 's5', category: 'Development Tools', skills: ['Git', 'GitHub'], order: 5, visible: true },
  { id: 's6', category: 'Core Competencies', skills: ['Data Analysis', 'Reporting', 'Automation', 'Problem Solving', 'Attention to Detail'], order: 6, visible: true },
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: 'International Best Researcher Award', description: 'Recognized at the Asia Research Award 2025 for outstanding contributions to data science and analytics research at an international level.', date: '2025-01-01', issuer: 'Asia Research Award 2025', imageUrl: '', type: 'Award', tags: ['Research', 'International'], featured: true, visible: true, order: 1 },
  { id: 'a2', title: 'Membership, American Chamber of Research', description: 'Inducted as a member recognizing contributions to research and innovation in computer science and data analytics.', date: '2025-01-01', issuer: 'American Chamber of Research', imageUrl: '', type: 'Professional', tags: ['Research', 'Membership'], featured: false, visible: true, order: 2 },
];

export default async function AboutPage() {
  const [profile, education, skillGroups, achievements] = await Promise.all([
    safe<AboutProfile>(`${API}/about/profile`, DEFAULT_PROFILE),
    safe<Education[]>(`${API}/about/education`, DEFAULT_EDUCATION),
    safe<AboutSkillGroup[]>(`${API}/about/skills`, DEFAULT_SKILL_GROUPS),
    safe<Achievement[]>(`${API}/achievements`, DEFAULT_ACHIEVEMENTS),
  ]);

  const visibleAchievements = achievements.filter(a => a.visible);

  return (
    <>
      <Navbar />
      <AboutPageContent
        profile={profile}
        education={education}
        skillGroups={skillGroups}
        achievements={visibleAchievements.length > 0 ? visibleAchievements : DEFAULT_ACHIEVEMENTS}
      />
      <Footer />
    </>
  );
}
