import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { authMeQueryOptions } from '@/features/auth/queries';
import { feedsQueryOptions } from '@/features/feeds/queries';
import { useUnsubscribeFeedMutation } from '@/features/feeds/mutations';

const LOGIN_PATH = '/login';

export const Route = createFileRoute('/feeds')({
  loader: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(authMeQueryOptions);
    if (!user) {
      throw redirect({ to: LOGIN_PATH });
    }
    await context.queryClient.ensureQueryData(feedsQueryOptions);
  },
  component: FeedsRoute,
});

function FeedsRoute() {
  const { t } = useTranslation();
  const { data: feeds } = useSuspenseQuery(feedsQueryOptions);
  const unsubscribeMutation = useUnsubscribeFeedMutation();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 font-heading text-xl font-semibold">{t('feedsPage.title')}</h1>
      {feeds.length === 0 ? (
        <p className="text-muted-foreground">{t('feedsPage.empty')}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {feeds.map((feed) => (
            <li
              key={feed.id}
              className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3"
            >
              <span className="truncate">{feed.name}</span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={unsubscribeMutation.isPending}
                onClick={() => unsubscribeMutation.mutate(feed.id)}
              >
                {t('feedsPage.unsubscribe')}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
