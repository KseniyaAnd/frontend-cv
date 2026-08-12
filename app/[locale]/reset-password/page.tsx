'use client';

import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/lib/components/Input';
import { resetPasswordAction } from '@/lib/actions/reset-password';

type ResetPasswordForm = {
  newPassword: string;
  confirmPassword: string;
};

export default function ResetPasswordPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const token = searchParams.get('token');

  const [state, formAction, pending] = useActionState(resetPasswordAction, {});

  const { control, watch } = useForm<ResetPasswordForm>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center px-4">
      <form action={formAction} className="flex w-full max-w-md flex-col items-center">
        <input type="hidden" name="token" value={token ?? ''} />

        <h1 className="mb-3 text-center text-3xl font-normal text-text md:text-4xl">
          {t('resetPasswordTitle')}
        </h1>

        <p className="mb-8 text-center text-sm text-text-secondary">{t('resetPasswordSubtitle')}</p>

        {state.error && (
          <div className="mb-6 w-full rounded-input border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
            {state.error}
          </div>
        )}

        <div className="mb-4 w-full">
          <Input
            control={control}
            name="newPassword"
            type="password"
            placeholder={t('newPassword')}
            autoComplete="new-password"
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
          <Input
            control={control}
            name="confirmPassword"
            type="password"
            placeholder={t('confirmPassword')}
            autoComplete="new-password"
            rules={{
              required: t('errors.confirmPasswordRequired'),
              validate: (value) =>
                value === watch('newPassword') || t('errors.passwordsDoNotMatch'),
            }}
          />
        </div>

        <div className="flex w-full flex-col items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="flex h-12 w-60 items-center justify-center rounded-button bg-primary text-sm font-bold uppercase tracking-wider text-primary-contrast transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? '...' : t('submit')}
          </button>

          <button
            type="button"
            onClick={() => router.push(`/${locale}/auth/login`)}
            disabled={pending}
            className="text-xs font-bold uppercase tracking-wider text-text-secondary transition-colors hover:text-text disabled:opacity-50"
          >
            {t('goToSignIn')}
          </button>
        </div>
      </form>
    </div>
  );
}
