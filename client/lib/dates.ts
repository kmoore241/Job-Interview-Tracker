/**
 * Parse a YYYY-MM-DD string to a Date object in LOCAL time (not UTC)
 * This prevents the "one day back" timezone bug
 */
export function parseLocalDate(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d); // local time, safe
}

/**
 * Format a Date object to YYYY-MM-DD string (local time)
 * Safe for use with <input type="date" />
 */
export function formatLocalYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Validate that a string is in YYYY-MM-DD format
 */
export function isValidDateString(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}
