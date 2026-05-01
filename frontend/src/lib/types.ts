export interface HeroContent {
  id: string;
  name: string;
  tagline: string;
  roles: string[];
  bio: string;
  resumeUrl: string;
  avatarUrl: string;
}

export interface HeroBadge {
  id: string;
  label: string;
  position: string;
  icon: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
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
  slug: string | null;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  credentialUrl: string;
  imageUrl: string;
  badgeImageUrl: string;
  category: string;
  description: string;
  overviewMd: string;
  skills: string[];
  tags: string[];
  featured: boolean;
  visible: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CertificationListResponse {
  items: Certification[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Achievement {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  overviewMd: string;
  date: string;
  issuer: string;
  imageUrl: string;
  badgeIcon: string;
  images: string[];
  category: string;
  tags: string[];
  featured: boolean;
  visible: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  categoryId?: string | null;
  icon: string;
  order: number;
  isHighlighted: boolean;
}

export interface SkillCategory {
  id: string;
  name: string;
  order: number;
  createdAt: string;
}

export interface SkillCategoryWithSkills extends SkillCategory {
  skills: Skill[];
}

export interface SkillsResponse {
  categories: SkillCategoryWithSkills[];
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
  order: number;
}

export interface HeroConfig {
  backgroundType: 'gradient' | 'image';
  backgroundValue: string;
  profileImage: string;
  themeImages: {
    light?: string;
    dark?: string;
  };
  overlayStyle?: string;
  linkedMode: boolean;
}

export interface AboutConfig {
  backgroundType: 'gradient' | 'image';
  backgroundValue: string;
  profileImage: string;
  linkedMode: boolean;
}

export interface SiteSettings {
  id: string;
  defaultTheme: string;
  accentColor: string;
  metaTitle: string;
  metaDesc: string;
  ogImageUrl: string;
  heroConfig: HeroConfig;
  aboutConfig: AboutConfig;
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
  showSummary: boolean;
  showEducation: boolean;
  showAchievements: boolean;
  showProjects: boolean;
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
  highlightedSkills: string[];
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
