import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "mealbee_admin";

function expectedToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password).update("mealbee-admin-session").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function passwordMatches(attempt: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  return !!password && safeEqual(attempt, password);
}

export function sessionToken(): string | null {
  return expectedToken();
}

export async function isAdmin(): Promise<boolean> {
  const expected = expectedToken();
  const actual = (await cookies()).get(ADMIN_COOKIE)?.value;
  return !!expected && !!actual && safeEqual(actual, expected);
}
