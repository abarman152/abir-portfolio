'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Download, MapPin, Brain, FolderOpen, BookOpen } from 'lucide-react';
import type { HeroContent, SocialLink } from '@/lib/types';

/* ─── Brand SVG icons ─────────────────────────────────────────── */
function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function LeetCodeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  );
}

function CodeforcesIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5V19.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V4.5C9 3.672 9.672 3 10.5 3h3zm9 7.5c.828 0 1.5.672 1.5 1.5v9c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-9c0-.828.672-1.5 1.5-1.5h3z" />
    </svg>
  );
}

/* ─── Social icon map ─────────────────────────────────────────── */
const SOCIAL_ICON: Record<string, React.ElementType> = {
  GitHub:      GitHubIcon,
  Github:      GitHubIcon,
  GitFork:     GitHubIcon,
  LinkedIn:    LinkedInIcon,
  Linkedin:    LinkedInIcon,
  Globe:       LinkedInIcon,
  LeetCode:    LeetCodeIcon,
  Codeforces:  CodeforcesIcon,
};

/* ─── Floating badge component ────────────────────────────────── */
function Badge({
  icon: Icon,
  label,
  style,
}: {
  icon: React.ElementType;
  label: string;
  style: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex', alignItems: 'center', gap: '0.45rem',
        padding: '0.5rem 0.875rem',
        borderRadius: '10px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        backdropFilter: 'blur(12px)',
        fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)',
        whiteSpace: 'nowrap',
        zIndex: 10,
        ...style,
      }}
    >
      <Icon size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
      {label}
    </div>
  );
}

/* ─── Hero ────────────────────────────────────────────────────── */
interface Props { hero: HeroContent; socials: SocialLink[] }

export default function Hero({ hero, socials }: Props) {
  const resolveIcon = (s: SocialLink): React.ElementType =>
    SOCIAL_ICON[s.platform] || SOCIAL_ICON[s.icon] || GitHubIcon;

  const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];
  const item = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: EASE },
  });

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        paddingTop: '60px',
        background: 'var(--bg)',
      }}
    >
      <div
        style={{ maxWidth: '1280px', margin: '0 auto', padding: '5rem 2.5rem', width: '100%' }}
      >
        <div
          className="hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '5rem',
            alignItems: 'center',
          }}
        >
          {/* ── LEFT — Text ─────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', minWidth: 0 }}>
            {/* Name */}
            <motion.p
              {...item(0)}
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--text-3)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
              }}
            >
              {hero.name || 'Abir Barman'}
            </motion.p>

            {/* Headline */}
            <motion.h1
              {...item(0.08)}
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
                color: 'var(--text)',
                marginBottom: '1.5rem',
                maxWidth: '580px',
              }}
            >
              {hero.tagline || (
                <>
                  I build{' '}
                  <span style={{ color: 'var(--accent)' }}>intelligent systems</span>{' '}
                  that turn data into real-world impact.
                </>
              )}
            </motion.h1>

            {/* Roles */}
            <motion.p
              {...item(0.16)}
              style={{
                fontSize: '1rem',
                fontWeight: 500,
                color: 'var(--text-2)',
                marginBottom: '0.875rem',
                letterSpacing: '0.01em',
              }}
            >
              Data Scientist · ML Engineer
            </motion.p>

            {/* Location */}
            <motion.div
              {...item(0.22)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                marginBottom: '2rem',
              }}
            >
              <MapPin size={13} style={{ color: 'var(--text-3)' }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-3)' }}>Bengaluru, India</span>
            </motion.div>

            {/* Bio */}
            <motion.p
              {...item(0.30)}
              style={{
                fontSize: '0.975rem',
                color: 'var(--text-2)',
                lineHeight: 1.8,
                marginBottom: '2.25rem',
                maxWidth: '520px',
              }}
            >
              {hero.bio ||
                'Specializing in machine learning, data pipelines, and end-to-end systems. I turn messy data into decisions and prototypes into products.'}
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...item(0.38)}
              style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}
            >
              <a
                href="#projects"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.7rem 1.5rem',
                  borderRadius: '9px', border: 'none',
                  background: 'var(--accent)', color: 'white',
                  fontSize: '0.9rem', fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'opacity 0.15s, transform 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = '0.88';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = '1';
                  (e.currentTarget as HTMLElement).style.transform = 'none';
                }}
              >
                View Projects <ArrowRight size={15} />
              </a>

              {hero.resumeUrl ? (
                <a
                  href={hero.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.7rem 1.5rem',
                    borderRadius: '9px',
                    border: '1px solid var(--border)',
                    background: 'transparent', color: 'var(--text)',
                    fontSize: '0.9rem', fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'border-color 0.15s, transform 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLElement).style.transform = 'none';
                  }}
                >
                  <Download size={15} /> Resume
                </a>
              ) : (
                <a
                  href="#contact"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.7rem 1.5rem',
                    borderRadius: '9px',
                    border: '1px solid var(--border)',
                    background: 'transparent', color: 'var(--text)',
                    fontSize: '0.9rem', fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'border-color 0.15s, transform 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLElement).style.transform = 'none';
                  }}
                >
                  Contact
                </a>
              )}
            </motion.div>

            {/* Social icons */}
            <motion.div {...item(0.46)} style={{ display: 'flex', gap: '0.5rem' }}>
              {socials.length > 0 ? (
                socials.map((s) => {
                  const Icon = resolveIcon(s);
                  return (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.platform}
                      style={{
                        width: 38, height: 38, borderRadius: '9px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'var(--bg-3)', border: '1px solid var(--border)',
                        color: 'var(--text-3)', textDecoration: 'none',
                        transition: 'color 0.15s, border-color 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = 'var(--text)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-3)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                      }}
                    >
                      <Icon size={17} />
                    </a>
                  );
                })
              ) : (
                /* Default social links when no DB data */
                [
                  { icon: GitHubIcon,      href: 'https://github.com',       label: 'GitHub' },
                  { icon: LinkedInIcon,    href: 'https://linkedin.com',     label: 'LinkedIn' },
                  { icon: LeetCodeIcon,    href: 'https://leetcode.com',     label: 'LeetCode' },
                  { icon: CodeforcesIcon,  href: 'https://codeforces.com',   label: 'Codeforces' },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    style={{
                      width: 38, height: 38, borderRadius: '9px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--bg-3)', border: '1px solid var(--border)',
                      color: 'var(--text-3)', textDecoration: 'none',
                      transition: 'color 0.15s, border-color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = 'var(--text)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = 'var(--text-3)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                    }}
                  >
                    <Icon size={17} />
                  </a>
                ))
              )}
            </motion.div>
          </div>

          {/* ── RIGHT — Profile image ────────────────── */}
          <motion.div
            className="hero-photo"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>

              {/* ── Floating badge — top right ───────── */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              >
                <Badge
                  icon={Brain}
                  label="AI / ML Systems"
                  style={{ top: -14, right: -20 }}
                />
              </motion.div>

              {/* ── Photo frame ─────────────────────── */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4 / 5',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  background: 'var(--bg-3)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 12px 48px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)',
                  position: 'relative',
                }}
              >
                {hero.avatarUrl ? (
                  <img
                    src={hero.avatarUrl}
                    alt={hero.name || 'Abir Barman'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    loading="eager"
                  />
                ) : (
                  /* Placeholder */
                  <div
                    style={{
                      width: '100%', height: '100%',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      gap: '0.875rem',
                    }}
                  >
                    <div
                      style={{
                        width: 96, height: 96, borderRadius: '50%',
                        background: 'var(--accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', fontWeight: 800, color: 'white',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      AB
                    </div>
                    <span style={{ color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 500 }}>
                      Add photo in Admin
                    </span>
                  </div>
                )}
              </div>

              {/* ── Floating badge — bottom left ─────── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.52, duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              >
                <Badge
                  icon={FolderOpen}
                  label="40+ Projects"
                  style={{ bottom: 28, left: -20 }}
                />
              </motion.div>

              {/* ── Floating badge — bottom right ────── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.62, duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              >
                <Badge
                  icon={BookOpen}
                  label="Research Work"
                  style={{ bottom: -14, right: 24 }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
