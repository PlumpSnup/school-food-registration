"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string; short?: string; primary?: boolean };

const HOME_LINKS: Item[] = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#lunchbox", label: "Lunchbox" },
  { href: "/#join", label: "Waitlist" },
  { href: "/kitchen", label: "Kitchen" },
];

/** `account` is the signed-in parent's initial, shown in the round account button. */
export default function HeaderNav({ account }: { account: string | null }) {
  const signedIn = account !== null;
  const path = usePathname();

  let actions: Item[];
  if (path.startsWith("/kitchen")) actions = [{ href: "/order", label: "Parent app" }];
  else if (path.startsWith("/admin")) actions = [{ href: "/kitchen", label: "Kitchen" }];
  else if (signedIn) actions = [{ href: "/lunches", label: "My lunches" }, { href: "/order", label: "Order", primary: true }];
  else actions = [{ href: "/sign-in", label: "Sign in" }, { href: "/order", label: "Order lunches", short: "Order", primary: true }];

  return (
    <nav className="appbar-nav" aria-label="Main">
      {path === "/" && (
        <ul className="appbar-links">
          {HOME_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
      )}
      <div className="appbar-actions">
        {actions
          .filter((a) => a.href !== path)
          .map((a) => {
            const active = !a.primary && path.startsWith(a.href);
            return (
              <Link
                key={a.href}
                href={a.href}
                className={`pill${a.primary ? " pill-primary" : ""}${active ? " pill-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {a.short ? (
                  <>
                    <span className="label-long">{a.label}</span>
                    <span className="label-short">{a.short}</span>
                  </>
                ) : (
                  a.label
                )}
              </Link>
            );
          })}
        {signedIn && !path.startsWith("/kitchen") && !path.startsWith("/admin") && (
          <Link
            href="/account"
            className={`account-button${path.startsWith("/account") ? " on" : ""}`}
            aria-label="Your account"
            aria-current={path.startsWith("/account") ? "page" : undefined}
          >
            {account}
          </Link>
        )}
      </div>
    </nav>
  );
}
