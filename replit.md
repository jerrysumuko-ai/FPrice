# Calabar FuelFinder

A Next.js 15 mobile-first web app that helps drivers in Calabar, Nigeria find current petrol and diesel prices at nearby filling stations.

## Stack

- **Framework**: Next.js 15.5.9 (App Router, Turbopack), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Radix UI primitives, shadcn/ui components, lucide-react icons
- **Database**: Supabase (Postgres + PostgREST + Row Level Security)
- **AI (optional)**: Genkit + Google GenAI (for future features; not currently wired into pages)
- **Forms / validation**: React Hook Form + Zod
- **Charts**: Recharts

## Replit setup

- Dev server: `npm run dev` → `next dev --turbopack -p 5000 -H 0.0.0.0`
- Workflow: **Start application** runs `npm run dev` on port 5000 (webview).
- Always bind to `0.0.0.0:5000` so the Replit preview proxy can reach it.

## Environment secrets (required)

| Secret                            | What it is                                     |
| --------------------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`        | Project URL, e.g. `https://xxx.supabase.co`    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | `anon public` key (long JWT starting `eyJ…`)   |
| `SUPABASE_SERVICE_ROLE_KEY`       | Service role key (server-side admin only)      |

## Data layer

All data lives in Supabase. Mock data has been removed.

- **Schema**: `supabase/schema.sql` — tables, GRANTs, RLS policies, and seed data. Idempotent; safe to re-run. Apply once via the Supabase SQL Editor when bootstrapping a new project.
- **Tables**: `stations`, `news_alerts`, `feedback`, `price_reports`
- **Types**: `src/lib/types.ts` defines `FuelStation`, `NewsAlert`, and snake_case → camelCase row mappers (`rowToStation`, `rowToNews`).
- **Client queries**: `src/lib/supabase-queries.ts` exposes `fetchStations`, `fetchStationById`, `fetchStationsByIds`, `fetchNewsAlerts`, `submitFeedback`, `submitPriceReport`, `createStation`. Used from `"use client"` pages via the browser Supabase client.
- **Supabase clients**: `src/utils/supabase/{client,server,middleware}.ts` — standard `@supabase/ssr` setup.
- **Middleware**: `middleware.ts` at the project root refreshes the auth session on every non-asset request via `updateSession`.

### RLS / access model

- `stations`, `news_alerts`: anon can `SELECT` (public reads from the browser).
- `stations`: anon can `INSERT` (community-driven station registrations).
- `feedback`, `price_reports`: anon can `INSERT` only.
- Nothing else is exposed via the anon key. Tighten when real auth is added.

## Pages

All pages are `"use client"` and fetch on mount via the helpers in `supabase-queries.ts`.

- `/` — A–Z list of stations with search and a "Recent" section backed by localStorage.
- `/station/[id]` — Station detail: prices, fuel calculator, feedback submission, price-report dialog. Star toggle persists in localStorage.
- `/favourites` — Loads station IDs from localStorage and fetches them from Supabase.
- `/feedback` — General feedback form with station dropdown sourced from Supabase.
- `/map` — Mock map with markers driven by Supabase station list.
- `/calculator` — Standalone budget → litres calculator using a station's price as the default.
- `/updates` — News alerts list from `news_alerts`.
- `/add-station` — Two-step form that inserts a new row into `stations`.
- `/profile`, `/signup` — UI shells (no auth wired up yet).

## Notes

- No Firebase code remains.
- The `signup` page currently routes to `/` without any auth call; auth is intentionally deferred.
- Logo and image columns currently use `picsum.photos` placeholders for stations seeded from SQL.

## Bootstrapping a fresh Supabase project

1. Create a new Supabase project.
2. Set the three secrets above in Replit Secrets.
3. Open Supabase → SQL Editor → New query → paste the entire contents of `supabase/schema.sql` → **Run**.
4. Restart the **Start application** workflow.
