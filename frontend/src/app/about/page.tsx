import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutPageContent from '@/components/sections/AboutPageContent';
import type { AboutProfile, AboutConfig, Education, AboutSkillGroup, Achievement, Project, SiteSettings } from '@/lib/types';

export const metadata: Metadata = {
  title: 'About — Abir Barman',
  description: 'Data Analytics Professional skilled in Python, SQL, Power BI, and data-driven insights.',
};

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
export const dynamic = 'force-dynamic';

async function safe<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
    if (!res.ok) return fallback;
    return res.json();
  } catch { return fallback; }
}

const DEFAULT_ABOUT_CONFIG: AboutConfig = {
  backgroundType: 'gradient',
  backgroundValue: '',
  profileImage: '',
  linkedMode: true,
};

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
  leetcodeUrl: 'https://leetcode.com/u/abirbarman/',
  codechefUrl: 'https://www.codechef.com/users/abirbarman',
  location: 'India',
  showSummary: true,
  showEducation: true,
  showAchievements: true,
  showProjects: true,
  showSkills: true,
};

const DEFAULT_EDUCATION: Education[] = [
  { id: 'e1', degree: 'Master of Computer Applications (MCA)', institution: 'VIT Bhopal University', location: 'Bhopal, Madhya Pradesh', startDate: '08/2024', endDate: '06/2026', description: '', order: 1, visible: true },
  { id: 'e2', degree: 'B.Sc. Computer Science Honours', institution: 'Kalyani Mahavidyalaya', location: 'Kalyani, West Bengal', startDate: '08/2021', endDate: '06/2024', description: '', order: 2, visible: true },
];

const DEFAULT_SKILL_GROUPS: AboutSkillGroup[] = [
  { id: 's1', category: 'Programming', skills: ['Python', 'SQL'], highlightedSkills: ['Python'], order: 1, visible: true },
  { id: 's2', category: 'Data Processing', skills: ['Data Cleaning', 'Data Transformation', 'Data Validation', 'CSV/JSON'], highlightedSkills: [], order: 2, visible: true },
  { id: 's3', category: 'Analytics Tools', skills: ['Microsoft Excel', 'Power BI'], highlightedSkills: ['Power BI'], order: 3, visible: true },
  { id: 's4', category: 'Databases', skills: ['PostgreSQL', 'RDBMS fundamentals'], highlightedSkills: [], order: 4, visible: true },
  { id: 's5', category: 'Development Tools', skills: ['Git', 'GitHub'], highlightedSkills: [], order: 5, visible: true },
  { id: 's6', category: 'Core Competencies', skills: ['Data Analysis', 'Reporting', 'Automation', 'Problem Solving', 'Attention to Detail'], highlightedSkills: [], order: 6, visible: true },
];

export default async function AboutPage() {
  const [profile, education, skillGroups, achievements, projects, settings] = await Promise.all([
    safe<AboutProfile>(`${API}/about/profile`, DEFAULT_PROFILE),
    safe<Education[]>(`${API}/about/education`, DEFAULT_EDUCATION),
    safe<AboutSkillGroup[]>(`${API}/about/skills`, DEFAULT_SKILL_GROUPS),
    safe<Achievement[]>(`${API}/achievements/featured`, []),
    safe<Project[]>(`${API}/projects/featured`, []),
    safe<SiteSettings>(`${API}/settings`, { id: '', defaultTheme: 'dark', accentColor: '#6366f1', metaTitle: '', metaDesc: '', ogImageUrl: '', heroConfig: { backgroundType: 'gradient', backgroundValue: '', profileImage: '', themeImages: {}, linkedMode: true }, aboutConfig: DEFAULT_ABOUT_CONFIG }),
  ]);

  const aboutConfig = settings.aboutConfig ?? DEFAULT_ABOUT_CONFIG;

  return (
    <>
      <Navbar />
      <AboutPageContent
        profile={profile}
        education={education}
        skillGroups={skillGroups}
        achievements={achievements.filter(a => a.visible).slice(0, 4)}
        projects={projects.slice(0, 3)}
        aboutConfig={aboutConfig}
      />
      <Footer />
    </>
  );
}
