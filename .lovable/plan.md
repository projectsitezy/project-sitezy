## Plan

I’ll fix the portfolio admin issue so Save gives visible feedback, updates the database reliably, and the homepage portfolio refreshes after changes.

### What I’ll change

1. **Portfolio admin Save button**
   - Make Save visibly switch to `Saving...` while working.
   - Disable Save during upload/save to prevent double-click issues.
   - Show clear success/error messages instead of looking like “nothing happened”.
   - If login/session/admin permission is the problem, show a clear re-login/admin message.

2. **Portfolio image upload flow**
   - Show image preview immediately after upload.
   - Keep the uploaded image URL in the draft until Save is clicked.
   - After Save, refresh both admin portfolio data and public homepage portfolio data.

3. **Backend access check**
   - Backend is healthy.
   - The admin user and admin role exist.
   - Portfolio table has data.
   - I’ll keep the fix compatible with existing Vercel setup.

4. **Night mode leftover in admin**
   - Remove the remaining admin `ThemeToggle` import/button so night mode stays off everywhere.

5. **GitHub/Vercel**
   - I can make the code push-ready, but I cannot directly push commits from here.
   - After implementation, you’ll push/sync from Lovable to GitHub; Vercel will redeploy automatically from GitHub.

### Files to update

- `src/routes/_authenticated/admin.tsx`

### Verification

- Admin portfolio Save shows loading + success/error toast.
- Uploaded screenshot preview appears before Save.
- After Save, refreshed portfolio data is available for the homepage.
- No Vercel config changes needed.