import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

import { ACCESS_TOKEN_COOKIE_NAME } from '../config/cookies.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { HTTP_UNAUTHORIZED } from '../constants/http-status.js';

const authenticate = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const token = request.cookies[ACCESS_TOKEN_COOKIE_NAME];

  if (!token) {
    reply.code(HTTP_UNAUTHORIZED).send({ error: 'Unauthorized' });
    return;
  }

  try {
    request.userId = verifyAccessToken(token).sub;
  } catch {
    reply.code(HTTP_UNAUTHORIZED).send({ error: 'Unauthorized' });
  }
};

const authenticatePlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('authenticate', authenticate);
};

export default fp(authenticatePlugin);
