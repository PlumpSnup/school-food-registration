import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { formatDate } from "@/lib/dates";
import { aed, money, readState } from "@/lib/demo";
import { currentParentEmail } from "@/lib/session";

export const metadata: Metadata = { title: "Order placed · MealBee" };

/** Confirmation for one or more orders placed together; the URL holds their ids separated by commas. */
export default async function OrderPlacedPage({ params }: { params: Promise<{ id: string }> }) {
  const email = await currentParentEmail();
  if (!email) redirect("/sign-in?next=/lunches");
  const ids = decodeURIComponent((await params).id).split(",");
  const state = await readState();
  const orders = ids
    .map((id) => state.orders.find((o) => o.id === id && o.email === email))
    .filter((o) => o !== undefined);
  if (orders.length === 0) notFound();

  const subtotal = orders.reduce((n, o) => n + o.subtotal, 0);
  const vat = orders.reduce((n, o) => n + o.vat, 0);
  const total = orders.reduce((n, o) => n + o.total, 0);
  const names = orders.map((o) => o.child.name);
  const schools = [...new Set(orders.map((o) => o.child.school))].join(" and ");

  return (
    <main className="app-page narrow center">
      <div className="bee-circle">
        <Image src="/bee.png" alt="" width={64} height={64} />
      </div>
      <h1 className="page-title">Order placed!</h1>
      <p className="muted">
        {orders.length === 1 ? `Order #${orders[0].id}` : `${orders.length} orders`} for{" "}
        {names.length > 1 ? `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}` : names[0]}
      </p>

      <div className="card rows text-left">
        {orders.map((o) => (
          <div key={o.id} className="row">
            <span>
              {orders.length > 1 && <strong>{o.child.name} · </strong>}
              {o.plan === "week" ? "Whole week" : `${o.lunches.length} lunch${o.lunches.length > 1 ? "es" : ""}`} ·{" "}
              {o.lunches.map((l) => formatDate(l.date, { weekday: "short" })).join(", ")}
            </span>
            <span className="muted">{money(o.subtotal)}</span>
          </div>
        ))}
        {orders.length > 1 && (
          <div className="row">
            <span className="muted">Subtotal</span>
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
        <div className="row">
          <span className="muted">Payment</span>
          <span className="chip">Coming soon</span>
        </div>
      </div>

      <p className="soft-note text-left">We&apos;ll let you know when each lunch is delivered to {schools}.</p>
      <Link href="/lunches" className="btn btn-block">
        See my lunches
      </Link>
    </main>
  );
}
