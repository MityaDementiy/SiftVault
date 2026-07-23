import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createSiftedItem, removeSiftedItem } from './api';
import { SIFTED_ITEMS_QUERY_KEY } from './queries';

export const useCreateSiftedItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSiftedItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SIFTED_ITEMS_QUERY_KEY });
    },
  });
};

export const useRemoveSiftedItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeSiftedItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SIFTED_ITEMS_QUERY_KEY });
    },
  });
};
