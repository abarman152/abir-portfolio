import { notFound } from 'next/navigation';
import type { Research } from '@/lib/types';
import ResearchDetail from './ResearchDetail';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

async function getResearch(slug: string): Promise<Research | null> {
  try {
    const res = await fetch(`${API}/research/${slug}`, {
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
  const item     = await getResearch(slug);
  if (!item) return { title: 'Research Not Found' };
  return {
    title:       `${item.title} | Abir Barman`,
    description: item.abstract,
  };
}

export default async function ResearchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item     = await getResearch(slug);
  if (!item) notFound();
  return <ResearchDetail item={item} />;
}
