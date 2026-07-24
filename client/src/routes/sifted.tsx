import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { FeedItemCard } from '@/components/feed-item-card';
import { authMeQueryOptions } from '@/features/auth/queries';
import { siftedItemsQueryOptions } from '@/features/sifted-items/queries';
import { useRemoveSiftedItemMutation } from '@/features/sifted-items/mutations';

const LOGIN_PATH = '/login';

export const Route = createFileRoute('/sifted')({
  loader: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(authMeQueryOptions);
    if (!user) {
      throw redirect({ to: LOGIN_PATH });
    }
    await context.queryClient.ensureQueryData(siftedItemsQueryOptions);
  },
  component: SiftedRoute,
});

function SiftedRoute() {
  const { t } = useTranslation();
  const { data: siftedItems } = useSuspenseQuery(siftedItemsQueryOptions);
  const removeSiftedItemMutation = useRemoveSiftedItemMutation();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 font-heading text-xl font-semibold">{t('siftedPage.title')}</h1>
      {siftedItems.length === 0 ? (
        <p className="text-muted-foreground">{t('siftedPage.empty')}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {siftedItems.map((siftedItem) => (
            <FeedItemCard
              key={siftedItem.id}
              item={siftedItem}
              highlighted
              footer={(
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={removeSiftedItemMutation.isPending}
                  onClick={() => removeSiftedItemMutation.mutate(siftedItem.id)}
                >
                  {t('siftedPage.remove')}
                </Button>
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
