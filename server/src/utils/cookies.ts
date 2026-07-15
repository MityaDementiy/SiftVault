import type { FastifyReply } from 'fastify';

import { env, IS_PRODUCTION } from '../config/env.js';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
  AUTH_COOKIE_PATH,
  REFRESH_COOKIE_PATH,
} from '../config/cookies.js';

const baseCookieOptions = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: 'lax' as const,
  domain: env.COOKIE_DOMAIN,
};

export const setAccessCookie = (reply: FastifyReply, accessToken: string): void => {
  reply.setCookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    ...baseCookieOptions,
    path: AUTH_COOKIE_PATH,
    maxAge: ACCESS_TOKEN_TTL_SECONDS,
  });
};

export const setRefreshCookie = (reply: FastifyReply, refreshToken: string): void => {
  reply.setCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    ...baseCookieOptions,
    path: REFRESH_COOKIE_PATH,
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
  });
};

export const setAuthCookies = (
  reply: FastifyReply,
  accessToken: string,
  refreshToken: string,
): void => {
  setAccessCookie(reply, accessToken);
  setRefreshCookie(reply, refreshToken);
};

export const clearAuthCookies = (reply: FastifyReply): void => {
  reply.clearCookie(ACCESS_TOKEN_COOKIE_NAME, { ...baseCookieOptions, path: AUTH_COOKIE_PATH });
  reply.clearCookie(REFRESH_TOKEN_COOKIE_NAME, { ...baseCookieOptions, path: REFRESH_COOKIE_PATH });
};
