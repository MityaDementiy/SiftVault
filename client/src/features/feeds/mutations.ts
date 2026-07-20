import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createFeed, unsubscribeFeed } from './api';
import { FEEDS_QUERY_KEY } from './queries';

export const useCreateFeedMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFeed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEEDS_QUERY_KEY });
    },
  });
};

export const useUnsubscribeFeedMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unsubscribeFeed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEEDS_QUERY_KEY });
    },
  });
};
