import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server';

import { API_BASE_URL, API_PROXY_PREFIX } from '@/config';

const NO_BODY_METHODS = ['GET', 'HEAD'];
const HOP_BY_HOP_RESPONSE_HEADERS = ['content-encoding', 'content-length', 'transfer-encoding', 'connection'];

const startHandlerFetch = createStartHandler(defaultStreamHandler);

const buildProxyResponseHeaders = (upstreamHeaders: Headers): Headers => {
  const headers = new Headers(upstreamHeaders);
  HOP_BY_HOP_RESPONSE_HEADERS.forEach((name) => headers.delete(name));

  const setCookies = upstreamHeaders.getSetCookie();
  headers.delete('set-cookie');
  setCookies.forEach((setCookie) => headers.append('set-cookie', setCookie));

  return headers;
};

const proxyToApi = async (
  request: Request,
  pathname: string,
  search: string,
): Promise<Response> => {
  const targetUrl = `${API_BASE_URL}${pathname.slice(API_PROXY_PREFIX.length)}${search}`;
  const hasBody = !NO_BODY_METHODS.includes(request.method);

  const upstreamResponse = await fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: hasBody ? request.body : undefined,
    duplex: hasBody ? 'half' : undefined,
  } as RequestInit);

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: buildProxyResponseHeaders(upstreamResponse.headers),
  });
};

const fetchHandler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  if (url.pathname.startsWith(API_PROXY_PREFIX)) {
    return proxyToApi(request, url.pathname, url.search);
  }
  return startHandlerFetch(request);
};

export default { fetch: fetchHandler };
