## Fixes

### 1. WhatsApp + Tawk overlap on mobile
Both float at `bottom-right`. Push the WhatsApp FAB up on mobile so it stacks above Tawk and above the sticky mobile CTA bar.

- `src/components/WhatsAppFab.tsx`: change `bottom-6 right-6` → `bottom-24 right-4 md:bottom-6 md:right-6`.
- `src/components/StickyMobileCTA.tsx`: no change (already only on mobile, bottom bar).

### 2. Turn off night mode (force light theme)
Remove the toggle UI and stop applying the `dark` class.

- `src/components/Navbar.tsx`: remove the `<ThemeToggle />` usage (desktop + mobile).
- `src/hooks/use-theme.tsx`: force `light` on mount, drop the `matchMedia` dark check and the `localStorage` read, make `toggle()` a no-op. Keeps the provider so existing imports don't break.
- `src/routes/__root.tsx` (only if it sets a class): ensure no `dark` class is hard-coded.

### 3. Login not working with `evansheikh69@gmail.com`
Two root causes that need to be cleared together:

a. **Email confirmation is on by default** — if you signed up but never clicked the confirmation email, `signInWithPassword` will reject. Fix: call `configure_auth` with `auto_confirm_email: true` so signup → login works immediately.

b. **The account may not exist yet** (or has the wrong password). Fix via a one-time SQL migration:
   - Upsert the user in `auth.users` with email `evansheikh69@gmail.com`, encrypted password `evan231@Medha`, `email_confirmed_at = now()`.
   - Insert `user_roles(user_id, 'admin')` for that user (the existing `assign_admin_on_signup` trigger already handles this email, but we'll backfill to be safe).
   - Insert a matching `profiles` row.

After this you log in directly with those credentials — no signup step needed.

### 4. Portfolio: upload doesn't show, Save does nothing
The code in `src/routes/_authenticated/admin.tsx` → `PortfolioRow` is already correct (re-sync `useEffect`, clean payload, error toasts, disabled state during save/upload). What's broken in your case:

- You're testing on the **Vercel deployment**, which still has the old build. The fix exists in this Lovable workspace but Vercel won't have it until you push the latest commit and Vercel redeploys.
- Storage policy `Admins upload site assets` requires `has_role(auth.uid(),'admin')`. If the admin user above isn't created, every upload silently fails with an RLS error. Step 3 unblocks this.

No further code change in `admin.tsx` is needed — but I'll add a tiny safety net: if `upload()` or `save()` fails because there's no session, show a clear "Please re-login" toast instead of a generic RLS message.

### Files

- `src/components/WhatsAppFab.tsx` — bottom offset on mobile
- `src/components/Navbar.tsx` — remove ThemeToggle
- `src/hooks/use-theme.tsx` — force light, no-op toggle
- `src/routes/_authenticated/admin.tsx` — friendlier auth-error toast in `PortfolioRow.save/upload`
- New SQL migration — create/repair admin user + role + profile
- `configure_auth` call — enable `auto_confirm_email`

### Verification

1. Reload preview: only one floating action button visible on mobile, no overlap with Tawk.
2. Theme toggle is gone; site stays light regardless of OS preference.
3. Go to `/login`, enter `evansheikh69@gmail.com` / `evan231@Medha` → redirected to `/admin`.
4. In Admin → Portfolio: pick an item, choose a file → preview image appears + "Image uploaded" toast → click Save → "Saved" toast → homepage `/#portfolio` shows the new image instantly.
5. Push to GitHub → Vercel auto-deploys → repeat step 4 on the Vercel URL.

### Note on deployment

Nothing here breaks the existing Vercel setup (no changes to `vercel.json` or `vite.config.ts`). After approval, push the new commit so Vercel rebuilds.
