import { create } from 'zustand';

interface UiState {
  isAddFeedDialogOpen: boolean;
  setAddFeedDialogOpen: (isOpen: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isAddFeedDialogOpen: false,
  setAddFeedDialogOpen: (isAddFeedDialogOpen) => set({ isAddFeedDialogOpen }),
}));
