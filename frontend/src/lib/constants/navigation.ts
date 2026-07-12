export const ROUTES = {
  HOME: '/',
  SERVICES: '/services',
  BOOK: '/book',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  DASHBOARD_SERVICES: '/dashboard/services',
  DASHBOARD_BOOKINGS: '/dashboard/bookings',
  DASHBOARD_BOOKING_DETAIL: (id: string) => `/dashboard/bookings/${id}`,
} as const;
