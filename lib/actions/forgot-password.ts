'use server';

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
  try {
    const email = String(formData.get('email'));

    await forgotPassword(email);

    return {
      success: 'Password reset instructions have been sent to your email address.',
    };
  } catch (error) {
    return {
      error: getErrorMessage(error, 'Something went wrong. Please try again later.'),
    };
  }
}
