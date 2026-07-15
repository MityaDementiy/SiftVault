import mongoose from 'mongoose';
import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';

import { env } from '../config/env.js';

const mongoosePlugin: FastifyPluginAsync = async (fastify) => {
  await mongoose.connect(env.MONGODB_URI);

  fastify.addHook('onClose', async () => {
    await mongoose.disconnect();
  });
};

export default fp(mongoosePlugin);
