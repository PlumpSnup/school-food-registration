import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { formatDate, isOpen, nowInDubai, orderWeekStart, schoolWeek, weekRange } from "@/lib/dates";
import { readState } from "@/lib/demo";
import { currentParentEmail } from "@/lib/session";
import MealCard from "../ui/MealCard";
import OrderPicker, { type PickerChild, type PickerDay } from "../ui/OrderPicker";

export const metadata: Metadata = { title: "Order lunches · MealBee" };

type Props = { searchParams: Promise<{ child?: string; children?: string; error?: string }> };

export default async function OrderPage({ searchParams }: Props) {
  const email = await currentParentEmail();
  if (!email) redirect("/sign-in?next=/order");
  const { child, children: childrenParam, error } = await searchParams;

  const state = await readState();
  const children = state.parents[email]?.children ?? [];
  if (children.length === 0) redirect("/children?first=1");

  const now = nowInDubai();
  const monday = orderWeekStart(now);
  const kids: PickerChild[] = children.map((c) => ({
    id: c.id,
    name: c.name,
    detail: [c.grade, c.school, c.allergies].filter(Boolean).join(" · "),
    taken: state.orders
      .filter((o) => o.child.id === c.id)
      .flatMap((o) => o.lunches.filter((l) => l.status !== "cancelled").map((l) => l.date)),
  }));
  const days: PickerDay[] = schoolWeek(monday).map((date) => ({
    date,
    day: formatDate(date, { weekday: "short" }),
    num: formatDate(date, { day: "numeric" }),
    open: isOpen(date, now),
  }));

  const asked = (childrenParam ?? child ?? "").split(",").filter((id) => kids.some((k) => k.id === id));
  const initial = asked.length > 0 ? asked : [kids[0].id];

  return (
    <main className="app-page narrow with-bar">
      {error && (
        <p className="form-error" role="alert">
          Those days are no longer available. Please pick again.
        </p>
      )}
      <OrderPicker
        key={initial.join(",")}
        kids={kids}
        days={days}
        initial={initial}
        weekLabel={weekRange(monday)}
        meal={<MealCard />}
      />
    </main>
  );
}
