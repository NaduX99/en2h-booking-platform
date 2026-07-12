import { apiClient } from './api-client';
import { ApiResponse } from '@/types/api.types';
import { Booking, CreateBookingInput, BookingQuery, BookingStatus } from '@/types/booking.types';

function buildQuery(q: BookingQuery): string {
  const params = new URLSearchParams();
  if (q.page) params.set('page', String(q.page));
  if (q.limit) params.set('limit', String(q.limit));
  if (q.search) params.set('search', q.search);
  if (q.status) params.set('status', q.status);
  if (q.serviceId) params.set('serviceId', q.serviceId);
  const s = params.toString();
  return s ? `?${s}` : '';
}

export const bookingsApi = {
  create: (input: CreateBookingInput) =>
    apiClient.post<ApiResponse<Booking>>('/bookings', input),

  getAll: (query: BookingQuery = {}) =>
    apiClient.get<ApiResponse<Booking[]>>(`/bookings${buildQuery(query)}`),

  getOne: (id: string) =>
    apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`),

  updateStatus: (id: string, status: BookingStatus) =>
    apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/status`, { status }),

  cancel: (id: string) =>
    apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/cancel`),
};
