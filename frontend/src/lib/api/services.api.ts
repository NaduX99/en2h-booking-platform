import { apiClient } from './api-client';
import { ApiResponse } from '@/types/api.types';
import { ServiceItem, CreateServiceInput, UpdateServiceInput, ServiceQuery } from '@/types/service.types';

function buildQuery(q: ServiceQuery): string {
  const params = new URLSearchParams();
  if (q.page) params.set('page', String(q.page));
  if (q.limit) params.set('limit', String(q.limit));
  if (q.search) params.set('search', q.search);
  if (q.isActive !== undefined) params.set('isActive', String(q.isActive));
  const s = params.toString();
  return s ? `?${s}` : '';
}

export const servicesApi = {
  getAll: (query: ServiceQuery = {}) =>
    apiClient.get<ApiResponse<ServiceItem[]>>(`/services${buildQuery(query)}`),

  getPublicActive: (query: Omit<ServiceQuery, 'isActive'> = {}) =>
    apiClient.get<ApiResponse<ServiceItem[]>>(`/services/public/active${buildQuery(query)}`, {
      isPublic: true,
    }),

  getOne: (id: string) =>
    apiClient.get<ApiResponse<ServiceItem>>(`/services/${id}`),

  create: (input: CreateServiceInput) =>
    apiClient.post<ApiResponse<ServiceItem>>('/services', input),

  update: (id: string, input: UpdateServiceInput) =>
    apiClient.patch<ApiResponse<ServiceItem>>(`/services/${id}`, input),

  remove: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/services/${id}`),
};
