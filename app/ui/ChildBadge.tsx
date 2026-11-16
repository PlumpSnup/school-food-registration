import Link from "next/link";
import type { Child } from "@/lib/demo";

export default function ChildBadge({ child, changeHref }: { child: Child; changeHref?: string }) {
  return (
    <div className="card flat child-card">
      <span className="avatar">{child.name.slice(0, 1).toUpperCase()}</span>
      <div className="child-text">
        <b>{child.name}</b>
        <p>
          {child.grade} · {child.school}
        </p>
      </div>
      {child.allergies && <span className="chip chip-allergy">{child.allergies}</span>}
      {changeHref && (
        <Link href={changeHref} className="text-link">
          Change
        </Link>
      )}
    </div>
  );
}
