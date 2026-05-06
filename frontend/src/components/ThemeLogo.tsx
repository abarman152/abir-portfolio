'use client';

import Image from 'next/image';

interface ThemeLogoProps {
  width?: number;
  height?: number;
  alt?: string;
  priority?: boolean;
  className?: string;
}

export default function ThemeLogo({
  width = 30,
  height = 30,
  alt = 'Abir logo',
  priority = false,
  className = '',
}: ThemeLogoProps) {
  return (
    <>
      <Image
        src="/branding/logo-white.png"
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={`theme-logo-for-dark ${className}`.trim()}
      />
      <Image
        src="/branding/logo-black.png"
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={`theme-logo-for-light ${className}`.trim()}
      />
    </>
  );
}
