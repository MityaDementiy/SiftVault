import { z } from 'zod';

import { MONGO_OBJECT_ID_PATTERN } from './feed.constants.js';
import {
  SIFTED_ITEM_TITLE_MAX_LENGTH,
  SIFTED_ITEM_LINK_MAX_LENGTH,
  SIFTED_ITEM_SOURCE_MAX_LENGTH,
  SIFTED_ITEM_IMAGE_URL_MAX_LENGTH,
} from './sifted-item.constants.js';

export const createSiftedItemSchema = z.object({
  title: z.string().trim().min(1).max(SIFTED_ITEM_TITLE_MAX_LENGTH),
  link: z.url().max(SIFTED_ITEM_LINK_MAX_LENGTH),
  source: z.string().trim().min(1).max(SIFTED_ITEM_SOURCE_MAX_LENGTH),
  imageUrl: z.url().max(SIFTED_ITEM_IMAGE_URL_MAX_LENGTH).optional(),
});

export const siftedItemParamsSchema = z.object({
  id: z.string().regex(MONGO_OBJECT_ID_PATTERN),
});

export const siftedItemResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  link: z.url(),
  source: z.string(),
  imageUrl: z.url().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateSiftedItemInput = z.infer<typeof createSiftedItemSchema>;
export type SiftedItemParams = z.infer<typeof siftedItemParamsSchema>;
