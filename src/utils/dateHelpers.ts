// Date and time utilities

/**
 * Format a date to a readable string
 */
export function formatDate(
  date: Date | string | number,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium',
  locale: string = 'en-IN'
): string {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const options: Intl.DateTimeFormatOptions = {
    short: { month: 'short', day: 'numeric' },
    medium: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  }[format] as Intl.DateTimeFormatOptions;

  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format a time to a readable string
 */
export function formatTime(
  date: Date | string | number,
  format: 'short' | 'medium' | 'long' = 'medium',
  locale: string = 'en-IN'
): string {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Time';
  }

  const options: Intl.DateTimeFormatOptions = {
    short: { hour: '2-digit', minute: '2-digit' },
    medium: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
    long: { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' },
  }[format] as Intl.DateTimeFormatOptions;

  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format a date and time
 */
export function formatDateTime(
  date: Date | string | number,
  format: 'short' | 'medium' | 'long' = 'medium',
  locale: string = 'en-IN'
): string {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Invalid DateTime';
  }

  const options: Intl.DateTimeFormatOptions = {
    short: { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    medium: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
    long: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
  }[format] as Intl.DateTimeFormatOptions;

  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format a relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale: string = 'en-IN'
): string {
  const dateObj = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string | number): boolean {
  const dateObj = new Date(date);
  const today = new Date();

  return dateObj.toDateString() === today.toDateString();
}

/**
 * Check if a date is yesterday
 */
export function isYesterday(date: Date | string | number): boolean {
  const dateObj = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return dateObj.toDateString() === yesterday.toDateString();
}

/**
 * Check if a date is tomorrow
 */
export function isTomorrow(date: Date | string | number): boolean {
  const dateObj = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return dateObj.toDateString() === tomorrow.toDateString();
}

/**
 * Get the start of day
 */
export function startOfDay(date: Date | string | number): Date {
  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
}

/**
 * Get the end of day
 */
export function endOfDay(date: Date | string | number): Date {
  const dateObj = new Date(date);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
}

/**
 * Get the start of week
 */
export function startOfWeek(date: Date | string | number, weekStartsOn: 0 | 1 = 1): Date {
  const dateObj = new Date(date);
  const day = dateObj.getDay();
  const diff = (day - weekStartsOn + 7) % 7;
  dateObj.setDate(dateObj.getDate() - diff);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
}

/**
 * Get the end of week
 */
export function endOfWeek(date: Date | string | number, weekStartsOn: 0 | 1 = 1): Date {
  const dateObj = startOfWeek(date, weekStartsOn);
  dateObj.setDate(dateObj.getDate() + 6);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
}

/**
 * Get the start of month
 */
export function startOfMonth(date: Date | string | number): Date {
  const dateObj = new Date(date);
  dateObj.setDate(1);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
}

/**
 * Get the end of month
 */
export function endOfMonth(date: Date | string | number): Date {
  const dateObj = new Date(date);
  dateObj.setMonth(dateObj.getMonth() + 1, 0);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
}

/**
 * Get the start of year
 */
export function startOfYear(date: Date | string | number): Date {
  const dateObj = new Date(date);
  dateObj.setMonth(0, 1);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
}

/**
 * Get the end of year
 */
export function endOfYear(date: Date | string | number): Date {
  const dateObj = new Date(date);
  dateObj.setMonth(11, 31);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
}

/**
 * Add time to a date
 */
export function addTime(
  date: Date | string | number,
  amount: number,
  unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years'
): Date {
  const dateObj = new Date(date);

  switch (unit) {
    case 'seconds':
      dateObj.setSeconds(dateObj.getSeconds() + amount);
      break;
    case 'minutes':
      dateObj.setMinutes(dateObj.getMinutes() + amount);
      break;
    case 'hours':
      dateObj.setHours(dateObj.getHours() + amount);
      break;
    case 'days':
      dateObj.setDate(dateObj.getDate() + amount);
      break;
    case 'weeks':
      dateObj.setDate(dateObj.getDate() + (amount * 7));
      break;
    case 'months':
      dateObj.setMonth(dateObj.getMonth() + amount);
      break;
    case 'years':
      dateObj.setFullYear(dateObj.getFullYear() + amount);
      break;
  }

  return dateObj;
}

/**
 * Subtract time from a date
 */
export function subtractTime(
  date: Date | string | number,
  amount: number,
  unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years'
): Date {
  return addTime(date, -amount, unit);
}

/**
 * Get the difference between two dates
 */
export function getDateDifference(
  date1: Date | string | number,
  date2: Date | string | number,
  unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years' = 'days'
): number {
  const dateObj1 = new Date(date1);
  const dateObj2 = new Date(date2);
  const diffMs = dateObj2.getTime() - dateObj1.getTime();

  switch (unit) {
    case 'seconds':
      return Math.floor(diffMs / 1000);
    case 'minutes':
      return Math.floor(diffMs / (1000 * 60));
    case 'hours':
      return Math.floor(diffMs / (1000 * 60 * 60));
    case 'days':
      return Math.floor(diffMs / (1000 * 60 * 60 * 24));
    case 'weeks':
      return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
    case 'months':
      return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
    case 'years':
      return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));
    default:
      return 0;
  }
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date | string | number, date2: Date | string | number): boolean {
  const dateObj1 = new Date(date1);
  const dateObj2 = new Date(date2);

  return dateObj1.getFullYear() === dateObj2.getFullYear() &&
    dateObj1.getMonth() === dateObj2.getMonth() &&
    dateObj1.getDate() === dateObj2.getDate();
}

/**
 * Check if two dates are in the same week
 */
export function isSameWeek(date1: Date | string | number, date2: Date | string | number): boolean {
  const dateObj1 = new Date(date1);
  const dateObj2 = new Date(date2);

  const startOfWeek1 = startOfWeek(dateObj1);
  const startOfWeek2 = startOfWeek(dateObj2);

  return isSameDay(startOfWeek1, startOfWeek2);
}

/**
 * Check if two dates are in the same month
 */
export function isSameMonth(date1: Date | string | number, date2: Date | string | number): boolean {
  const dateObj1 = new Date(date1);
  const dateObj2 = new Date(date2);

  return dateObj1.getFullYear() === dateObj2.getFullYear() &&
    dateObj1.getMonth() === dateObj2.getMonth();
}

/**
 * Check if two dates are in the same year
 */
export function isSameYear(date1: Date | string | number, date2: Date | string | number): boolean {
  const dateObj1 = new Date(date1);
  const dateObj2 = new Date(date2);

  return dateObj1.getFullYear() === dateObj2.getFullYear();
}

/**
 * Get the day of the week
 */
export function getDayOfWeek(date: Date | string | number, locale: string = 'en-IN'): string {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(dateObj);
}

/**
 * Get the month name
 */
export function getMonthName(date: Date | string | number, locale: string = 'en-IN'): string {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat(locale, { month: 'long' }).format(dateObj);
}

/**
 * Get the quarter of the year
 */
export function getQuarter(date: Date | string | number): number {
  const dateObj = new Date(date);
  return Math.floor((dateObj.getMonth() + 3) / 3);
}

/**
 * Check if a year is a leap year
 */
export function isLeapYear(year: number): boolean {
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

/**
 * Get the number of days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the week number of the year
 */
export function getWeekNumber(date: Date | string | number): number {
  const dateObj = new Date(date);
  const firstDayOfYear = new Date(dateObj.getFullYear(), 0, 1);
  const pastDaysOfYear = (dateObj.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Parse a date string in various formats
 */
export function parseDate(dateString: string): Date | null {
  // Try ISO format first
  const isoDate = new Date(dateString);
  if (!isNaN(isoDate.getTime())) {
    return isoDate;
  }

  // Try common formats
  const formats = [
    // DD/MM/YYYY
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
    // MM/DD/YYYY
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
    // YYYY-MM-DD
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
    // DD-MM-YYYY
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
  ];

  for (const format of formats) {
    const match = dateString.match(format);
    if (match) {
      try {
        // Assume DD/MM/YYYY format for now
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // Month is 0-based
        const year = parseInt(match[3], 10);

        const parsedDate = new Date(year, month, day);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate;
        }
      } catch {
        continue;
      }
    }
  }

  return null;
}

/**
 * Format a date range
 */
export function formatDateRange(
  startDate: Date | string | number,
  endDate: Date | string | number,
  format: 'short' | 'medium' | 'long' = 'medium',
  locale: string = 'en-IN'
): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isSameDay(start, end)) {
    return formatDate(start, format, locale);
  }

  if (isSameMonth(start, end)) {
    return `${start.getDate()} - ${formatDate(end, format, locale)}`;
  }

  if (isSameYear(start, end)) {
    return `${formatDate(start, 'medium', locale)} - ${formatDate(end, 'medium', locale)}`;
  }

  return `${formatDate(start, format, locale)} - ${formatDate(end, format, locale)}`;
}

/**
 * Get business days between two dates
 */
export function getBusinessDays(startDate: Date | string | number, endDate: Date | string | number): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;

  const current = new Date(start);
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

/**
 * Check if a date is a business day
 */
export function isBusinessDay(date: Date | string | number): boolean {
  const dateObj = new Date(date);
  const dayOfWeek = dateObj.getDay();
  return dayOfWeek !== 0 && dayOfWeek !== 6;
}

/**
 * Get the next business day
 */
export function getNextBusinessDay(date: Date | string | number): Date {
  const dateObj = new Date(date);
  const nextDay = new Date(dateObj);
  nextDay.setDate(nextDay.getDate() + 1);

  while (!isBusinessDay(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }

  return nextDay;
}

/**
 * Format a duration
 */
export function formatDuration(
  milliseconds: number,
  format: 'short' | 'medium' | 'long' = 'medium'
): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  switch (format) {
    case 'short':
      if (hours > 0) return `${hours}h ${minutes % 60}m`;
      if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
      return `${seconds}s`;

    case 'medium':
      if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ${minutes % 60} minute${minutes % 60 !== 1 ? 's' : ''}`;
      if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ${seconds % 60} second${seconds % 60 !== 1 ? 's' : ''}`;
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;

    case 'long':
      const parts = [];
      if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
      if (minutes % 60 > 0) parts.push(`${minutes % 60} minute${minutes % 60 !== 1 ? 's' : ''}`);
      if (seconds % 60 > 0) parts.push(`${seconds % 60} second${seconds % 60 !== 1 ? 's' : ''}`);
      return parts.join(', ');

    default:
      return formatDuration(milliseconds, 'medium');
  }
}

/**
 * Get the age from a birth date
 */
export function getAge(birthDate: Date | string | number): number {
  const birth = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Format an age
 */
export function formatAge(birthDate: Date | string | number): string {
  const age = getAge(birthDate);

  if (age < 1) {
    const months = getDateDifference(birthDate, new Date(), 'months');
    return `${months} month${months > 1 ? 's' : ''} old`;
  }

  return `${age} year${age > 1 ? 's' : ''} old`;
}

/**
 * Get a date range for a period
 */
export function getDateRange(
  period: 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear'
): { start: Date; end: Date } {
  const now = new Date();

  switch (period) {
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) };

    case 'yesterday':
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return { start: startOfDay(yesterday), end: endOfDay(yesterday) };

    case 'thisWeek':
      return { start: startOfWeek(now), end: endOfWeek(now) };

    case 'lastWeek':
      const lastWeek = new Date(now);
      lastWeek.setDate(lastWeek.getDate() - 7);
      return { start: startOfWeek(lastWeek), end: endOfWeek(lastWeek) };

    case 'thisMonth':
      return { start: startOfMonth(now), end: endOfMonth(now) };

    case 'lastMonth':
      const lastMonth = new Date(now);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };

    case 'thisYear':
      return { start: startOfYear(now), end: endOfYear(now) };

    case 'lastYear':
      const lastYear = new Date(now);
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      return { start: startOfYear(lastYear), end: endOfYear(lastYear) };

    default:
      return { start: startOfDay(now), end: endOfDay(now) };
  }
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: Date | string | number): boolean {
  return new Date(date) > new Date();
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date | string | number): boolean {
  return new Date(date) < new Date();
}

/**
 * Get the next occurrence of a specific day of the week
 */
export function getNextDayOfWeek(dayOfWeek: number, fromDate?: Date): Date {
  const from = fromDate ? new Date(fromDate) : new Date();
  const daysUntilNext = (dayOfWeek - from.getDay() + 7) % 7;

  const nextDate = new Date(from);
  nextDate.setDate(from.getDate() + (daysUntilNext === 0 ? 7 : daysUntilNext));

  return nextDate;
}

/**
 * Get the previous occurrence of a specific day of the week
 */
export function getPreviousDayOfWeek(dayOfWeek: number, fromDate?: Date): Date {
  const from = fromDate ? new Date(fromDate) : new Date();
  const daysSinceLast = (from.getDay() - dayOfWeek + 7) % 7;

  const previousDate = new Date(from);
  previousDate.setDate(from.getDate() - (daysSinceLast === 0 ? 7 : daysSinceLast));

  return previousDate;
}

/**
 * Format a date for input fields
 */
export function formatDateForInput(date: Date | string | number): string {
  const dateObj = new Date(date);
  return dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
}

/**
 * Format a time for input fields
 */
export function formatTimeForInput(date: Date | string | number): string {
  const dateObj = new Date(date);
  return dateObj.toTimeString().slice(0, 5); // HH:MM format
}

/**
 * Format a datetime for input fields
 */
export function formatDateTimeForInput(date: Date | string | number): string {
  const dateObj = new Date(date);
  return dateObj.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM format
}

/**
 * Get the time zone offset
 */
export function getTimezoneOffset(date: Date | string | number, locale: string = 'en-IN'): string {
  const dateObj = new Date(date);
  const offset = dateObj.getTimezoneOffset();
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset <= 0 ? '+' : '-';

  return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Convert time from one timezone to another
 */
export function convertTimezone(
  date: Date | string | number,
  fromTimezone: string,
  toTimezone: string
): Date {
  // This is a simplified implementation
  // In a real app, you'd use a proper timezone library
  const dateObj = new Date(date);
  const fromOffset = getTimezoneOffsetInMinutes(fromTimezone);
  const toOffset = getTimezoneOffsetInMinutes(toTimezone);

  const diff = toOffset - fromOffset;
  return new Date(dateObj.getTime() + diff * 60 * 1000);
}

/**
 * Get timezone offset in minutes
 */
function getTimezoneOffsetInMinutes(timezone: string): number {
  // This is a simplified implementation
  // In a real app, you'd use the Intl API or a timezone library
  const timezones: Record<string, number> = {
    'UTC': 0,
    'IST': 330, // India Standard Time
    'EST': -300, // Eastern Standard Time
    'PST': -480, // Pacific Standard Time
    'GMT': 0,
  };

  return timezones[timezone] || 0;
}

/**
 * Check if a date is between two dates
 */
export function isBetween(
  date: Date | string | number,
  startDate: Date | string | number,
  endDate: Date | string | number
): boolean {
  const dateObj = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);

  return dateObj >= start && dateObj <= end;
}
