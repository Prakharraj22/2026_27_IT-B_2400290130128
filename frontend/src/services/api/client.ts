// Real HTTP client wired to the NestJS backend (`/v1` API, see Backend/README.md).
// Handles base URL config, JWT storage, the standard error envelope, and
// transparent access-token refresh on 401 responses.

export const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:3000/v1';

const ACCESS_TOKEN_KEY = 'careerai-access-token';
const REFRESH_TOKEN_KEY = 'careerai-refresh-token';

export function simulateLatency<T>(data: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export class ApiError extends Error {
  code: string;
  details: Record<string, unknown>;
  status: number;

  constructor(status: number, code: string, message: string, details: Record<string, unknown> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function hasAuthTokens(): boolean {
  return !!getRefreshToken();
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function setAccessToken(accessToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// Set by AppContext so the client can force a logout when refresh fails,
// without this module needing to import the router or app state.
let onSessionExpired: (() => void) | null = null;
export function setSessionExpiredHandler(handler: () => void): void {
  onSessionExpired = handler;
}

let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  if (!refreshInFlight) {
    refreshInFlight = fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const body = await res.json();
        setAccessToken(body.accessToken);
        return body.accessToken as string;
      })
      .catch(() => null)
      .finally(() => {
        refreshInFlight = null;
      });
  }

  return refreshInFlight;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  auth?: boolean; // defaults to true
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}, isRetry = false): Promise<T> {
  const { method = 'GET', body, auth = true } = options;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth && !isRetry) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      return apiRequest<T>(path, options, true);
    }
    clearTokens();
    onSessionExpired?.();
    throw new ApiError(401, 'UNAUTHORIZED', 'Session expired. Please log in again.');
  }

  if (res.status === 204) return undefined as T;

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    const err = payload?.error;
    throw new ApiError(res.status, err?.code || 'UNKNOWN_ERROR', err?.message || 'Something went wrong.', err?.details || {});
  }

  return payload as T;
}
