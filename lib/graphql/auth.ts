import { gql } from 'graphql-request';
import { graphqlClient } from '../graphql-client';

export const SIGNUP_MUTATION = gql`
  mutation Signup($auth: AuthInput!) {
    signup(auth: $auth) {
      access_token
      refresh_token
      user {
        id
        email
      }
    }
  }
`;

export type AuthInput = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
};

export type AuthResult = {
  access_token: string;
  refresh_token: string;
  user: User;
};

type SignupResponse = {
  signup: AuthResult;
};

export async function signup(auth: AuthInput): Promise<AuthResult> {
  const data = await graphqlClient.request<SignupResponse>(SIGNUP_MUTATION, {
    auth,
  });
  return data.signup;
}

export const LOGIN_QUERY = gql`
  query Login($auth: AuthInput!) {
    login(auth: $auth) {
      access_token
      refresh_token
      user {
        id
        email
      }
    }
  }
`;

type LoginResponse = {
  login: AuthResult;
};

export async function login(auth: AuthInput): Promise<AuthResult> {
  const data = await graphqlClient.request<LoginResponse>(LOGIN_QUERY, {
    auth,
  });
  return data.login;
}
