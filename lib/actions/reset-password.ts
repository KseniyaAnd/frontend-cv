'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { resetPassword, login } from '@/lib/graphql/auth';
import { getErrorMessage } from '@/lib/utils/error';

export type ResetPasswordState = {
  error?: string;
};

function decodeEmailFromToken(token: string): string | null {
  try {
    const payload = token.split('.')[1];

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString());

    return decoded.email ?? null;
  } catch {
    return null;
  }
}

export async function resetPasswordAction(
  _: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  try {
    const token = String(formData.get('token'));
    const newPassword = String(formData.get('newPassword'));
    const confirmPassword = String(formData.get('confirmPassword'));

    if (!token) {
      return {
        error: 'Reset link expired',
      };
    }

    const email = decodeEmailFromToken(token);

    if (!email) {
      return {
        error: 'Reset link expired',
      };
    }

    await resetPassword(token, newPassword, confirmPassword);

    const { login: result } = await login({
      email,
      password: newPassword,
    });

    const cookieStore = await cookies();

    cookieStore.set('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    cookieStore.set('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    redirect('/');
  } catch (error) {
    return {
      error: getErrorMessage(error, 'Failed to reset password'),
    };
  }
}
