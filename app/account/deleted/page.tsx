import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "Account deleted · MealBee" };

export default function AccountDeletedPage() {
  return (
    <main className="app-page narrow center">
      <div className="bee-circle">
        <Image src="/bee.png" alt="" width={64} height={64} />
      </div>
      <h1 className="page-title">Your account has been deleted</h1>
      <p className="muted">Your details, children and orders have been removed. Thanks for trying MealBee.</p>
      <Link href="/" className="btn btn-block">
        Back to the home page
      </Link>
    </main>
  );
}
