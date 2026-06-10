# THE OPEN — your standalone daily brief

A self-hosted, password-protected web app that rebuilds itself every weekday
morning: live portfolio quotes + an AI-written news roundup + a rotating
research deep-dive. Built with Next.js, deploys on Vercel.

---

## What it does (and what it deliberately does NOT)

**Does**
- Sits behind a real, server-checked password (signed httpOnly session cookie).
- Pulls **live quotes** for your holdings from a market-data API.
- Each weekday at ~7am ET, a Vercel Cron job calls your Anthropic API key to
  write the news + a rotating deep-dive, and saves the edition to a KV store.
- Renders it all as a tabbed dashboard you can open from any device.

**Does NOT (by design, for your safety)**
- It does **not** connect to your Robinhood or Outlook. Those require OAuth and
  storing sensitive tokens; wiring them in is a deliberate later step (see
  "Extending"), not something to bolt on casually. v1 uses a holdings config +
  public quotes so no brokerage login ever lives in this app.
- It is **not** investment advice. It reports data and public news for learning.

---

## Architecture

```
Browser ──► middleware.ts (auth gate) ──► app/page.tsx ──► reads latest edition from KV
                                                  │
Vercel Cron ─(0 11 * * 1-5)─► /api/generate ──────┘ writes edition:
                                  ├─ lib/quotes.ts   (Finnhub live quotes)
                                  └─ lib/anthropic.ts (Claude writes news + deep-dive)
```

- **Auth:** `middleware.ts` + `/api/login` (compares to `APP_PASSWORD`, sets a
  signed cookie via `lib/auth.ts`).
- **Generation:** `/api/generate` is callable two ways — by Vercel Cron (with
  the `CRON_SECRET` bearer token) or by you clicking **↻ Refresh** while logged in.
- **Storage:** Upstash Redis (a.k.a. Vercel KV).

---

## Deploy in ~15 minutes

### 1. Get the accounts/keys
- **Anthropic API key** — console.anthropic.com → API Keys. (This is what writes
  the news; it bills your account per run — a few cents/day.)
- **Finnhub key** — finnhub.io, free tier is fine for quotes.
- **Vercel account** — vercel.com.

### 2. Push this folder to GitHub
```bash
git init && git add . && git commit -m "the open"
# create a repo on GitHub, then:
git remote add origin <your-repo-url> && git push -u origin main
```

### 3. Import into Vercel
- Vercel → **Add New → Project** → import your repo. Framework auto-detects Next.js.
- Before deploying, add a **KV store**: Vercel → **Storage → Create → KV (Upstash)**,
  connect it to the project. This auto-sets `KV_REST_API_URL` and `KV_REST_API_TOKEN`.

### 4. Set environment variables (Vercel → Settings → Environment Variables)
Copy from `.env.example`. Generate secrets locally:
```bash
openssl rand -hex 32   # SESSION_SECRET
openssl rand -hex 16   # CRON_SECRET
```
Required: `APP_PASSWORD`, `SESSION_SECRET`, `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`,
`FINNHUB_API_KEY`, `CRON_SECRET` (KV vars are set by the integration).

### 5. Deploy, then seed the first edition
- Deploy. Visit your URL → you'll hit the login page → enter `APP_PASSWORD`.
- The dashboard will say "No brief yet." Click **↻ Refresh** to build edition #1.
- After that, the cron (`vercel.json`: `0 11 * * 1-5` = 11:00 UTC weekdays ≈ 7am ET)
  rebuilds it every weekday automatically. Adjust the schedule in `vercel.json`.
  (Vercel automatically sends the `CRON_SECRET` as a bearer token to cron routes.)

### Run locally first (optional)
```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
```

---

## Customizing

- **Your holdings:** edit `lib/config.ts` (`HOLDINGS`). Seeded from your account
  on 2026-06-10 — update share counts when you rebalance.
- **News focus / tone:** `lib/config.ts` (`NEWS_FOCUS`) and the system prompt in
  `lib/anthropic.ts`.
- **Deep-dive rotation:** the `ROTATION` array in `app/api/generate/route.ts`.
- **Morning time:** the cron expression in `vercel.json` (it's in **UTC**).

---

## Security notes (read this)

- The password is checked **server-side** and never shipped to the browser; the
  session is a signed, httpOnly, secure cookie. Good for a single user. For
  multiple users or SSO, replace `middleware.ts` + `/api/login` with **Auth.js**
  (next-auth) — same shape, more robust.
- **No secrets in the repo.** Everything sensitive is an env var. Never commit
  `.env.local`.
- Your Anthropic key bills per generation. The cron runs weekday mornings only;
  watch usage in the Anthropic console.

## Extending to real Robinhood / Outlook data (later)
This is intentionally out of v1. When you're ready, the safe pattern is:
add a server-side OAuth flow per provider, store refresh tokens encrypted in KV
(never in the browser), and add `lib/robinhood.ts` / `lib/outlook.ts` modules
that `/api/generate` calls alongside `quotes.ts`. Treat any brokerage write-access
as off-limits for an automated job. Happy to build these with you step by step.

---

## Netlify instead of Vercel
Works, with two swaps: use **Netlify Scheduled Functions** instead of `vercel.json`
crons, and Netlify's env-var UI. The app code is unchanged.
