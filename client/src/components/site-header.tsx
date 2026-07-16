import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ChevronDownIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { AddFeedDialog } from '@/components/add-feed-dialog';
import { authMeQueryOptions } from '@/features/auth/queries';
import { useLogoutMutation } from '@/features/auth/mutations';

export function SiteHeader() {
  const { t } = useTranslation();
  const { data: user } = useSuspenseQuery(authMeQueryOptions);
  const logoutMutation = useLogoutMutation();

  return (
    <header className="flex items-center justify-between border-b px-4 py-3">
      <Link to="/" className="font-heading text-lg font-semibold">
        {t('app.name')}
      </Link>
      <nav className="flex items-center gap-3">
        {user ? (
          <>
            <AddFeedDialog />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="sm" className="gap-1">
                  {t('siteHeader.greeting', { username: user.username })}
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  variant="destructive"
                  disabled={logoutMutation.isPending}
                  onSelect={() => logoutMutation.mutate()}
                >
                  {t('siteHeader.logOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">{t('siteHeader.signIn')}</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/register">{t('siteHeader.register')}</Link>
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
