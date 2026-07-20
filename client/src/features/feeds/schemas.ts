import { z } from 'zod';

export const addFeedSchema = z.object({
  url: z.url(),
  name: z.string().optional(),
});

export type AddFeedFormValues = z.infer<typeof addFeedSchema>;
