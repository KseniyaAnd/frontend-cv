'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { PasswordInput } from '../PasswordInput';
import { signup } from '@/lib/graphql/auth';

type SignupForm = {
  email: string;
  password: string;
};

export default function SignupPage() {
  const t = useTranslations('auth');
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<SignupForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const getErrorMessage = (error: any, fallback: string): string => {
    return error?.response?.errors?.[0]?.message ?? fallback;
  };

  const onSubmit = async (values: SignupForm) => {
    setServerError(null);
    setLoading(true);

    try {
      const result = await signup(values);

      localStorage.setItem('access_token', result.access_token);
      localStorage.setItem('refresh_token', result.refresh_token);

      router.push('/');
    } catch (err: any) {
      setServerError(getErrorMessage(err, t('errors.invalidCredentials')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-md flex-col items-center"
      >
        <h1 className="mb-3 text-center text-3xl font-normal text-text md:text-4xl">
          {t('registerNow')}
        </h1>

        <p className="mb-8 text-center text-sm text-text-secondary">{t('signupSubtitle')}</p>

        {serverError && (
          <div className="mb-6 w-full rounded-input border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
            {serverError}
          </div>
        )}

        <Controller
          name="email"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <div className="mb-4 w-full">
              <input
                {...field}
                type="email"
                placeholder={t('email')}
                className="w-full rounded-input border border-border bg-surface px-4 py-3.5 text-sm text-text placeholder:text-text-secondary outline-none transition focus:border-text"
              />
            </div>
          )}
        />

        <div className="mb-8 w-full">
          <PasswordInput control={control} name="password" label={t('password')} />
        </div>

        <div className="flex w-full flex-col items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-60 items-center justify-center rounded-button bg-primary text-sm font-bold uppercase tracking-wider text-primary-contrast transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? '...' : t('createAccount')}
          </button>

          <button
            type="button"
            onClick={() => router.push('/auth/login')}
            className="text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-text transition-colors"
          >
            {t('haveAccount')}
          </button>
        </div>
      </form>
    </div>
  );
}
