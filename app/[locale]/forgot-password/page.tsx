'use client';

import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { forgotPassword } from '@/lib/graphql/auth';
import { getErrorMessage } from '@/lib/utils/error';

type ForgotPasswordForm = {
  email: string;
};

export default function ForgotPasswordPage() {
  const t = useTranslations('auth');
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: ForgotPasswordForm) => {
    setServerError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        await forgotPassword(values.email);

        setSuccessMessage(
          t('passwordResetEmailSent') ||
            'Password reset instructions have been sent to your email address.',
        );
      } catch (err: unknown) {
        setServerError(
          getErrorMessage(
            err,
            t('errors.resetPasswordFailed') || 'Something went wrong. Please try again later.',
          ),
        );
      }
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-md flex-col items-center"
        noValidate
      >
        <h1 className="mb-3 text-center text-3xl font-normal text-text md:text-4xl">
          {t('forgotPasswordTitle') || 'Forgot password'}
        </h1>

        <p className="mb-8 text-center text-sm text-text-secondary">
          {t('forgotPasswordSubtitle') || 'We will send you an email with further instructions'}
        </p>

        {serverError && (
          <div className="mb-6 w-full rounded-input border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
            {serverError}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 w-full rounded-input border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
            {successMessage}
          </div>
        )}

        <Controller
          name="email"
          control={control}
          rules={{
            required: t('errors.emailRequired') || 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t('errors.invalidEmail') || 'Please enter a valid email address',
            },
          }}
          render={({ field }) => (
            <div className="mb-8 w-full">
              <input
                {...field}
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`w-full rounded-input border bg-surface px-4 py-3.5 text-sm text-text placeholder:text-text-secondary outline-none transition focus:border-text ${
                  errors.email ? 'border-primary' : 'border-border hover:border-text-secondary'
                }`}
                placeholder="example@email.com"
              />

              {errors.email && (
                <p id="email-error" className="mt-2 text-sm text-primary">
                  {errors.email.message}
                </p>
              )}
            </div>
          )}
        />

        <div className="flex w-full flex-col items-center gap-4">
          <button
            type="submit"
            disabled={isPending}
            className="flex h-12 w-60 items-center justify-center rounded-button bg-primary text-sm font-bold uppercase tracking-wider text-primary-contrast transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? '...' : t('resetPassword') || 'Reset password'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/auth/login')}
            disabled={isPending}
            className="text-xs font-bold uppercase tracking-wider text-text-secondary transition-colors hover:text-text focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {t('cancel') || 'Cancel'}
          </button>
        </div>
      </form>
    </div>
  );
}
