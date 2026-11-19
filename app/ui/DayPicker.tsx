import Link from "next/link";
import { formatDate } from "@/lib/dates";

/** Chips for choosing which weekday a kitchen page shows. */
export default function DayPicker({
  base,
  days,
  selected,
}: {
  base: string;
  days: { date: string; count: number }[];
  selected: string;
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
          <b>
            <span className="day-long">{formatDate(d.date, { weekday: "long" })}</span>
            <span className="day-short">{formatDate(d.date, { weekday: "short" })}</span>
          </b>
          <span>
            {d.count}
            <span className="day-long"> lunch{d.count === 1 ? "" : "es"}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
