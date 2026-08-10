'use client';

import { useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { OtpInput } from '@/lib/components/OtpInput';
import { verifyEmailAction } from '@/lib/actions/verify-email';

export default function VerifyEmailPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const locale = useLocale();

  const [code, setCode] = useState(Array(6).fill(''));

  const [state, formAction, pending] = useActionState(verifyEmailAction, {});

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
      <form action={formAction} className="w-full max-w-md text-center">
        <input type="hidden" name="code" value={code.join('')} />
        <input type="hidden" name="locale" value={locale} />

        <h1 className="mb-3 text-3xl text-text">{t('emailVerification')}</h1>

        <p className="mb-8 text-sm text-text-secondary">{t('emailVerificationSubtitle')}</p>

        {state.error && (
          <div className="mb-6 rounded-input border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
            {state.error}
          </div>
        )}

        <div className="mb-8">
          <OtpInput
            value={code}
            onChange={setCode}
            length={6}
            disabled={pending}
            error={!!state.error}
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            type="submit"
            disabled={pending || code.join('').length !== 6}
            className="flex h-12 w-60 items-center justify-center rounded-button bg-primary text-sm font-bold uppercase tracking-wider text-primary-contrast transition hover:opacity-90 disabled:opacity-50"
          >
            {pending ? '...' : t('confirm')}
          </button>

          <button
            type="button"
            onClick={() => router.push(`/${locale}`)}
            disabled={pending}
            className="text-xs font-bold uppercase tracking-wider text-text-secondary transition-colors hover:text-text disabled:opacity-50"
          >
            {t('later')}
          </button>
        </div>
      </form>
    </div>
  );
}
