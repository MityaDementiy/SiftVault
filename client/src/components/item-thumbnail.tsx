import { ImageOffIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const THUMBNAIL_CLASS_NAME = 'aspect-video w-full object-cover';

export function ItemThumbnail({ src, alt }: { src?: string; alt: string }) {
  const { t } = useTranslation();

  if (!src) {
    return (
      <div
        role="img"
        aria-label={t('siftedItem.imagePlaceholderAlt')}
        className={`${THUMBNAIL_CLASS_NAME} flex items-center justify-center rounded-t-xl bg-muted`}
      >
        <ImageOffIcon className="size-8 text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  return <img src={src} alt={alt} className={THUMBNAIL_CLASS_NAME} />;
}
