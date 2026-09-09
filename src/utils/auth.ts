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

/**
 * Safely decodes stored BPL session token payload locally without requiring network
 */
export function decodeSessionToken(token: string): AuthSession | null {
  if (!token || typeof token !== 'string') return null;

  try {
    let payloadB64 = '';
    if (token.startsWith('bpl_jwt_')) {
      const raw = token.slice('bpl_jwt_'.length);
      const dotIndex = raw.indexOf('.');
      payloadB64 = dotIndex !== -1 ? raw.substring(0, dotIndex) : raw;
    } else if (token.includes('.')) {
      const parts = token.split('.');
      payloadB64 = parts[1] || parts[0];
    } else {
      return null;
    }

    // Decode base64url / base64
    const base64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    const jsonString = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonString);

    const nowSec = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < nowSec) {
      // Expired token
      return null;
    }

    return {
      token,
      userId: payload.userId || 'bidwar_user',
      mobile: payload.mobile || '',
      authenticatedAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : new Date().toISOString()
    };
  } catch (err) {
    return null;
  }
}

export async function fetchAuthSession(): Promise<AuthSession | null> {
  const token = getStoredAuthToken();
  if (!token) return null;

  const localDecoded = decodeSessionToken(token);
  if (!localDecoded) {
    // Stored token is invalid or expired
    clearStoredAuthToken();
    return null;
  }

  // If browser is offline, instantly trust valid decoded local session
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return localDecoded;
  }

  try {
    const res = await fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.status === 401 || res.status === 403) {
      // Explicit unauthorized response from server
      clearStoredAuthToken();
      return null;
    }

    if (res.ok) {
      const data = await res.json();
      if (data.authenticated && data.identity) {
        return {
          token,
          userId: data.identity.userId,
          mobile: data.identity.mobile,
          authenticatedAt: data.identity.authenticatedAt || localDecoded.authenticatedAt
        };
      }
    }

    // If server responded with a non-401 error or unexpected JSON, fallback to valid decoded session
    return localDecoded;
  } catch (err) {
    // Network disconnection / timeout / offline: DO NOT log user out
    console.warn('[Auth] Network unreachable, preserving valid local authenticated session.');
    return localDecoded;
  }
}

