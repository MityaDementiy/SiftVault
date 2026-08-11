import { queryOptions } from '@tanstack/react-query';

import { fetchHealth } from './api';

export const HEALTH_QUERY_KEY = ['health'] as const;

const HEALTH_REFETCH_INTERVAL_MS = 10 * 60 * 1000;

export const healthQueryOptions = queryOptions({
  queryKey: HEALTH_QUERY_KEY,
  queryFn: fetchHealth,
  refetchInterval: HEALTH_REFETCH_INTERVAL_MS,
  refetchIntervalInBackground: true,
  refetchOnWindowFocus: false,
  retry: false,
});
