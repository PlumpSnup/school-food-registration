"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isAdmin, passwordMatches, sessionToken } from "@/lib/admin-auth";
import { GRADES, PARTNER_SCHOOLS } from "@/lib/constants";
import { isOpen, isSchoolDay, orderWeekStart, schoolWeek } from "@/lib/dates";
import {
  canCancel,
  effectiveStatus,
  price,
  readState,
  resetState,
  takenDays,
  updateState,
  type Child,
  type LunchStatus,
} from "@/lib/demo";
import { clearSignIn, currentParentEmail, finishSignIn, pendingSignIn, startSignIn } from "@/lib/session";

export type FormState = { error?: string; errors?: Record<string, string> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Only follow redirects to pages on this site. */
function safeNext(value: FormDataEntryValue | null): string | null {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : null;
}

function text(formData: FormData, name: string, max: number): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function requireParent(): Promise<string> {
  const email = await currentParentEmail();
  if (!email) redirect("/sign-in");
  return email;
}

async function requireKitchen(): Promise<void> {
  if (!(await isAdmin())) redirect("/kitchen");
}

// Parent sign-in

export async function requestCode(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = text(formData, "email", 200).toLowerCase();
  if (!EMAIL_RE.test(email)) return { errors: { email: "Please enter a valid email address." } };
  await startSignIn(email);
  const next = safeNext(formData.get("next"));
  redirect(`/sign-in?step=code${next ? `&next=${encodeURIComponent(next)}` : ""}`);
}

export async function verifyCode(_prev: FormState, formData: FormData): Promise<FormState> {
  const pending = await pendingSignIn();
  if (!pending) return { error: "That code has expired. Please ask for a new one." };
  if (text(formData, "code", 6) !== pending.code) return { error: "That code doesn't match. Please try again." };

  const state = await readState();
  let hasChildren = (state.parents[pending.email]?.children.length ?? 0) > 0;
  if (!state.parents[pending.email]) {
    await updateState((s) => {
      s.parents[pending.email] ??= { email: pending.email, children: [] };
      hasChildren = s.parents[pending.email].children.length > 0;
    });
  }
  await finishSignIn(pending.email);
  redirect(safeNext(formData.get("next")) ?? (hasChildren ? "/order" : "/children?first=1"));
}

export async function restartSignIn(): Promise<void> {
  await clearSignIn();
  redirect("/sign-in");
}

export async function signOut(): Promise<void> {
  await clearSignIn();
  redirect("/");
}

// Children

export async function saveChild(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = await requireParent();
  const child: Child = {
    id: text(formData, "id", 40) || `c${Date.now().toString(36)}`,
    name: text(formData, "name", 60),
    school: text(formData, "school", 100),
    grade: text(formData, "grade", 30),
    allergies: text(formData, "allergies", 200),
    notes: text(formData, "notes", 120),
  };
  const errors: Record<string, string> = {};
  if (child.name.length < 1) errors.name = "Please enter your child's first name.";
  if (!(PARTNER_SCHOOLS as readonly string[]).includes(child.school)) errors.school = "Please choose a school.";
  if (!(GRADES as readonly string[]).includes(child.grade)) errors.grade = "Please choose a grade.";
  if (Object.keys(errors).length) return { errors };

  await updateState((s) => {
    const parent = (s.parents[email] ??= { email, children: [] });
    const i = parent.children.findIndex((c) => c.id === child.id);
    if (i >= 0) parent.children[i] = child;
    else parent.children.push(child);
  });
  redirect(`/order?child=${child.id}`);
}

// Orders

/** Places one order per selected child for the picked days they don't already have. */
export async function placeOrder(formData: FormData): Promise<void> {
  const email = await requireParent();
  const childIds = text(formData, "children", 400).split(",").filter(Boolean);
  const asked = new Set(text(formData, "days", 200).split(","));
  const week = schoolWeek(orderWeekStart());

  const ids = await updateState((s) => {
    const placed: string[] = [];
    for (const childId of childIds) {
      const child = s.parents[email]?.children.find((c) => c.id === childId);
      if (!child) continue;
      const taken = takenDays(s, child.id);
      const days = week.filter((d) => asked.has(d) && isSchoolDay(d) && isOpen(d) && !taken.has(d));
      if (days.length === 0) continue;
      const wholeWeek = days.length === 5;
      const order = {
        id: `MB-${s.nextOrderNo++}`,
        email,
        child: { ...child },
        plan: wholeWeek ? ("week" as const) : ("days" as const),
        createdAt: new Date().toISOString(),
        ...price(days.length, wholeWeek),
        lunches: days.map((date) => ({ date, status: "ordered" as const })),
      };
      s.orders.push(order);
      placed.push(order.id);
    }
    return placed;
  });

  if (ids.length === 0) redirect(`/order?children=${childIds.join(",")}&error=1`);
  revalidatePath("/kitchen", "layout");
  redirect(`/order/${ids.join(",")}`);
}

export async function cancelLunch(orderId: string, date: string): Promise<void> {
  const email = await requireParent();
  await updateState((s) => {
    const order = s.orders.find((o) => o.id === orderId && o.email === email);
    const lunch = order?.lunches.find((l) => l.date === date);
    if (lunch && canCancel(lunch)) lunch.status = "cancelled";
  });
  revalidatePath("/lunches");
  revalidatePath("/account");
  revalidatePath("/kitchen", "layout");
}

// Account

/** Removes a child and cancels their lunches that can still be cancelled. Past orders stay in the history. */
export async function removeChild(childId: string): Promise<void> {
  const email = await requireParent();
  await updateState((s) => {
    const parent = s.parents[email];
    if (!parent) return;
    parent.children = parent.children.filter((c) => c.id !== childId);
    for (const order of s.orders) {
      if (order.email !== email || order.child.id !== childId) continue;
      for (const lunch of order.lunches) if (canCancel(lunch)) lunch.status = "cancelled";
    }
  });
  revalidatePath("/account");
  revalidatePath("/kitchen", "layout");
}

/** Deletes the parent, their children and all their orders, then signs them out. */
export async function deleteAccount(formData: FormData): Promise<void> {
  const email = await requireParent();
  if (formData.get("confirm") !== "yes") redirect("/account?confirm=1#delete");
  await updateState((s) => {
    delete s.parents[email];
    s.orders = s.orders.filter((o) => o.email !== email);
  });
  await clearSignIn();
  revalidatePath("/kitchen", "layout");
  redirect("/account/deleted");
}

// Kitchen

export async function kitchenLogin(_prev: FormState, formData: FormData): Promise<FormState> {
  const token = sessionToken();
  if (!token || !passwordMatches(String(formData.get("password") ?? ""))) return { error: "Wrong password." };
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/kitchen");
}

export async function setLunchStatus(orderId: string, date: string, status: LunchStatus): Promise<void> {
  await requireKitchen();
  await updateState((s) => {
    const lunch = s.orders.find((o) => o.id === orderId)?.lunches.find((l) => l.date === date);
    if (lunch && lunch.status !== "cancelled") lunch.status = status;
  });
  revalidatePath("/kitchen", "layout");
  revalidatePath("/lunches");
}

export async function markSchoolDelivered(school: string, date: string): Promise<void> {
  await requireKitchen();
  await updateState((s) => {
    for (const order of s.orders) {
      if (order.child.school !== school) continue;
      for (const lunch of order.lunches) {
        if (lunch.date === date && effectiveStatus(lunch) !== "cancelled") lunch.status = "delivered";
      }
    }
  });
  revalidatePath("/kitchen", "layout");
  revalidatePath("/lunches");
}

export async function resetDemo(): Promise<void> {
  await requireKitchen();
  await resetState();
  revalidatePath("/", "layout");
  redirect("/kitchen?reset=1");
}
