import {
  render, screen, fireEvent,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  describe, expect, it, beforeEach, afterEach, vi,
} from 'vitest';

import en from '@/i18n/locales/en.json';
import { useUiStore } from '@/stores/ui-store';

import { AddFeedDialog } from './add-feed-dialog';

const jsonResponse = (status: number, body: unknown): Response => new Response(
  JSON.stringify(body),
  { status, headers: { 'Content-Type': 'application/json' } },
);

const renderDialog = () => render(
  <QueryClientProvider client={new QueryClient()}>
    <AddFeedDialog />
  </QueryClientProvider>,
);

const openDialog = () => {
  const trigger = screen.getByRole('button', { name: en.addFeedDialog.trigger });
  fireEvent.pointerDown(trigger, { pointerType: 'mouse', button: 0 });
  fireEvent.click(trigger);
};

describe('AddFeedDialog', () => {
  beforeEach(() => {
    useUiStore.setState({ isAddFeedDialogOpen: false });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders a trigger button and keeps the form hidden until opened', () => {
    renderDialog();

    expect(screen.getByRole('button', { name: en.addFeedDialog.trigger })).toBeInTheDocument();
    expect(screen.queryByLabelText(en.addFeedDialog.urlLabel)).not.toBeInTheDocument();
  });

  it('shows the form when the trigger is clicked', () => {
    renderDialog();

    openDialog();

    expect(screen.getByLabelText(en.addFeedDialog.urlLabel)).toBeInTheDocument();
    expect(screen.getByLabelText(en.addFeedDialog.nameLabel)).toBeInTheDocument();
  });

  it('closes when the close (X) button is clicked', () => {
    renderDialog();

    openDialog();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByLabelText(en.addFeedDialog.urlLabel)).not.toBeInTheDocument();
  });

  it('shows a validation error for an invalid url', async () => {
    renderDialog();

    openDialog();
    const urlInput = screen.getByLabelText(en.addFeedDialog.urlLabel);
    fireEvent.change(urlInput, { target: { value: 'not-a-url' } });
    fireEvent.submit(urlInput.closest('form') as HTMLFormElement);

    expect(await screen.findByText(/invalid/i)).toBeInTheDocument();
  });

  it('submits the feed to the server and closes the dialog on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(201, {
      feed: {
        id: 'feed-1', url: 'https://example.com/rss.xml', name: 'Example', createdAt: '', updatedAt: '',
      },
    }));
    vi.stubGlobal('fetch', fetchMock);

    renderDialog();

    openDialog();
    fireEvent.change(screen.getByLabelText(en.addFeedDialog.urlLabel), {
      target: { value: 'https://example.com/rss.xml' },
    });
    fireEvent.click(screen.getByRole('button', { name: en.addFeedDialog.submit }));

    await screen.findByRole('button', { name: en.addFeedDialog.trigger });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/feeds'),
      expect.objectContaining({ method: 'POST' }),
    );
    expect(screen.queryByLabelText(en.addFeedDialog.urlLabel)).not.toBeInTheDocument();
  });

  it('shows a server error message when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(409, { error: 'FeedAlreadyExists' })));

    renderDialog();

    openDialog();
    fireEvent.change(screen.getByLabelText(en.addFeedDialog.urlLabel), {
      target: { value: 'https://example.com/rss.xml' },
    });
    fireEvent.click(screen.getByRole('button', { name: en.addFeedDialog.submit }));

    expect(await screen.findByText(/already subscribed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(en.addFeedDialog.urlLabel)).toBeInTheDocument();
  });
});
