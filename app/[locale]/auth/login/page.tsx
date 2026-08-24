'use client';

import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/lib/actions/login';
import { Input } from '@/lib/components/Input';
import { Button } from '@/lib/components/Button';

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

        <div className="mb-8 w-full">
          <Input
            control={control}
            name="password"
            type="password"
            placeholder={t('password')}
            autoComplete="current-password"
            rules={{ required: t('errors.passwordRequired') }}
          />
        </div>

        <div className="flex w-full flex-col items-center gap-4">
          <Button type="submit" loading={pending} onClick={() => router.push(`/${locale}/home`)}>
            {t('login')}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push(`/${locale}/forgot-password`)}
          >
            {t('forgotPassword')}
          </Button>
        </div>
      </form>
    </div>
  );
}
