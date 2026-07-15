import { createFileRoute, redirect, Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from '@/components/ui/card';
import { authMeQueryOptions } from '@/features/auth/queries';
import { useLoginMutation } from '@/features/auth/mutations';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas';
import { AuthApiError, mapAuthErrorToField, DEFAULT_ERROR_MESSAGE } from '@/features/auth/api';

const HOME_PATH = '/';

export const Route = createFileRoute('/login')({
  loader: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(authMeQueryOptions);
    if (user) {
      throw redirect({ to: HOME_PATH });
    }
  },
  component: LoginRoute,
});

function LoginRoute() {
  const loginMutation = useLoginMutation();
  const {
    register, handleSubmit, setError, formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values, {
      onError: (error) => {
        if (error instanceof AuthApiError) {
          const { field, message } = mapAuthErrorToField(error);
          setError(field === 'email' || field === 'password' ? field : 'root', { message });
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
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Welcome back to SiftVault.</CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="flex flex-col gap-4">
            {errors.root ? (
              <p className="text-sm text-destructive">{errors.root.message}</p>
            ) : null}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" {...register('email')} />
              {errors.email ? (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1.5 mb-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
              {errors.password ? (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              ) : null}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              Sign in
            </Button>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?
              {' '}
              <Link to="/register" className="text-primary underline-offset-4 hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
