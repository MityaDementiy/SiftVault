import type { ReactNode } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from '@tanstack/react-router';

import { SiteHeader } from '@/components/site-header';
import { authMeQueryOptions } from '@/features/auth/queries';
import appCss from '../styles.css?url';

if (import.meta.env.DEV && typeof window !== 'undefined') {
  import('react-scan').then(({ scan }) => scan({ enabled: true }));
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'SiftVault' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(authMeQueryOptions),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <SiteHeader />
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{ position: 'bottom-left' }}
          plugins={[
            {
              name: 'TanStack Query',
              render: <ReactQueryDevtoolsPanel />,
            },
            {
              name: 'TanStack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
