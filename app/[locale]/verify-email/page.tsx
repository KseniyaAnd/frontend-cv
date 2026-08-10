'use client';

import { useEffect, useRef, useState } from 'react';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { verifyEmailAction } from '@/lib/actions/verify-email';

export default function VerifyEmailPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const locale = useLocale();

  const [code, setCode] = useState(['', '', '', '', '', '']);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const [state, formAction, pending] = useActionState(verifyEmailAction, {});

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...code];

    next[index] = value;

    setCode(next);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

    if (!pasted) return;

    const next = [...code];

    pasted.split('').forEach((digit, i) => {
      next[i] = digit;
    });

    setCode(next);

    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

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

        <div className="mb-8 inline-flex justify-center">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputs.current[index] = el;
              }}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              inputMode="numeric"
              maxLength={1}
              className="mr-3 box-border h-12 w-12 border border-border bg-surface text-center text-xl text-text outline-none focus:border-primary last:mr-0"
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="flex h-12 w-60 items-center justify-center rounded-button bg-primary text-sm font-bold uppercase tracking-wider text-primary-contrast transition hover:opacity-90 disabled:opacity-50"
          >
            {pending ? '...' : t('confirm')}
          </button>

          <button
            type="button"
            onClick={() => router.push(`/${locale}`)}
            className="text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-text"
          >
            {t('later')}
          </button>
        </div>
      </form>
    </div>
  );
}
