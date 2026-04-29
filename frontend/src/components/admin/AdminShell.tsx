'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen, BookOpen, Award, Trophy,
  BarChart2, Link2, Settings, MessageSquare, LogOut, Code2,
  Moon, Sun, Menu, X, TrendingUp, UserCircle,
} from 'lucide-react';
import { useTheme } from '../ThemeProvider';

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/about', icon: UserCircle, label: 'About Page' },
  { href: '/admin/projects', icon: FolderOpen, label: 'Projects' },
  { href: '/admin/research', icon: BookOpen, label: 'Research' },
  { href: '/admin/certifications', icon: Award, label: 'Certifications' },
  { href: '/admin/achievements', icon: Trophy, label: 'Achievements' },
  { href: '/admin/skills', icon: BarChart2, label: 'Skills' },
  { href: '/admin/stats', icon: TrendingUp, label: 'Stats' },
  { href: '/admin/social', icon: Link2, label: 'Social Links' },
  { href: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) router.replace('/admin/login');
    setMounted(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.replace('/admin/login');
  };

  if (!mounted) return null;

  const Sidebar = () => (
    <div style={{
      width: '240px', height: '100%',
      background: 'var(--bg-2)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      padding: '1.5rem 1rem',
      position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 50,
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <Link href="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', marginBottom: '2rem' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--accent), var(--accent))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Code2 size={17} color="white" />
        </div>
        <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '1rem' }}>
          Admin<span style={{ color: 'var(--accent)' }}>CMS</span>
        </span>
      </Link>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.6rem 0.875rem', borderRadius: '10px',
                textDecoration: 'none',
                background: active ? 'var(--accent-dim)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-2)',
                fontWeight: active ? 600 : 400,
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent',
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.6rem 0.875rem', borderRadius: '10px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-2)', fontSize: '0.875rem',
            width: '100%', textAlign: 'left',
          }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <Link
          href="/"
          target="_blank"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.6rem 0.875rem', borderRadius: '10px',
            textDecoration: 'none', color: 'var(--text-2)', fontSize: '0.875rem',
          }}
        >
          <Code2 size={16} /> View Site
        </Link>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.6rem 0.875rem', borderRadius: '10px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#ef4444', fontSize: '0.875rem', width: '100%', textAlign: 'left',
          }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:block" style={{ width: '240px', flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 40,
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
              }}
            />
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden"
              style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 50 }}
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar (mobile) */}
        <div className="md:hidden" style={{
          padding: '0.875rem 1.25rem',
          background: 'var(--bg-2)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <span style={{ fontWeight: 700, color: 'var(--text)' }}>Admin Panel</span>
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)' }}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
