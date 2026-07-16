import { createFileRoute, redirect, Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from '@/components/ui/card';
import { authMeQueryOptions } from '@/features/auth/queries';
import { useRegisterMutation } from '@/features/auth/mutations';
import { registerSchema, type RegisterFormValues } from '@/features/auth/schemas';
import { AuthApiError, mapAuthErrorToField, DEFAULT_ERROR_MESSAGE } from '@/features/auth/api';

const HOME_PATH = '/';

export const Route = createFileRoute('/register')({
  loader: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(authMeQueryOptions);
    if (user) {
      throw redirect({ to: HOME_PATH });
    }
  },
  component: RegisterRoute,
});

function RegisterRoute() {
  const { t } = useTranslation();
  const registerMutation = useRegisterMutation();
  const {
    register, handleSubmit, setError, formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = handleSubmit((values) => {
    registerMutation.mutate(values, {
      onError: (error) => {
        if (error instanceof AuthApiError) {
          const { field, message } = mapAuthErrorToField(error);
          setError(field ?? 'root', { message });
          return;
        }
        setError('root', { message: DEFAULT_ERROR_MESSAGE });
      },
    });
  });

  return (
    <div className="flex justify-center px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t('register.title')}</CardTitle>
          <CardDescription>{t('register.description', { appName: t('app.name') })}</CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="flex flex-col gap-4">
            {errors.root ? (
              <p className="text-sm text-destructive">{errors.root.message}</p>
            ) : null}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">{t('auth.emailLabel')}</Label>
              <Input id="email" type="email" autoComplete="email" {...register('email')} />
              {errors.email ? (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username">{t('register.usernameLabel')}</Label>
              <Input id="username" type="text" autoComplete="username" {...register('username')} />
              {errors.username ? (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1.5 mb-2">
              <Label htmlFor="password">{t('auth.passwordLabel')}</Label>
              <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
              {errors.password ? (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              ) : null}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
              {t('register.submit')}
            </Button>
            <p className="text-sm text-muted-foreground">
              {t('register.hasAccountPrompt')}
              {' '}
              <Link to="/login" className="text-primary underline-offset-4 hover:underline">
                {t('register.signInLink')}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
