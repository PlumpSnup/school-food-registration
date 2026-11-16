# MealBee waitlist

Waitlist sign-up page for MealBee, healthy school lunches delivered to school in Dubai.

- `/` is the landing page, with the waitlist form near the bottom.
- `/admin` lists waitlist sign-ups and downloads them as CSV (password: the `ADMIN_PASSWORD` environment variable in Vercel).

## Ordering demo

A demo of the parent app and the kitchen side, for presentations. Nothing is paid and no emails are sent.

- **Parents:** `/sign-in` (email, then a 6-digit code shown on screen) → `/children` → `/order` (whole week or single days) → `/order/review` → `/order/[id]` → `/lunches` (refreshes itself every few seconds).
- **Kitchen:** `/kitchen` (same password as `/admin`) with Home, Orders and Schools tabs. "Mark delivered" shows up on the parent's My lunches page.
- **Sample data:** `sara@example.com` is a parent with lunches already ordered this week, plus 37 other children at three schools. "Reset demo" on the kitchen home puts everything back.

The demo's data is one private JSON file (`demo/state.json`) in the same Blob store. `SESSION_SECRET` signs parent sign-in cookies. Without a Blob token (running locally) the demo saves to `.data/demo-state.json` instead.

Sign-ups are stored as private JSON files in the `mealbee-waitlist` Vercel Blob store, one per email address.

## Run locally

```sh
npm install
npx vercel env pull .env.local   # needs BLOB_READ_WRITE_TOKEN and ADMIN_PASSWORD
npm run dev
```
