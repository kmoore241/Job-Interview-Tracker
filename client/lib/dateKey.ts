/**
 * Convert a Date to a consistent string key (YYYY-MM-DD)
 * Used for comparing dates without timezone/time issues
 */
export const dayKey = (d: Date): string => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Calculate time remaining until a date
 */
export const getCountdown = (
  targetDate: Date
): { days: number; hours: number; isNegative: boolean } => {
  const now = Date.now();
  const target = targetDate.getTime();
  const ms = target - now;

  if (ms < 0) {
    return { days: 0, hours: 0, isNegative: true };
  }

  const totalHours = Math.floor(ms / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  return { days, hours, isNegative: false };
};
