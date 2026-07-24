import {
  render, screen, fireEvent,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  describe, expect, it, beforeEach,
} from 'vitest';

import en from '@/i18n/locales/en.json';
import type { FeedItem } from '@/features/feeds/types';
import { useUiStore } from '@/stores/ui-store';

import { GuestHome, FeedItemsList } from './index';

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

beforeEach(() => {
  useUiStore.setState({ expandedItemLinks: new Set() });
});

describe('GuestHome', () => {
  it('renders the guest greeting as a heading', () => {
    render(<GuestHome />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(en.app.name);
  });
});

describe('FeedItemsList', () => {
  it('renders the empty state when there are no items', () => {
    renderWithQueryClient(<FeedItemsList items={[]} />);

    expect(screen.getByText(en.home.empty)).toBeInTheDocument();
  });

  it('renders each item with its title, source and a link to open the source in a new tab', () => {
    const items: FeedItem[] = [
      { title: 'Crude Oil rises', link: 'https://example.com/oil', source: 'Bloomberg' },
      { title: 'Markets rally', link: 'https://example.com/markets', source: 'Reuters' },
    ];

    renderWithQueryClient(<FeedItemsList items={items} />);

    items.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
      expect(screen.getByText(item.source)).toBeInTheDocument();

      const link = screen.getAllByRole('link', { name: en.feedItemCard.openSource })
        .find((candidate) => candidate.getAttribute('href') === item.link);
      expect(link).toHaveAttribute('href', item.link);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('expands an item to show its content when the read-here button is clicked', () => {
    const items: FeedItem[] = [
      {
        title: 'Crude Oil rises',
        link: 'https://example.com/oil',
        source: 'Bloomberg',
        content: '<p>Oil prices climbed today.</p>',
      },
    ];

    renderWithQueryClient(<FeedItemsList items={items} />);

    expect(screen.queryByText('Oil prices climbed today.')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: en.feedItemCard.readHere }));

    expect(screen.getByText('Oil prices climbed today.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: en.feedItemCard.collapse }));

    expect(screen.queryByText('Oil prices climbed today.')).not.toBeInTheDocument();
  });

  it('shows a save-for-later button for items that have not been sifted yet', () => {
    const items: FeedItem[] = [
      { title: 'Crude Oil rises', link: 'https://example.com/oil', source: 'Bloomberg' },
    ];

    renderWithQueryClient(<FeedItemsList items={items} />);

    expect(screen.getByRole('button', { name: en.siftedItem.saveForLater })).toBeInTheDocument();
    expect(screen.queryByText(en.siftedItem.sifted)).not.toBeInTheDocument();
  });

  it('shows a sifted badge instead of the save button for already-sifted items', () => {
    const items: FeedItem[] = [
      { title: 'Crude Oil rises', link: 'https://example.com/oil', source: 'Bloomberg' },
    ];

    renderWithQueryClient(
      <FeedItemsList items={items} siftedLinks={new Set(['https://example.com/oil'])} />,
    );

    expect(screen.getByText(en.siftedItem.sifted)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: en.siftedItem.saveForLater }),
    ).not.toBeInTheDocument();
  });
});
