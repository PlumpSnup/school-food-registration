"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/kitchen", label: "Home" },
  { href: "/kitchen/orders", label: "Orders" },
  { href: "/kitchen/schools", label: "Schools" },
];

export default function KitchenTabs() {
  const path = usePathname();
  return (
    <nav className="tabs no-print" aria-label="Kitchen">
      {TABS.map((t) => {
        const active = t.href === "/kitchen" ? path === "/kitchen" : path.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} className={active ? "tab on" : "tab"} aria-current={active ? "page" : undefined}>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
