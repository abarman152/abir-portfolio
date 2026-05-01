'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/',               label: 'Home' },
  { href: '/about',          label: 'About' },
  { href: '/projects',       label: 'Projects' },
  { href: '/research',       label: 'Research' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/achievements',   label: 'Achievements' },
  { href: '/#contact',       label: 'Contact' },
];

const drawerGroups = [
  [
    { href: '/',         label: 'Home' },
    { href: '/about',    label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/research', label: 'Research' },
  ],
  [
    { href: '/certifications', label: 'Certifications' },
    { href: '/achievements',   label: 'Achievements' },
  ],
  [
    { href: '/#contact', label: 'Contact' },
  ],
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    if (pathname !== '/') return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.4 }
    );
    document.querySelectorAll('section[id]').forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' && activeSection === '';
    if (href === '/about') return pathname.startsWith('/about');
    if (href === '/projects') return pathname.startsWith('/projects');
    if (href === '/research') return pathname.startsWith('/research');
    if (href === '/certifications') return pathname.startsWith('/certifications');
    if (href === '/achievements') return pathname.startsWith('/achievements');
    if (href.startsWith('/#')) return pathname === '/' && activeSection === href.slice(2);
    return false;
  };

  return (
    <>
      <motion.nav
        initial={{ y: -72 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          height: '60px',
          display: 'flex', alignItems: 'center',
          padding: '0 1rem',
          overflow: 'hidden',
          background: scrolled ? 'var(--bg-2)' : 'transparent',
          backdropFilter: scrolled ? 'blur(18px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'background 0.25s ease, border-color 0.25s ease',
        }}
      >
        {/* ── Logo ─────────────────────────────────── */}
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginRight: '2rem', flexShrink: 0 }}
        >
          <img src="/logo.svg" alt="Abir logo" style={{ width: 30, height: 30, display: 'block' }} />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', letterSpacing: '-0.01em' }}>
            Abir
          </span>
        </Link>

        {/* ── Desktop links ─────────────────────────── */}
        <div
          style={{ gap: '0.125rem', alignItems: 'center', flex: 1 }}
          className="hidden md:flex"
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const baseStyle: React.CSSProperties = {
              position: 'relative',
              padding: '0.35rem 0.7rem',
              borderRadius: '7px',
              fontSize: '0.825rem',
              fontWeight: active ? 600 : 400,
              color: active ? 'var(--text)' : 'var(--text-2)',
              background: 'transparent',
              textDecoration: 'none',
              transition: 'color 0.18s ease',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
            };
            const pill = active ? (
              <motion.span
                layoutId="nav-pill"
                style={{
                  position: 'absolute', inset: 0,
                  borderRadius: '7px',
                  background: 'var(--bg-3)',
                  zIndex: -1,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 38, mass: 0.6 }}
              />
            ) : null;
            return link.href.startsWith('/') && !link.href.startsWith('/#') ? (
              <Link key={link.href} href={link.href} style={baseStyle}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'; }}
              >
                {pill}{link.label}
              </Link>
            ) : (
              <a key={link.href} href={link.href} style={baseStyle}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'; }}
              >
                {pill}{link.label}
              </a>
            );
          })}
        </div>

        {/* ── Right actions ─────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto', flexShrink: 0 }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="nav-icon-btn"
            style={{
              width: 32, height: 32, borderRadius: '8px',
              background: 'var(--bg-3)', border: '1px solid var(--border)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-2)',
            }}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Resume */}
          <a
            href="#"
            className="hidden md:flex"
            style={{
              padding: '0.35rem 0.875rem', borderRadius: '7px',
              border: '1px solid var(--border)',
              fontSize: '0.825rem', fontWeight: 500,
              color: 'var(--text-2)', textDecoration: 'none',
              transition: 'border-color 0.15s, color 0.15s',
              display: 'inline-flex', alignItems: 'center',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-2)';
            }}
          >
            Resume
          </a>

          {/* Hire Me */}
          <a
            href="#contact"
            className="hidden md:flex"
            style={{
              padding: '0.375rem 1rem', borderRadius: '7px',
              background: 'var(--accent)', color: 'white',
              fontSize: '0.825rem', fontWeight: 600,
              textDecoration: 'none',
              transition: 'opacity 0.15s',
              display: 'inline-flex', alignItems: 'center',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            Hire Me
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', display: 'flex', padding: '4px' }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile drawer ───────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 110,
                background: 'rgba(0,0,0,0.55)',
              }}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: '80%', maxWidth: '320px',
                zIndex: 120,
                background: 'var(--bg-2)',
                borderLeft: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column',
                overflowY: 'auto',
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--border)',
                flexShrink: 0,
              }}>
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
                >
                  <img src="/logo.svg" alt="Abir logo" style={{ width: 26, height: 26 }} />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>Abir</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  style={{
                    background: 'var(--bg-3)', border: '1px solid var(--border)',
                    borderRadius: '8px', width: 32, height: 32,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-2)',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Nav groups */}
              <nav style={{ flex: 1, padding: '0.75rem 0' }}>
                {drawerGroups.map((group, gi) => (
                  <div key={gi}>
                    {group.map((link) => {
                      const active = isActive(link.href);
                      const isPage = link.href.startsWith('/') && !link.href.startsWith('/#');
                      const itemStyle: React.CSSProperties = {
                        display: 'flex', alignItems: 'center',
                        padding: '0.7rem 1.25rem',
                        fontSize: '0.95rem',
                        fontWeight: active ? 600 : 400,
                        color: active ? 'var(--text)' : 'var(--text-2)',
                        textDecoration: 'none',
                        transition: 'color 0.15s, background 0.15s',
                        borderRadius: '6px',
                        margin: '0 0.5rem',
                        background: active ? 'var(--bg-3)' : 'transparent',
                      };
                      return isPage ? (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          style={itemStyle}
                          onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-3)'; } }}
                          onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; } }}
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          style={itemStyle}
                          onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-3)'; } }}
                          onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; } }}
                        >
                          {link.label}
                        </a>
                      );
                    })}
                    {gi < drawerGroups.length - 1 && (
                      <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 1.25rem' }} />
                    )}
                  </div>
                ))}
              </nav>

              {/* CTA buttons */}
              <div style={{
                padding: '1rem 1.25rem 1.5rem',
                borderTop: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column', gap: '0.625rem',
                flexShrink: 0,
              }}>
                <a
                  href="#"
                  style={{
                    display: 'block', textAlign: 'center',
                    padding: '0.7rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    color: 'var(--text-2)',
                    textDecoration: 'none',
                    fontSize: '0.875rem', fontWeight: 500,
                    transition: 'border-color 0.15s, color 0.15s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'; }}
                >
                  Resume
                </a>
                <a
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'block', textAlign: 'center',
                    padding: '0.7rem',
                    borderRadius: '8px',
                    background: 'var(--accent)',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.875rem', fontWeight: 600,
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                >
                  Hire Me
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
