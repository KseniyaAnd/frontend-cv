'use client';

import { useActionState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { PasswordInput } from '../PasswordInput';
import { loginAction } from '@/lib/actions/login';
type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const locale = useLocale();

  const [state, formAction, pending] = useActionState(loginAction, {});

  const { control } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center px-4">
      <form action={formAction} className="flex w-full max-w-md flex-col items-center">
        <h1 className="mb-3 text-center text-3xl font-normal text-text md:text-4xl">
          {t('welcomeBack')}
        </h1>

        <p className="mb-8 text-center text-sm text-text-secondary">{t('loginSubtitle')}</p>

        {state.error && (
          <div className="mb-6 w-full rounded-input border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
            {state.error}
          </div>
        )}

        <Controller
          name="email"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <div className="mb-4 w-full">
              <input
                {...field}
                name="email"
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
            disabled={pending}
            className="flex h-12 w-60 items-center justify-center rounded-button bg-primary text-sm font-bold uppercase tracking-wider text-primary-contrast transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? '...' : t('login')}
          </button>

          <button
            type="button"
            onClick={() => router.push(`/${locale}/forgot-password`)}
            className="text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-text transition-colors"
          >
            {t('forgotPassword')}
          </button>
        </div>
      </form>
    </div>
  );
}
