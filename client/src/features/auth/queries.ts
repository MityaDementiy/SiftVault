import { queryOptions } from '@tanstack/react-query';

import { fetchCurrentUser } from './api';

export const AUTH_ME_QUERY_KEY = ['auth', 'me'] as const;

const AUTH_ME_STALE_TIME_MS = 60_000;

export const authMeQueryOptions = queryOptions({
  queryKey: AUTH_ME_QUERY_KEY,
  queryFn: fetchCurrentUser,
  staleTime: AUTH_ME_STALE_TIME_MS,
});
