import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { readState } from "@/lib/demo";
import { currentParentEmail } from "@/lib/session";
import { signOut } from "../actions";
import ChildForm from "../ui/ChildForm";

export const metadata: Metadata = { title: "Your children · MealBee" };

type Props = { searchParams: Promise<{ first?: string; edit?: string; add?: string }> };

export default async function ChildrenPage({ searchParams }: Props) {
  const email = await currentParentEmail();
  if (!email) redirect("/sign-in?next=/children");
  const { first, edit, add } = await searchParams;
  const children = (await readState()).parents[email]?.children ?? [];
  const editing = children.find((c) => c.id === edit);
  const showForm = Boolean(editing || add || children.length === 0);

  return (
    <main className="app-page narrow">
      <p className="eyebrow">{first ? "One quick step" : "Your family"}</p>
      <h1 className="page-title">{first || children.length === 0 ? "Who's the lunch for?" : "Your children"}</h1>

      {children.length > 0 && (
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
              <Link href={`/children?edit=${c.id}`} className="text-link">
                Edit
              </Link>
              <Link href={`/order?child=${c.id}`} className="btn btn-small">
                Order
              </Link>
            </li>
          ))}
        </ul>
      )}

      {showForm ? (
        <>
          {children.length > 0 && <h2 className="section-label">{editing ? `Edit ${editing.name}` : "Add a child"}</h2>}
          <ChildForm key={editing?.id ?? "new"} child={editing} />
        </>
      ) : (
        <Link href="/children?add=1" className="btn btn-ghost btn-block">
          + Add another child
        </Link>
      )}

      <form action={signOut} className="signout">
        <span>Signed in as {email}</span>
        <button type="submit" className="link-button">
          Sign out
        </button>
      </form>
    </main>
  );
}
