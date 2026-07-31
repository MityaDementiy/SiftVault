import { apiFetch } from '@/lib/http';

import type { Feed, FeedItem, FeedErrorBody } from './types';
import type { AddFeedFormValues } from './schemas';

export class FeedApiError extends Error {
  readonly status: number;

  readonly body: FeedErrorBody;

  constructor(status: number, body: FeedErrorBody) {
    super(body.error);
    this.status = status;
    this.body = body;
  }
}

const throwFeedApiError = async (response: Response): Promise<never> => {
  throw new FeedApiError(response.status, await response.json() as FeedErrorBody);
};

export const createFeed = async (input: AddFeedFormValues): Promise<Feed> => {
  const name = input.name?.trim() || undefined;
  const response = await apiFetch('/feeds', { method: 'POST', body: JSON.stringify({ url: input.url, name }) });

  if (!response.ok) {
    return throwFeedApiError(response);
  }

  const { feed } = await response.json() as { feed: Feed };
  return feed;
};

export const fetchFeeds = async (): Promise<Feed[]> => {
  const response = await apiFetch('/feeds');

  if (!response.ok) {
    return throwFeedApiError(response);
  }

  const { feeds } = await response.json() as { feeds: Feed[] };
  return feeds;
};

export const fetchFeedItems = async (): Promise<FeedItem[]> => {
  const response = await apiFetch('/feeds/items');

  if (!response.ok) {
    return throwFeedApiError(response);
  }

  const { items } = await response.json() as { items: FeedItem[] };
  return items;
};

export const unsubscribeFeed = async (id: string): Promise<void> => {
  const response = await apiFetch(`/feeds/${id}`, { method: 'DELETE' });

  if (!response.ok) {
    await throwFeedApiError(response);
  }
};

export const DEFAULT_FEED_ERROR_MESSAGE = 'Something went wrong. Please try again.';

export const mapFeedErrorToMessage = (error: FeedApiError): string => {
  switch (error.body.error) {
    case 'InvalidFeedUrl':
      return "Couldn't fetch that feed. Check the URL and try again.";
    case 'FeedAlreadyExists':
      return "You're already subscribed to this feed.";
    default:
      return DEFAULT_FEED_ERROR_MESSAGE;
  }
};
