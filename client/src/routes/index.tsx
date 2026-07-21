import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import {
  Card, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card';
import { authMeQueryOptions } from '@/features/auth/queries';
import { feedItemsQueryOptions } from '@/features/feeds/queries';
import type { FeedItem } from '@/features/feeds/types';

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(authMeQueryOptions);
    if (user) {
      await context.queryClient.ensureQueryData(feedItemsQueryOptions);
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useSuspenseQuery(authMeQueryOptions);
  return user ? <AuthenticatedHome /> : <GuestHome />;
}

function AuthenticatedHome() {
  const { data: items } = useSuspenseQuery(feedItemsQueryOptions);
  return <FeedItemsList items={items} />;
}

export function GuestHome() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-heading text-xl font-semibold">
        {t('home.guestGreeting', { appName: t('app.name') })}
      </h1>
    </div>
  );
}

export function FeedItemsList({ items }: { items: FeedItem[] }) {
  const { t } = useTranslation();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-muted-foreground">{t('home.empty')}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <Card key={item.link}>
            <CardHeader>
              <CardTitle>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {item.title}
                </a>
              </CardTitle>
              <CardDescription>{item.source}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
