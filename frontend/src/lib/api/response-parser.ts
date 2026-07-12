import { ApiError } from './api-error';

export interface NestJsErrorBody {
  success?: boolean;
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

export function parseErrorBody(body: NestJsErrorBody, status: number): ApiError {
  const STATUS_MESSAGES: Record<number, string> = {
    400: 'Invalid request. Please check your input.',
    401: 'Your session has expired. Please log in again.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'This action conflicts with existing data.',
    429: 'Too many requests. Please wait and try again.',
    500: 'A server error occurred. Please try again later.',
  };

  let message = STATUS_MESSAGES[status] ?? 'An unexpected error occurred.';

  if (body?.message) {
    if (Array.isArray(body.message)) {
      message = body.message[0] ?? message;
    } else if (typeof body.message === 'string') {
      message = body.message;
    }
  }

  // Humanize common backend messages
  if (message.toLowerCase().includes('email already exists') || message.toLowerCase().includes('duplicate')) {
    message = 'This email is already registered.';
  }
  if (message.toLowerCase().includes('invalid credentials') || message.toLowerCase().includes('wrong password')) {
    message = 'Invalid email or password.';
  }
  if (message.toLowerCase().includes('slot') || message.toLowerCase().includes('conflict')) {
    message = 'This time slot is already booked.';
  }
  if (message.toLowerCase().includes('not active') || message.toLowerCase().includes('inactive')) {
    message = 'This service is no longer available.';
  }

  return new ApiError(message, status, body);
}
