export interface SiftedItem {
  id: string;
  title: string;
  link: string;
  source: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSiftedItemInput {
  title: string;
  link: string;
  source: string;
  imageUrl?: string;
}

export type SiftedItemErrorBody =
  | { error: 'SiftedItemAlreadyExists' }
  | { error: 'SiftedItemNotFound' }
  | { error: 'Unauthorized' };
