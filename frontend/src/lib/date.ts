const MONTHS_LONG  = ['January','February','March','April','May','June','July','August','September','October','November','December'] as const;
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] as const;

/** "January 2025" — safe for SSR, no locale dependency */
export function fmtMonthYear(iso: string): string {
  try {
    const d = new Date(iso);
    return `${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  } catch { return iso; }
}

/** "Jan 2025" — safe for SSR, no locale dependency */
export function fmtMonthYearShort(iso: string): string {
  try {
    const d = new Date(iso);
    return `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  } catch { return iso; }
}

/** "January 15, 2025" — safe for SSR, no locale dependency */
export function fmtFullDate(iso: string): string {
  try {
    const d = new Date(iso);
    return `${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  } catch { return iso; }
}
