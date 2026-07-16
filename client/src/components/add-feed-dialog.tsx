import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { useUiStore } from '@/stores/ui-store';
import { addFeedSchema, type AddFeedFormValues } from '@/features/feeds/schemas';

export function AddFeedDialog() {
  const { t } = useTranslation();
  const isOpen = useUiStore((s) => s.isAddFeedDialogOpen);

  const {
    register, handleSubmit, reset, formState: { errors },
  } = useForm<AddFeedFormValues>({ resolver: zodResolver(addFeedSchema) });

  const onSubmit = handleSubmit(() => {
    reset();
    useUiStore.getState().setAddFeedDialogOpen(false);
  });

  const handleOpenChange = (open: boolean) => {
    useUiStore.getState().setAddFeedDialogOpen(open);
    if (!open) {
      reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" size="sm">
          <PlusIcon />
          {t('addFeedDialog.trigger')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('addFeedDialog.title')}</DialogTitle>
          <DialogDescription>{t('addFeedDialog.description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="feed-url">{t('addFeedDialog.urlLabel')}</Label>
            <Input
              id="feed-url"
              type="url"
              autoComplete="off"
              placeholder={t('addFeedDialog.urlPlaceholder')}
              {...register('url')}
            />
            {errors.url ? (
              <p className="text-sm text-destructive">{errors.url.message}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="feed-title">{t('addFeedDialog.nameLabel')}</Label>
            <Input id="feed-title" type="text" autoComplete="off" {...register('title')} />
          </div>
          <DialogFooter>
            <Button type="submit">{t('addFeedDialog.submit')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
