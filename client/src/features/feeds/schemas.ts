import { z } from 'zod';

export const addFeedSchema = z.object({
  url: z.url(),
  title: z.string().optional(),
});

export type AddFeedFormValues = z.infer<typeof addFeedSchema>;
