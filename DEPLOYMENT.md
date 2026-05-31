# Deployment Guide — Salon de Thé Bien Vivre

## Vercel + Supabase Deployment Checklist

### Prerequisites

- [ ] GitHub repository connected to Vercel
- [ ] Supabase project created and migrations applied
- [ ] Square account with webhook configured
- [ ] Resend account with verified domain
- [ ] Upstash Redis database created
- [ ] Cloudflare Turnstile site configured
- [ ] Custom domain ready (optional)

---

## Step 1: Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Note your **Project URL** and **anon key** (Settings → API)
3. Note your **service role key** (Settings → API → Service role — keep secret!)
4. Run migrations in order via SQL Editor or Supabase CLI:
   - `001_initial_schema.sql`
   - `002_rls_policies.sql`
   - `003_seed_data.sql`
5. Enable Email Auth (Authentication → Providers → Email)
6. Create the first admin user (see `ADMIN_SETUP.md`)

---

## Step 2: Square Setup

1. Create a Square developer account at [developer.squareup.com](https://developer.squareup.com)
2. Create an application and obtain:
   - **Access Token** (sandbox for testing, production for live)
   - **Location ID**
   - **Application ID**
3. Configure a webhook endpoint:
   - URL: `https://yourdomain.com/api/webhooks/square`
   - Events: `payment.created`, `payment.updated`
   - Note the **Signature Key** from the webhook configuration

---

## Step 3: Resend Setup

1. Create an account at [resend.com](https://resend.com)
2. Add and verify your sending domain
3. Create an API key
4. Note the `FROM_EMAIL` you will use (must match verified domain)

---

## Step 4: Upstash Redis

1. Create a Redis database at [upstash.com](https://upstash.com)
2. Note the **REST URL** and **REST Token**

---

## Step 5: Cloudflare Turnstile

1. Go to [Cloudflare Dashboard → Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
2. Add a new site with your domain
3. Note the **Site Key** (public) and **Secret Key** (private)

---

## Step 6: Vercel Deployment

1. Import your GitHub repository in [Vercel](https://vercel.com)
2. Set **Framework Preset** to `Next.js`
3. Add all environment variables (Settings → Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SQUARE_ACCESS_TOKEN
SQUARE_LOCATION_ID
SQUARE_WEBHOOK_SIGNATURE_KEY
NEXT_PUBLIC_SQUARE_APPLICATION_ID
NEXT_PUBLIC_SQUARE_LOCATION_ID
RESEND_API_KEY
FROM_EMAIL
ADMIN_EMAIL
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
NEXT_PUBLIC_SITE_URL
```

4. Deploy — Vercel will build and deploy automatically
5. Add your custom domain (Settings → Domains)

---

## Step 7: Post-Deployment Verification

- [ ] Visit the site and confirm French/English pages load
- [ ] Test contact form submission
- [ ] Test newsletter subscription
- [ ] Verify admin login works at `/fr/admin`
- [ ] Test a Square payment in sandbox mode
- [ ] Confirm Square webhook receives events
- [ ] Check Resend dashboard for email delivery
- [ ] Verify rate limiting works (submit form 6+ times quickly)

---

## Updating the Site

```bash
git push origin main
```

Vercel automatically deploys on every push to `main`.

## Rolling Back

In Vercel dashboard → Deployments → select a previous deployment → Promote to Production.
