import { createHash } from "node:crypto";
import { get, head, list, put } from "@vercel/blob";
import { GRADES, PLANS, type Plan } from "./constants";

export { GRADES, PLANS, type Plan };

export type Signup = {
  parentName: string;
  email: string;
  phone: string;
  school: string;
  grade: string;
  plan: Plan;
  allergies: string;
  createdAt: string;
};

export type ValidationResult =
  | { ok: true; signup: Omit<Signup, "createdAt"> }
  | { ok: false; errors: Record<string, string> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9 ()-]{7,20}$/;

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function validateSignup(input: Record<string, unknown>): ValidationResult {
  const signup = {
    parentName: text(input.parentName, 100),
    email: text(input.email, 200).toLowerCase(),
    phone: text(input.phone, 30),
    school: text(input.school, 150),
    grade: text(input.grade, 30),
    plan: text(input.plan, 10) as Plan,
    allergies: text(input.allergies, 500),
  };
  const errors: Record<string, string> = {};

  if (signup.parentName.length < 2) errors.parentName = "Please enter your name.";
  if (!EMAIL_RE.test(signup.email)) errors.email = "Please enter a valid email address.";
  if (signup.phone && !PHONE_RE.test(signup.phone)) errors.phone = "Please enter a valid phone number.";
  if (signup.school.length < 2) errors.school = "Please enter your child's school.";
  if (!(GRADES as readonly string[]).includes(signup.grade)) errors.grade = "Please choose a grade.";
  if (!(signup.plan in PLANS)) errors.plan = "Please choose an option.";
  if (input.consent !== true) errors.consent = "Please agree so we can contact you.";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, signup };
}

// One blob per email, so the pathname doubles as the duplicate check.
function pathFor(email: string): string {
  return `signups/${createHash("sha256").update(email).digest("hex")}.json`;
}

async function exists(pathname: string): Promise<boolean> {
  try {
    await head(pathname);
    return true;
  } catch {
    return false;
  }
}

export async function saveSignup(signup: Omit<Signup, "createdAt">): Promise<"created" | "duplicate"> {
  const pathname = pathFor(signup.email);
  if (await exists(pathname)) return "duplicate";

  const record: Signup = { ...signup, createdAt: new Date().toISOString() };
  try {
    await put(pathname, JSON.stringify(record), {
      access: "private",
      addRandomSuffix: false,
      contentType: "application/json",
    });
  } catch (err) {
    // A second submit racing the first lands here once the blob exists.
    if (await exists(pathname)) return "duplicate";
    throw err;
  }
  return "created";
}

export async function listSignups(): Promise<Signup[]> {
  const pathnames: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "signups/", cursor, limit: 1000 });
    pathnames.push(...page.blobs.map((b) => b.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const signups: Signup[] = [];
  for (let i = 0; i < pathnames.length; i += 20) {
    const batch = await Promise.all(
      pathnames.slice(i, i + 20).map(async (pathname) => {
        const result = await get(pathname, { access: "private", useCache: false });
        if (!result?.stream) return null;
        return (await new Response(result.stream).json()) as Signup;
      }),
    );
    signups.push(...batch.filter((s): s is Signup => s !== null));
  }
  return signups.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
