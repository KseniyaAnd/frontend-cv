'use server';

import { redirect } from 'next/navigation';

import { verifyMail } from '@/app/api/graphql/auth';
import { getErrorMessage } from '@/lib/utils/error';

export type VerifyEmailState = {
  error?: string;
};

export async function verifyEmailAction(
  _: VerifyEmailState,
  formData: FormData,
): Promise<VerifyEmailState> {
  const code = String(formData.get('code'));
  const locale = String(formData.get('locale'));

  try {
    if (code.length !== 6) {
      return {
        error: 'Invalid verification code',
      };
    }

    await verifyMail(code);
  } catch (error) {
    return {
      error: getErrorMessage(error, 'Invalid verification code'),
    };
  }

  redirect(`/${locale}`);
}
