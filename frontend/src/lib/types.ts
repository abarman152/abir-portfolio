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
  techStack: string[];
  imageUrl: string;
  screenshots: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  order: number;
  createdAt: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  journal: string;
  year: number;
  doi: string;
  paperUrl: string;
  tags: string[];
  featured: boolean;
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

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}
