import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

const REFRESH_MUTATION = `
  mutation UpdateToken {
    updateToken {
      access_token
      refresh_token
    }
  }
`;

type BackendResult = {
  status: number;
  json: any;
};

async function callBackend(body: unknown, accessToken: string | undefined): Promise<BackendResult> {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: APP_URL,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => null);
  return { status: res.status, json };
}

function isUnauthenticated(result: BackendResult): boolean {
  if (result.status === 401) return true;
  const code = result.json?.errors?.[0]?.extensions?.code;
  return code === 'UNAUTHENTICATED';
}

async function refreshTokens(refreshToken: string) {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: APP_URL,
      Authorization: `Bearer ${refreshToken}`,
    },
    body: JSON.stringify({ query: REFRESH_MUTATION, operationName: 'UpdateToken' }),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || json?.errors || !json?.data?.updateToken) {
    return null;
  }

  return json.data.updateToken as { access_token: string; refresh_token: string };
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  let result = await callBackend(body, accessToken);

  if (isUnauthenticated(result) && refreshToken) {
    const newTokens = await refreshTokens(refreshToken);

    if (newTokens) {
      result = await callBackend(body, newTokens.access_token);

      const response = NextResponse.json(result.json, { status: result.status });

      response.cookies.set('access_token', newTokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
      response.cookies.set('refresh_token', newTokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      return response;
    }

    const response = NextResponse.json(result.json, { status: result.status });
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
  }

  return NextResponse.json(result.json, { status: result.status });
}
