import { formatDate } from "@/lib/dates";
import { lunchesOn, readState, type KitchenLunch, type LunchStatus } from "@/lib/demo";
import { markSchoolDelivered } from "../../actions";
import DayPicker from "../../ui/DayPicker";
import PrintButton from "../../ui/PrintButton";
import StatusChip from "../../ui/StatusChip";
import SubmitButton from "../../ui/SubmitButton";
import { kitchenDays } from "../days";

export const dynamic = "force-dynamic";

function schoolStatus(lunches: KitchenLunch[]): LunchStatus {
  if (lunches.every((l) => l.status === "delivered")) return "delivered";
  if (lunches.some((l) => l.status !== "ordered")) return "cooking";
  return "ordered";
}

export default async function KitchenSchools({ searchParams }: { searchParams: Promise<{ day?: string }> }) {
  const { day } = await searchParams;
  const state = await readState();
  const { now, days, selected } = kitchenDays(state, day);
  const lunches = lunchesOn(state, selected, now).filter((l) => l.status !== "cancelled");

  const schools = new Map<string, KitchenLunch[]>();
  for (const l of lunches) schools.set(l.order.child.school, [...(schools.get(l.order.child.school) ?? []), l]);
  const sorted = [...schools.entries()].sort((a, b) => b[1].length - a[1].length);

  return (
    <main className="app-page">
      <div className="title-row">
        <div>
          <p className="eyebrow">
            {`${formatDate(selected, { weekday: "long" })} · next week`} · {lunches.length} lunches
          </p>
          <h1 className="page-title">Delivery lists</h1>
        </div>
        <PrintButton />
      </div>
      <DayPicker base="/kitchen/schools" days={days} selected={selected} />

      {sorted.length === 0 ? (
        <p className="card empty">No lunches for this day.</p>
      ) : (
        <ul className="stack">
          {sorted.map(([school, list]) => {
            const status = schoolStatus(list);
            const allergyCount = list.filter((l) => l.order.child.allergies).length;
            return (
              <li key={school} className="card order-card school-card">
                <div className="order-top">
                  <div>
                    <b>{school}</b>
                    <p>
                      {list.length} lunches · {allergyCount} {allergyCount === 1 ? "allergy" : "allergies"}
                    </p>
                  </div>
                  <StatusChip status={status} />
                </div>
                <details className="school-list" open={list.length <= 8}>
                  <summary className="no-print">Show the {list.length} children</summary>
                  <ul className="rows">
                    {list.map((l) => (
                      <li key={`${l.order.id}-${l.lunch.date}`} className="row">
                        <span>
                          {l.order.child.name} · {l.order.child.grade.replace("Grade ", "Gr ")}
                        </span>
                        <span className="row-end">
                          {l.order.child.notes && <span className="row-note">{l.order.child.notes}</span>}
                          {l.order.child.allergies ? (
                            <span className="chip chip-allergy">{l.order.child.allergies}</span>
                          ) : (
                            !l.order.child.notes && <span className="muted">—</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </details>
                {status !== "delivered" && (
                  <form action={markSchoolDelivered.bind(null, school, selected)} className="actions no-print">
                    <SubmitButton className="btn btn-small" pendingText="Saving…">
                      Mark all delivered
                    </SubmitButton>
                  </form>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
