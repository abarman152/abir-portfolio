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

async function getDefaultTheme(): Promise<'dark' | 'light'> {
  try {
    const res = await fetch(`${API}/settings`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return 'dark';
    const data = await res.json();
    return data?.defaultTheme === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export const metadata: Metadata = {
  title: 'Abir — Data Scientist',
  description: 'Data Scientist and ML Engineer building intelligent systems that turn data into real-world impact.',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico?v=2',       sizes: 'any' },
      { url: '/favicon-16x16.png?v=2', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png?v=2', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png?v=2',
  },
  openGraph: {
    title: 'Abir — Data Scientist',
    description: 'Data Scientist and ML Engineer building intelligent systems that turn data into real-world impact.',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Abir — Data Scientist' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abir — Data Scientist',
    description: 'Data Scientist and ML Engineer building intelligent systems that turn data into real-world impact.',
    images: ['/og-image.png'],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const dbDefault = await getDefaultTheme();

  // CRITICAL: Set data-theme on <html> SERVER-SIDE so the first paint is correct.
  // Without this, the HTML arrives without data-theme → CSS defaults to :root (light)
  // → visible flash before the inline script runs.
  //
  // The inline script then overrides with localStorage if the user has toggled before.
  // Priority: localStorage > system preference > DB default
  const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t&&t!==document.documentElement.getAttribute('data-theme')){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

  return (
    <html
      lang="en"
      data-theme={dbDefault}
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
