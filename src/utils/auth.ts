export const AUTH_TOKEN_KEY = 'bpl_auth_token';

export interface AuthSession {
  token: string;
  userId: string;
  mobile: string;
  authenticatedAt: string;
}

export function getStoredAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function fetchAuthSession(): Promise<AuthSession | null> {
  const token = getStoredAuthToken();
  if (!token) return null;

  try {
    const res = await fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) {
      clearStoredAuthToken();
      return null;
    }
    const data = await res.json();
    if (data.authenticated && data.identity) {
      return {
        token,
        userId: data.identity.userId,
        mobile: data.identity.mobile,
        authenticatedAt: data.identity.authenticatedAt || new Date().toISOString()
      };
    } else {
      clearStoredAuthToken();
      return null;
    }
  } catch (err) {
    console.warn('Auth check network error:', err);
    return null;
  }
}
