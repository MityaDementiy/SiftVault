export interface AuthUser {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface ValidationIssue {
  path: (string | number)[];
  message: string;
}

export type AuthErrorBody =
  | { error: 'EmailTaken' }
  | { error: 'UsernameTaken' }
  | { error: 'InvalidCredentials' }
  | { error: 'Unauthorized' }
  | { error: 'ValidationError'; issues: ValidationIssue[] };
