import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import { ZodError } from 'zod';

import { env } from './config/env.js';
import { HTTP_BAD_REQUEST } from './constants/http-status.js';
import mongoosePlugin from './plugins/mongoose.plugin.js';
import authenticatePlugin from './plugins/authenticate.plugin.js';
import authRoutes from './routes/auth.routes.js';

const HOST = '0.0.0.0';
const AUTH_ROUTES_PREFIX = '/auth';

const app = Fastify({ logger: true });

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    reply.code(HTTP_BAD_REQUEST).send({ error: 'ValidationError', issues: error.issues });
    return;
  }

  app.log.error(error);
  reply.send(error);
});

await app.register(mongoosePlugin);
await app.register(cors, { origin: env.CLIENT_ORIGIN, credentials: true });
await app.register(cookie);
await app.register(rateLimit, { global: false });
await app.register(authenticatePlugin);
await app.register(authRoutes, { prefix: AUTH_ROUTES_PREFIX });

app.get('/', async () => ({ message: 'Hello, SiftVault!' }));

try {
  await app.listen({ port: env.PORT, host: HOST });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
