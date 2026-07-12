import { BookingStatus } from '@/types/booking.types';

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
};

export const BOOKING_STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED'],
  CANCELLED: [],
  COMPLETED: [],
};

export const FINAL_STATUSES: BookingStatus[] = ['CANCELLED', 'COMPLETED'];

export function getAllowedTransitions(status: BookingStatus): BookingStatus[] {
  return BOOKING_STATUS_TRANSITIONS[status] ?? [];
}

export function isFinalStatus(status: BookingStatus): boolean {
  return FINAL_STATUSES.includes(status);
}
