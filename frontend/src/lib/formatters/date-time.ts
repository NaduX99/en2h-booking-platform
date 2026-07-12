import { format, parseISO, isValid } from 'date-fns';

export function formatDate(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return 'Invalid date';
    return format(d, 'MMM d, yyyy');
  } catch {
    return 'Invalid date';
  }
}

export function formatDateTime(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return 'Invalid date';
    return format(d, 'MMM d, yyyy h:mm a');
  } catch {
    return 'Invalid date';
  }
}

export function formatTime(time: string): string {
  try {
    const [hours, minutes] = time.split(':').map(Number);
    const d = new Date();
    d.setHours(hours ?? 0, minutes ?? 0, 0);
    return format(d, 'h:mm a');
  } catch {
    return time;
  }
}

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}
