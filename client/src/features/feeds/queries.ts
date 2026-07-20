import { queryOptions } from '@tanstack/react-query';

import { fetchFeeds } from './api';

export const FEEDS_QUERY_KEY = ['feeds'] as const;

export const feedsQueryOptions = queryOptions({
  queryKey: FEEDS_QUERY_KEY,
  queryFn: fetchFeeds,
});
