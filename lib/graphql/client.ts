import { GraphQLClient } from 'graphql-request';

export function getGraphQLClient() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  return new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
    credentials: 'include',
    headers: {
      Origin: process.env.NEXT_PUBLIC_APP_URL!,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
