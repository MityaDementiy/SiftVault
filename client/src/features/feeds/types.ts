export interface Feed {
  id: string;
  url: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedItem {
  title: string;
  link: string;
  source: string;
  imageUrl?: string;
  content?: string;
}

export type FeedErrorBody =
  | { error: 'InvalidFeedUrl' }
  | { error: 'FeedAlreadyExists' }
  | { error: 'FeedNotFound' }
  | { error: 'Unauthorized' };
