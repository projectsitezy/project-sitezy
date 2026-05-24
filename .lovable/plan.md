# Phase 2 — Project SITEZY

Phase 1 e marketing site + order form ready ache. Ekhon Phase 2 te ja ja chilo seta build korbo:

## 1. Authentication + Admin Role
- Email/password login (Google sign-in optional, bolun lagbe kina)
- `profiles` table + `user_roles` table (enum: `admin`, `user`) — secure role check via `has_role()` SECURITY DEFINER function
- `/login` public route, `/admin/*` protected via `_authenticated` layout + admin role guard
- Apnar nijer admin account ekta seed korbo (apnar email den)

## 2. Admin Dashboard (`/admin`)
- **Orders panel**: shob orders table view, filter by status (pending / in-progress / completed / cancelled), search by phone/name, screenshot + brief file preview, status update, notes, CSV export
- **Contact messages panel**: inbox view, mark as read/replied
- **Analytics**: total orders, revenue, conversion, package breakdown, last 30 days chart (Recharts)

## 3. Live CMS Editing (Admin only)
DB-backed content jate code change na kore admin theke edit kora jay:
- `site_settings` (key/value JSONB) — hero headline (Bangla + English), subheadline, CTA labels, contact info, WhatsApp number, social links, popup banner config
- `packages` table — name, price, features[], badge, order, active flag → Packages section ei table theke read korbe
- `reviews` table — name, role, rating, text, avatar, active
- `portfolio_items` table — title, category, image, url, active
- `faqs` table — question, answer, order, active
- Admin UI: inline forms with image upload to storage, drag-to-reorder, preview

## 4. Popup Banner
- Promotional modal/toast (admin-configurable: title, message, CTA, image, schedule on/off, frequency: once-per-session / always)
- Smooth entry animation, dismissable, localStorage memory

## 5. Dark / Light Mode
- Theme toggle in navbar, `next-themes` style implementation, semantic tokens already in `styles.css` — extend `.dark` overrides for full coverage
- Persist preference, system-preference default
- SSR-safe (no flash) via inline `ScriptOnce`

## 6. Email Notifications
- Email domain setup (Lovable Cloud managed)
- Transactional emails:
  - New order → notify admin (with order details + screenshot link)
  - Order confirmation → customer
  - Contact form → notify admin
  - Order status change → customer
- Triggered via server functions on insert/update

## 7. Live Chat
- Floating chat widget (apni ki chan?):
  - **Option A**: Tawk.to / Crisp embed (free, instant)
  - **Option B**: Custom DB-backed chat (heavier — Phase 3 candidate)
- Default suggestion: Tawk.to/Crisp, since WhatsApp FAB already covers async

## 8. Sticky CTA polish + SEO refinements
- Sticky bottom-bar CTA on mobile ("Order Now" + WhatsApp)
- `sitemap.xml` dynamic from active portfolio/packages
- JSON-LD: `Service`, `Product` (per package), `FAQPage`

---

## Technical Notes
- **DB migrations** (single batch): `profiles`, `user_roles` + enum + `has_role()`, `site_settings`, `packages`, `reviews`, `portfolio_items`, `faqs`, `popup_banner`, all with RLS (public SELECT where `active=true`, admin-only write via `has_role(auth.uid(),'admin')`)
- **Data fetching**: TanStack Query `useSuspenseQuery` + `createServerFn` with `requireSupabaseAuth` for admin mutations; public reads via server fn with `supabaseAdmin` scoped projection
- **Image uploads**: reuse `order-uploads` bucket pattern, new `site-assets` public bucket for CMS images
- **Refactor**: replace hardcoded `src/data/site.ts` content with DB reads via loaders

---

## Questions before I start
1. **Admin email** — kon email diye admin account toiri korbo? (apnar email den)
2. **Google login** dorkar nai shudhu apnar admin er jonno? Naki customer-facing future feature er jonno chai?
3. **Live chat**: Tawk.to/Crisp embed (recommended, 5 min setup) — naki skip korbo ekhon?
4. **Email domain**: kono custom domain ache (e.g. `projectsitezy.com`) jeta email pathate use korbo? Na thakle skip kore default e thakbe.

Ei 4 ta uttor pele full Phase 2 implement shuru kore dibo.
