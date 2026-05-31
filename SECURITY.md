# Security Checklist — Salon de Thé Bien Vivre

## Environment Variables

- [ ] All secrets stored in `.env.local` (never committed — see `.gitignore`)
- [ ] `.env.example` committed with empty / placeholder values only
- [ ] Supabase service role key (`SUPABASE_SERVICE_ROLE_KEY`) is **never** imported in client-side code (`src/lib/supabase/client.ts` uses anon key only)
- [ ] Square webhook signature secret set in `SQUARE_WEBHOOK_SIGNATURE_KEY`
- [ ] Resend API key (`RESEND_API_KEY`) only used server-side
- [ ] Upstash Redis credentials only used server-side

## API Routes

- [ ] All public API routes enforce Cloudflare Turnstile verification (`verifyTurnstile`)
- [ ] All public API routes enforce Upstash rate limiting (`rateLimit`)
- [ ] All admin API routes verify Supabase session + role before any database operation
- [ ] Square webhook route verifies HMAC-SHA256 signature using `timingSafeEqual` (constant-time comparison)
- [ ] All inputs validated with Zod schemas before database insertion
- [ ] IP addresses stored for rate-limit tracking (never exposed in responses)

## Supabase / Database

- [ ] Row Level Security (RLS) enabled on all 15 tables (see `supabase/migrations/002_rls_policies.sql`)
- [ ] Public users can only read `published` / `active` / `is_available=true` rows
- [ ] Insertions for sensitive tables (reservations, inquiries) go through service role only (server-side API routes)
- [ ] `is_admin()`, `is_staff()`, `is_content_editor()` helper functions use `SECURITY DEFINER`
- [ ] `handle_new_user()` trigger assigns `role = 'read_only'` on signup — never auto-elevates
- [ ] No direct SQL interpolation — all queries use Supabase query builder

## Content Security Policy

Configured in `next.config.ts` via `headers()`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` restricts camera, microphone, geolocation
- Review and tighten `Content-Security-Policy` before launch (currently permissive for CDN fonts/scripts)

## Authentication (Admin)

- [ ] Admin login page uses Supabase `signInWithPassword` — no custom password storage
- [ ] Admin layout Server Component re-validates session on every request
- [ ] Profiles with `status = 'inactive'` or `'suspended'` are blocked by RLS helper functions
- [ ] No hardcoded admin credentials anywhere in codebase

## Square Payments

- [ ] Use `Environment.Sandbox` in development, `Environment.Production` in production
- [ ] `SQUARE_ENVIRONMENT` env var controls this switch in `src/lib/square.ts`
- [ ] Idempotency keys generated with `crypto.randomUUID()` — prevents duplicate charges
- [ ] Payment source IDs are validated server-side — never trust client-supplied amounts
- [ ] Amount is recalculated server-side from `experience.price_cents * quantity`

## Email

- [ ] Resend sender domain must be verified (`RESEND_FROM_EMAIL`)
- [ ] No user-supplied content is rendered as raw HTML in emails — use escaped template literals

## Dependencies

- [ ] Run `npm audit` before launch and after each dependency update
- [ ] Pin major versions in `package.json`
- [ ] Review `next.config.ts` for any disabled security features

## Deployment

- [ ] Vercel: all env vars set in project settings (not in `vercel.json`)
- [ ] Vercel: preview deployments should use separate Supabase branch project
- [ ] Supabase: enable "Leaked Password Protection" in Auth settings
- [ ] Supabase: set allowed redirect URLs in Auth → URL Configuration
- [ ] Cloudflare Turnstile: verify allowed domains list includes your production domain only
- [ ] Square: switch webhook URL to production endpoint after go-live

## GDPR / Law 25 (Quebec)

- [ ] Privacy policy page (`/fr/politique-de-confidentialite`) is accurate and up to date
- [ ] Newsletter consent is explicit (checkbox, not pre-ticked)
- [ ] All forms include `consent_terms` boolean stored with the record
- [ ] IP addresses collected for rate limiting — ensure data retention policy is defined
- [ ] Unsubscribe flow implemented for newsletter (set `status = 'unsubscribed'`)
