'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({
  theme: 'dark',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Sync React state with whatever the inline script + server set
    const current = document.documentElement.getAttribute('data-theme') as Theme;
    if (current) setTheme(current);

    // If no localStorage override exists, also respect system preference
    // (the server only knows the DB default, not the user's system preference)
    const stored = localStorage.getItem('theme');
    if (!stored) {
      const systemDark = window.matchMedia('(prefers-color-scheme:dark)').matches;
      const systemTheme: Theme = systemDark ? 'dark' : 'light';
      if (systemTheme !== current) {
        document.documentElement.setAttribute('data-theme', systemTheme);
        setTheme(systemTheme);
      }
    }
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
