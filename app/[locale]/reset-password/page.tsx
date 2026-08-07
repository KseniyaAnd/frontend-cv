'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword, login } from '@/lib/graphql/auth';
import { PasswordInput } from '../auth/PasswordInput';
import { getErrorMessage } from '@/lib/utils/error';

type ResetPasswordForm = {
  newPassword: string;
  confirmPassword: string;
};

function decodeEmailFromToken(token: string): string | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded.email ?? null;
  } catch {
    return null;
  }
}

export default function ResetPasswordPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { control, handleSubmit, watch } = useForm<ResetPasswordForm>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: ResetPasswordForm) => {
    setServerError(null);

    if (!token) {
      setServerError(t('errors.resetLinkExpired'));
      return;
    }

    const email = decodeEmailFromToken(token);

    if (!email) {
      setServerError(t('errors.resetLinkExpired'));
      return;
    }

    startTransition(async () => {
      try {
        await resetPassword(token, values.newPassword, values.confirmPassword);

        const { login: result } = await login({ email, password: values.newPassword });

        localStorage.setItem('access_token', result.access_token);
        localStorage.setItem('refresh_token', result.refresh_token);

        router.push('/');
        router.refresh();
      } catch (err: unknown) {
        setServerError(getErrorMessage(err, t('errors.resetPasswordFailed')));
      }
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-md flex-col items-center"
      >
        <h1 className="mb-3 text-center text-3xl font-normal text-text md:text-4xl">
          {t('resetPasswordTitle')}
        </h1>
        <p className="mb-8 text-center text-sm text-text-secondary">{t('resetPasswordSubtitle')}</p>

        {serverError && (
          <div className="mb-6 w-full rounded-input border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
            {serverError}
          </div>
        )}

        <div className="mb-4 w-full">
          <PasswordInput
            control={control}
            name="newPassword"
            label={t('newPassword')}
            rules={{
              required: t('errors.passwordRequired'),
              minLength: {
                value: 6,
                message: t('errors.passwordMinLength'),
              },
            }}
          />
        </div>

        <div className="mb-8 w-full">
          <PasswordInput
            control={control}
            name="confirmPassword"
            label={t('confirmPassword')}
            rules={{
              required: t('errors.confirmPasswordRequired'),
              validate: (value: string) =>
                value === watch('newPassword') || t('errors.passwordsDoNotMatch'),
            }}
          />
        </div>

        <div className="flex w-full flex-col items-center gap-4">
          <button
            type="submit"
            disabled={isPending}
            className="flex h-12 w-60 items-center justify-center rounded-button bg-primary text-sm font-bold uppercase tracking-wider text-primary-contrast transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? '...' : t('submit')}
          </button>

          <button
            type="button"
            onClick={() => router.push('/login')}
            disabled={isPending}
            className="text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-text transition-colors disabled:opacity-50"
          >
            {t('goToSignIn')}
          </button>
        </div>
      </form>
    </div>
  );
}
