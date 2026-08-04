'use server';

import { cookies } from 'next/headers';
import { login as loginMutation } from '@/lib/graphql/auth';

type LoginInput = {
  email: string;
  password: string;
};

export async function loginAction(values: LoginInput) {
  const result = await loginMutation(values);

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

  return { success: true };
}
