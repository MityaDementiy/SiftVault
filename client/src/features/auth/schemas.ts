import { z } from 'zod';

import {
  USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_PATTERN, MIN_PASSWORD_LENGTH,
} from './constants';

export const registerSchema = z.object({
  email: z.email(),
  username: z.string().min(USERNAME_MIN_LENGTH).max(USERNAME_MAX_LENGTH).regex(USERNAME_PATTERN),
  password: z.string().min(MIN_PASSWORD_LENGTH),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
