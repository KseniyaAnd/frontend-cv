'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { WifiOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/lib/components/Button';

export function OfflineDetector({ children }: { children: ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);
  const t = useTranslations('common.error');

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    if (!navigator.onLine) setIsOffline(true);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (isOffline) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="flex w-full max-w-md flex-col items-center text-center">
          <div className="mb-6">
            <WifiOff className="h-16 w-16 text-text" />
          </div>
          <h1 className="mb-3 text-4xl font-semibold text-text">{t('title')}</h1>
          <p className="mb-8 text-base leading-6 text-text-secondary">{t('offline')}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            {t('retry')}
          </Button>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
