import type { LunchStatus } from "@/lib/demo";

const LABEL: Record<LunchStatus, string> = {
  ordered: "Ordered",
  cooking: "Cooking",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function StatusChip({ status, bee = false }: { status: LunchStatus; bee?: boolean }) {
  return (
    <span className={`chip chip-${status}`}>
      {LABEL[status]}
      {bee && status === "delivered" ? " 🐝" : ""}
    </span>
  );
}

export function StatusSteps({ status }: { status: LunchStatus }) {
  const reached = { ordered: 1, cooking: 2, delivered: 3, cancelled: 0 }[status];
  return (
    <span className="steps-bar" aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <i key={i} className={i <= reached ? "on" : ""} />
      ))}
    </span>
  );
}
