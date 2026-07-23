import { queryOptions } from '@tanstack/react-query';

import { fetchSiftedItems } from './api';

export const SIFTED_ITEMS_QUERY_KEY = ['sifted-items'] as const;

export const siftedItemsQueryOptions = queryOptions({
  queryKey: SIFTED_ITEMS_QUERY_KEY,
  queryFn: fetchSiftedItems,
});
