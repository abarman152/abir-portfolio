'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { SocialLink } from '@/lib/types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

/* ── Navigation links — synced with Navbar routes ── */
const NAV_LINKS = [
  { href: '/about',          label: 'About' },
  { href: '/projects',       label: 'Projects' },
  { href: '/research',       label: 'Research' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/achievements',   label: 'Achievements' },
];

/* ── Platform → inline SVG icon mapping ── */
function SocialIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase();
  if (p === 'github') return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
  if (p === 'linkedin') return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
  if (p === 'leetcode') return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
    </svg>
  );
  if (p === 'email' || p === 'mail') return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
  if (p === 'twitter' || p === 'x') return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
  // Default: generic link icon
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}

export default function Footer() {
  const [socials, setSocials] = useState<SocialLink[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/social`, { cache: 'no-store' });
        if (!res.ok) return;
        const data: SocialLink[] = await res.json();
        setSocials(data.filter((s) => s.visible).sort((a, b) => a.order - b.order));
      } catch {
        // Silently fail — footer still renders without socials
      }
    })();
  }, []);

  return (
    <motion.footer
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}
    >
      {/* Main footer body */}
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '3rem 2rem 2.5rem',
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr',
        gap: '2.5rem',
        alignItems: 'start',
      }}
        className="footer-grid"
      >
        {/* Left — Identity */}
        <div>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Abir<span style={{ color: 'var(--accent)' }}>.dev</span>
            </span>
          </Link>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 500, marginTop: '0.3rem', letterSpacing: '0.02em' }}>
            Data Scientist &nbsp;·&nbsp; ML Engineer
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.7, marginTop: '0.875rem', maxWidth: '260px' }}>
            Building intelligent systems that create real-world impact.
          </p>
        </div>

        {/* Center — Navigation (using real routes) */}
        <div>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
            Navigation
          </p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                style={{
                  fontSize: '0.85rem', color: 'var(--text-2)', textDecoration: 'none',
                  transition: 'color 0.15s', width: 'fit-content',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-2)')}
              >
                {label}
              </Link>
            ))}
            {/* Contact stays as anchor to homepage section */}
            <a
              href="/#contact"
              style={{
                fontSize: '0.85rem', color: 'var(--text-2)', textDecoration: 'none',
                transition: 'color 0.15s', width: 'fit-content',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-2)')}
            >
              Contact
            </a>
          </nav>
        </div>

        {/* Right — Dynamic Social Links */}
        <div>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
            Connect
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {socials.length > 0 ? (
              socials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target={s.url.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                    color: 'var(--text-2)', textDecoration: 'none',
                    fontSize: '0.85rem', transition: 'color 0.15s', width: 'fit-content',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--accent)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-2)')}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: '7px', flexShrink: 0,
                    background: 'var(--bg-3)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <SocialIcon platform={s.platform} />
                  </span>
                  {s.platform}
                </a>
              ))
            ) : (
              // Minimal fallback while loading
              <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>Loading…</span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '1rem 2rem',
        borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '0.5rem',
      }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>
          © {new Date().getFullYear()} Abir Barman. All rights reserved.
        </p>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>
          Built with Next.js &amp; TypeScript
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </motion.footer>
  );
}
