import type { ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  describe, expect, it, vi,
} from 'vitest';

import { AUTH_ME_QUERY_KEY } from '@/features/auth/queries';
import type { AuthUser } from '@/features/auth/types';
import en from '@/i18n/locales/en.json';

import { SiteHeader } from './site-header';

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    Link: ({ to, children }: { to: string; children: ReactNode }) => <a href={to}>{children}</a>,
  };
});

const FAKE_USER: AuthUser = {
  id: 'user-1',
  email: 'alice@example.com',
  username: 'alice',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const renderWithAuthState = (user: AuthUser | null) => {
  const queryClient = new QueryClient();
  queryClient.setQueryData(AUTH_ME_QUERY_KEY, user);

  return render(
    <QueryClientProvider client={queryClient}>
      <SiteHeader />
    </QueryClientProvider>,
  );
};

describe('SiteHeader', () => {
  it('shows register/sign-in links when logged out', () => {
    renderWithAuthState(null);

    expect(screen.getByRole('link', { name: en.siteHeader.signIn })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: en.siteHeader.register })).toBeInTheDocument();
  });

  it('shows a greeting and an add feed button when logged in', () => {
    renderWithAuthState(FAKE_USER);

    const greeting = en.siteHeader.greeting.replace('{{username}}', FAKE_USER.username);
    expect(screen.getByText(greeting)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: en.addFeedDialog.trigger })).toBeInTheDocument();
  });

  it('reveals the logout option in a menu when the greeting is clicked', async () => {
    renderWithAuthState(FAKE_USER);

    const greeting = en.siteHeader.greeting.replace('{{username}}', FAKE_USER.username);
    const trigger = screen.getByRole('button', { name: greeting });
    fireEvent.pointerDown(trigger, { pointerType: 'mouse', button: 0 });
    fireEvent.click(trigger);

    expect(await screen.findByRole('menuitem', { name: en.siteHeader.logOut })).toBeInTheDocument();
  });
});
