import { z } from 'zod';

export const userResponseSchema = z.object({
  id: z.string(),
  email: z.email(),
  username: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
