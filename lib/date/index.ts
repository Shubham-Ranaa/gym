import { formatInTimeZone, toZonedTime, fromZonedTime, getTimezoneOffset } from 'date-fns-tz';
import { format, startOfDay, endOfDay, isSameDay, addDays, subDays, parseISO } from 'date-fns';

export const DEFAULT_TIMEZONE = 'Asia/Kolkata';

export function getGymTimezone(): string {
  return process.env.GYM_TIMEZONE || DEFAULT_TIMEZONE;
}

export function getCurrentGymTime(timezone?: string): Date {
  const tz = timezone || getGymTimezone();
  return toZonedTime(new Date(), tz);
}

export function getGymLocalDate(timezone?: string): string {
  const now = getCurrentGymTime(timezone);
  return format(now, 'yyyy-MM-dd');
}

export function getGymLocalDateFromUTC(utcDate: string | Date, timezone?: string): string {
  const date = typeof utcDate === 'string' ? parseISO(utcDate) : utcDate;
  const tz = timezone || getGymTimezone();
  const zoned = toZonedTime(date, tz);
  return format(zoned, 'yyyy-MM-dd');
}

export function getGymLocalDateTime(timezone?: string): Date {
  return getCurrentGymTime(timezone);
}

export function utcToGymLocal(utcDate: string | Date, timezone?: string): Date {
  const date = typeof utcDate === 'string' ? parseISO(utcDate) : utcDate;
  const tz = timezone || getGymTimezone();
  return toZonedTime(date, tz);
}

export function gymLocalToUTC(localDate: string | Date, timezone?: string): Date {
  const date = typeof localDate === 'string' ? parseISO(localDate) : localDate;
  const tz = timezone || getGymTimezone();
  return fromZonedTime(date, tz);
}

export function formatInGymTimezone(
  date: string | Date,
  formatStr: string,
  timezone?: string
): string {
  const tz = timezone || getGymTimezone();
  return formatInTimeZone(date, tz, formatStr);
}

export function formatGymDate(date: string | Date, timezone?: string): string {
  return formatInGymTimezone(date, 'yyyy-MM-dd', timezone);
}

export function formatGymDateTime(date: string | Date, timezone?: string): string {
  return formatInGymTimezone(date, 'yyyy-MM-dd HH:mm:ss', timezone);
}

export function formatGymTime(date: string | Date, timezone?: string): string {
  return formatInGymTimezone(date, 'HH:mm:ss', timezone);
}

export function getStartOfGymDay(date: string | Date, timezone?: string): Date {
  const tz = timezone || getGymTimezone();
  const zoned = typeof date === 'string' ? toZonedTime(parseISO(date), tz) : toZonedTime(date, tz);
  return startOfDay(zoned);
}

export function getEndOfGymDay(date: string | Date, timezone?: string): Date {
  const tz = timezone || getGymTimezone();
  const zoned = typeof date === 'string' ? toZonedTime(parseISO(date), tz) : toZonedTime(date, tz);
  return endOfDay(zoned);
}

export function isSameGymDay(date1: string | Date, date2: string | Date, timezone?: string): boolean {
  const tz = timezone || getGymTimezone();
  const d1 = typeof date1 === 'string' ? toZonedTime(parseISO(date1), tz) : toZonedTime(date1, tz);
  const d2 = typeof date2 === 'string' ? toZonedTime(parseISO(date2), tz) : toZonedTime(date2, tz);
  return isSameDay(d1, d2);
}

export function addGymDays(date: string | Date, days: number, timezone?: string): Date {
  const tz = timezone || getGymTimezone();
  const zoned = typeof date === 'string' ? toZonedTime(parseISO(date), tz) : toZonedTime(date, tz);
  return addDays(zoned, days);
}

export function subGymDays(date: string | Date, days: number, timezone?: string): Date {
  const tz = timezone || getGymTimezone();
  const zoned = typeof date === 'string' ? toZonedTime(parseISO(date), tz) : toZonedTime(date, tz);
  return subDays(zoned, days);
}

export function getLastNGymDays(n: number, timezone?: string): string[] {
  const dates: string[] = [];
  const today = getCurrentGymTime(timezone);
  for (let i = n - 1; i >= 0; i--) {
    const day = subDays(today, i);
    dates.push(format(day, 'yyyy-MM-dd'));
  }
  return dates;
}

export function getGymDayBounds(gymLocalDate: string, timezone?: string): { start: Date; end: Date } {
  const tz = timezone || getGymTimezone();
  const start = gymLocalToUTC(`${gymLocalDate}T00:00:00`, tz);
  const end = gymLocalToUTC(`${gymLocalDate}T23:59:59.999`, tz);
  return { start, end };
}

export function getTimezoneOffsetMinutes(timezone?: string): number {
  const tz = timezone || getGymTimezone();
  return getTimezoneOffset(tz, new Date());
}

export function formatRelativeTime(date: string | Date, timezone?: string): string {
  const tz = timezone || getGymTimezone();
  const now = getCurrentGymTime(tz);
  const then = typeof date === 'string' ? toZonedTime(parseISO(date), tz) : toZonedTime(date, tz);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatInGymTimezone(then, 'MMM d, yyyy', tz);
}