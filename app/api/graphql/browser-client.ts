import { GraphQLClient } from 'graphql-request';

export function getBrowserGraphQLClient() {
  const url = new URL('/api/graphql', window.location.origin).toString();

  return new GraphQLClient(url, {
    credentials: 'include',
  });
}
