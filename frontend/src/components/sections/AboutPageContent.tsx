'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Award, GraduationCap } from 'lucide-react';
import type { AboutProfile, Education, AboutSkillGroup, Achievement } from '@/lib/types';

function LinkedInIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
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
  const contacts = [
    { icon: Phone, text: profile.phone, href: `tel:${profile.phone}` },
    { icon: Mail, text: profile.email, href: `mailto:${profile.email}` },
    { icon: LinkedInIcon, text: (profile.linkedinUrl || '').replace('https://', ''), href: profile.linkedinUrl },
    { icon: MapPin, text: profile.location, href: undefined },
  ].filter(c => c.text);

  return (
    <div style={{ paddingTop: '60px', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '4rem 0 3.5rem' }}>
        <div style={SECTION_WRAP}>
          <div className="about-page-header">

            {/* Left: identity */}
            <div style={{ minWidth: 0 }}>
              <motion.span
                {...fadeUp(0)}
                style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1rem' }}
              >
                Portfolio · About
              </motion.span>

              <motion.h1
                {...fadeUp(0.06)}
                style={{ fontSize: 'clamp(1.9rem, 4vw, 2.75rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: '0.5rem' }}
              >
                {profile.name}
              </motion.h1>

              <motion.p
                {...fadeUp(0.12)}
                style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.4rem' }}
              >
                {profile.title}
              </motion.p>

              <motion.p
                {...fadeUp(0.17)}
                style={{ fontSize: '0.875rem', color: 'var(--text-2)', marginBottom: '2rem', lineHeight: 1.6, maxWidth: '540px' }}
              >
                {profile.subtitle}
              </motion.p>

              {/* Contact pills */}
              <motion.div {...fadeUp(0.23)} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {contacts.map(({ icon: Icon, text, href }, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.375rem 0.8rem', borderRadius: '8px', background: 'var(--bg-3)', border: '1px solid var(--border)', fontSize: '0.775rem', color: 'var(--text-2)' }}>
                    <Icon size={12} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    {href ? (
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                         style={{ color: 'inherit', textDecoration: 'none' }}
                         onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text)')}
                         onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-2)')}
                      >{text}</a>
                    ) : text}
                  </span>
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
            <div style={{ display: 'grid', gridTemplateColumns: profile.secondaryPhoto ? '1fr 160px' : '1fr', gap: '2.5rem', alignItems: 'start' }}>
              <div>
                <motion.span {...fadeUp(0)} style={SECTION_LABEL}>Professional Summary</motion.span>
                <motion.p
                  {...fadeUp(0.08)}
                  style={{ fontSize: '0.975rem', color: 'var(--text-2)', lineHeight: 1.9, maxWidth: '700px' }}
                >
                  {profile.summary}
                </motion.p>
              </div>

              {profile.secondaryPhoto && (
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="about-secondary-photo">
                  <div style={{ width: '140px', height: '165px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
                    <img src={profile.secondaryPhoto} alt="Secondary" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </motion.div>
              )}
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
