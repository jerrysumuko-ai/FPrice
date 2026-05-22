"use client"

import { useEffect } from 'react';

function ThemeInit() {
  useEffect(() => {
    const stored = localStorage.getItem('fuelfinder-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = stored ?? (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }, []);
  return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeInit />
      {children}
    </>
  );
}
