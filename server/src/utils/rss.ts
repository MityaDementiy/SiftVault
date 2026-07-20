import Parser from 'rss-parser';

const FEED_FETCH_TIMEOUT_MS = 10_000;

const parser = new Parser({ timeout: FEED_FETCH_TIMEOUT_MS });

export class FeedFetchError extends Error {}

export const fetchFeedTitle = async (url: string): Promise<string> => {
  let feed;
  try {
    feed = await parser.parseURL(url);
  } catch (error) {
    throw new FeedFetchError('Failed to fetch or parse RSS feed', { cause: error });
  }

  if (!feed.title) {
    throw new FeedFetchError('RSS feed has no title');
  }

  return feed.title;
};
