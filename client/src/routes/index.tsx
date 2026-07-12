import { createFileRoute } from '@tanstack/react-router'
import { API_BASE_URL } from '../config'

type HomeResponse = {
  message: string
}

export const Route = createFileRoute('/')({
  component: Home,
  loader: async (): Promise<HomeResponse> => {
    const response = await fetch(`${API_BASE_URL}/`)
    return response.json()
  },
})

function Home() {
  const { message } = Route.useLoaderData()
  return <h1>{message}</h1>
}
