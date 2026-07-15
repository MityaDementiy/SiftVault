import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { authMeQueryOptions } from '@/features/auth/queries';
import { useLogoutMutation } from '@/features/auth/mutations';

export function SiteHeader() {
  const { data: user } = useSuspenseQuery(authMeQueryOptions);
  const logoutMutation = useLogoutMutation();

  return (
    <header className="flex items-center justify-between border-b px-4 py-3">
      <Link to="/" className="font-heading text-lg font-semibold">
        SiftVault
      </Link>
      <nav className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-muted-foreground">{`Hello, ${user.username}!`}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={logoutMutation.isPending}
              onClick={() => logoutMutation.mutate()}
            >
              Log out
            </Button>
          </>
        ) : (
          <>
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/register">Register</Link>
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
