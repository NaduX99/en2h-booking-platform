import { ServiceItem } from './service.types';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  service?: ServiceItem;
  bookingDate: string;
  bookingTime: string;
  status: BookingStatus;
  notes?: string | null;
  cancelledAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookingInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  bookingDate: string;
  bookingTime: string;
  notes?: string;
}

export interface BookingQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: BookingStatus;
  serviceId?: string;
}
