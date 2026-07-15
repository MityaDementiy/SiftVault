import { Schema, model, type InferSchemaType } from 'mongoose';

import { USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_PATTERN } from '../schemas/user.constants.js';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: USERNAME_MIN_LENGTH,
      maxlength: USERNAME_MAX_LENGTH,
      match: USERNAME_PATTERN,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const {
      _id: id, email, username, createdAt, updatedAt,
    } = ret;
    return {
      id: id.toString(), email, username, createdAt, updatedAt,
    };
  },
});

export type User = InferSchemaType<typeof userSchema>;

export const UserModel = model('User', userSchema);
