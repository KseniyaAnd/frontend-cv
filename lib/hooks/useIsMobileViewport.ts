'use client';

import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  return isMobile;
}
