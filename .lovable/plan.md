# Phase 2 — Final Pass

Admin email peyechi (`evansheikh69@gmail.com`) ar Tawk.to ID o peyechi. Ekhon baki kaaj gulo finish korbo.

## 1. Admin Role Assignment
- Login page er instructions update korbo: first `evansheikh69@gmail.com` diye signup korte hobe (email confirm korar por).
- Signup hoye gele ekta migration / insert chalabo je `user_roles` table e `(user_id, 'admin')` insert korbe — auth.users theke ei email lookup kore.
- Auto-confirm email **off** thakbe (default), tai apni Lovable Cloud → Users theke account confirm korte parben, othoba email confirm korben.

> Alternative: chaile auto-confirm on kore dite pari shudhu apnar signup er somoy — bolun.

## 2. Tawk.to Live Chat Integration
- `site_settings` te ekta `live_chat` key already structure ache; oitar moddhe Tawk.to property ID + widget ID store korbo:
  - Property ID: `6a12c169fb330b1c32810372`
  - Widget ID: `default`
- Notun component `src/components/TawkChat.tsx` toiri korbo ja:
  - `site_settings.live_chat.tawk_property_id` + `.tawk_widget_id` DB theke read korbe (TanStack Query)
  - Enabled thakle dynamically `<script>` inject korbe `embed.tawk.to/<property>/<widget>` theke
  - Unmount e cleanup + `Tawk_API.hideWidget()` call korbe
  - SSR-safe (`typeof window` guard)
- Admin dashboard "Settings" tab e Tawk.to section add korbo: Property ID, Widget ID, Enable toggle — apni future e change korte parben.
- Initial value seed kore debo apnar deya ID diye, enabled = true.
- `__root.tsx` e `<TawkChat />` mount korbo (after AuthProvider).

## 3. Email Notifications
Lovable Cloud managed transactional email diye:
- **New order** → admin (`evansheikh69@gmail.com`) ke notify: order details, customer info, screenshot signed URL, brief file link
- **Order confirmation** → customer (jodi email diye thake)
- **New contact message** → admin ke
- **Order status change** → customer (status update e)

Implementation:
- `email_domain--setup_email_infra` diye default Lovable Cloud sender setup korbo (apnar custom domain ekhon nai dhore niye, default `noreply@<lovable subdomain>` use korbo — pore custom domain add korte parben)
- Server function `src/lib/notifications.functions.ts`:
  - `notifyNewOrder({ orderId })` — supabaseAdmin diye order fetch + email send
  - `notifyContactMessage({ messageId })`
  - `notifyOrderStatusChange({ orderId, newStatus })`
- Trigger:
  - OrderDialog submit success er por `notifyNewOrder` call
  - Contact form submit success er por `notifyContactMessage` call
  - Admin dashboard e status update korar somoy `notifyOrderStatusChange` call

## 4. SEO Refinements
- `src/routes/api/sitemap[.]xml.ts` — dynamic sitemap: home + packages (slug onujayi anchor) + active portfolio items
- `index.tsx` head() te JSON-LD inject:
  - `Organization` schema (PROJECT SITEZY, logo, contact)
  - `FAQPage` schema from `faqs` table
  - Per-package `Service` schema
- `robots.txt` update kore sitemap reference add korbo

## 5. Small polish
- Login page e helper text: "First-time admin? Sign up with evansheikh69@gmail.com to claim admin access."
- Admin dashboard er Settings tab e Tawk.to + popup banner sections er moddhe spacing fix
- Mobile sticky CTA: WhatsApp + Order Now buttons jate Tawk.to widget er sathe overlap na hoy — z-index ar bottom offset adjust korbo

---

## Technical Notes
- **Admin role assign**: ekta one-time SQL migration —
  ```sql
  INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'evansheikh69@gmail.com'
  ON CONFLICT DO NOTHING;
  ```
  Eta apnar signup hoye jaowar **por** chalate hobe. Tai workflow:
  1. Apni `/login` e giye signup korben evansheikh69@gmail.com diye
  2. Email confirm korben (link asbe)
  3. Tarpor apni amake bolun "admin role assign koro" — ami migration chalabo
  
  Othoba ekhoni chalate chaile bolun, ami auto-confirm on kore signup → role assign → auto-confirm off — ek dhakka te kore dibo.

- **Tawk.to**: script `embed.tawk.to/<property-id>/<widget-id>` format use kore. Apnar deya URL e `default` widget — eta exactly serial.

- **Email**: Lovable Cloud manages SMTP. Server fn theke `fetch` diye Resend/Cloud email API call korbo (Lovable AI Gateway style)। Custom domain pore add kore "from" address change korte parben.

---

## Questions
1. **Admin signup flow**: Apni ki nije signup korte chan (manual confirm), naki auto-confirm on kore ami ekhoni apnar admin account toiri kore dibo? (Auto-confirm on hole apni email confirm chara direct login korte parben.)
2. **Email "from" address**: Custom domain (e.g. `projectsitezy.com`) ki ekhon ache, naki default Lovable Cloud sender e shuru kori?

Eta 2 ta uttor pele bakitate full implementation start kore dibo.
