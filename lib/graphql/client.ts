import { GraphQLClient } from 'graphql-request';

export function getGraphQLClient() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  return new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
    credentials: 'include',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
}
