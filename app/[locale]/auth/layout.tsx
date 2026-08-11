'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { NavigationTabs } from '@/lib/components/NavigationTabs';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('auth');
  const pathname = usePathname();
  const router = useRouter();

  const isSignup = pathname.includes('/signup');

  return (
    <div className="flex min-h-screen flex-col bg-background text-text transition-colors">
      <NavigationTabs
        items={[
          {
            label: t('login'),
            onAction: () => router.push('/auth/login'),
            isActive: !isSignup,
          },
          {
            label: t('signup'),
            onAction: () => router.push('/auth/signup'),
            isActive: isSignup,
          },
        ]}
      />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-4">
        <div className="w-full max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
