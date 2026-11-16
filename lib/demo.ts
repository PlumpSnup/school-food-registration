import { BlobPreconditionFailedError, get, put } from "@vercel/blob";
import { addDays, isOpen, mondayOf, nowInDubai, schoolWeek, type Now } from "./dates";
import { price } from "./demo-prices";

export { aed, DAY_PRICE, MEAL, money, price, WEEK_PRICE } from "./demo-prices";

// The ordering demo keeps all of its data in one private JSON file in Blob storage.

export type LunchStatus = "ordered" | "cooking" | "delivered" | "cancelled";

export type Child = { id: string; name: string; school: string; grade: string; allergies: string };
export type Lunch = { date: string; status: LunchStatus };
export type Order = {
  id: string;
  email: string;
  child: Child;
  plan: "week" | "days";
  createdAt: string;
  subtotal: number;
  vat: number;
  total: number;
  lunches: Lunch[];
};
export type Parent = { email: string; children: Child[] };
export type DemoState = { version: 1; parents: Record<string, Parent>; orders: Order[]; nextOrderNo: number };

export const DEMO_EMAIL = "sara@example.com";

/** What a lunch's status looks like right now: past lunches count as delivered. */
export function effectiveStatus(lunch: Lunch, now: Now = nowInDubai()): LunchStatus {
  if (lunch.status === "cancelled" || lunch.status === "delivered") return lunch.status;
  if (lunch.date < now.date) return "delivered";
  return lunch.status;
}

export function canCancel(lunch: Lunch, now: Now = nowInDubai()): boolean {
  return effectiveStatus(lunch, now) === "ordered" && isOpen(lunch.date, now);
}

const PATH = "demo/state.json";

// Without a Blob token (running on a laptop) the demo keeps its data in a local file instead.
const LOCAL_FILE = ".data/demo-state.json";
const useLocal = () => !process.env.BLOB_READ_WRITE_TOKEN;

async function load(): Promise<{ state: DemoState; etag?: string }> {
  if (useLocal()) {
    const { readFile } = await import("node:fs/promises");
    try {
      return { state: JSON.parse(await readFile(LOCAL_FILE, "utf8")) as DemoState };
    } catch {
      return { state: seed() };
    }
  }
  const result = await get(PATH, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) return { state: seed() };
  return { state: (await new Response(result.stream).json()) as DemoState, etag: result.blob.etag };
}

async function save(state: DemoState, etag?: string): Promise<void> {
  if (useLocal()) {
    const { mkdir, writeFile } = await import("node:fs/promises");
    await mkdir(".data", { recursive: true });
    await writeFile(LOCAL_FILE, JSON.stringify(state));
    return;
  }
  await put(PATH, JSON.stringify(state), {
    access: "private",
    addRandomSuffix: false,
    contentType: "application/json",
    ...(etag ? { ifMatch: etag } : { allowOverwrite: false }),
  });
}

export async function readState(): Promise<DemoState> {
  return (await load()).state;
}

/** Read, change and save the state; retries if someone else saved in between. */
export async function updateState<T>(change: (state: DemoState) => T): Promise<T> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const { state, etag } = await load();
    const result = change(state);
    try {
      await save(state, etag);
      return result;
    } catch (err) {
      if (err instanceof BlobPreconditionFailedError || (!etag && /exist/i.test(String(err)))) continue;
      throw err;
    }
  }
  throw new Error("The demo is busy, please try again.");
}

export async function resetState(): Promise<void> {
  if (useLocal()) return save(seed());
  await put(PATH, JSON.stringify(seed()), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

// Sample data: three schools, 38 children, weekly plans this week and next.
const SCHOOLS: [string, string[]][] = [
  [
    "Palm Grove School",
    ["Omar", "Layla", "Zayn", "Mira", "Yusuf", "Hana", "Adam", "Noor", "Ali", "Sofia", "Karim", "Aisha", "Rayan",
      "Lina", "Sami", "Maya", "Idris", "Dana", "Faris", "Salma", "Theo"],
  ],
  ["Sunrise Academy", ["Ahmed", "Ella", "Rami", "Jana", "Hamza", "Leah", "Tariq", "Nadia", "Ben", "Rana", "Khalid", "Zara"]],
  ["Green Hills School", ["Musa", "Amira", "Leo", "Huda", "Isa"]],
];
const ALLERGIES: Record<string, string> = {
  Omar: "No dairy",
  Sofia: "Gluten-free",
  Ella: "Egg-free",
  Leo: "No sesame",
};

function seed(now: Now = nowInDubai()): DemoState {
  const thisWeek = schoolWeek(mondayOf(now.date));
  const nextWeek = schoolWeek(addDays(mondayOf(now.date), 7));
  const state: DemoState = { version: 1, parents: {}, orders: [], nextOrderNo: 1001 };

  let n = 0;
  for (const [school, names] of SCHOOLS) {
    for (const name of names) {
      n++;
      const email = name === "Omar" ? DEMO_EMAIL : `parent${n}@example.com`;
      const child: Child = { id: `c${n}`, name, school, grade: `Grade ${(n % 6) + 1}`, allergies: ALLERGIES[name] ?? "" };
      if (name === "Omar") child.grade = "Grade 3";
      state.parents[email] = { email, children: [child] };

      // Omar has this week only, so the demo parent can order next week live.
      const weeks = name === "Omar" ? [thisWeek] : [thisWeek, nextWeek];
      for (const week of weeks) {
        const days = n % 5 === 0 ? [week[0], week[2], week[4]] : week;
        const wholeWeek = days.length === 5;
        state.orders.push({
          id: `MB-${state.nextOrderNo++}`,
          email,
          child,
          plan: wholeWeek ? "week" : "days",
          createdAt: new Date(`${addDays(week[0], -3)}T09:00:00+04:00`).toISOString(),
          ...price(days.length, wholeWeek),
          lunches: days.map((date) => ({ date, status: "ordered" as const })),
        });
      }
    }
  }
  return state;
}

export type KitchenLunch = { order: Order; lunch: Lunch; status: LunchStatus };

/** Every lunch for one day, cancelled ones last. */
export function lunchesOn(state: DemoState, date: string, now: Now = nowInDubai()): KitchenLunch[] {
  return state.orders
    .flatMap((order) =>
      order.lunches.filter((l) => l.date === date).map((lunch) => ({ order, lunch, status: effectiveStatus(lunch, now) })),
    )
    .sort((a, b) => Number(a.status === "cancelled") - Number(b.status === "cancelled") || a.order.child.name.localeCompare(b.order.child.name));
}

export function activeCount(state: DemoState, date: string, now: Now = nowInDubai()): number {
  return lunchesOn(state, date, now).filter((l) => l.status !== "cancelled").length;
}
