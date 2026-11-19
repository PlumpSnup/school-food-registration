import { nowInDubai, orderWeekStart, schoolWeek } from "@/lib/dates";
import { activeCount, isNewOrder, latestOrders, type DemoState } from "@/lib/demo";

/** The kitchen works on the week parents order for: Monday to Friday of next week. */
export function kitchenDays(state: DemoState, requested?: string) {
  const now = nowInDubai();
  const dates = schoolWeek(orderWeekStart(now));
  const days = dates.map((date) => ({ date, count: activeCount(state, date, now) }));
  // Without a chosen day, open on the day of the newest order if it just came in, so it shows straight away.
  const newest = latestOrders(state, 1)[0];
  const newestDay = newest && isNewOrder(newest) ? newest.lunches.map((l) => l.date).find((d) => dates.includes(d)) : undefined;
  const selected = requested && dates.includes(requested) ? requested : (newestDay ?? dates[0]);
  return { now, days, selected };
}
