import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { formatDate } from "@/lib/dates";
import { aed, money, readState } from "@/lib/demo";
import { currentParentEmail } from "@/lib/session";

export const metadata: Metadata = { title: "Order placed · MealBee" };

export default async function OrderPlacedPage({ params }: { params: Promise<{ id: string }> }) {
  const email = await currentParentEmail();
  if (!email) redirect("/sign-in?next=/lunches");
  const { id } = await params;
  const order = (await readState()).orders.find((o) => o.id === id && o.email === email);
  if (!order) notFound();

  const dayNames = order.lunches.map((l) => formatDate(l.date, { weekday: "short" })).join(", ");

  return (
    <main className="app-page narrow center">
      <div className="bee-circle">
        <Image src="/bee.png" alt="" width={64} height={64} />
      </div>
      <h1 className="page-title">Order placed!</h1>
      <p className="muted">
        Order #{order.id} for {order.child.name}
      </p>

      <div className="card rows text-left">
        <div className="row">
          <span>
            {order.plan === "week" ? "Whole week" : `${order.lunches.length} lunch${order.lunches.length > 1 ? "es" : ""}`} ·{" "}
            {dayNames}
          </span>
          <span className="muted">{money(order.subtotal)}</span>
        </div>
        <div className="row">
          <span className="muted">VAT 5%</span>
          <span className="muted">{money(order.vat)}</span>
        </div>
        <div className="row row-total">
          <span>Total</span>
          <span>{aed(order.total)}</span>
        </div>
        <div className="row">
          <span className="muted">Payment</span>
          <span className="chip">Coming soon</span>
        </div>
      </div>

      <p className="soft-note text-left">We&apos;ll let you know when each lunch is delivered to {order.child.school}.</p>
      <Link href="/lunches" className="btn btn-block">
        See my lunches
      </Link>
    </main>
  );
}
