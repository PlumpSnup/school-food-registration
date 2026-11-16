import Link from "next/link";
import { formatDate } from "@/lib/dates";

/** Chips for choosing which delivery day a kitchen page shows. */
export default function DayPicker({
  base,
  days,
  selected,
  today,
}: {
  base: string;
  days: { date: string; count: number }[];
  selected: string;
  today: string;
}) {
  return (
    <div className="day-chips no-print" role="group" aria-label="Delivery day">
      {days.map((d) => (
        <Link
          key={d.date}
          href={`${base}?day=${d.date}`}
          className={d.date === selected ? "day-chip on" : "day-chip"}
          aria-current={d.date === selected ? "date" : undefined}
        >
          <b>{d.date === today ? "Today" : formatDate(d.date, { weekday: "short" })}</b>
          <span>
            {formatDate(d.date, { day: "numeric", month: "short" })} · {d.count}
          </span>
        </Link>
      ))}
    </div>
  );
}
