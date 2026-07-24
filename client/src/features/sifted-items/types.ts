export interface SiftedItem {
  id: string;
  title: string;
  link: string;
  source: string;
  imageUrl?: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSiftedItemInput {
  title: string;
  link: string;
  source: string;
  imageUrl?: string;
  content?: string;
}

export type SiftedItemErrorBody =
  | { error: 'SiftedItemAlreadyExists' }
  | { error: 'SiftedItemNotFound' }
  | { error: 'Unauthorized' };
