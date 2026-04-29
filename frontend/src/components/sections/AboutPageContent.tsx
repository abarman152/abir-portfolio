'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Award, GraduationCap } from 'lucide-react';
import type { AboutProfile, Education, AboutSkillGroup, Achievement } from '@/lib/types';

function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
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

function CodeChefIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.257.004C5.37.136.14 5.005.003 10.892c-.09 3.805 1.7 7.37 4.7 9.65a.75.75 0 0 0 1.18-.61v-1.74c0-.35.19-.68.5-.86l.34-.19c.31-.18.5-.51.5-.87v-1.44a.75.75 0 0 1 .75-.75h.13a.75.75 0 0 1 .53.22l.47.47c.14.14.33.22.53.22h.24c.41 0 .75-.34.75-.75V13.5a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v1.74c0 .41.34.75.75.75h.12a.75.75 0 0 0 .53-.22l.47-.47c.14-.14.33-.22.53-.22h.13c.41 0 .75.34.75.75v1.44c0 .36.19.69.5.87l.34.19c.31.18.5.51.5.86v1.74a.75.75 0 0 0 1.18.61c3-2.28 4.79-5.85 4.7-9.65C23.86 5.005 18.63.136 12.743.004a12.2 12.2 0 0 0-1.486 0zm.743 3.246c3.45 0 6.25 2.8 6.25 6.25s-2.8 6.25-6.25 6.25-6.25-2.8-6.25-6.25 2.8-6.25 6.25-6.25zm0 1.5a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5zm-2 2h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1 0-1.5zm0 2.5h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1 0-1.5z" />
    </svg>
  );
}

interface Props {
  profile: AboutProfile;
  education: Education[];
  skillGroups: AboutSkillGroup[];
  achievements: Achievement[];
}

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45, delay, ease: EASE },
});

const SECTION_LABEL: React.CSSProperties = {
  display: 'block',
  fontSize: '0.68rem',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: 'var(--text-3)',
  marginBottom: '2rem',
};

const SECTION_WRAP: React.CSSProperties = {
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '0 2rem',
};

export default function AboutPageContent({ profile, education, skillGroups, achievements }: Props) {
  const socialLinks = [
    { icon: Phone,        label: 'Phone',    href: profile.phone    ? `tel:${profile.phone}`         : '' },
    { icon: Mail,         label: 'Email',    href: profile.email    ? `mailto:${profile.email}`       : '' },
    { icon: LinkedInIcon, label: 'LinkedIn', href: profile.linkedinUrl || '' },
    { icon: GitHubIcon,   label: 'GitHub',   href: profile.githubUrl   || '' },
    { icon: LeetCodeIcon, label: 'LeetCode', href: profile.leetcodeUrl  || '' },
    { icon: CodeChefIcon, label: 'CodeChef', href: profile.codechefUrl  || '' },
  ].filter(l => l.href);

  return (
    <div style={{ paddingTop: '60px', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '5rem 0 4.5rem' }}>
        <div style={SECTION_WRAP}>
          <div className="about-page-header">

            {/* Left: identity */}
            <div style={{ minWidth: 0 }}>

              {/* Eyebrow */}
              <motion.span
                {...fadeUp(0)}
                style={{ display: 'inline-block', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1.5rem' }}
              >
                Portfolio · About
              </motion.span>

              {/* Name — hero-level */}
              <motion.h1
                {...fadeUp(0.07)}
                style={{
                  fontSize: 'clamp(2.4rem, 5vw, 3.5rem)',
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: '-0.04em',
                  color: 'var(--text)',
                  marginBottom: '1rem',
                }}
              >
                {profile.name}
              </motion.h1>

              {/* Title */}
              <motion.p
                {...fadeUp(0.13)}
                style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}
              >
                {profile.title}
              </motion.p>

              {/* Subtitle — two lines split on " | " */}
              <motion.div
                {...fadeUp(0.18)}
                style={{ marginBottom: '2.5rem' }}
              >
                {(profile.subtitle || '').split('|').map((line, i) => (
                  <p
                    key={i}
                    style={{ fontSize: '0.875rem', color: 'var(--text-3)', lineHeight: 1.7, fontWeight: 400 }}
                  >
                    {line.trim()}
                  </p>
                ))}
              </motion.div>

              {/* Social icon row */}
              <motion.div
                {...fadeUp(0.24)}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
              >
                {socialLinks.map(({ icon: Icon, label, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="about-contact-icon"
                    aria-label={label}
                  >
                    <Icon size={18} />
                    <span className="about-contact-tooltip">{label}</span>
                  </a>
                ))}
              </motion.div>
            </div>

            {/* Right: Primary photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="about-page-photo"
            >
              <div style={{ width: '180px', height: '215px', borderRadius: '16px', overflow: 'hidden', background: 'var(--bg-3)', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem' }}>
                {profile.primaryPhoto ? (
                  <img src={profile.primaryPhoto} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
                      {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-3)', textAlign: 'center', padding: '0 0.5rem' }}>Add photo in Admin</span>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SUMMARY ─────────────────────────────────────────────── */}
      {profile.showSummary && profile.summary && (
        <section style={{ background: 'var(--bg)', padding: '3.5rem 0', borderBottom: '1px solid var(--border)' }}>
          <div style={SECTION_WRAP}>
            <motion.span {...fadeUp(0)} style={SECTION_LABEL}>Professional Summary</motion.span>
            <div style={{ maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {profile.summary.split('\n\n').filter(Boolean).map((para, i) => (
                <motion.p
                  key={i}
                  {...fadeUp(0.06 + i * 0.07)}
                  style={{ fontSize: '0.975rem', color: 'var(--text-2)', lineHeight: 2, margin: 0 }}
                >
                  {para.trim()}
                </motion.p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── EDUCATION ───────────────────────────────────────────── */}
      {profile.showEducation && education.length > 0 && (
        <section style={{ background: 'var(--bg-2)', padding: '3.5rem 0', borderBottom: '1px solid var(--border)' }}>
          <div style={SECTION_WRAP}>
            <motion.span {...fadeUp(0)} style={SECTION_LABEL}>Education</motion.span>

            <div style={{ position: 'relative', paddingLeft: '2rem' }}>
              <div style={{ position: 'absolute', left: '6px', top: '10px', bottom: '10px', width: '1px', background: 'var(--border)' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
                {education.map((edu, i) => (
                  <motion.div key={edu.id} {...fadeUp(i * 0.1)} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-1.875rem', top: '5px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--bg-2)', boxShadow: '0 0 0 3px rgba(99,102,241,0.18)' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <GraduationCap size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                        <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>
                          {edu.degree}
                        </h3>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', background: 'var(--bg-3)', border: '1px solid var(--border)', padding: '0.2rem 0.6rem', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                        {edu.startDate} – {edu.endDate}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: 'var(--accent)', fontWeight: 500, marginBottom: '0.15rem', marginLeft: '1.5rem' }}>
                      {edu.institution}
                    </p>
                    {edu.location && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginLeft: '1.5rem' }}>
                        <MapPin size={11} /> {edu.location}
                      </p>
                    )}
                    {edu.description && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', marginTop: '0.5rem', lineHeight: 1.7, marginLeft: '1.5rem' }}>
                        {edu.description}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── KEY ACHIEVEMENTS ────────────────────────────────────── */}
      {profile.showAchievements && achievements.length > 0 && (
        <section style={{ background: 'var(--bg)', padding: '3.5rem 0', borderBottom: '1px solid var(--border)' }}>
          <div style={SECTION_WRAP}>
            <motion.span {...fadeUp(0)} style={SECTION_LABEL}>Key Achievements</motion.span>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {achievements.map((ach, i) => (
                <motion.div
                  key={ach.id}
                  {...fadeUp(i * 0.08)}
                  style={{ padding: '1.5rem', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.3)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
                >
                  <div style={{ width: 38, height: 38, borderRadius: '10px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Award size={16} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem', lineHeight: 1.35 }}>
                      {ach.title}
                    </h3>
                    {ach.issuer && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 500, marginBottom: '0.4rem' }}>
                        {ach.issuer}
                      </p>
                    )}
                    {ach.description && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.65 }}>
                        {ach.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SKILLS ──────────────────────────────────────────────── */}
      {profile.showSkills && skillGroups.length > 0 && (
        <section style={{ background: 'var(--bg-2)', padding: '3.5rem 0 4rem' }}>
          <div style={SECTION_WRAP}>
            <motion.span {...fadeUp(0)} style={SECTION_LABEL}>Skills</motion.span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {skillGroups.map((group, i) => (
                <motion.div
                  key={group.id}
                  {...fadeUp(i * 0.06)}
                  style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '1rem', alignItems: 'flex-start', paddingBottom: '1rem', borderBottom: i < skillGroups.length - 1 ? '1px solid var(--border)' : 'none' }}
                  className="about-skill-row"
                >
                  <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingTop: '0.2rem' }}>
                    {group.category}
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {group.skills.map(skill => (
                      <span key={skill} className="tag">{skill}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
