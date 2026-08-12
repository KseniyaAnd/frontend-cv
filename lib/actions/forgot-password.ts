'use server';

import { getLocale, getTranslations } from 'next-intl/server';

import { forgotPassword } from '@/lib/graphql/auth';
import { getErrorMessage } from '@/lib/utils/error';

export type ForgotPasswordState = {
  error?: string;
  success?: string;
};

export async function forgotPasswordAction(
  _: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const locale = await getLocale();

  const t = await getTranslations({
    locale,
    namespace: 'auth',
  });

  try {
    const email = String(formData.get('email'));

    await forgotPassword(email);

    return {
      success: t('passwordResetEmailSent'),
    };
  } catch (error) {
    return {
      error: getErrorMessage(error, t('errors.forgotPasswordFailed')),
    };
  }
}
