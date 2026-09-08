import { useState, useEffect, useCallback } from 'react';

export type AppRoute = '/' | '/register' | '/verify' | '/teams' | '/rules' | '/terms' | '/privacy' | '/refunds' | '/contact';

export function normalizePath(pathname: string): AppRoute {
  const clean = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (clean === '/register') return '/register';
  if (clean === '/verify') return '/verify';
  if (clean === '/teams') return '/teams';
  if (clean === '/rules') return '/rules';
  if (clean === '/terms') return '/terms';
  if (clean === '/privacy') return '/privacy';
  if (clean === '/refunds' || clean === '/refund-policy') return '/refunds';
  if (clean === '/contact' || clean === '/contact-us') return '/contact';
  return '/';
}

export function useRouter() {
  const [currentPath, setCurrentPath] = useState<AppRoute>(() => {
    if (typeof window !== 'undefined') {
      return normalizePath(window.location.pathname);
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path: AppRoute | string, replace = false) => {
    const normalized = normalizePath(path);
    if (typeof window !== 'undefined') {
      if (replace) {
        window.history.replaceState({}, '', normalized);
      } else if (window.location.pathname !== normalized) {
        window.history.pushState({}, '', normalized);
      }
      setCurrentPath(normalized);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return { currentPath, navigate };
}
