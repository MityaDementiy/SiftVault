import { apiFetch } from '@/lib/http';

import type { SiftedItem, CreateSiftedItemInput, SiftedItemErrorBody } from './types';

export class SiftedItemApiError extends Error {
  readonly status: number;

  readonly body: SiftedItemErrorBody;

  constructor(status: number, body: SiftedItemErrorBody) {
    super(body.error);
    this.status = status;
    this.body = body;
  }
}

const throwSiftedItemApiError = async (response: Response): Promise<never> => {
  throw new SiftedItemApiError(response.status, await response.json() as SiftedItemErrorBody);
};

export const fetchSiftedItems = async (): Promise<SiftedItem[]> => {
  const response = await apiFetch('/sifted-items');

  if (!response.ok) {
    return throwSiftedItemApiError(response);
  }

  const { siftedItems } = await response.json() as { siftedItems: SiftedItem[] };
  return siftedItems;
};

export const createSiftedItem = async (input: CreateSiftedItemInput): Promise<SiftedItem> => {
  const response = await apiFetch('/sifted-items', { method: 'POST', body: JSON.stringify(input) });

  if (!response.ok) {
    return throwSiftedItemApiError(response);
  }

  const { siftedItem } = await response.json() as { siftedItem: SiftedItem };
  return siftedItem;
};

export const removeSiftedItem = async (id: string): Promise<void> => {
  const response = await apiFetch(`/sifted-items/${id}`, { method: 'DELETE' });

  if (!response.ok) {
    await throwSiftedItemApiError(response);
  }
};
