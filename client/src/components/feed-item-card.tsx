import { ChevronDownIcon, ExternalLinkIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';

import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ItemThumbnail } from '@/components/item-thumbnail';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui-store';

interface FeedItemCardItem {
  title: string;
  link: string;
  source: string;
  imageUrl?: string;
  content?: string;
}

export function FeedItemCard({
  item,
  highlighted = false,
  footer,
}: { item: FeedItemCardItem; highlighted?: boolean; footer: ReactNode }) {
  const { t } = useTranslation();
  const isExpanded = useUiStore((state) => state.expandedItemLinks.has(item.link));

  const handleToggleExpanded = () => {
    useUiStore.getState().toggleExpandedItem(item.link);
  };

  return (
    <Card className={cn(highlighted && 'ring-2 ring-sifted')}>
      <ItemThumbnail src={item.imageUrl} alt={item.title} />
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{item.source}</CardDescription>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          {item.content ? (
            <div
              className="space-y-3 text-sm leading-relaxed text-foreground [&_a]:text-primary [&_a]:underline [&_img]:my-2 [&_img]:rounded-lg"
              // eslint-disable-next-line react/no-danger -- sanitized server-side before storage
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">{t('feedItemCard.noContent')}</p>
          )}
        </CardContent>
      )}
      <CardFooter className="justify-between">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-expanded={isExpanded}
            onClick={handleToggleExpanded}
          >
            <ChevronDownIcon className={cn('transition-transform', isExpanded && 'rotate-180')} />
            {isExpanded ? t('feedItemCard.collapse') : t('feedItemCard.readHere')}
          </Button>
          <Button type="button" variant="outline" size="sm" asChild>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <ExternalLinkIcon />
              {t('feedItemCard.openSource')}
            </a>
          </Button>
        </div>
        {footer}
      </CardFooter>
    </Card>
  );
}
