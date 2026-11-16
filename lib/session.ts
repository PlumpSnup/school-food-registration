import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Parent sign-in for the ordering demo: signed cookies, no passwords.

const PARENT_COOKIE = "mb_parent";
const CODE_COOKIE = "mb_code";
const CODE_MINUTES = 10;

function secret(): string {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "mealbee-local-dev";
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function pack(data: object): string {
  const value = Buffer.from(JSON.stringify(data)).toString("base64url");
  return `${value}.${sign(value)}`;
}

function unpack(raw: string | undefined): Record<string, unknown> | null {
  const [value, signature] = raw?.split(".") ?? [];
  if (!value || !signature) return null;
  const expected = Buffer.from(sign(value));
  const actual = Buffer.from(signature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString());
  } catch {
    return null;
  }
}

const cookieOptions = { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" };

export async function currentParentEmail(): Promise<string | null> {
  const data = unpack((await cookies()).get(PARENT_COOKIE)?.value);
  return typeof data?.email === "string" ? data.email : null;
}

/** Makes a 6-digit code for this email. In the demo the page shows it instead of emailing it. */
export async function startSignIn(email: string): Promise<void> {
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  (await cookies()).set(CODE_COOKIE, pack({ email, code, exp: Date.now() + CODE_MINUTES * 60_000 }), {
    ...cookieOptions,
    maxAge: CODE_MINUTES * 60,
  });
}

export async function pendingSignIn(): Promise<{ email: string; code: string } | null> {
  const data = unpack((await cookies()).get(CODE_COOKIE)?.value);
  if (!data || typeof data.exp !== "number" || data.exp < Date.now()) return null;
  return { email: String(data.email), code: String(data.code) };
}

export async function finishSignIn(email: string): Promise<void> {
  const jar = await cookies();
  jar.delete(CODE_COOKIE);
  jar.set(PARENT_COOKIE, pack({ email }), { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 });
}

export async function clearSignIn(): Promise<void> {
  const jar = await cookies();
  jar.delete(CODE_COOKIE);
  jar.delete(PARENT_COOKIE);
}
