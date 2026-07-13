import { createFileRoute } from '@tanstack/react-router';

import { API_BASE_URL } from '../config';

type HomeResponse = {
  message: string
};

export const Route = createFileRoute('/')({
  component: RouteComponent,
  loader: async (): Promise<HomeResponse> => {
    const response = await fetch(`${API_BASE_URL}/`);
    return response.json();
  },
});

function RouteComponent() {
  const { message } = Route.useLoaderData();
  return <Home message={message} />;
}

export function Home({ message }: HomeResponse) {
  return <h1>{message}</h1>;
}
