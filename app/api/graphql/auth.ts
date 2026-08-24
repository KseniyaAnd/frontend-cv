import { gql, GraphQLClient } from 'graphql-request';
import { getServerGraphQLClient } from './server-client';

export type SignupInput = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: {
    id: string;
    email: string;
  };
  access_token: string;
  refresh_token: string;
};

export type SignupResponse = {
  signup: AuthResponse;
};

export type LoginResponse = {
  login: AuthResponse;
};

const SIGNUP_MUTATION = gql`
  mutation Signup($auth: SignupInput!) {
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

const LOGIN_MUTATION = gql`
  mutation Login($auth: AuthInput!) {
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

export async function signup(data: SignupInput) {
  return getServerGraphQLClient().request<SignupResponse>(SIGNUP_MUTATION, {
    auth: data,
  });
}

export async function login(data: LoginInput) {
  return getServerGraphQLClient().request<LoginResponse>(LOGIN_MUTATION, {
    auth: data,
  });
}

const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($auth: ForgotPasswordInput!) {
    forgotPassword(auth: $auth)
  }
`;

export async function forgotPassword(email: string) {
  return getServerGraphQLClient().request(FORGOT_PASSWORD_MUTATION, {
    auth: { email },
  });
}

const VERIFY_MAIL_MUTATION = gql`
  mutation VerifyMail($mail: VerifyMailInput!) {
    verifyMail(mail: $mail)
  }
`;

export async function verifyMail(otp: string) {
  return getServerGraphQLClient().request(VERIFY_MAIL_MUTATION, {
    mail: { otp },
  });
}

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($auth: ResetPasswordInput!) {
    resetPassword(auth: $auth)
  }
`;

export async function resetPassword(
  resetToken: string,
  newPassword: string,
  confirmPassword: string,
) {
  const client = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
    headers: {
      Origin: process.env.NEXT_PUBLIC_APP_URL!,
      Authorization: `Bearer ${resetToken}`,
    },
  });

  return client.request(RESET_PASSWORD_MUTATION, {
    auth: { newPassword, confirmPassword },
  });
}
