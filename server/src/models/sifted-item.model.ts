import { Schema, model, type InferSchemaType } from 'mongoose';

import {
  SIFTED_ITEM_TITLE_MAX_LENGTH,
  SIFTED_ITEM_LINK_MAX_LENGTH,
  SIFTED_ITEM_SOURCE_MAX_LENGTH,
  SIFTED_ITEM_IMAGE_URL_MAX_LENGTH,
} from '../schemas/sifted-item.constants.js';

const siftedItemSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: SIFTED_ITEM_TITLE_MAX_LENGTH,
    },
    link: {
      type: String,
      required: true,
      trim: true,
      maxlength: SIFTED_ITEM_LINK_MAX_LENGTH,
    },
    source: {
      type: String,
      required: true,
      trim: true,
      maxlength: SIFTED_ITEM_SOURCE_MAX_LENGTH,
    },
    imageUrl: {
      type: String,
      trim: true,
      maxlength: SIFTED_ITEM_IMAGE_URL_MAX_LENGTH,
    },
  },
  { timestamps: true },
);

siftedItemSchema.index({ userId: 1, link: 1 }, { unique: true });
siftedItemSchema.index({ userId: 1, createdAt: -1 });

siftedItemSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const {
      _id: id, title, link, source, imageUrl, createdAt, updatedAt,
    } = ret;
    return {
      id: id.toString(), title, link, source, imageUrl, createdAt, updatedAt,
    };
  },
});

export type SiftedItem = InferSchemaType<typeof siftedItemSchema>;

export const SiftedItemModel = model('SiftedItem', siftedItemSchema);
