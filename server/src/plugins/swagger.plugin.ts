import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { jsonSchemaTransform, jsonSchemaTransformObject } from 'fastify-type-provider-zod';

const API_TITLE = 'SiftVault API';
const API_VERSION = '0.0.1';
const SWAGGER_UI_ROUTE_PREFIX = '/docs';

const swaggerPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(swagger, {
    openapi: {
      info: { title: API_TITLE, version: API_VERSION },
    },
    transform: jsonSchemaTransform,
    transformObject: jsonSchemaTransformObject,
  });

  await fastify.register(swaggerUi, {
    routePrefix: SWAGGER_UI_ROUTE_PREFIX,
  });
};

export default fp(swaggerPlugin);
