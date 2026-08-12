'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { signup } from '@/lib/graphql/auth';
import { getErrorMessage } from '@/lib/utils/error';

export type SignupState = {
  error?: string;
};

export async function signupAction(_: SignupState, formData: FormData): Promise<SignupState> {
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const confirmPassword = String(formData.get('confirmPassword'));

  try {
    const { signup: result } = await signup({
      email,
      password,
      confirmPassword,
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
  } catch (error) {
    return {
      error: getErrorMessage(error, 'Registration failed'),
    };
  }

  redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}
