import { GraphQLClient } from 'graphql-request';

export function getServerGraphQLClient() {
  return new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
    headers: {
      Origin: process.env.NEXT_PUBLIC_APP_URL!,
    },
  });
}
