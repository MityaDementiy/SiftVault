import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  describe, expect, it, vi,
} from 'vitest';

import { AUTH_ME_QUERY_KEY } from '@/features/auth/queries';
import type { AuthUser } from '@/features/auth/types';

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

    expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Register' })).toBeInTheDocument();
  });

  it('shows a greeting and logout button when logged in', () => {
    renderWithAuthState(FAKE_USER);

    expect(screen.getByText('Hello, alice!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log out' })).toBeInTheDocument();
  });
});
