import type { Metadata } from "next";
import { isAdmin } from "@/lib/admin-auth";
import AutoRefresh from "../ui/AutoRefresh";
import KitchenLogin from "../ui/KitchenLogin";
import KitchenTabs from "../ui/KitchenTabs";

export const metadata: Metadata = { title: "Kitchen · MealBee", robots: { index: false, follow: false } };

export default async function KitchenLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) {
    return (
      <main className="app-page narrow">
        <p className="eyebrow">Team only</p>
        <h1 className="page-title">Kitchen</h1>
        <KitchenLogin />
      </main>
    );
  }
  return (
    <div className="kitchen">
      {/* New orders and changes show up without reloading. */}
      <AutoRefresh seconds={5} />
      <KitchenTabs />
      {children}
    </div>
  );
}
