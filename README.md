# MealBee waitlist

Waitlist sign-up page for MealBee, healthy school lunches delivered to school in Dubai.

- `/` is the landing page and sign-up form.
- `/admin` lists sign-ups and downloads them as CSV (password: the `ADMIN_PASSWORD` environment variable in Vercel).

Sign-ups are stored as private JSON files in the `mealbee-waitlist` Vercel Blob store, one per email address.

## Run locally

```sh
npm install
npx vercel env pull .env.local   # needs BLOB_READ_WRITE_TOKEN and ADMIN_PASSWORD
npm run dev
```
