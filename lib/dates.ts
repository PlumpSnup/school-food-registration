// Calendar dates as "YYYY-MM-DD" strings, always in Dubai time.

const TZ = "Asia/Dubai";

export type Now = { date: string; hour: number };

export function nowInDubai(): Now {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { date: `${get("year")}-${get("month")}-${get("day")}`, hour: Number(get("hour")) };
}

function utc(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

export function addDays(date: string, days: number): string {
  const d = utc(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 0 = Sunday … 6 = Saturday. */
export function weekday(date: string): number {
  return utc(date).getUTCDay();
}

export function isSchoolDay(date: string): boolean {
  const w = weekday(date);
  return w >= 1 && w <= 5;
}

export function mondayOf(date: string): string {
  const w = weekday(date);
  return addDays(date, w === 0 ? -6 : 1 - w);
}

export function schoolWeek(monday: string): string[] {
  return [0, 1, 2, 3, 4].map((i) => addDays(monday, i));
}

export function nextSchoolDay(date: string): string {
  let d = addDays(date, 1);
  while (!isSchoolDay(d)) d = addDays(d, 1);
  return d;
}

/** Orders for a day close at 6 pm Dubai time the day before. */
export const CUTOFF_HOUR = 18;

export function isOpen(date: string, now: Now = nowInDubai()): boolean {
  const cutoffDay = addDays(date, -1);
  return now.date < cutoffDay || (now.date === cutoffDay && now.hour < CUTOFF_HOUR);
}

/** The Monday of the week parents order for: next week, or the one after once Monday has closed. */
export function orderWeekStart(now: Now = nowInDubai()): string {
  const monday = addDays(mondayOf(now.date), 7);
  return isOpen(monday, now) ? monday : addDays(monday, 7);
}

export function formatDate(date: string, options: Intl.DateTimeFormatOptions): string {
  return utc(date).toLocaleDateString("en-GB", { timeZone: "UTC", ...options });
}

/** "23–27 Nov" for a school week. */
export function weekRange(monday: string): string {
  const friday = addDays(monday, 4);
  const sameMonth = monday.slice(5, 7) === friday.slice(5, 7);
  const start = formatDate(monday, sameMonth ? { day: "numeric" } : { day: "numeric", month: "short" });
  return `${start}–${formatDate(friday, { day: "numeric", month: "short" })}`;
}

/** "just now", "4 min ago", "2 h ago", "3 days ago". */
export function timeAgo(iso: string, nowMs = Date.now()): string {
  const minutes = Math.max(0, Math.round((nowMs - new Date(iso).getTime()) / 60_000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}
