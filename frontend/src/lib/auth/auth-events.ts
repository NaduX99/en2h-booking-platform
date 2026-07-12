export const AUTH_LOGOUT_EVENT = 'en2h:auth:logout';

export function dispatchLogout(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT));
  }
}

export function onLogout(handler: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(AUTH_LOGOUT_EVENT, handler);
  return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handler);
}
