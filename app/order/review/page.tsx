import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { formatDate, isOpen, orderWeekStart, schoolWeek } from "@/lib/dates";
import { aed, DAY_PRICE, MEAL, money, price, readState } from "@/lib/demo";
import { currentParentEmail } from "@/lib/session";
import { placeOrder } from "../../actions";
import ChildBadge from "../../ui/ChildBadge";
import SubmitButton from "../../ui/SubmitButton";

export const metadata: Metadata = { title: "Check your order · MealBee" };

type Props = { searchParams: Promise<{ child?: string; days?: string }> };

export default async function ReviewPage({ searchParams }: Props) {
  const email = await currentParentEmail();
  if (!email) redirect("/sign-in?next=/order");
  const { child: childId, days: daysParam = "" } = await searchParams;
  const child = (await readState()).parents[email]?.children.find((c) => c.id === childId);
  if (!child) redirect("/order");

  const asked = new Set(daysParam.split(","));
  const days = schoolWeek(orderWeekStart()).filter((d) => asked.has(d) && isOpen(d));
  if (days.length === 0) redirect(`/order?child=${child.id}`);
  const wholeWeek = days.length === 5;
  const cost = price(days.length, wholeWeek);

  return (
    <main className="app-page narrow with-bar">
      <p className="eyebrow">Almost done</p>
      <h1 className="page-title">Check your order</h1>
      <ChildBadge child={child} />

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
        <div className="row">
          <span className="muted">VAT 5%</span>
          <span className="muted">{money(cost.vat)}</span>
        </div>
        <div className="row row-total">
          <span>Total</span>
          <span>{aed(cost.total)}</span>
        </div>
      </div>

      <p className="soft-note">
        Delivered to {child.school} before lunch break. You can cancel a day until 6 pm the day before.
      </p>

      <form action={placeOrder} className="bottom-bar">
        <input type="hidden" name="child" value={child.id} />
        <input type="hidden" name="days" value={days.join(",")} />
        <SubmitButton className="bar-button bar-center" pendingText="Placing order…">
          Place order · {aed(cost.total)}
        </SubmitButton>
      </form>
    </main>
  );
}
