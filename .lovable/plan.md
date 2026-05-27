## GitHub + Vercel Deployment Plan

Ami project ke properly GitHub e push korar moto state e niye jabo and Vercel e smoothly deploy hobe seta nishchit korbo. UI/design kichu change hobe na.

### 1. Vercel build config thik kora
- `vite.config.ts` e `nitro()` plugin ke Vercel preset diye configure korbo (`preset: "vercel"`) jate `.vercel/output` properly generate hoy
- `vercel.json` update korbo:
  - `outputDirectory: ".vercel/output"` (Nitro Vercel preset er standard)
  - `framework: null` rakhbo
  - build/install command thik ache
- `src/server.ts` (Cloudflare Worker entry) ke build theke baad dewar jonno conditional korbo — Vercel build e eta load hobe na

### 2. package.json scripts ensure kora
- `build` script Nitro Vercel preset er sathe kaj korbe seta verify korbo
- Unnecessary Cloudflare-only scripts (wrangler deploy ityadi) ke optional/dev-only korbo

### 3. .gitignore + repo hygiene
- `.vercel`, `.nitro`, `.output`, `node_modules`, `dist`, `.env` — sob ignored ache seta confirm korbo
- `.env.example` already ache, ota e Vercel e lagano env var list ache

### 4. Vercel deploy steps (ami document korbo)
1. Lovable er GitHub integration diye repo push (chat input er + button → GitHub → Connect)
2. Vercel e "New Project" → ei GitHub repo import
3. Framework Preset: **Other** (vercel.json read korbe)
4. Environment Variables add koro (Lovable Cloud → Backend theke copy):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Deploy click

### 5. Supabase Auth redirect URLs
- Vercel domain (production + preview) ke Supabase Auth er "Site URL" / "Redirect URLs" e add korte hobe — eta ami document korbo, login flow tate break korbe na

### 6. Validation
- Local e `bun run build` chaliye dekhbo `.vercel/output` generate hocche kina
- Build error/warning thakle fix korbo

### Files to change
- `vite.config.ts` — Nitro Vercel preset
- `vercel.json` — outputDirectory update
- `src/server.ts` — Cloudflare-only guard (optional)
- `.gitignore` — verify

### What stays the same
- Saari UI/components, routes, admin panel, portfolio sync logic — kichu touch hobe na
