CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'::public.app_role
  )
$$;

GRANT USAGE ON SCHEMA private TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private.is_admin(uuid) TO anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "Admins can update contact messages" ON public.contact_messages;
CREATE POLICY "Admins can update contact messages"
ON public.contact_messages
FOR UPDATE
TO public
USING (private.is_admin(auth.uid()))
WITH CHECK (private.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view contact messages"
ON public.contact_messages
FOR SELECT
TO public
USING (private.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage faqs" ON public.faqs;
CREATE POLICY "Admins manage faqs"
ON public.faqs
FOR ALL
TO public
USING (private.is_admin(auth.uid()))
WITH CHECK (private.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins read all faqs" ON public.faqs;
CREATE POLICY "Admins read all faqs"
ON public.faqs
FOR SELECT
TO public
USING (private.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders"
ON public.orders
FOR UPDATE
TO public
USING (private.is_admin(auth.uid()))
WITH CHECK (private.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view orders" ON public.orders;
CREATE POLICY "Admins can view orders"
ON public.orders
FOR SELECT
TO public
USING (private.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage packages" ON public.packages;
CREATE POLICY "Admins manage packages"
ON public.packages
FOR ALL
TO public
USING (private.is_admin(auth.uid()))
WITH CHECK (private.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins read all packages" ON public.packages;
CREATE POLICY "Admins read all packages"
ON public.packages
FOR SELECT
TO public
USING (private.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage popup" ON public.popup_banner;
CREATE POLICY "Admins manage popup"
ON public.popup_banner
FOR ALL
TO public
USING (private.is_admin(auth.uid()))
WITH CHECK (private.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage portfolio" ON public.portfolio_items;
CREATE POLICY "Admins manage portfolio"
ON public.portfolio_items
FOR ALL
TO public
USING (private.is_admin(auth.uid()))
WITH CHECK (private.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins read all portfolio" ON public.portfolio_items;
CREATE POLICY "Admins read all portfolio"
ON public.portfolio_items
FOR SELECT
TO public
USING (private.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage reviews" ON public.reviews;
CREATE POLICY "Admins manage reviews"
ON public.reviews
FOR ALL
TO public
USING (private.is_admin(auth.uid()))
WITH CHECK (private.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins read all reviews" ON public.reviews;
CREATE POLICY "Admins read all reviews"
ON public.reviews
FOR SELECT
TO public
USING (private.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage site settings" ON public.site_settings;
CREATE POLICY "Admins manage site settings"
ON public.site_settings
FOR ALL
TO public
USING (private.is_admin(auth.uid()))
WITH CHECK (private.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO public
USING (private.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Admins manage roles"
ON public.user_roles
FOR ALL
TO public
USING (private.is_admin(auth.uid()))
WITH CHECK (private.is_admin(auth.uid()));