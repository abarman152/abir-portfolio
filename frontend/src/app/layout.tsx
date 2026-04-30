import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

async function getDefaultTheme(): Promise<string> {
  try {
    const res = await fetch(`${API}/settings`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return 'dark';
    const data = await res.json();
    return data?.defaultTheme || 'dark';
  } catch {
    return 'dark';
  }
}

export const metadata: Metadata = {
  title: 'Abir Barman — Data Scientist',
  description: 'Data Scientist and ML Engineer building intelligent systems that turn data into real-world impact.',
  openGraph: {
    title: 'Abir Barman — Data Scientist',
    description: 'Data Scientist and ML Engineer building intelligent systems that turn data into real-world impact.',
    type: 'website',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const dbDefault = await getDefaultTheme();

  // The inline script runs BEFORE hydration:
  // 1. If user has a localStorage preference → use that
  // 2. If system prefers dark → use 'dark'
  // 3. Otherwise → use the DB-configured default theme
  const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t){document.documentElement.setAttribute('data-theme',t);return;}var d='${dbDefault}';if(window.matchMedia){var m=window.matchMedia('(prefers-color-scheme:dark)');if(m.matches){d='dark';}else if(window.matchMedia('(prefers-color-scheme:light)').matches){d='light';}}document.documentElement.setAttribute('data-theme',d);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
