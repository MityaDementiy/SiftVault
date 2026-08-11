import { apiFetch } from '@/lib/http';

import type { HealthStatus } from './types';

export const fetchHealth = async (): Promise<HealthStatus> => {
  const response = await apiFetch('/health');
  return response.json() as Promise<HealthStatus>;
};
