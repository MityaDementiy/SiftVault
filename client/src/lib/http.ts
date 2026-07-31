import { API_BASE_URL } from '@/config';

const IS_SERVER = typeof window === 'undefined';

const buildHeaders = (init: RequestInit, cookie: string | undefined): HeadersInit => ({
  ...(init.body ? { 'Content-Type': 'application/json' } : {}),
  ...(cookie ? { Cookie: cookie } : {}),
  ...init.headers,
});

// TanStack Start route loaders run on the server during SSR, where `fetch` has no browser
// cookie jar — `credentials: 'include'` is a no-op there. Forward the incoming request's
// cookies by hand, and forward any Set-Cookie the API sends back (e.g. a refreshed access
// token) onto the SSR response so the browser's cookie jar stays in sync.
export const getIncomingCookieHeader = async (): Promise<string | undefined> => {
  const { getRequestHeader } = await import('@tanstack/react-start/server');
  return getRequestHeader('cookie');
};

const forwardSetCookies = async (response: Response): Promise<void> => {
  const setCookies = response.headers.getSetCookie();
  if (setCookies.length === 0) {
    return;
  }
  const { setResponseHeader } = await import('@tanstack/react-start/server');
  setResponseHeader('set-cookie', setCookies);
};

export const mergeCookieHeader = (base: string | undefined, setCookies: string[]): string => {
  const jar = new Map((base ?? '').split(';').map((pair) => pair.trim()).filter(Boolean).map((pair) => {
    const separatorIndex = pair.indexOf('=');
    return [pair.slice(0, separatorIndex), pair.slice(separatorIndex + 1)] as const;
  }));

  setCookies.forEach((setCookie) => {
    const [pair] = setCookie.split(';');
    const separatorIndex = pair.indexOf('=');
    jar.set(pair.slice(0, separatorIndex).trim(), pair.slice(separatorIndex + 1));
  });

  return Array.from(jar.entries()).map(([name, value]) => `${name}=${value}`).join('; ');
};

export const apiFetch = async (
  path: string,
  init: RequestInit = {},
  cookieOverride?: string,
): Promise<Response> => {
  if (!IS_SERVER) {
    return fetch(`${API_BASE_URL}${path}`, {
      ...init,
      credentials: 'include',
      headers: buildHeaders(init, undefined),
    });
  }

  const cookie = cookieOverride ?? await getIncomingCookieHeader();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: buildHeaders(init, cookie),
  });
  await forwardSetCookies(response);
  return response;
};
