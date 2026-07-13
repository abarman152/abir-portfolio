'use client';

import { useCallback, useEffect, useState } from 'react';
import type { HeroContent } from './types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export function isValidResumeUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

// Cross-origin anchors ignore the `download` attribute, so Cloudinary-hosted
// files need the fl_attachment flag to force a download instead of inline view.
export function resumeDownloadUrl(url: string): string {
  const cloudinary = url.match(
    /^(https:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|raw)\/upload\/)(.+)$/
  );
  return cloudinary ? `${cloudinary[1]}fl_attachment/${cloudinary[2]}` : url;
}

// Known-good iframe sources: Google Drive /preview links, Google Docs viewer,
// Cloudinary-hosted files, and direct PDFs. Anything else may still work but
// can be blocked by the host's X-Frame-Options/CSP.
export function isLikelyEmbeddablePreview(url: string): boolean {
  return (
    /^https:\/\/drive\.google\.com\/file\/d\/[^/]+\/preview(?:[?#]|$)/.test(url) ||
    /^https:\/\/docs\.google\.com\//.test(url) ||
    /^https:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|raw)\/upload\//.test(url) ||
    /\.pdf(?:[?#]|$)/i.test(url)
  );
}

// Admin-facing guidance for preview URLs that are valid http(s) but unlikely
// to render inside an iframe. Returns null when the URL looks fine.
export function previewUrlHint(url: string): string | null {
  if (!isValidResumeUrl(url)) return null;
  const driveShare = url.match(/^https:\/\/drive\.google\.com\/file\/d\/([^/]+)\/(?:view|edit)/);
  if (driveShare) {
    return `Use the /preview form of this Google Drive link: https://drive.google.com/file/d/${driveShare[1]}/preview`;
  }
  if (!isLikelyEmbeddablePreview(url)) {
    return 'This URL may not render in an embedded preview — Google Drive /preview links or direct PDF URLs work best';
  }
  return null;
}

interface ResumeState {
  hero: HeroContent | null;
  loading: boolean;
  error: boolean;
}

let cache: HeroContent | null = null;
let inflight: Promise<HeroContent> | null = null;

async function fetchHero(): Promise<HeroContent> {
  const res = await fetch(`${API}/hero`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export function useResume(): ResumeState & { retry: () => void } {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<ResumeState>(() =>
    cache
      ? { hero: cache, loading: false, error: false }
      : { hero: null, loading: true, error: false }
  );

  useEffect(() => {
    let active = true;
    const source =
      cache !== null
        ? Promise.resolve(cache)
        : (inflight ??= fetchHero().finally(() => {
            inflight = null;
          }));
    source
      .then((hero) => {
        cache = hero;
        if (!active) return;
        setState((prev) =>
          prev.hero === hero && !prev.loading ? prev : { hero, loading: false, error: false }
        );
      })
      .catch(() => {
        if (active) setState({ hero: null, loading: false, error: true });
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ hero: null, loading: true, error: false });
    setAttempt((a) => a + 1);
  }, []);

  return { ...state, retry };
}
