Plan for GitHub + Vercel production readiness

1. Convert the TanStack Start build to Vercel
- Add the official Nitro/Vercel adapter dependency.
- Update `vite.config.ts` to use Nitro for Vercel and disable the Cloudflare build plugin path.
- Remove the active dependency on the Cloudflare Worker entry during Vercel builds so the app builds to `.output` correctly.
- Add `vercel.json` with:
  - build command: `bun run build`
  - install command: `bun install`
  - output directory: `.output`
  - framework preset: `null`
- Keep the current UI/components unchanged.

2. Fix portfolio admin-to-homepage sync properly
- Standardize public query keys so admin invalidation and homepage reads target the same cache entries.
- Update the admin portfolio add/edit/delete actions to:
  - check and show database errors instead of silently failing
  - invalidate the exact homepage portfolio query key
  - optimistically update local cache where safe
- Keep realtime invalidation for `portfolio_items`, so changes made in the admin panel instantly refresh the homepage when it is open.

3. Improve public data fetching and caching
- Apply consistent query keys for portfolio, packages, reviews, FAQs, popup, chat, and settings.
- Keep fast client caching, but invalidate immediately on realtime updates.
- Select only the columns each homepage component needs.
- Keep existing database indexes/realtime setup and add any missing safe indexes if needed.

4. Optimize uploads and images
- Improve admin portfolio image upload flow without changing the admin UI:
  - validate image type/size before upload
  - upload with cache-control headers
  - use deterministic public URLs from the existing public storage bucket
  - prevent double-submit while uploading/saving
- Add lazy loading/async decoding where missing, including popup/admin preview images where appropriate.
- Avoid heavy client work on first load and keep third-party chat loading async.

5. Production cleanup for GitHub/Vercel
- Remove or ignore deployment artifacts that should not be committed/deployed, while keeping required config files.
- Ensure `.gitignore` covers generated output and local deployment folders.
- Confirm environment variables needed on Vercel are documented in a small deployment note:
  - public backend URL/key for browser reads
  - server backend URL/public key/service role key only if server-side backend access is used
- Do not edit generated backend client/type files.

6. Validation after implementation
- Run the project’s verification command after code changes.
- Check the portfolio flow by confirming admin mutation keys match homepage query keys and realtime invalidation.
- Confirm the Vercel build config points to `.output` and no Cloudflare-only adapter is required for Vercel.

Expected result
- Admin portfolio add/edit/delete changes appear on the homepage immediately.
- The app is configured for GitHub-to-Vercel deployment.
- Public pages load faster with cleaner caching, optimized fetches, and safer uploads.
- The current website design remains exactly the same.