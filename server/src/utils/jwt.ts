import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { ACCESS_TOKEN_TTL_SECONDS, REFRESH_TOKEN_TTL_SECONDS } from '../config/cookies.js';

type TokenType = 'access' | 'refresh';

const ACCESS_TOKEN_TYPE: TokenType = 'access';
const REFRESH_TOKEN_TYPE: TokenType = 'refresh';

export interface TokenPayload {
  sub: string;
  type: TokenType;
}

export class InvalidTokenTypeError extends Error {}

const verifyToken = (token: string, secret: string, expectedType: TokenType): TokenPayload => {
  const decoded = jwt.verify(token, secret) as TokenPayload;

  if (decoded.type !== expectedType) {
    throw new InvalidTokenTypeError();
  }

  return decoded;
};

export const signAccessToken = (userId: string): string => jwt.sign(
  { sub: userId, type: ACCESS_TOKEN_TYPE },
  env.JWT_ACCESS_SECRET,
  { expiresIn: ACCESS_TOKEN_TTL_SECONDS },
);

export const signRefreshToken = (userId: string): string => jwt.sign(
  { sub: userId, type: REFRESH_TOKEN_TYPE },
  env.JWT_REFRESH_SECRET,
  { expiresIn: REFRESH_TOKEN_TTL_SECONDS },
);

export const verifyAccessToken = (token: string): TokenPayload => (
  verifyToken(token, env.JWT_ACCESS_SECRET, ACCESS_TOKEN_TYPE)
);

export const verifyRefreshToken = (token: string): TokenPayload => (
  verifyToken(token, env.JWT_REFRESH_SECRET, REFRESH_TOKEN_TYPE)
);
