"use client";

import { useEffect, useRef, useState } from "react";
import type { LunchStatus } from "@/lib/demo";

export type LiveItem = { key: string; name: string; day: string; status: LunchStatus };

const MESSAGE: Partial<Record<LunchStatus, (i: LiveItem) => string>> = {
  cooking: (i) => `${i.name}'s lunch for ${i.day} is cooking now 🍳`,
  delivered: (i) => `${i.name}'s lunch for ${i.day} has been delivered 🐝`,
};

/**
 * Banners for lunches being cooked or just delivered, plus a pop-up when a status changes while the page is
 * open (the page re-fetches itself every few seconds).
 */
export default function LiveStatus({ items }: { items: LiveItem[] }) {
  const seen = useRef<Map<string, LunchStatus> | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const before = seen.current;
    seen.current = new Map(items.map((i) => [i.key, i.status]));
    if (!before) return;
    const changed = items.find((i) => before.get(i.key) !== i.status && MESSAGE[i.status]);
    if (!changed) return;
    setToast(MESSAGE[changed.status]!(changed));
    const id = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(id);
  }, [items]);

  const cooking = items.filter((i) => i.status === "cooking");
  const delivered = items.filter((i) => i.status === "delivered");

  return (
    <>
      {(cooking.length > 0 || delivered.length > 0) && (
        <div className="live-banners" aria-live="polite">
          {cooking.map((i) => (
            <p key={i.key} className="live-banner live-cooking">
              <span className="live-dot" aria-hidden="true" />
              {MESSAGE.cooking!(i)}
            </p>
          ))}
          {delivered.map((i) => (
            <p key={i.key} className="live-banner live-delivered">
              {MESSAGE.delivered!(i)}
            </p>
          ))}
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </>
  );
}
