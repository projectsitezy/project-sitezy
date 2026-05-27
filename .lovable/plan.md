## Problem

In the admin Portfolio panel, clicking **Save** appears to do nothing and the uploaded picture doesn't show up on the homepage.

## Root cause

In `src/routes/_authenticated/admin.tsx` → `PortfolioRow`:

1. **Save errors are swallowed.** The Save click calls `supabase.from("portfolio_items").update(d)...` without checking the returned `error`. If RLS, a bad column, or a stale value rejects the write, the user still sees a green "Saved" toast and nothing changes in the DB. That's why the picture never updates on the homepage — the row in the DB was never written.
2. **The whole row object is sent back as the update payload**, including `id`, `created_at`, `updated_at`. Sending `updated_at` (and `id`) back can cause the update to no-op or fail under stricter policies.
3. **Local row state never re-syncs** after refresh. `useState(item)` only seeds on mount, so even when the parent refetches, the form keeps showing old values — making it feel like "the picture didn't change".

## Fix

Edit only `PortfolioRow` in `src/routes/_authenticated/admin.tsx`:

- Save handler:
  - Build a clean payload with only editable fields: `title, category, live_url, image_url, sort_order, active, description`.
  - `await` the update, capture `error`, and on error show `toast.error(error.message)` and return.
  - Only show "Saved" and `refresh()` on success.
- Add a `useEffect` that syncs local `d` from the `item` prop whenever `item.updated_at` changes, so the row reflects fresh DB values after refetch.
- Keep the upload flow exactly as-is (it already validates type/size and sets `image_url` in local state).

No UI/design changes. No schema, RLS, or other component changes.

## Files

- `src/routes/_authenticated/admin.tsx` — `PortfolioRow` only.

## Verification

- Edit a portfolio item, change the image, click Save → success toast appears, and the homepage `/` Portfolio section shows the new image immediately (realtime + cache invalidation already wired).
- If the write is ever rejected, the actual Supabase error message now appears in a toast instead of a false success.
