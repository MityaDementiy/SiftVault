import {
  render, screen, fireEvent,
} from '@testing-library/react';
import {
  describe, expect, it, beforeEach,
} from 'vitest';

import en from '@/i18n/locales/en.json';
import { useUiStore } from '@/stores/ui-store';

import { AddFeedDialog } from './add-feed-dialog';

const openDialog = () => {
  const trigger = screen.getByRole('button', { name: en.addFeedDialog.trigger });
  fireEvent.pointerDown(trigger, { pointerType: 'mouse', button: 0 });
  fireEvent.click(trigger);
};

describe('AddFeedDialog', () => {
  beforeEach(() => {
    useUiStore.setState({ isAddFeedDialogOpen: false });
  });

  it('renders a trigger button and keeps the form hidden until opened', () => {
    render(<AddFeedDialog />);

    expect(screen.getByRole('button', { name: en.addFeedDialog.trigger })).toBeInTheDocument();
    expect(screen.queryByLabelText(en.addFeedDialog.urlLabel)).not.toBeInTheDocument();
  });

  it('shows the form when the trigger is clicked', () => {
    render(<AddFeedDialog />);

    openDialog();

    expect(screen.getByLabelText(en.addFeedDialog.urlLabel)).toBeInTheDocument();
    expect(screen.getByLabelText(en.addFeedDialog.nameLabel)).toBeInTheDocument();
  });

  it('closes when the close (X) button is clicked', () => {
    render(<AddFeedDialog />);

    openDialog();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByLabelText(en.addFeedDialog.urlLabel)).not.toBeInTheDocument();
  });

  it('shows a validation error for an invalid url', async () => {
    render(<AddFeedDialog />);

    openDialog();
    const urlInput = screen.getByLabelText(en.addFeedDialog.urlLabel);
    fireEvent.change(urlInput, { target: { value: 'not-a-url' } });
    fireEvent.submit(urlInput.closest('form') as HTMLFormElement);

    expect(await screen.findByText(/invalid/i)).toBeInTheDocument();
  });
});
