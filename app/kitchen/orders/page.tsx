import Link from "next/link";
import { formatDate } from "@/lib/dates";
import { lunchesOn, MEAL, readState } from "@/lib/demo";
import { setLunchStatus } from "../../actions";
import ConfirmButton from "../../ui/ConfirmButton";
import DayPicker from "../../ui/DayPicker";
import StatusChip from "../../ui/StatusChip";
import SubmitButton from "../../ui/SubmitButton";
import { kitchenDays } from "../days";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ day?: string; allergies?: string }> };

export default async function KitchenOrders({ searchParams }: Props) {
  const { day, allergies } = await searchParams;
  const state = await readState();
  const { now, days, selected } = kitchenDays(state, day);
  let lunches = lunchesOn(state, selected, now);
  if (allergies) lunches = lunches.filter((l) => l.order.child.allergies);

  return (
    <main className="app-page">
      <p className="eyebrow">{formatDate(selected, { weekday: "long", day: "numeric", month: "short" })}</p>
      <h1 className="page-title">Orders</h1>
      <DayPicker base="/kitchen/orders" days={days} selected={selected} today={now.date} />
      <div className="filter-row">
        <Link href={`/kitchen/orders?day=${selected}`} className={allergies ? "chip" : "chip chip-on"}>
          All
        </Link>
        <Link href={`/kitchen/orders?day=${selected}&allergies=1`} className={allergies ? "chip chip-on" : "chip"}>
          Allergies only
        </Link>
      </div>

      {lunches.length === 0 ? (
        <p className="card empty">No lunches for this day.</p>
      ) : (
        <ul className="stack">
          {lunches.map(({ order, lunch, status }) => {
            const act = (to: "cooking" | "delivered" | "cancelled") => setLunchStatus.bind(null, order.id, lunch.date, to);
            return (
              <li key={`${order.id}-${lunch.date}`} className={`card order-card${status === "cancelled" ? " faded" : ""}`}>
                <div className="order-top">
                  <div>
                    <b>{order.child.name}</b>
                    <p>
                      {order.child.grade} · {order.child.school} · #{order.id}
                    </p>
                  </div>
                  <StatusChip status={status} />
                </div>
                <div className="chips">
                  <span className="chip">{MEAL.short}</span>
                  {order.child.allergies && <span className="chip chip-allergy">{order.child.allergies}</span>}
                  <span className="chip">{order.plan === "week" ? "Weekly plan" : "Picked days"}</span>
                </div>
                {(status === "ordered" || status === "cooking") && (
                  <div className="actions">
                    {status === "ordered" ? (
                      <form action={act("cooking")}>
                        <SubmitButton className="btn btn-small">Start cooking</SubmitButton>
                      </form>
                    ) : (
                      <form action={act("delivered")}>
                        <SubmitButton className="btn btn-small">Mark delivered</SubmitButton>
                      </form>
                    )}
                    <form action={act("cancelled")}>
                      <ConfirmButton message={`Cancel ${order.child.name}'s lunch?`} className="btn btn-small btn-ghost">
                        Cancel
                      </ConfirmButton>
                    </form>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
