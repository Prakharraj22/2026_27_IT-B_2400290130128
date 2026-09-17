import { apiRequest, setTokens, clearTokens, getRefreshToken, simulateLatency } from './client';
import { getProfile, updateProfile } from './profileApi';
import type { User } from '../../types';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// POST /v1/auth/login
export async function login(email: string, password: string): Promise<{ user: User }> {
  const tokens = await apiRequest<TokenPair>('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
  setTokens(tokens.accessToken, tokens.refreshToken);
  const user = await getProfile();
  return { user };
}

// POST /v1/auth/register, then /v1/auth/login (register does not return tokens),
// then PATCH /v1/profiles/me to store the display name (backend has no separate
// "name" field on User — fullName lives on Profile).
export async function signup(name: string, email: string, password: string): Promise<{ user: User }> {
  await apiRequest('/auth/register', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
  const tokens = await apiRequest<TokenPair>('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
  setTokens(tokens.accessToken, tokens.refreshToken);
  const user = await updateProfile({ name });
  return { user };
}

// POST /v1/auth/logout — best-effort; local session is cleared regardless.
export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    await apiRequest('/auth/logout', { method: 'POST', body: { refreshToken } }).catch(() => undefined);
  }
  clearTokens();
}

// POST /v1/auth/forgot-password — not implemented by the backend yet (no
// password-reset flow exists). Kept mocked so the UI path stays functional.
export async function forgotPassword(_email: string) {
  return simulateLatency({ success: true }, 900);
}
