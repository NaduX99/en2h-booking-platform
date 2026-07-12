import { z } from 'zod';

export const serviceSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  duration: z
    .number({ message: 'Duration must be a number' })
    .int('Duration must be a whole number')
    .min(5, 'Duration must be at least 5 minutes'),
  price: z
    .number({ message: 'Price must be a number' })
    .min(0, 'Price cannot be negative'),
  isActive: z.boolean(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
