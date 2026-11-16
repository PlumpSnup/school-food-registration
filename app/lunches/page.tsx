import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CUTOFF_HOUR, addDays, formatDate, nowInDubai } from "@/lib/dates";
import { canCancel, effectiveStatus, MEAL, readState } from "@/lib/demo";
import { currentParentEmail } from "@/lib/session";
import { cancelLunch } from "../actions";
import AutoRefresh from "../ui/AutoRefresh";
import ConfirmButton from "../ui/ConfirmButton";
import StatusChip, { StatusSteps } from "../ui/StatusChip";

export const metadata: Metadata = { title: "My lunches · MealBee" };

export default async function LunchesPage() {
  const email = await currentParentEmail();
  if (!email) redirect("/sign-in?next=/lunches");
  const state = await readState();
  const children = state.parents[email]?.children ?? [];
  const now = nowInDubai();

  const lunches = state.orders
    .filter((o) => o.email === email)
    .flatMap((o) => o.lunches.map((l) => ({ ...l, order: o, status: effectiveStatus(l, now), cancellable: canCancel(l, now) })));
  const upcoming = lunches.filter((l) => l.date >= now.date).sort((a, b) => a.date.localeCompare(b.date));
  const past = lunches
    .filter((l) => l.date < now.date)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);
  const many = children.length > 1;

  const card = (l: (typeof lunches)[number], faded = false) => (
    <li key={`${l.order.id}-${l.date}`} className={`card lunch-card${faded ? " faded" : ""}`}>
      <span className="date-block">
        <b>{formatDate(l.date, { day: "numeric" })}</b>
        <span>{formatDate(l.date, { weekday: "short" })}</span>
      </span>
      <div className="lunch-text">
        <h3>{many ? `${l.order.child.name} · ${MEAL.short}` : MEAL.short}</h3>
        {l.status === "cancelled" ? null : l.cancellable ? (
          <form action={cancelLunch.bind(null, l.order.id, l.date)} className="inline-form">
            <span>
              Cancel until {formatDate(addDays(l.date, -1), { weekday: "short" })} {CUTOFF_HOUR - 12} pm
            </span>
            <ConfirmButton message="Cancel this lunch?" className="link-button small">
              Cancel
            </ConfirmButton>
          </form>
        ) : (
          !faded && <StatusSteps status={l.status} />
        )}
      </div>
      <StatusChip status={l.status} bee={!faded} />
    </li>
  );

  return (
    <main className="app-page narrow">
      <AutoRefresh />
      <p className="eyebrow">{children.map((c) => `${c.name} · ${c.school}`).join(" · ") || "Your lunches"}</p>
      <h1 className="page-title">My lunches</h1>

      {upcoming.length === 0 ? (
        <div className="card empty">
          <p>No lunches coming up yet.</p>
          <Link href="/order" className="btn">
            Order lunches
          </Link>
        </div>
      ) : (
        <ul className="stack">{upcoming.map((l) => card(l))}</ul>
      )}

      {past.length > 0 && (
        <>
          <h2 className="section-label">Past lunches</h2>
          <ul className="stack">{past.map((l) => card(l, true))}</ul>
        </>
      )}

      <p className="note">
        <Link href="/children" className="text-link">
          Manage children
        </Link>
      </p>
    </main>
  );
}
