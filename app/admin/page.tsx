import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isAdmin, passwordMatches, sessionToken } from "@/lib/admin-auth";
import { PLANS } from "@/lib/constants";
import { listSignups } from "@/lib/signups";

export const metadata: Metadata = {
  title: "MealBee admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function login(formData: FormData) {
  "use server";
  const attempt = String(formData.get("password") ?? "");
  const token = sessionToken();
  if (!token || !passwordMatches(attempt)) redirect("/admin?error=1");
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

async function logout() {
  "use server";
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin");
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (!(await isAdmin())) {
    const { error } = await searchParams;
    return (
      <main className="admin admin-login">
        <form action={login} className="form-card">
          <h1>MealBee admin</h1>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          {error && (
            <p className="form-error" role="alert">
              Wrong password.
            </p>
          )}
          <button type="submit" className="btn btn-block">
            Log in
          </button>
        </form>
      </main>
    );
  }

  const signups = await listSignups();
  const weekly = signups.filter((s) => s.plan === "weekly").length;
  const single = signups.filter((s) => s.plan === "single").length;

  return (
    <main className="admin">
      <div className="admin-head">
        <h1>Waitlist sign-ups</h1>
        <div className="admin-actions">
          <a href="/api/admin/export" className="btn btn-small">
            Download CSV
          </a>
          <form action={logout}>
            <button type="submit" className="btn btn-small btn-ghost">
              Log out
            </button>
          </form>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <span className="stat-num">{signups.length}</span> total
        </div>
        <div className="stat">
          <span className="stat-num">{weekly}</span> weekly plan
        </div>
        <div className="stat">
          <span className="stat-num">{single}</span> single meals
        </div>
      </div>

      {signups.length === 0 ? (
        <p>No sign-ups yet.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Parent</th>
                <th>Email</th>
                <th>Phone</th>
                <th>School</th>
                <th>Grade</th>
                <th>Interest</th>
                <th>Allergies</th>
              </tr>
            </thead>
            <tbody>
              {signups.map((s) => (
                <tr key={s.email}>
                  <td>{new Date(s.createdAt).toLocaleDateString("en-GB", { timeZone: "Asia/Dubai" })}</td>
                  <td>{s.parentName}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td>{s.school}</td>
                  <td>{s.grade}</td>
                  <td>{PLANS[s.plan] ?? s.plan}</td>
                  <td>{s.allergies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
