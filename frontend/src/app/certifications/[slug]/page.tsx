import { notFound } from 'next/navigation';
import type { Certification } from '@/lib/types';
import CertDetail from './CertDetail';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

async function getCert(slug: string): Promise<Certification | null> {
  try {
    const res = await fetch(`${API}/certifications/${slug}`, {
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
  const cert     = await getCert(slug);
  if (!cert) return { title: 'Certification Not Found' };
  return {
    title:       `${cert.title} | Abir Barman`,
    description: cert.description || `${cert.title} — issued by ${cert.issuer}`,
  };
}

export default async function CertPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cert     = await getCert(slug);
  if (!cert) notFound();
  return <CertDetail cert={cert} />;
}
