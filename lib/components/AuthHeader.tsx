'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

export default function AuthHeader() {
  const t = useTranslations('auth');
  const pathname = usePathname();
  const router = useRouter();

  const isSignup = pathname.includes('/signup');

  const baseButtonStyles =
    'relative px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors';
  const activeTabStyles = 'text-primary';
  const inactiveTabStyles = 'text-text-secondary hover:text-text';

  return (
    <header className="flex w-full justify-center pt-4">
      <nav className="flex">
        <button
          type="button"
          onClick={() => router.push('/auth/login')}
          className={`${baseButtonStyles} ${!isSignup ? activeTabStyles : inactiveTabStyles}`}
        >
          {t('login')}
          {!isSignup && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />}
        </button>

        <button
          type="button"
          onClick={() => router.push('/auth/signup')}
          className={`${baseButtonStyles} ${isSignup ? activeTabStyles : inactiveTabStyles}`}
        >
          {t('signup')}
          {isSignup && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />}
        </button>
      </nav>
    </header>
  );
}
