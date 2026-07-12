import { apiClient } from './api-client';
import { ApiResponse } from '@/types/api.types';
import { User, AuthTokens, LoginInput, RegisterInput } from '@/types/auth.types';

interface LoginResponse {
  success: boolean;
  message: string;
  data: AuthTokens & {
    user: User;
  };
}

interface RegisterResponse {
  data: User;
  message?: string;
}

export const authApi = {
  login: (input: LoginInput) =>
    apiClient.post<LoginResponse>('/auth/login', input, { isPublic: true }),

  register: (input: Omit<RegisterInput, 'confirmPassword'>) =>
    apiClient.post<RegisterResponse>('/auth/register', input, { isPublic: true }),

  logout: (refreshToken: string) =>
    apiClient.post<void>('/auth/logout', { refreshToken }),

  refresh: (refreshToken: string) =>
    apiClient.post<{ data: AuthTokens }>('/auth/refresh', { refreshToken }, {
      isPublic: true,
      skipRefresh: true,
    }),

  getProfile: () =>
    apiClient.get<ApiResponse<User>>('/auth/profile'),
};
