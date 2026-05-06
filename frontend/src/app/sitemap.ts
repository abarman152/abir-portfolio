import type { MetadataRoute } from 'next';

const BASE = 'https://www.abirbarman.com';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

async function fetchSlugs(endpoint: string): Promise<string[]> {
  try {
    const res = await fetch(`${API}/${endpoint}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const items = Array.isArray(data) ? data : data?.data ?? [];
    return items
      .filter((item: { visible?: boolean }) => item.visible !== false)
      .map((item: { slug: string }) => item.slug)
      .filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, researchSlugs, certSlugs, achievementSlugs] =
    await Promise.all([
      fetchSlugs('projects'),
      fetchSlugs('research'),
      fetchSlugs('certifications'),
      fetchSlugs('achievements'),
    ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/research`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/certifications`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/achievements`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...projectSlugs.map((slug) => ({
      url: `${BASE}/projects/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...researchSlugs.map((slug) => ({
      url: `${BASE}/research/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...certSlugs.map((slug) => ({
      url: `${BASE}/certifications/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...achievementSlugs.map((slug) => ({
      url: `${BASE}/achievements/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
