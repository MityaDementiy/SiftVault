import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';

import { env, IS_PRODUCTION } from './config/env.js';
import mongoosePlugin from './plugins/mongoose.plugin.js';
import swaggerPlugin from './plugins/swagger.plugin.js';
import authenticatePlugin from './plugins/authenticate.plugin.js';
import authRoutes from './routes/auth.routes.js';
import feedRoutes from './routes/feed.routes.js';

const HOST = '0.0.0.0';
const AUTH_ROUTES_PREFIX = '/auth';
const FEED_ROUTES_PREFIX = '/feeds';

const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler((error, _request, reply) => {
  app.log.error(error);
  reply.send(error);
});

await app.register(mongoosePlugin);
await app.register(cors, { origin: env.CLIENT_ORIGIN, credentials: true });
await app.register(cookie);
await app.register(rateLimit, { global: false });
if (!IS_PRODUCTION) {
  await app.register(swaggerPlugin);
}
await app.register(authenticatePlugin);
await app.register(authRoutes, { prefix: AUTH_ROUTES_PREFIX });
await app.register(feedRoutes, { prefix: FEED_ROUTES_PREFIX });

app.get('/', async () => ({ message: 'Hello, SiftVault!' }));

try {
  await app.listen({ port: env.PORT, host: HOST });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
