import { Schema, model, type InferSchemaType } from 'mongoose';

import { FEED_NAME_MAX_LENGTH, FEED_URL_MAX_LENGTH } from '../schemas/feed.constants.js';

const feedSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
      maxlength: FEED_URL_MAX_LENGTH,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: FEED_NAME_MAX_LENGTH,
    },
  },
  { timestamps: true },
);

feedSchema.index({ userId: 1, url: 1 }, { unique: true });

feedSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const {
      _id: id, url, name, createdAt, updatedAt,
    } = ret;
    return {
      id: id.toString(), url, name, createdAt, updatedAt,
    };
  },
});

export type Feed = InferSchemaType<typeof feedSchema>;

export const FeedModel = model('Feed', feedSchema);
