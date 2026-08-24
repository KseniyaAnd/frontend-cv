import { gql } from 'graphql-request';
import { getBrowserGraphQLClient } from './browser-client';

export type CurrentUserProfile = {
  first_name: string | null;
  last_name: string | null;
  role: string;
};

export type MeResponse = {
  me: CurrentUserProfile;
};

const ME_QUERY = gql`
  query Me {
    me {
      first_name
      last_name
      role
    }
  }
`;

export async function getMe() {
  return getBrowserGraphQLClient().request<MeResponse>(ME_QUERY);
}
