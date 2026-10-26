import { isAdmin } from "@/lib/admin-auth";
import { PLANS } from "@/lib/constants";
import { listSignups } from "@/lib/signups";

export const dynamic = "force-dynamic";

function cell(value: string): string {
  // Stop spreadsheet apps from treating a value as a formula.
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });

  const signups = await listSignups();
  const header = ["Signed up (UTC)", "Parent name", "Email", "Phone", "School", "Grade", "Interest", "Allergies"];
  const rows = signups.map((s) =>
    [s.createdAt, s.parentName, s.email, s.phone, s.school, s.grade, PLANS[s.plan] ?? s.plan, s.allergies]
      .map(cell)
      .join(","),
  );
  // BOM so Excel opens the file as UTF-8.
  const csv = "﻿" + [header.map(cell).join(","), ...rows].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="mealbee-waitlist-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
