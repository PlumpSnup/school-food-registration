import { get, put } from "@vercel/blob";
import { addDays, isOpen, mondayOf, nowInDubai, schoolWeek, type Now } from "./dates";
import { price } from "./demo-prices";

export { aed, DAY_PRICE, MEAL, money, price, WEEK_PRICE } from "./demo-prices";

// The ordering demo keeps all of its data in one private JSON file in Blob storage.

export type LunchStatus = "ordered" | "cooking" | "delivered" | "cancelled";

export type Child = { id: string; name: string; school: string; grade: string; allergies: string; notes?: string };
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

async function load(): Promise<DemoState> {
  if (useLocal()) {
    const { readFile } = await import("node:fs/promises");
    try {
      return JSON.parse(await readFile(LOCAL_FILE, "utf8")) as DemoState;
    } catch {
      return seed();
    }
  }
  const result = await get(PATH, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) return seed();
  return (await new Response(result.stream).json()) as DemoState;
}

// Saves overwrite the whole file. The ETag check Blob offers for conditional writes rejected every write
// in production, and two people saving in the same instant is unlikely enough for a demo.
async function save(state: DemoState): Promise<void> {
  if (useLocal()) {
    const { mkdir, writeFile } = await import("node:fs/promises");
    await mkdir(".data", { recursive: true });
    await writeFile(LOCAL_FILE, JSON.stringify(state));
    return;
  }
  await put(PATH, JSON.stringify(state), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function readState(): Promise<DemoState> {
  return load();
}

/** Read, change and save the state. */
export async function updateState<T>(change: (state: DemoState) => T): Promise<T> {
  const state = await load();
  const result = change(state);
  await save(state);
  return result;
}

export async function resetState(): Promise<void> {
  await save(seed());
}

// Sample data: three schools and 38 children with a realistic mix of plans, grades, siblings, allergies,
// notes from parents and the odd cancelled lunch. It is random but repeatable for the same week.
const SCHOOLS: [string, string[]][] = [
  [
    "Palm Grove School",
    ["Omar", "Layla", "Zayn", "Mira", "Yusuf", "Hana", "Adam", "Noor", "Ali", "Sofia", "Karim", "Aisha", "Rayan",
      "Lina", "Sami", "Maya", "Idris", "Dana", "Faris", "Salma", "Theo"],
  ],
  ["Sunrise Academy", ["Ahmed", "Ella", "Rami", "Jana", "Hamza", "Leah", "Tariq", "Nadia", "Ben", "Rana", "Khalid", "Zara"]],
  ["Green Hills School", ["Musa", "Amira", "Leo", "Huda", "Isa"]],
];
const ALLERGIES = ["Gluten-free", "Egg-free", "No sesame", "No dairy", "Mild, no spice", "Soy-free"];
const NOTES = [
  "Small portion please",
  "Extra rice",
  "Cut the chicken small",
  "No cucumber, extra carrots",
  "Sauce on the side",
  "Please pack a spoon",
  "Big eater, extra chicken",
  "Water only, no juice",
];
const SEED_GRADES = ["FS2 / KG1", "KG2", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7",
  "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

/** A small seeded random number generator (mulberry32), so a week's sample data is the same on every reset. */
function random(seedText: string): () => number {
  let a = [...seedText].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 2654435761), 1779033703) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seed(now: Now = nowInDubai()): DemoState {
  const monday = mondayOf(now.date);
  const weeks = [schoolWeek(monday), schoolWeek(addDays(monday, 7))];
  const rnd = random(monday);
  const pick = <T,>(list: T[]) => list[Math.floor(rnd() * list.length)];
  const state: DemoState = { version: 1, parents: {}, orders: [], nextOrderNo: 1001 };

  // Today's lunches are cooking in the morning and delivered after lunch.
  const todayStatus: LunchStatus = now.hour >= 12 ? "delivered" : now.hour >= 7 ? "cooking" : "ordered";
  const statusFor = (date: string): LunchStatus =>
    date < now.date ? "delivered" : date === now.date ? todayStatus : "ordered";

  let n = 0;
  let parentEmail = "";
  for (const [school, names] of SCHOOLS) {
    for (const name of names) {
      n++;
      const isDemo = name === "Omar";
      // About one child in five is a younger sibling ordered by the same parent as the child before.
      const sibling = !isDemo && n > 2 && parentEmail !== DEMO_EMAIL && rnd() < 0.2;
      if (!sibling) parentEmail = isDemo ? DEMO_EMAIL : `parent${n}@example.com`;
      const email = parentEmail;

      const child: Child = {
        id: `c${n}`,
        name,
        school,
        grade: isDemo ? "Grade 3" : pick(SEED_GRADES),
        allergies: isDemo ? "No dairy" : rnd() < 0.2 ? pick(ALLERGIES) : "",
        notes: isDemo ? "" : rnd() < 0.25 ? pick(NOTES) : "",
      };
      (state.parents[email] ??= { email, children: [] }).children.push(child);

      weeks.forEach((week, w) => {
        // Omar only has this week, so the demo parent can order next week live; some families skip a week.
        if ((isDemo && w === 1) || (!isDemo && rnd() < 0.12)) return;
        const r = rnd();
        const count = isDemo ? 5 : r < 0.45 ? 5 : r < 0.6 ? 4 : r < 0.78 ? 3 : r < 0.9 ? 2 : 1;
        const days = [...week]
          .sort(() => rnd() - 0.5)
          .slice(0, count)
          .sort();
        const wholeWeek = count === 5;
        const placed = new Date(`${addDays(week[0], -2 - Math.floor(rnd() * 4))}T00:00:00+04:00`);
        placed.setUTCMinutes(Math.floor((7 + rnd() * 15) * 60) - 4 * 60);
        state.orders.push({
          id: `MB-${state.nextOrderNo++}`,
          email,
          child,
          plan: wholeWeek ? "week" : "days",
          createdAt: placed.toISOString(),
          ...price(days.length, wholeWeek),
          lunches: days.map((date) => ({
            date,
            status: !isDemo && date > now.date && rnd() < 0.03 ? ("cancelled" as const) : statusFor(date),
          })),
        });
      });
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
