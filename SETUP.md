# Salon de Thé Bien Vivre — Setup Guide

Complete step-by-step guide to go from zero to production.

---

## Step 1 — Migrate code to your GitHub repo

The code lives on branch `claude/happy-ramanujan-Q6yC9` in the Aurex GitHub repo.
Run these commands **on your local machine**:

```bash
# Clone from current location
git clone https://github.com/aurexbusiness/salon-de-the-bien-vivre.git \
  -b claude/happy-ramanujan-Q6yC9 salon-de-the-bien-vivre
cd salon-de-the-bien-vivre

# Point to new repo
git remote set-url origin https://github.com/fxbillions450-pixel/salon-de-the-bien-vivre.git

# Push everything as main
git push -u origin claude/happy-ramanujan-Q6yC9:main
```

---

## Step 2 — Supabase: Disable network restrictions

Before running migrations, you must allow connections from your IP:

1. Go to https://supabase.com/dashboard/project/kjqduijwicmmcmndithk
2. **Settings → Network → Network Restrictions**
3. Either **disable** restrictions or add your IP address
4. Save

---

## Step 3 — Run Supabase migrations

From your cloned repo, run:

```bash
# Install psql if needed: brew install libpq (Mac) or apt install postgresql-client (Ubuntu)
bash scripts/setup-supabase.sh
```

Or run each file manually in the Supabase SQL Editor:
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_rls_policies.sql`
- `supabase/migrations/003_seed_data.sql`

---

## Step 4 — Create admin user

1. Go to https://supabase.com/dashboard/project/kjqduijwicmmcmndithk
2. **Authentication → Users → Add user**
3. Email: `nakicha@salondethebienvivre.com`
4. Password: `BienVivre2026@`
5. Check **Auto Confirm User** → Save
6. Go to **SQL Editor** → run `scripts/create-admin-user.sql`

---

## Step 5 — Configure external services

### Resend (email)
1. Sign up at https://resend.com
2. Add and verify your domain
3. Create API key → save as `RESEND_API_KEY`

### Cloudflare Turnstile (bot protection)
1. Go to https://dash.cloudflare.com → Turnstile
2. Add site → choose "Managed" → add your domain
3. Copy **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
4. Copy **Secret Key** → `TURNSTILE_SECRET_KEY`

### Square (payments)
1. Sign up at https://developer.squareup.com
2. Create an application
3. Copy **Sandbox Application ID** → `NEXT_PUBLIC_SQUARE_APP_ID`
4. Go to Locations → copy **Location ID** → `NEXT_PUBLIC_SQUARE_LOCATION_ID`
5. Copy **Sandbox Access Token** → `SQUARE_ACCESS_TOKEN`
6. Webhooks → add endpoint URL → copy **Signature Key** → `SQUARE_WEBHOOK_SIGNATURE_KEY`

### Upstash Redis (rate limiting)
1. Sign up at https://upstash.com
2. Create a Redis database (Frankfurt or closest region)
3. Copy **REST URL** → `RATE_LIMIT_REDIS_URL`
4. Copy **REST Token** → `RATE_LIMIT_REDIS_TOKEN`

---

## Step 6 — Fill .env.local

Copy `.env.example` to `.env.local` and fill all values.
The file already has the Supabase values pre-filled. Add the rest from Step 5.

**Never commit `.env.local` to git.** It is already in `.gitignore`.

---

## Step 7 — Deploy to Vercel

### Option A — Via Vercel CLI (easiest)
```bash
npm i -g vercel
vercel login
vercel --prod
```
Vercel will ask which team/account and create the project automatically.
Then add all env vars in **Vercel Dashboard → Project → Settings → Environment Variables**.

### Option B — Via Vercel Dashboard
1. Go to https://vercel.com/new
2. Import Git Repository → connect GitHub → select `fxbillions450-pixel/salon-de-the-bien-vivre`
3. Framework: **Next.js** (auto-detected)
4. Add all environment variables from `.env.local`
5. Deploy

### Set Square Webhook URL
After deploying, go to Square Developer → Webhooks → update endpoint:
```
https://your-vercel-domain.vercel.app/api/webhooks/square
```

---

## Step 8 — Verify everything works

- [ ] Home page loads at your Vercel URL
- [ ] Language switcher works (FR ↔ EN)
- [ ] Contact form submits (check Supabase → contact_messages)
- [ ] Newsletter signup works
- [ ] Admin login works at `/fr/admin` with your email/password
- [ ] Square sandbox payment flow works
- [ ] Webhook confirms reservation after payment

---

## Supabase credentials (reference)

| Variable | Value |
|---|---|
| Project ID | `kjqduijwicmmcmndithk` |
| Project URL | `https://kjqduijwicmmcmndithk.supabase.co` |
| Anon (publishable) key | `sb_publishable_rPBFd8lVWWG5Pkz5rjl81Q_0--Xm5aH` |
| Service role key | *(in .env.local — do not share)* |
| DB password | *(saved securely — do not commit)* |
| Dashboard | https://supabase.com/dashboard/project/kjqduijwicmmcmndithk |
