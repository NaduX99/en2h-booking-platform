const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  if (typeof window === 'undefined') {
    // Server side - skip throw during build
    console.warn('NEXT_PUBLIC_API_URL is not configured');
  }
}

export const env = {
  apiUrl: (apiUrl ?? 'http://localhost:3000/api/v1').replace(/\/$/, ''),
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'EN2H Booking Platform',
} as const;
