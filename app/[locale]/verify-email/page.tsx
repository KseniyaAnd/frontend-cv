'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { verifyMail } from '@/lib/graphql/auth';
import { getErrorMessage } from '@/lib/utils/error';

export default function VerifyEmailPage() {
  const t = useTranslations('auth');
  const router = useRouter();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inputs = useRef<(HTMLInputElement | null)[]>([]);

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

    const focusIndex = Math.min(pasted.length, 5);
    inputs.current[focusIndex]?.focus();
  };

  const onSubmit = async () => {
    const otp = code.join('');

    if (otp.length !== 6) {
      setError(t('errors.invalidVerificationCode'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verifyMail(otp);
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(getErrorMessage(err, t('errors.invalidVerificationCode')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-3 text-3xl text-text">{t('emailVerification')}</h1>

        <p className="mb-8 text-sm text-text-secondary">{t('emailVerificationSubtitle')}</p>

        {error && (
          <div className="mb-6 rounded-input border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
            {error}
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
              style={{
                width: '48px',
                height: '48px',
                marginRight: index < 5 ? '12px' : '0',
              }}
              className="box-border shrink-0 grow-0 basis-auto border border-border bg-surface text-center text-xl text-text outline-none focus:border-primary"
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onSubmit}
            disabled={loading}
            className="flex h-12 w-60 items-center justify-center rounded-button bg-primary text-sm font-bold uppercase tracking-wider text-primary-contrast transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? '...' : t('confirm')}
          </button>

          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-text"
          >
            {t('later')}
          </button>
        </div>
      </div>
    </div>
  );
}
