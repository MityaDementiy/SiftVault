import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import {
  createSiftedItemSchema, siftedItemParamsSchema, siftedItemResponseSchema,
} from '../schemas/sifted-item.schema.js';
import { errorResponseSchema } from '../schemas/error.schema.js';
import { SiftedItemModel } from '../models/sifted-item.model.js';
import {
  HTTP_OK, HTTP_CREATED, HTTP_NO_CONTENT, HTTP_NOT_FOUND, HTTP_CONFLICT,
} from '../constants/http-status.js';

const SIFTED_ITEM_TAGS = ['SiftedItems'];
const SIFTED_ITEM_RESPONSE_SCHEMA = z.object({ siftedItem: siftedItemResponseSchema });
const SIFTED_ITEMS_RESPONSE_SCHEMA = z.object({ siftedItems: z.array(siftedItemResponseSchema) });

const SIFTED_ITEM_ALREADY_EXISTS_BODY = { error: 'SiftedItemAlreadyExists' };
const SIFTED_ITEM_NOT_FOUND_BODY = { error: 'SiftedItemNotFound' };

interface MongoDuplicateKeyError extends Error {
  code: number;
}

const isDuplicateKeyError = (error: unknown): error is MongoDuplicateKeyError => (
  error instanceof Error && (error as MongoDuplicateKeyError).code === 11000
);

const siftedItemRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.addHook('preHandler', fastify.authenticate);

  fastify.get('/', {
    schema: {
      tags: SIFTED_ITEM_TAGS,
      response: {
        [HTTP_OK]: SIFTED_ITEMS_RESPONSE_SCHEMA,
      },
    },
  }, async (request, reply) => {
    const siftedItems = await SiftedItemModel
      .find({ userId: request.userId })
      .sort({ createdAt: -1 });
    reply.code(HTTP_OK).send({ siftedItems });
  });

  fastify.post('/', {
    schema: {
      tags: SIFTED_ITEM_TAGS,
      body: createSiftedItemSchema,
      response: {
        [HTTP_CREATED]: SIFTED_ITEM_RESPONSE_SCHEMA,
        [HTTP_CONFLICT]: errorResponseSchema,
      },
    },
  }, async (request, reply) => {
    const {
      title, link, source, imageUrl, content,
    } = request.body;

    let siftedItem;
    try {
      siftedItem = await SiftedItemModel.create({
        userId: request.userId, title, link, source, imageUrl, content,
      });
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        reply.code(HTTP_CONFLICT).send(SIFTED_ITEM_ALREADY_EXISTS_BODY);
        return;
      }
      throw error;
    }

    reply.code(HTTP_CREATED).send({ siftedItem });
  });

  fastify.delete('/:id', {
    schema: {
      tags: SIFTED_ITEM_TAGS,
      params: siftedItemParamsSchema,
      response: {
        [HTTP_NO_CONTENT]: z.null(),
        [HTTP_NOT_FOUND]: errorResponseSchema,
      },
    },
  }, async (request, reply) => {
    const { id } = request.params;
    const deletedSiftedItem = await SiftedItemModel
      .findOneAndDelete({ _id: id, userId: request.userId });

    if (!deletedSiftedItem) {
      reply.code(HTTP_NOT_FOUND).send(SIFTED_ITEM_NOT_FOUND_BODY);
      return;
    }

    reply.code(HTTP_NO_CONTENT).send(null);
  });
};

export default siftedItemRoutes;
