import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { formatDate, isOpen, orderWeekStart, schoolWeek } from "@/lib/dates";
import { aed, DAY_PRICE, MEAL, money, price, readState, takenDays } from "@/lib/demo";
import { currentParentEmail } from "@/lib/session";
import { placeOrder } from "../../actions";
import ChildBadge from "../../ui/ChildBadge";
import SubmitButton from "../../ui/SubmitButton";

export const metadata: Metadata = { title: "Check your order · MealBee" };

type Props = { searchParams: Promise<{ child?: string; children?: string; days?: string }> };

export default async function ReviewPage({ searchParams }: Props) {
  const email = await currentParentEmail();
  if (!email) redirect("/sign-in?next=/order");
  const { child, children: childrenParam, days: daysParam = "" } = await searchParams;
  const state = await readState();
  const ids = (childrenParam ?? child ?? "").split(",");
  const kids = (state.parents[email]?.children ?? []).filter((c) => ids.includes(c.id));
  if (kids.length === 0) redirect("/order");

  const asked = new Set(daysParam.split(","));
  const week = schoolWeek(orderWeekStart()).filter((d) => asked.has(d) && isOpen(d));
  const lines = kids
    .map((kid) => {
      const taken = takenDays(state, kid.id);
      const days = week.filter((d) => !taken.has(d));
      return { kid, days, wholeWeek: days.length === 5, cost: price(days.length, days.length === 5) };
    })
    .filter((l) => l.days.length > 0);
  if (lines.length === 0) redirect(`/order?children=${kids.map((k) => k.id).join(",")}`);

  const subtotal = lines.reduce((n, l) => n + l.cost.subtotal, 0);
  const vat = lines.reduce((n, l) => n + l.cost.vat, 0);
  const total = lines.reduce((n, l) => n + l.cost.total, 0);
  const schools = [...new Set(lines.map((l) => l.kid.school))].join(" and ");

  return (
    <main className="app-page narrow with-bar">
      <p className="eyebrow">Almost done</p>
      <h1 className="page-title">Check your order</h1>

      {lines.map(({ kid, days, wholeWeek, cost }) => (
        <section key={kid.id} className="review-child">
          <ChildBadge child={kid} />
          <div className="card rows">
            {days.map((d) => (
              <div key={d} className="row">
                <span>
                  {formatDate(d, { weekday: "short", day: "numeric", month: "short" })} · {MEAL.short}
                </span>
                {!wholeWeek && <span className="muted">{money(DAY_PRICE)}</span>}
              </div>
            ))}
            {wholeWeek && (
              <div className="row">
                <span>Whole week plan</span>
                <span className="muted">{money(cost.subtotal)}</span>
              </div>
            )}
          </div>
        </section>
      ))}

      <div className="card rows review-total">
        {lines.length > 1 && (
          <div className="row">
            <span className="muted">Subtotal · {lines.length} children</span>
            <span className="muted">{money(subtotal)}</span>
          </div>
        )}
        <div className="row">
          <span className="muted">VAT 5%</span>
          <span className="muted">{money(vat)}</span>
        </div>
        <div className="row row-total">
          <span>Total</span>
          <span>{aed(total)}</span>
        </div>
      </div>

      <p className="soft-note">
        Delivered to {schools} before lunch break. You can cancel a day until 6 pm the day before.
      </p>

      <form action={placeOrder} className="bottom-bar">
        <input type="hidden" name="children" value={lines.map((l) => l.kid.id).join(",")} />
        <input type="hidden" name="days" value={week.join(",")} />
        <SubmitButton className="bar-button bar-center" pendingText="Placing order…">
          Place order · {aed(total)}
        </SubmitButton>
      </form>
    </main>
  );
}
