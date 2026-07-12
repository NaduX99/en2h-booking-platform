import { env } from '@/lib/config/env';
import { clearSession } from '@/lib/auth/session';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/lib/auth/token-storage';
import { dispatchLogout } from '@/lib/auth/auth-events';
import { ApiError } from './api-error';
import { parseErrorBody, NestJsErrorBody } from './response-parser';
import { AuthTokens } from '@/types/auth.types';

// Shared refresh lock — prevents race conditions on token rotation
let refreshPromise: Promise<void> | null = null;

async function performRefresh(): Promise<void> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new ApiError('No refresh token', 401);

  const res = await fetch(`${env.apiUrl}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearSession();
    dispatchLogout();
    throw new ApiError('Session expired. Please log in again.', 401);
  }

  const json = await res.json() as { data: AuthTokens };
  const tokens = json.data;
  setAccessToken(tokens.accessToken);
  setRefreshToken(tokens.refreshToken);
}

async function refreshOnce(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface RequestOptions {
  body?: unknown;
  isPublic?: boolean;
  skipRefresh?: boolean;
}

async function request<T>(
  method: HttpMethod,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, isPublic = false, skipRefresh = false } = options;

  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (!isPublic) {
    const token = getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${env.apiUrl}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Handle 401 with refresh
  const isAuthRoute = path.includes('/auth/login') || path.includes('/auth/register') || path.includes('/auth/refresh');
  if (res.status === 401 && !skipRefresh && !isAuthRoute) {
    try {
      await refreshOnce();
      return request<T>(method, path, { ...options, skipRefresh: true });
    } catch {
      throw new ApiError('Your session has expired. Please log in again.', 401);
    }
  }

  // Parse error responses
  if (!res.ok) {
    let errorBody: NestJsErrorBody = {};
    try {
      errorBody = await res.json() as NestJsErrorBody;
    } catch {
      // ignore parse errors
    }
    throw parseErrorBody(errorBody, res.status);
  }

  // Handle empty responses (204, 201 with no body)
  const text = await res.text();
  if (!text) return undefined as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined as T;
  }
}

export const apiClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('GET', path, options),

  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('POST', path, { ...options, body }),

  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('PATCH', path, { ...options, body }),

  delete: <T>(path: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('DELETE', path, options),
};
