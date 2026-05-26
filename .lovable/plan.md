## Root cause of the portfolio (and similar) sync bug

`src/components/Portfolio.tsx`, `Packages.tsx`, `Reviews.tsx`, and `FAQ.tsx` all import from the **static** `src/data/site.ts` file. The admin panel writes to Supabase tables (`portfolio_items`, `packages`, `reviews`, `faqs`), but the homepage never reads from them — so admin edits can never appear, no matter how many times you refresh.

## Plan

### 1. Fix data sync (homepage ↔ admin)
Convert the 4 homepage sections to read from Supabase via TanStack Query, with fallback to the static data when the DB is empty (keeps UI identical on first load):

- `Portfolio.tsx` → query `portfolio_items` where `active = true`, order by `sort_order`
- `Packages.tsx` → query `packages` where `active = true`
- `Reviews.tsx` → query `reviews` where `active = true`
- `FAQ.tsx` → query `faqs` where `active = true`

Each uses `useQuery` with a stable `queryKey` and shows a lightweight skeleton during initial fetch.

### 2. Instant updates via Realtime
- Migration: `ALTER PUBLICATION supabase_realtime ADD TABLE portfolio_items, packages, reviews, faqs, popup_banner, site_settings;` and set `REPLICA IDENTITY FULL` on each.
- Add a small `useRealtimeInvalidate(table, queryKey)` hook that subscribes to `postgres_changes` and calls `queryClient.invalidateQueries`. Wire it into each of the 4 components + `PopupBanner` + `LiveChat`. Admin edits then reflect on the homepage within ~1s with no refresh.

### 3. Performance & production polish
- **Images**: add `loading="lazy"` + `decoding="async"` everywhere; add `fetchpriority="high"` only on the Hero LCP image; preload the Hero image via root `head().links`.
- **Query client**: bump `staleTime` to 60s and `gcTime` to 5m for public reads (fewer refetches; realtime handles freshness).
- **Code hygiene**: remove unused imports flagged by ESLint; delete any dead files surfaced during the pass. UI/design is NOT changed.
- **DB indexes**: add `(active, sort_order)` indexes on `portfolio_items`, `packages`, `reviews`, `faqs` to keep list queries instant as rows grow.

### 4. Deployment readiness
- Confirm `.env.example` exists with `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` documented (server vars too).
- Verify build passes; no edits to `client.ts`, `types.ts`, `routeTree.gen.ts`.

> **Note on hosting**: this project runs on TanStack Start with a Cloudflare Worker server (see `src/server.ts`, `wrangler.jsonc`). It is **not** a static Vite app — Vercel needs the Cloudflare/Node adapter or you should publish via Lovable's built-in Publish (one click, no config). I'll keep the code portable but recommend Lovable Publish; if you specifically need Vercel I'll add the adapter in a follow-up.

### Files touched
- Edit: `src/components/Portfolio.tsx`, `Packages.tsx`, `Reviews.tsx`, `FAQ.tsx`, `Hero.tsx` (LCP hints), `src/routes/__root.tsx` (preload), `src/router.tsx` (query defaults)
- Add: `src/hooks/use-realtime-invalidate.ts`
- Migration: enable realtime + add indexes

### What stays the same
UI, layout, colors, typography, animations, copy — identical. Only data source and performance change.
