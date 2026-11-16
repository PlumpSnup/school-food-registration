import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentParentEmail, pendingSignIn } from "@/lib/session";
import { CodeForm, EmailForm } from "../ui/SignInForms";

export const metadata: Metadata = { title: "Sign in · MealBee" };

type Props = { searchParams: Promise<{ step?: string; next?: string }> };

export default async function SignInPage({ searchParams }: Props) {
  const { step, next } = await searchParams;
  if (await currentParentEmail()) redirect(next?.startsWith("/") ? next : "/order");
  const pending = step === "code" ? await pendingSignIn() : null;

  return (
    <main className="app-page narrow">
      <p className="eyebrow">Welcome</p>
      <h1 className="page-title">Sign in to order lunches</h1>
      {pending ? <CodeForm email={pending.email} code={pending.code} next={next} /> : <EmailForm next={next} />}
      <p className="note">In the real app the code arrives by email.</p>
    </main>
  );
}
