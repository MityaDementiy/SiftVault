import { apiFetch, getIncomingCookieHeader, mergeCookieHeader } from '@/lib/http';

import type { AuthUser, AuthErrorBody } from './types';
import type { RegisterFormValues, LoginFormValues } from './schemas';

export class AuthApiError extends Error {
  readonly status: number;

  readonly body: AuthErrorBody;

  constructor(status: number, body: AuthErrorBody) {
    super(body.error);
    this.status = status;
    this.body = body;
  }
}

const IS_SERVER = typeof window === 'undefined';

const requestCurrentUser = async (cookie?: string): Promise<AuthUser | null> => {
  const response = await apiFetch('/auth/me', {}, cookie);

  if (!response.ok) {
    return null;
  }

  const { user } = await response.json() as { user: AuthUser };
  return user;
};

export const fetchCurrentUser = async (): Promise<AuthUser | null> => {
  const incomingCookie = IS_SERVER ? await getIncomingCookieHeader() : undefined;

  const user = await requestCurrentUser(incomingCookie);

  if (user) {
    return user;
  }

  const refreshResponse = await apiFetch('/auth/refresh', { method: 'POST' }, incomingCookie);

  if (!refreshResponse.ok) {
    return null;
  }

  const refreshedCookie = IS_SERVER
    ? mergeCookieHeader(incomingCookie, refreshResponse.headers.getSetCookie())
    : undefined;

  return requestCurrentUser(refreshedCookie);
};

const parseAuthError = async (response: Response): Promise<AuthApiError> => {
  const body = await response.json() as AuthErrorBody;
  return new AuthApiError(response.status, body);
};

export const registerUser = async (input: RegisterFormValues): Promise<AuthUser> => {
  const response = await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(input) });

  if (!response.ok) {
    throw await parseAuthError(response);
  }

  const { user } = await response.json() as { user: AuthUser };
  return user;
};

export const loginUser = async (input: LoginFormValues): Promise<AuthUser> => {
  const response = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(input) });

  if (!response.ok) {
    throw await parseAuthError(response);
  }

  const { user } = await response.json() as { user: AuthUser };
  return user;
};

export const logoutUser = async (): Promise<void> => {
  await apiFetch('/auth/logout', { method: 'POST' });
};

interface AuthFieldError {
  field?: 'email' | 'username' | 'password';
  message: string;
}

export const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

export const mapAuthErrorToField = (error: AuthApiError): AuthFieldError => {
  switch (error.body.error) {
    case 'EmailTaken':
      return { field: 'email', message: 'This email is already registered.' };
    case 'UsernameTaken':
      return { field: 'username', message: 'This username is already taken.' };
    case 'InvalidCredentials':
      return { message: 'Incorrect email or password.' };
    case 'ValidationError': {
      const [issue] = error.body.issues;
      const field = issue?.path[0];
      if (field === 'email' || field === 'username' || field === 'password') {
        return { field, message: issue.message };
      }
      return { message: issue?.message ?? DEFAULT_ERROR_MESSAGE };
    }
    default:
      return { message: DEFAULT_ERROR_MESSAGE };
  }
};
