'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { login } from '@/lib/graphql/auth';
import { getErrorMessage } from '@/lib/utils/error';

export type LoginState = {
  error?: string;
};

export async function loginAction(_: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));

  try {
    const { login: result } = await login({
      email,
      password,
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
      error: getErrorMessage(error, 'Invalid credentials'),
    };
  }

  redirect('/');
}
