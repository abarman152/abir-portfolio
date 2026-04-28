'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun, Menu, X, Code2 } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import Link from 'next/link';

const navLinks = [
  { href: '/',               label: 'Home' },
  { href: '#about',          label: 'About Me' },
  { href: '#projects',       label: 'Projects' },
  { href: '#research',       label: 'Research' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#achievements',   label: 'Achievements' },
  { href: '#contact',        label: 'Contact' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.4 }
    );
    document.querySelectorAll('section[id]').forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const isActive = (href: string) =>
    href === '/' ? activeSection === '' : activeSection === href.slice(1);

  return (
    <>
      <motion.nav
        initial={{ y: -72 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          height: '60px',
          display: 'flex', alignItems: 'center',
          padding: '0 2rem',
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
          <div style={{
            width: 30, height: 30, borderRadius: '8px',
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Code2 size={15} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', letterSpacing: '-0.01em' }}>
            Abir<span style={{ color: 'var(--accent)' }}>.dev</span>
          </span>
        </Link>

        {/* ── Desktop links ─────────────────────────── */}
        <div
          style={{ display: 'flex', gap: '0.125rem', alignItems: 'center', flex: 1 }}
          className="hidden md:flex"
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                style={{
                  padding: '0.35rem 0.7rem',
                  borderRadius: '7px',
                  fontSize: '0.825rem',
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--text)' : 'var(--text-2)',
                  background: active ? 'var(--bg-3)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'color 0.15s, background 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'; }}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* ── Right actions ─────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto', flexShrink: 0 }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
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

      {/* ── Mobile menu ─────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed', top: 60, left: 0, right: 0, zIndex: 99,
              background: 'var(--bg-2)', backdropFilter: 'blur(18px)',
              borderBottom: '1px solid var(--border)',
              padding: '0.75rem 2rem 1.25rem',
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block', padding: '0.65rem 0',
                  color: 'var(--text-2)', textDecoration: 'none',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '0.9rem', fontWeight: 500,
                }}
              >
                {link.label}
              </a>
            ))}
            <div style={{ display: 'flex', gap: '0.625rem', marginTop: '1rem' }}>
              <a href="#" style={{ flex: 1, padding: '0.65rem', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--border)', color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
                Resume
              </a>
              <a href="#contact" onClick={() => setMobileOpen(false)} style={{ flex: 1, padding: '0.65rem', textAlign: 'center', borderRadius: '8px', background: 'var(--accent)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
                Hire Me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
