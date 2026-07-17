import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { userResponseSchema } from '../schemas/user.schema.js';
import { errorResponseSchema } from '../schemas/error.schema.js';
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

const AUTH_TAGS = ['Auth'];
const USER_RESPONSE_SCHEMA = z.object({ user: userResponseSchema });

const UNAUTHORIZED_BODY = { error: 'Unauthorized' };
const INVALID_CREDENTIALS_BODY = { error: 'InvalidCredentials' };

interface MongoDuplicateKeyError extends Error {
  code: number;
  keyValue: Record<string, unknown>;
}

const isDuplicateKeyError = (error: unknown): error is MongoDuplicateKeyError => (
  error instanceof Error && (error as MongoDuplicateKeyError).code === 11000
);

const authRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post('/register', {
    ...AUTH_RATE_LIMIT_ROUTE_CONFIG,
    schema: {
      tags: AUTH_TAGS,
      body: registerSchema,
      response: {
        [HTTP_CREATED]: USER_RESPONSE_SCHEMA,
        [HTTP_CONFLICT]: errorResponseSchema,
      },
    },
  }, async (request, reply) => {
    const { email, username, password } = request.body;
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

  fastify.post('/login', {
    ...AUTH_RATE_LIMIT_ROUTE_CONFIG,
    schema: {
      tags: AUTH_TAGS,
      body: loginSchema,
      response: {
        [HTTP_OK]: USER_RESPONSE_SCHEMA,
        [HTTP_UNAUTHORIZED]: errorResponseSchema,
      },
    },
  }, async (request, reply) => {
    const { email, password } = request.body;
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

  fastify.post('/logout', {
    schema: { tags: AUTH_TAGS },
  }, async (_request, reply) => {
    clearAuthCookies(reply);
    reply.code(HTTP_NO_CONTENT).send();
  });

  fastify.post('/refresh', {
    ...AUTH_RATE_LIMIT_ROUTE_CONFIG,
    schema: {
      tags: AUTH_TAGS,
      response: {
        [HTTP_NO_CONTENT]: z.null(),
        [HTTP_UNAUTHORIZED]: errorResponseSchema,
      },
    },
  }, async (request, reply) => {
    const token: string | undefined = request.cookies[REFRESH_TOKEN_COOKIE_NAME];

    if (!token) {
      reply.code(HTTP_UNAUTHORIZED).send(UNAUTHORIZED_BODY);
      return;
    }

    try {
      const { sub } = verifyRefreshToken(token);
      setAccessCookie(reply, signAccessToken(sub));
      reply.code(HTTP_NO_CONTENT).send(null);
    } catch {
      reply.code(HTTP_UNAUTHORIZED).send(UNAUTHORIZED_BODY);
    }
  });

  fastify.get('/me', {
    preHandler: fastify.authenticate,
    schema: {
      tags: AUTH_TAGS,
      response: {
        [HTTP_OK]: USER_RESPONSE_SCHEMA,
        [HTTP_UNAUTHORIZED]: errorResponseSchema,
      },
    },
  }, async (request, reply) => {
    const user = await UserModel.findById(request.userId);

    if (!user) {
      reply.code(HTTP_UNAUTHORIZED).send(UNAUTHORIZED_BODY);
      return;
    }

    reply.code(HTTP_OK).send({ user });
  });
};

export default authRoutes;
