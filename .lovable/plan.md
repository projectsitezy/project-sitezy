# Project SITEZY — Phase 1 Build Plan

A premium, luxury-minimal single-page marketing site inspired by SoftTank's feel, plus a full order submission flow with payment proof. Admin CMS and full editability come in Phase 2.

## Stack & Setup
- TanStack Start (existing) + Tailwind v4
- **Lovable Cloud** for backend (orders + file storage for payment screenshots)
- Logo: upload, remove beige background → transparent PNG in `src/assets/`

## Design System
- Background: clean white (`oklch(0.99 0 0)`)
- Foreground: charcoal (`oklch(0.18 0.01 60)`)
- Accent: soft beige/warm neutral (`oklch(0.88 0.04 75)`)
- Subtle warm gradient glow for hero & cards
- Typography: serif display (Instrument Serif / similar) headings + Inter body — luxury minimal
- Generous spacing, glassmorphism cards, fine 1px borders, soft shadows

## Animations
- Lenis smooth scroll
- Framer Motion: section fade-up on scroll, stagger reveals
- 3D tilt on package & portfolio cards (mouse parallax)
- Floating glow blobs in hero
- Premium loader on initial paint
- Smooth hover states throughout

## Page Sections (single route `/`)
1. **Sticky Navbar** — logo top-right (per brief), nav links left/center: Home · Services · Packages · Portfolio · Reviews · FAQ · Contact. Mobile drawer menu.
2. **Hero** — Bangla headline + subheadline + sub-text, CTAs "View Packages" (scroll) + "WhatsApp Now" (wa.me/8801886112667), floating glow, scroll cue.
3. **Why Choose SITEZY** — 7 reason cards (Fast Delivery, Affordable, Mobile Responsive, SEO Ready, Premium Design, Full Support, Secure) with icons + tilt.
4. **Services** — core service offerings as cards.
5. **Portfolio** — static showcase grid (6 demo cards: image, title, category, "Live Preview" button). Tilt effect. *(Admin-editable in Phase 2 — hardcoded for now)*
6. **Packages** — 4 animated pricing cards: Starter ৳449, Business ৳999, Small E-commerce ৳1899, Premium E-commerce ৳3499. "Popular" badge on Business. Each opens order modal.
7. **Trust Counters** — animated count-up: Websites Sold, Happy Clients, Active Projects, Satisfaction %.
8. **Client Reviews** — slider/carousel of testimonials.
9. **FAQ** — premium accordion (Radix).
10. **Contact** — form (name/email/message) + social links (FB, IG, email, WhatsApp).
11. **Footer** — brand mark, links, socials, copyright.

## Order Flow (Lovable Cloud)
Modal opened from any package card:
- Step 1 — Details: name, phone, email, package (preselected), requirements (textarea), budget, optional file upload (brief/reference)
- Step 2 — Payment proof: choose method (Bkash/Nagad/Rocket/Upay) → show payment number → enter transaction ID + sender number + screenshot upload
- Submit → insert into `orders` table, upload files to storage, show success toast
- WhatsApp deeplink as fallback CTA

## Floating Elements
- Floating WhatsApp button (bottom-right, pulse glow)
- Sticky "Order Now" CTA on mobile

## Database (Lovable Cloud)
- `orders` table: id, name, phone, email, package_name, package_price, requirements, budget, brief_file_url, payment_method, transaction_id, sender_number, screenshot_url, status (default 'pending'), created_at
- RLS: anonymous insert allowed; select restricted (Phase 2 admin will read)
- Storage bucket `order-uploads` (public read for now, or signed URLs)

## SEO
- Per-route `head()` with title, description, OG tags
- JSON-LD Organization + Service schema
- `robots.txt` + `sitemap.xml` server route
- Semantic HTML, single H1, alt text, lazy images

## Out of Scope (Phase 2)
- Admin dashboard / CMS editing of all content
- Auth (owner signup)
- Popup banner system with countdown
- Theme/logo/text/package live editing from UI
- Dark mode toggle
- Live chat
- Email notifications on order

## Technical Notes
- Hardcode packages, reviews, portfolio, FAQ as typed data in `src/data/` — easy to refactor into DB-backed in Phase 2
- All copy stored in one `content.ts` for quick edits
- Mobile-first, tested at 375 / 768 / 1440

After you upload the logo and approve, I'll switch to build mode and ship it.
