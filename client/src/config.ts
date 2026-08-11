const DEFAULT_API_BASE_URL = 'http://localhost:3001';

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? DEFAULT_API_BASE_URL;

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.error(`[config] VITE_API_URL is not set in production, falling back to ${DEFAULT_API_BASE_URL}. API proxy requests will fail.`);
}

export const API_PROXY_PREFIX = '/api';
