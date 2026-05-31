# Salon de Thé Bien Vivre

A full-stack web application for **Salon de Thé Bien Vivre**, a vegan tea house and wellness space located at 1951 Rue Saint-Zotique Est, Montréal, QC. The site features bilingual (FR/EN) content, online experience reservations, private event inquiries, vendor applications, a newsletter, and a full admin panel.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| Payments | Square Web Payments SDK |
| Email | Resend |
| Rate Limiting | Upstash Redis |
| Bot Protection | Cloudflare Turnstile |
| Styling | Tailwind CSS |
| i18n | next-intl (FR / EN) |
| Testing | Vitest + Testing Library |
| Deployment | Vercel |

## Prerequisites

- Node.js 20+
- npm or pnpm
- Supabase account
- Square developer account
- Resend account
- Upstash Redis account
- Cloudflare Turnstile account

## Local Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd salon-de-the-bien-vivre
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

See **Environment Variables** section below for all required keys.

### 3. Set up Supabase

```bash
# Install Supabase CLI if needed
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

Or run the migrations manually in the Supabase SQL editor:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/migrations/003_seed_data.sql`

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file with the following:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Square
SQUARE_ACCESS_TOKEN=your-square-access-token
SQUARE_LOCATION_ID=your-location-id
SQUARE_WEBHOOK_SIGNATURE_KEY=your-webhook-signature-key
NEXT_PUBLIC_SQUARE_APPLICATION_ID=your-app-id
NEXT_PUBLIC_SQUARE_LOCATION_ID=your-location-id

# Resend (email)
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-site-key
TURNSTILE_SECRET_KEY=your-secret-key

# Site
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Running Tests

```bash
# Unit + integration tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# End-to-end tests
npm run test:e2e
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete Vercel + Supabase deployment instructions.

## Admin Setup

See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for instructions on creating the first admin user.

## Project Structure

```
src/
├── app/
│   ├── [locale]/           # Bilingual pages (fr/en)
│   │   ├── admin/          # Admin panel pages
│   │   ├── experiences/    # Public experience listings
│   │   ├── menu/           # Menu page
│   │   └── ...
│   └── api/                # API routes
│       ├── contact/
│       ├── newsletter/
│       ├── experiences/
│       ├── reservations/
│       ├── webhooks/square/
│       ├── private-event-inquiry/
│       ├── vendor-application/
│       └── admin/
├── components/             # Reusable UI components
├── lib/                    # Utilities, clients, schemas
│   ├── supabase/           # Supabase clients
│   ├── validations.ts      # Zod schemas
│   ├── square.ts           # Square payment helpers
│   ├── email.ts            # Email helpers (Resend)
│   ├── ratelimit.ts        # Rate limiting (Upstash)
│   └── turnstile.ts        # Bot protection
└── test/                   # Test setup
supabase/
└── migrations/             # SQL migration files
```
