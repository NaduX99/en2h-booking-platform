'use client';

import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { authApi } from '@/lib/api/auth.api';
import { clearSession, saveSession } from '@/lib/auth/session';
import { getRefreshToken, getStoredUser } from '@/lib/auth/token-storage';
import { onLogout } from '@/lib/auth/auth-events';
import { getErrorMessage } from '@/lib/api/api-error';
import { AuthContextValue, LoginInput, RegisterInput, User } from '@/types/auth.types';

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialized = useRef(false);

  const clearAndReset = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  // Restore session on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function restore() {
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          setIsInitializing(false);
          return;
        }

        // Try profile with existing access token
        try {
          const res = await authApi.getProfile();
          setUser(res.data);
        } catch {
          // Try refresh
          try {
            const rt = getRefreshToken();
            if (!rt) throw new Error('No refresh token');
            const refreshRes = await authApi.refresh(rt);
            const tokens = refreshRes.data;
            const profileRes = await authApi.getProfile();
            saveSession(tokens, profileRes.data);
            setUser(profileRes.data);
          } catch {
            clearAndReset();
          }
        }
      } finally {
        setIsInitializing(false);
      }
    }

    void restore();
  }, [clearAndReset]);

  // Listen for forced logout events
  useEffect(() => {
    return onLogout(() => {
      clearAndReset();
    });
  }, [clearAndReset]);

  const login = useCallback(async (input: LoginInput) => {
    setIsSubmitting(true);
    try {
      const res = await authApi.login(input);
      const { user: u, ...tokens } = res.data;
      saveSession(tokens, u);
      setUser(u);
      toast.success(`Welcome back, ${u.name}!`);
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: input.name,
        email: input.email,
        password: input.password,
      };
      await authApi.register(payload);
      toast.success('Account created! Please log in.');
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const rt = getRefreshToken();
      if (rt) await authApi.logout(rt);
    } catch {
      // ignore
    } finally {
      clearAndReset();
      toast.success('Logged out successfully.');
    }
  }, [clearAndReset]);

  const refreshSession = useCallback(async () => {
    const rt = getRefreshToken();
    if (!rt) return;
    try {
      const res = await authApi.refresh(rt);
      const tokens = res.data;
      const storedUser = getStoredUser();
      if (storedUser) saveSession(tokens, storedUser);
    } catch {
      clearAndReset();
    }
  }, [clearAndReset]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isInitializing,
    isSubmitting,
    login,
    register,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
