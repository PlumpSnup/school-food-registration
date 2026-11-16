import Image from "next/image";
import Link from "next/link";
import { formatDate, isSchoolDay, mondayOf, schoolWeek } from "@/lib/dates";
import { activeCount, lunchesOn, readState } from "@/lib/demo";
import { resetDemo } from "../actions";
import ConfirmButton from "../ui/ConfirmButton";
import { kitchenDays } from "./days";

export const dynamic = "force-dynamic";

export default async function KitchenHome({ searchParams }: { searchParams: Promise<{ reset?: string }> }) {
  const { reset } = await searchParams;
  const state = await readState();
  const { now, tomorrow } = kitchenDays(state);

  const tomorrowLunches = lunchesOn(state, tomorrow, now).filter((l) => l.status !== "cancelled");
  const allergies = tomorrowLunches.filter((l) => l.order.child.allergies).length;
  const today = isSchoolDay(now.date) ? lunchesOn(state, now.date, now).filter((l) => l.status !== "cancelled") : [];
  const todaySchools = new Set(today.map((l) => l.order.child.school)).size;
  const week = schoolWeek(mondayOf(now.date)).reduce((sum, d) => sum + activeCount(state, d, now), 0);
  const greeting = now.hour < 12 ? "Good morning" : now.hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <main className="app-page">
      {reset && (
        <p className="soft-note" role="status">
          The demo has been reset to the sample parents and orders.
        </p>
      )}
      <p className="eyebrow">Kitchen</p>
      <h1 className="page-title">
        {greeting} <Image src="/bee.png" alt="" width={36} height={36} className="title-bee" />
      </h1>

      <Link href={`/kitchen/orders?day=${tomorrow}`} className="card big-card">
        <span>
          <span className="big-label">
            Next delivery · {formatDate(tomorrow, { weekday: "short", day: "numeric", month: "short" })}
          </span>
          <span className="big-num">{tomorrowLunches.length}</span>
          <span className="big-sub">lunches to cook</span>
        </span>
        <span className="big-go">View →</span>
      </Link>

      <div className="grid2">
        <div className="card stat">
          <p>Today</p>
          <b>{today.length}</b>
          <span>{isSchoolDay(now.date) ? `lunches · ${todaySchools} schools` : "no school today"}</span>
        </div>
        <div className="card stat">
          <p>This week</p>
          <b>{week}</b>
          <span>lunches ordered</span>
        </div>
      </div>

      <div className="grid2">
        <Link href={`/kitchen/schools?day=${tomorrow}`} className="btn btn-block">
          School lists
        </Link>
        <Link href={`/kitchen/orders?day=${tomorrow}&allergies=1`} className="btn btn-ghost btn-block">
          Allergies ({allergies})
        </Link>
      </div>

      <form action={resetDemo} className="reset-form">
        <ConfirmButton
          message="Reset the demo? All orders go back to the sample data."
          className="reset-button"
        >
          ↺ Reset demo
        </ConfirmButton>
      </form>
    </main>
  );
}
