import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import en from '@/i18n/locales/en.json';
import type { FeedItem } from '@/features/feeds/types';

import { GuestHome, FeedItemsList } from './index';

describe('GuestHome', () => {
  it('renders the guest greeting as a heading', () => {
    render(<GuestHome />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(en.app.name);
  });
});

describe('FeedItemsList', () => {
  it('renders the empty state when there are no items', () => {
    render(<FeedItemsList items={[]} />);

    expect(screen.getByText(en.home.empty)).toBeInTheDocument();
  });

  it('renders each item as a link opening in a new tab, with its source', () => {
    const items: FeedItem[] = [
      { title: 'Crude Oil rises', link: 'https://example.com/oil', source: 'Bloomberg' },
      { title: 'Markets rally', link: 'https://example.com/markets', source: 'Reuters' },
    ];

    render(<FeedItemsList items={items} />);

    items.forEach((item) => {
      const link = screen.getByRole('link', { name: item.title });
      expect(link).toHaveAttribute('href', item.link);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(screen.getByText(item.source)).toBeInTheDocument();
    });
  });
});
