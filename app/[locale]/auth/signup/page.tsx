'use client';

import { useActionState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { signupAction } from '@/lib/actions/signup';
import { Input } from '@/lib/components/Input';
import { Button } from '@/lib/components/Button';

type SignupForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const locale = useLocale();

  const [state, formAction, pending] = useActionState(signupAction, {});

  const { control } = useForm<SignupForm>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center px-4">
      <form action={formAction} className="flex w-full max-w-md flex-col items-center">
        <h1 className="mb-3 text-center text-3xl font-normal text-text md:text-4xl">
          {t('registerNow')}
        </h1>

        <p className="mb-8 text-center text-sm text-text-secondary">{t('signupSubtitle')}</p>

        {state.error && (
          <div className="mb-6 w-full rounded-input border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
            {state.error}
          </div>
        )}

        <div className="mb-4 w-full">
          <Input
            control={control}
            name="email"
            type="email"
            placeholder={t('email')}
            autoComplete="email"
            rules={{ required: t('errors.emailRequired') }}
          />
        </div>

        <div className="mb-4 w-full">
          <Input
            control={control}
            name="password"
            type="password"
            placeholder={t('password')}
            autoComplete="new-password"
            rules={{ required: t('errors.passwordRequired') }}
          />
        </div>

        <div className="mb-8 w-full">
          <Input
            control={control}
            name="confirmPassword"
            type="password"
            placeholder={t('confirmPassword')}
            autoComplete="new-password"
            rules={{ required: t('errors.confirmPasswordRequired') }}
          />
        </div>

        <div className="flex w-full flex-col items-center gap-4">
          <Button type="submit" loading={pending}>
            {t('createAccount')}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push(`/${locale}/auth/login`)}
          >
            {t('haveAccount')}
          </Button>
        </div>
      </form>
    </div>
  );
}
