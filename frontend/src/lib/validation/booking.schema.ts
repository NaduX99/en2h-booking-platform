import { z } from 'zod';

export const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Please select a service'),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().min(1, 'Email is required').email('Invalid email address'),
  customerPhone: z
    .string()
    .min(7, 'Phone number must be at least 7 digits')
    .regex(/^[\d\s\+\-\(\)]+$/, 'Invalid phone number'),
  bookingDate: z.string().min(1, 'Please select a date'),
  bookingTime: z.string().min(1, 'Please select a time'),
  notes: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
