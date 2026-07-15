import type { FastifyPluginAsync } from 'fastify';

import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { UserModel } from '../models/user.model.js';
import { hashPassword, verifyPassword, DUMMY_PASSWORD_HASH } from '../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import {
  setAuthCookies, setAccessCookie, clearAuthCookies,
} from '../utils/cookies.js';
import { REFRESH_TOKEN_COOKIE_NAME } from '../config/cookies.js';
import { AUTH_RATE_LIMIT_MAX, AUTH_RATE_LIMIT_WINDOW } from '../config/rate-limit.js';
import {
  HTTP_OK, HTTP_CREATED, HTTP_NO_CONTENT, HTTP_UNAUTHORIZED, HTTP_CONFLICT,
} from '../constants/http-status.js';

const AUTH_RATE_LIMIT_ROUTE_CONFIG = {
  config: { rateLimit: { max: AUTH_RATE_LIMIT_MAX, timeWindow: AUTH_RATE_LIMIT_WINDOW } },
};

const UNAUTHORIZED_BODY = { error: 'Unauthorized' };
const INVALID_CREDENTIALS_BODY = { error: 'InvalidCredentials' };

interface MongoDuplicateKeyError extends Error {
  code: number;
  keyValue: Record<string, unknown>;
}

const isDuplicateKeyError = (error: unknown): error is MongoDuplicateKeyError => (
  error instanceof Error && (error as MongoDuplicateKeyError).code === 11000
);

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/register', AUTH_RATE_LIMIT_ROUTE_CONFIG, async (request, reply) => {
    const { email, username, password } = registerSchema.parse(request.body);
    const passwordHash = await hashPassword(password);

    let user;
    try {
      user = await UserModel.create({ email, username, passwordHash });
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        const conflictError = 'email' in error.keyValue ? 'EmailTaken' : 'UsernameTaken';
        reply.code(HTTP_CONFLICT).send({ error: conflictError });
        return;
      }
      throw error;
    }

    setAuthCookies(reply, signAccessToken(user.id), signRefreshToken(user.id));
    reply.code(HTTP_CREATED).send({ user });
  });

  fastify.post('/login', AUTH_RATE_LIMIT_ROUTE_CONFIG, async (request, reply) => {
    const { email, password } = loginSchema.parse(request.body);
    const user = await UserModel.findOne({ email }).select('+passwordHash');
    const isValidPassword = await verifyPassword(
      password,
      user?.passwordHash ?? DUMMY_PASSWORD_HASH,
    );

    if (!user || !isValidPassword) {
      reply.code(HTTP_UNAUTHORIZED).send(INVALID_CREDENTIALS_BODY);
      return;
    }

    setAuthCookies(reply, signAccessToken(user.id), signRefreshToken(user.id));
    reply.code(HTTP_OK).send({ user });
  });

  fastify.post('/logout', async (_request, reply) => {
    clearAuthCookies(reply);
    reply.code(HTTP_NO_CONTENT).send();
  });

  fastify.post('/refresh', AUTH_RATE_LIMIT_ROUTE_CONFIG, async (request, reply) => {
    const token: string | undefined = request.cookies[REFRESH_TOKEN_COOKIE_NAME];

    if (!token) {
      reply.code(HTTP_UNAUTHORIZED).send(UNAUTHORIZED_BODY);
      return;
    }

    try {
      const { sub } = verifyRefreshToken(token);
      setAccessCookie(reply, signAccessToken(sub));
      reply.code(HTTP_NO_CONTENT).send();
    } catch {
      reply.code(HTTP_UNAUTHORIZED).send(UNAUTHORIZED_BODY);
    }
  });

  fastify.get('/me', { preHandler: fastify.authenticate }, async (request, reply) => {
    const user = await UserModel.findById(request.userId);

    if (!user) {
      reply.code(HTTP_UNAUTHORIZED).send(UNAUTHORIZED_BODY);
      return;
    }

    reply.code(HTTP_OK).send({ user });
  });
};

export default authRoutes;
