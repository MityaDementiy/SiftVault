import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import {
  createFeedSchema, feedParamsSchema, feedResponseSchema, feedItemResponseSchema,
} from '../schemas/feed.schema.js';
import { errorResponseSchema } from '../schemas/error.schema.js';
import { FeedModel } from '../models/feed.model.js';
import { fetchFeedTitle, fetchFeedItems, FeedFetchError } from '../utils/rss.js';
import {
  HTTP_OK, HTTP_CREATED, HTTP_NO_CONTENT, HTTP_BAD_REQUEST, HTTP_NOT_FOUND, HTTP_CONFLICT,
} from '../constants/http-status.js';

const FEED_TAGS = ['Feeds'];
const FEED_ITEMS_PER_FEED_LIMIT = 20;
const FEED_RESPONSE_SCHEMA = z.object({ feed: feedResponseSchema });
const FEEDS_RESPONSE_SCHEMA = z.object({ feeds: z.array(feedResponseSchema) });
const FEED_ITEMS_RESPONSE_SCHEMA = z.object({ items: z.array(feedItemResponseSchema) });

const INVALID_FEED_URL_BODY = { error: 'InvalidFeedUrl' };
const FEED_ALREADY_EXISTS_BODY = { error: 'FeedAlreadyExists' };
const FEED_NOT_FOUND_BODY = { error: 'FeedNotFound' };

interface MongoDuplicateKeyError extends Error {
  code: number;
}

const isDuplicateKeyError = (error: unknown): error is MongoDuplicateKeyError => (
  error instanceof Error && (error as MongoDuplicateKeyError).code === 11000
);

const feedRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.addHook('preHandler', fastify.authenticate);

  fastify.get('/', {
    schema: {
      tags: FEED_TAGS,
      response: {
        [HTTP_OK]: FEEDS_RESPONSE_SCHEMA,
      },
    },
  }, async (request, reply) => {
    const feeds = await FeedModel.find({ userId: request.userId }).sort({ createdAt: -1 });
    reply.code(HTTP_OK).send({ feeds });
  });

  fastify.get('/items', {
    schema: {
      tags: FEED_TAGS,
      response: {
        [HTTP_OK]: FEED_ITEMS_RESPONSE_SCHEMA,
      },
    },
  }, async (request, reply) => {
    const feeds = await FeedModel.find({ userId: request.userId }).sort({ createdAt: -1 });

    const results = await Promise.allSettled(feeds.map(async (feed) => {
      const items = await fetchFeedItems(feed.url);
      return items
        .slice(0, FEED_ITEMS_PER_FEED_LIMIT)
        .map((item) => ({ ...item, source: feed.name }));
    }));

    const items = results.flatMap((result) => {
      if (result.status === 'rejected') {
        request.log.warn(result.reason, 'Failed to fetch feed items');
        return [];
      }
      return result.value;
    });

    reply.code(HTTP_OK).send({ items });
  });

  fastify.post('/', {
    schema: {
      tags: FEED_TAGS,
      body: createFeedSchema,
      response: {
        [HTTP_CREATED]: FEED_RESPONSE_SCHEMA,
        [HTTP_BAD_REQUEST]: errorResponseSchema,
        [HTTP_CONFLICT]: errorResponseSchema,
      },
    },
  }, async (request, reply) => {
    const { url, name } = request.body;

    let resolvedName = name;
    if (!resolvedName) {
      try {
        resolvedName = await fetchFeedTitle(url);
      } catch (error) {
        if (error instanceof FeedFetchError) {
          reply.code(HTTP_BAD_REQUEST).send(INVALID_FEED_URL_BODY);
          return;
        }
        throw error;
      }
    }

    let feed;
    try {
      feed = await FeedModel.create({ userId: request.userId, url, name: resolvedName });
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        reply.code(HTTP_CONFLICT).send(FEED_ALREADY_EXISTS_BODY);
        return;
      }
      throw error;
    }

    reply.code(HTTP_CREATED).send({ feed });
  });

  fastify.delete('/:id', {
    schema: {
      tags: FEED_TAGS,
      params: feedParamsSchema,
      response: {
        [HTTP_NO_CONTENT]: z.null(),
        [HTTP_NOT_FOUND]: errorResponseSchema,
      },
    },
  }, async (request, reply) => {
    const { id } = request.params;
    const deletedFeed = await FeedModel.findOneAndDelete({ _id: id, userId: request.userId });

    if (!deletedFeed) {
      reply.code(HTTP_NOT_FOUND).send(FEED_NOT_FOUND_BODY);
      return;
    }

    reply.code(HTTP_NO_CONTENT).send(null);
  });
};

export default feedRoutes;
