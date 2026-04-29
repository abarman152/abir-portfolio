export interface HeroContent {
  id: string;
  name: string;
  tagline: string;
  roles: string[];
  bio: string;
  resumeUrl: string;
  avatarUrl: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  username: string;
  icon: string;
  order: number;
  visible: boolean;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDesc: string;
  problem: string;
  result: string;
  techStack: string[];
  imageUrl: string;
  screenshots: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  isPublished: boolean;
  date: string;
  order: number;
  bannerImageUrl: string;
  resultImages: string[];
  overviewMd: string;
  problemCharLimit: number;
  resultCharLimit: number;
  createdAt: string;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ResearchAuthor {
  name: string;
  role?: string;
  isPrimary?: boolean;
}

export interface Research {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  overviewMd: string;
  authors: ResearchAuthor[];
  publishedAt: string;
  publisher: string;
  publicationUrl: string;
  googleScholarUrl: string;
  tags: string[];
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchListResponse {
  items: Research[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  credentialUrl: string;
  imageUrl: string;
  category: string;
  description: string;
  tags: string[];
  featured: boolean;
  visible: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  issuer: string;
  imageUrl: string;
  type: string;
  tags: string[];
  featured: boolean;
  visible: boolean;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  icon: string;
  order: number;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
  order: number;
}

export interface SiteSettings {
  id: string;
  defaultTheme: string;
  accentColor: string;
  metaTitle: string;
  metaDesc: string;
  ogImageUrl: string;
}

export interface AboutProfile {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  summary: string;
  phone: string;
  email: string;
  linkedinUrl: string;
  githubUrl: string;
  leetcodeUrl: string;
  codechefUrl: string;
  location: string;
  primaryPhoto: string;
  secondaryPhoto: string;
  showSummary: boolean;
  showEducation: boolean;
  showAchievements: boolean;
  showSkills: boolean;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  order: number;
  visible: boolean;
}

export interface AboutSkillGroup {
  id: string;
  category: string;
  skills: string[];
  order: number;
  visible: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}
