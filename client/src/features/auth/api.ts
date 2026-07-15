import { API_BASE_URL } from '@/config';

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

const fetchJson = (path: string, init?: RequestInit): Promise<Response> => fetch(`${API_BASE_URL}${path}`, {
  ...init,
  credentials: 'include',
  headers: { 'Content-Type': 'application/json', ...init?.headers },
});

const requestCurrentUser = async (): Promise<AuthUser | null> => {
  const response = await fetchJson('/auth/me');

  if (!response.ok) {
    return null;
  }

  const { user } = await response.json() as { user: AuthUser };
  return user;
};

const refreshSession = async (): Promise<boolean> => {
  const response = await fetchJson('/auth/refresh', { method: 'POST' });
  return response.ok;
};

export const fetchCurrentUser = async (): Promise<AuthUser | null> => {
  const user = await requestCurrentUser();

  if (user) {
    return user;
  }

  const refreshed = await refreshSession();

  if (!refreshed) {
    return null;
  }

  return requestCurrentUser();
};

const parseAuthError = async (response: Response): Promise<AuthApiError> => {
  const body = await response.json() as AuthErrorBody;
  return new AuthApiError(response.status, body);
};

export const registerUser = async (input: RegisterFormValues): Promise<AuthUser> => {
  const response = await fetchJson('/auth/register', { method: 'POST', body: JSON.stringify(input) });

  if (!response.ok) {
    throw await parseAuthError(response);
  }

  const { user } = await response.json() as { user: AuthUser };
  return user;
};

export const loginUser = async (input: LoginFormValues): Promise<AuthUser> => {
  const response = await fetchJson('/auth/login', { method: 'POST', body: JSON.stringify(input) });

  if (!response.ok) {
    throw await parseAuthError(response);
  }

  const { user } = await response.json() as { user: AuthUser };
  return user;
};

export const logoutUser = async (): Promise<void> => {
  await fetchJson('/auth/logout', { method: 'POST' });
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
