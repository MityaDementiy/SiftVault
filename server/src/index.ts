import Fastify from 'fastify'
import cors from '@fastify/cors'

const DEFAULT_PORT = 3001
const HOST = '0.0.0.0'
const CLIENT_ORIGIN = 'http://localhost:3000'

const app = Fastify({ logger: true })

await app.register(cors, { origin: CLIENT_ORIGIN })

app.get('/', async () => ({ message: 'Hello, SiftVault!' }))

const port = Number(process.env.PORT) || DEFAULT_PORT

try {
  await app.listen({ port, host: HOST })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
