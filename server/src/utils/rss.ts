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

export interface FeedItemSummary {
  title: string;
  link: string;
}

export const fetchFeedItems = async (url: string): Promise<FeedItemSummary[]> => {
  let feed;
  try {
    feed = await parser.parseURL(url);
  } catch (error) {
    throw new FeedFetchError('Failed to fetch or parse RSS feed', { cause: error });
  }

  const hasTitleAndLink = (item: (typeof feed.items)[number]):
  item is typeof item & { title: string; link: string } => Boolean(item.title && item.link);

  return feed.items
    .filter(hasTitleAndLink)
    .map((item) => ({ title: item.title, link: item.link }));
};
