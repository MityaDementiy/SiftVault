import { z } from 'zod';

import {
  FEED_URL_MAX_LENGTH, FEED_NAME_MIN_LENGTH, FEED_NAME_MAX_LENGTH, MONGO_OBJECT_ID_PATTERN,
} from './feed.constants.js';

export const createFeedSchema = z.object({
  url: z.url().max(FEED_URL_MAX_LENGTH),
  name: z.string().trim().min(FEED_NAME_MIN_LENGTH).max(FEED_NAME_MAX_LENGTH)
    .optional(),
});

export const feedParamsSchema = z.object({
  id: z.string().regex(MONGO_OBJECT_ID_PATTERN),
});

export const feedResponseSchema = z.object({
  id: z.string(),
  url: z.url(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const feedItemResponseSchema = z.object({
  title: z.string(),
  link: z.url(),
  source: z.string(),
  imageUrl: z.url().optional(),
});

export type CreateFeedInput = z.infer<typeof createFeedSchema>;
export type FeedParams = z.infer<typeof feedParamsSchema>;
