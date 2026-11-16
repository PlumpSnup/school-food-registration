import Image from "next/image";
import Link from "next/link";
import { currentParentEmail } from "@/lib/session";
import HeaderNav from "./HeaderNav";

export default async function Header() {
  const email = await currentParentEmail();
  return (
    <header className="appbar">
      <div className="appbar-inner">
        <Link href="/" className="brand" aria-label="MealBee home">
          <Image src="/bee.png" alt="" width={34} height={34} className="brand-bee" priority />
          <span className="brand-text">
            <span className="brand-name">
              Meal<span className="y">Bee</span>
              <span className="demo-tag">Demo</span>
            </span>
            <span className="brand-tag">Bee happy · bee healthy</span>
          </span>
        </Link>
        <HeaderNav account={email ? email.slice(0, 1).toUpperCase() : null} />
      </div>
    </header>
  );
}
