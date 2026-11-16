import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatDate, nowInDubai } from "@/lib/dates";
import { aed, canCancel, effectiveStatus, readState } from "@/lib/demo";
import { currentParentEmail } from "@/lib/session";
import { cancelLunch, deleteAccount, removeChild, signOut } from "../actions";
import ConfirmButton from "../ui/ConfirmButton";
import StatusChip from "../ui/StatusChip";

export const metadata: Metadata = { title: "Your account · MealBee" };

type Props = { searchParams: Promise<{ confirm?: string }> };

export default async function AccountPage({ searchParams }: Props) {
  const email = await currentParentEmail();
  if (!email) redirect("/sign-in?next=/account");
  const { confirm } = await searchParams;

  const state = await readState();
  const children = state.parents[email]?.children ?? [];
  const now = nowInDubai();
  const orders = state.orders
    .filter((o) => o.email === email)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <main className="app-page narrow account">
      <p className="eyebrow">Signed in as {email}</p>
      <h1 className="page-title">Your account</h1>

      <nav className="account-jump" aria-label="Account sections">
        <a href="#details">Details</a>
        <a href="#children">Children</a>
        <a href="#orders">Orders ({orders.length})</a>
        <a href="#delete">Delete account</a>
      </nav>

      <section id="details" className="account-section">
        <h2 className="section-label">Your details</h2>
        <div className="card rows">
          <div className="row">
            <span className="muted">Email</span>
            <span className="break">{email}</span>
          </div>
          <div className="row">
            <span className="muted">Sign-in</span>
            <span>6-digit email code</span>
          </div>
          <div className="row">
            <span className="muted">Payment</span>
            <span className="chip">Coming soon</span>
          </div>
        </div>
        <form action={signOut} className="account-actions">
          <button type="submit" className="btn btn-small btn-ghost">
            Sign out
          </button>
        </form>
      </section>

      <section id="children" className="account-section">
        <h2 className="section-label">Children</h2>
        {children.length === 0 ? (
          <p className="card empty">No children added yet.</p>
        ) : (
          <ul className="stack">
            {children.map((c) => (
              <li key={c.id} className="card child-card">
                <span className="avatar">{c.name.slice(0, 1).toUpperCase()}</span>
                <div className="child-text">
                  <b>{c.name}</b>
                  <p>
                    {c.grade} · {c.school}
                  </p>
                </div>
                {c.allergies && <span className="chip chip-allergy">{c.allergies}</span>}
                <div className="child-actions">
                  <Link href={`/children?edit=${c.id}`} className="text-link">
                    Edit
                  </Link>
                  <form action={removeChild.bind(null, c.id)}>
                    <ConfirmButton
                      message={`Remove ${c.name}? Their upcoming lunches that can still be cancelled will be cancelled.`}
                      className="link-button small danger-link"
                    >
                      Remove
                    </ConfirmButton>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Link href="/children?add=1" className="btn btn-small btn-ghost account-add">
          + Add a child
        </Link>
      </section>

      <section id="orders" className="account-section">
        <h2 className="section-label">Orders</h2>
        {orders.length === 0 ? (
          <div className="card empty">
            <p>You haven&apos;t ordered any lunches yet.</p>
            <Link href="/order" className="btn">
              Order lunches
            </Link>
          </div>
        ) : (
          <ul className="stack">
            {orders.map((o) => (
              <li key={o.id} className="card order-card">
                <div className="order-top">
                  <div>
                    <b>#{o.id}</b>
                    <p>
                      {o.child.name} · {o.plan === "week" ? "Whole week" : "Picked days"} · ordered{" "}
                      {formatDate(o.createdAt.slice(0, 10), { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <span className="order-total">{aed(o.total)}</span>
                </div>
                <ul className="rows order-lunches">
                  {o.lunches.map((l) => {
                    const status = effectiveStatus(l, now);
                    return (
                      <li key={l.date} className="row">
                        <span>{formatDate(l.date, { weekday: "short", day: "numeric", month: "short" })}</span>
                        <span className="row-end">
                          {canCancel(l, now) && (
                            <form action={cancelLunch.bind(null, o.id, l.date)}>
                              <ConfirmButton message="Cancel this lunch?" className="link-button small">
                                Cancel
                              </ConfirmButton>
                            </form>
                          )}
                          <StatusChip status={status} />
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="delete" className="account-section">
        <h2 className="section-label">Delete account</h2>
        <form action={deleteAccount} className="card danger-card">
          <p>
            This permanently deletes your account, your children&apos;s details and all your orders. Upcoming lunches
            will not be delivered. This can&apos;t be undone.
          </p>
          <label className="consent">
            <input type="checkbox" name="confirm" value="yes" required />
            <span>I understand, delete my account and everything in it.</span>
          </label>
          {confirm && (
            <p className="form-error" role="alert">
              Please tick the box to confirm.
            </p>
          )}
          <ConfirmButton message="Delete your MealBee account for good?" className="btn btn-danger">
            Delete my account
          </ConfirmButton>
        </form>
      </section>
    </main>
  );
}
