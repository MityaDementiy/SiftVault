import { z } from 'zod';

const DEFAULT_PORT = 3001;
const MIN_JWT_SECRET_LENGTH = 32;

try {
  process.loadEnvFile();
} catch {
  // NOTE: no .env file — expected in production, where env vars are injected by the host
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(DEFAULT_PORT),
  CLIENT_ORIGIN: z.url(),
  MONGODB_URI: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(MIN_JWT_SECRET_LENGTH),
  JWT_REFRESH_SECRET: z.string().min(MIN_JWT_SECRET_LENGTH),
  COOKIE_DOMAIN: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment configuration:', z.prettifyError(parsedEnv.error));
  process.exit(1);
}

export const env = parsedEnv.data;

export const IS_PRODUCTION = env.NODE_ENV === 'production';
