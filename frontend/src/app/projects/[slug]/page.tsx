import { notFound } from 'next/navigation';
import type { Project } from '@/lib/types';
import ProjectDetail from './ProjectDetail';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

async function getProject(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(`${API}/projects/${slug}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project  = await getProject(slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title:       `${project.title} | Abir Barman`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project  = await getProject(slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
