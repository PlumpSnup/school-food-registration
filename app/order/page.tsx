import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { formatDate, isOpen, nowInDubai, orderWeekStart, schoolWeek, weekRange } from "@/lib/dates";
import { readState } from "@/lib/demo";
import { currentParentEmail } from "@/lib/session";
import ChildBadge from "../ui/ChildBadge";
import MealCard from "../ui/MealCard";
import OrderPicker, { type PickerDay } from "../ui/OrderPicker";

export const metadata: Metadata = { title: "Order lunches · MealBee" };

type Props = { searchParams: Promise<{ child?: string; error?: string }> };

export default async function OrderPage({ searchParams }: Props) {
  const email = await currentParentEmail();
  if (!email) redirect("/sign-in?next=/order");
  const { child: childId, error } = await searchParams;

  const state = await readState();
  const children = state.parents[email]?.children ?? [];
  if (children.length === 0) redirect("/children?first=1");
  const child = children.find((c) => c.id === childId) ?? children[0];

  const now = nowInDubai();
  const monday = orderWeekStart(now);
  const taken = new Set(
    state.orders
      .filter((o) => o.child.id === child.id)
      .flatMap((o) => o.lunches.filter((l) => l.status !== "cancelled").map((l) => l.date)),
  );
  const days: PickerDay[] = schoolWeek(monday).map((date) => ({
    date,
    day: formatDate(date, { weekday: "short" }),
    num: formatDate(date, { day: "numeric" }),
    open: isOpen(date, now),
    ordered: taken.has(date),
  }));

  return (
    <main className="app-page narrow with-bar">
      <p className="eyebrow">Next week · {weekRange(monday)}</p>
      <h1 className="page-title">Pick {child.name}&apos;s lunches</h1>
      {error && (
        <p className="form-error" role="alert">
          Those days are no longer available. Please pick again.
        </p>
      )}
      <MealCard />
      <OrderPicker key={child.id} childId={child.id} days={days} />
      <ChildBadge child={child} changeHref={children.length > 1 ? "/children" : `/children?edit=${child.id}`} />
    </main>
  );
}
