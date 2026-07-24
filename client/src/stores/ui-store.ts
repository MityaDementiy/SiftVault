import { create } from 'zustand';

interface UiState {
  isAddFeedDialogOpen: boolean;
  setAddFeedDialogOpen: (isOpen: boolean) => void;
  expandedItemLinks: Set<string>;
  toggleExpandedItem: (link: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isAddFeedDialogOpen: false,
  setAddFeedDialogOpen: (isAddFeedDialogOpen) => set({ isAddFeedDialogOpen }),
  expandedItemLinks: new Set(),
  toggleExpandedItem: (link) => set((state) => {
    const expandedItemLinks = new Set(state.expandedItemLinks);
    if (expandedItemLinks.has(link)) {
      expandedItemLinks.delete(link);
    } else {
      expandedItemLinks.add(link);
    }
    return { expandedItemLinks };
  }),
}));
