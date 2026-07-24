import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FeedItemCard } from '@/components/feed-item-card';
import { authMeQueryOptions } from '@/features/auth/queries';
import { feedItemsQueryOptions } from '@/features/feeds/queries';
import type { FeedItem } from '@/features/feeds/types';
import { siftedItemsQueryOptions } from '@/features/sifted-items/queries';
import { useCreateSiftedItemMutation } from '@/features/sifted-items/mutations';

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(authMeQueryOptions);
    if (user) {
      await Promise.all([
        context.queryClient.ensureQueryData(feedItemsQueryOptions),
        context.queryClient.ensureQueryData(siftedItemsQueryOptions),
      ]);
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
  const { data: siftedItems } = useSuspenseQuery(siftedItemsQueryOptions);
  const siftedLinks = new Set(siftedItems.map((siftedItem) => siftedItem.link));

  return <FeedItemsList items={items} siftedLinks={siftedLinks} />;
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

const EMPTY_SIFTED_LINKS: Set<string> = new Set();

export function FeedItemsList({
  items,
  siftedLinks = EMPTY_SIFTED_LINKS,
}: { items: FeedItem[]; siftedLinks?: Set<string> }) {
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
          <SiftableFeedItemCard key={item.link} item={item} isSifted={siftedLinks.has(item.link)} />
        ))}
      </div>
    </div>
  );
}

function SiftableFeedItemCard({ item, isSifted }: { item: FeedItem; isSifted: boolean }) {
  const { t } = useTranslation();
  const createSiftedItemMutation = useCreateSiftedItemMutation();

  const handleSave = () => {
    createSiftedItemMutation.mutate({
      title: item.title,
      link: item.link,
      source: item.source,
      imageUrl: item.imageUrl,
      content: item.content,
    });
  };

  return (
    <FeedItemCard
      item={item}
      highlighted={isSifted}
      footer={isSifted ? (
        <Badge variant="sifted">{t('siftedItem.sifted')}</Badge>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={createSiftedItemMutation.isPending}
          onClick={handleSave}
        >
          {t('siftedItem.saveForLater')}
        </Button>
      )}
    />
  );
}
