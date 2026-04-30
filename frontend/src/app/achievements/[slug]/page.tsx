import { notFound } from 'next/navigation';
import type { Achievement } from '@/lib/types';
import AchievementDetail from './AchievementDetail';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

async function getAchievement(slug: string): Promise<Achievement | null> {
  try {
    const res = await fetch(`${API}/achievements/${slug}`, {
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
  const item = await getAchievement(slug);
  if (!item) return { title: 'Achievement Not Found' };
  return {
    title:       `${item.title} | Abir Barman`,
    description: item.description || `${item.title} — ${item.issuer}`,
  };
}

export default async function AchievementPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getAchievement(slug);
  if (!item) notFound();
  return <AchievementDetail item={item} />;
}
