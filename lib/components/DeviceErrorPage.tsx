'use client';

import { useTranslations } from 'next-intl';
import { MonitorX } from 'lucide-react';

export function DeviceErrorPage() {
  const t = useTranslations('common.deviceError');

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <div className="mb-6 flex justify-center">
          <MonitorX className="h-16 w-16 stroke-[1.5]" />
        </div>

        <h1 className="mb-3 text-3xl font-semibold text-text">{t('title')}</h1>

        <p className="text-base leading-relaxed text-text-secondary">{t('message')}</p>
      </div>
    </main>
  );
}
