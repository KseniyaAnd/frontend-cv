'use client';

import { useIsMobileViewport } from '@/lib/hooks/useIsMobileViewport';
import { DeviceErrorPage } from '@/lib/components/DeviceErrorPage';

export function DeviceGuard({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobileViewport();

  if (isMobile) {
    return <DeviceErrorPage />;
  }

  return <>{children}</>;
}
