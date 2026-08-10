'use client';

import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Input } from '@/lib/components/Input';
import { forgotPasswordAction } from '@/lib/actions/forgot-password';

type ForgotPasswordForm = {
  email: string;
};

export default function ForgotPasswordPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const locale = useLocale();

  const [state, formAction, pending] = useActionState(forgotPasswordAction, {});

  const { control } = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: '',
    },
  });

  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center px-4">
      <form action={formAction} className="flex w-full max-w-md flex-col items-center" noValidate>
        <h1 className="mb-3 text-center text-3xl font-normal text-text md:text-4xl">
          {t('forgotPasswordTitle')}
        </h1>

        <p className="mb-8 text-center text-sm text-text-secondary">
          {t('forgotPasswordSubtitle')}
        </p>

        {state.error && (
          <div className="mb-6 w-full rounded-input border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
            {state.error}
          </div>
        )}

        {state.success && (
          <div className="mb-6 w-full rounded-input border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
            {t('passwordResetEmailSent')}
          </div>
        )}

        <div className="mb-8 w-full">
          <Input
            control={control}
            name="email"
            type="email"
            placeholder="example@email.com"
            autoComplete="email"
            rules={{
              required: t('errors.emailRequired'),
              pattern: {
                value: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
                message: t('errors.invalidEmail'),
              },
            }}
          />
        </div>

        <div className="flex w-full flex-col items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="flex h-12 w-60 items-center justify-center rounded-button bg-primary text-sm font-bold uppercase tracking-wider text-primary-contrast transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? '...' : t('resetPassword')}
          </button>

          <button
            type="button"
            onClick={() => router.push(`/${locale}/auth/login`)}
            disabled={pending}
            className="text-xs font-bold uppercase tracking-wider text-text-secondary transition-colors hover:text-text focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {t('cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}
