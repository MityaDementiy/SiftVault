import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { API_BASE_URL } from '../config';

type HomeResponse = {
  message: string
};

const HOME_MESSAGE_REFRESH_INTERVAL_MS = 30_000;

const homeMessageQueryOptions = queryOptions({
  queryKey: ['home-message'],
  queryFn: async (): Promise<HomeResponse> => {
    const response = await fetch(`${API_BASE_URL}/`);
    return response.json();
  },
  staleTime: HOME_MESSAGE_REFRESH_INTERVAL_MS,
  refetchInterval: HOME_MESSAGE_REFRESH_INTERVAL_MS,
});

export const Route = createFileRoute('/')({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(homeMessageQueryOptions),
});

function RouteComponent() {
  const { data: { message } } = useSuspenseQuery(homeMessageQueryOptions);
  return <Home message={message} />;
}

export function Home({ message }: HomeResponse) {
  return <h1>{message}</h1>;
}
