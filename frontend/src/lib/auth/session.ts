import { AuthTokens, User } from '@/types/auth.types';
import {
  clearTokenStorage,
  setAccessToken,
  setRefreshToken,
  setStoredUser,
} from './token-storage';

export function saveSession(tokens: AuthTokens, user: User): void {
  setAccessToken(tokens.accessToken);
  setRefreshToken(tokens.refreshToken);
  setStoredUser(user);
}

export function clearSession(): void {
  clearTokenStorage();
}
