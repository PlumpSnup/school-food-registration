import { isSchoolDay, nextSchoolDay, nowInDubai } from "@/lib/dates";
import { activeCount, type DemoState } from "@/lib/demo";

/** The delivery days a kitchen page can switch between: today (on school days) and the next eight. */
export function kitchenDays(state: DemoState, requested?: string) {
  const now = nowInDubai();
  const dates: string[] = [];
  let d = isSchoolDay(now.date) ? now.date : nextSchoolDay(now.date);
  while (dates.length < 8) {
    dates.push(d);
    d = nextSchoolDay(d);
  }
  const days = dates.map((date) => ({ date, count: activeCount(state, date, now) }));
  const tomorrow = nextSchoolDay(now.date);
  const selected = requested && dates.includes(requested) ? requested : tomorrow;
  return { now, days, selected, tomorrow };
}
