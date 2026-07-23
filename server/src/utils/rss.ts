import Parser from 'rss-parser';

const FEED_FETCH_TIMEOUT_MS = 10_000;
const IMAGE_ENCLOSURE_TYPE_PREFIX = 'image/';
const IMG_SRC_PATTERN = /<img[^>]+src=["']([^"']+)["']/i;

interface MediaContent {
  $: { url?: string; medium?: string };
}

interface CustomItemFields {
  'media:content'?: MediaContent | MediaContent[];
  'media:thumbnail'?: MediaContent;
  'content:encoded'?: string;
}

const parser = new Parser<Record<string, unknown>, CustomItemFields>({
  timeout: FEED_FETCH_TIMEOUT_MS,
  customFields: { item: ['media:content', 'media:thumbnail', 'content:encoded'] },
});

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
  imageUrl?: string;
}

type ParsedFeedItem = Awaited<ReturnType<typeof parser.parseURL>>['items'][number];

const extractImageUrl = (item: ParsedFeedItem): string | undefined => {
  if (item.enclosure?.type?.startsWith(IMAGE_ENCLOSURE_TYPE_PREFIX) && item.enclosure.url) {
    return item.enclosure.url;
  }

  const mediaContent = item['media:content'];
  const firstMediaContent = Array.isArray(mediaContent) ? mediaContent[0] : mediaContent;
  if (firstMediaContent?.$.url) {
    return firstMediaContent.$.url;
  }

  if (item['media:thumbnail']?.$.url) {
    return item['media:thumbnail'].$.url;
  }

  const html = item['content:encoded'] ?? item.content;
  const match = html?.match(IMG_SRC_PATTERN);
  return match?.[1];
};

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
    .map((item) => ({ title: item.title, link: item.link, imageUrl: extractImageUrl(item) }));
};
