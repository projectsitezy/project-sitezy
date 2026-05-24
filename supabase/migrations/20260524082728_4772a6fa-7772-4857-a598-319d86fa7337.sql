
-- Revoke direct execute on internal helpers (they still work inside RLS policies and triggers)
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- Make order-uploads private (admin reads via signed URLs)
UPDATE storage.buckets SET public = false WHERE id = 'order-uploads';

-- Tighten public submission policies (require non-empty essentials)
DROP POLICY IF EXISTS "Anyone can submit an order" ON public.orders;
CREATE POLICY "Anyone can submit an order" ON public.orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(name) > 0 AND length(phone) > 0 AND length(package_name) > 0 AND package_price > 0
  );

DROP POLICY IF EXISTS "Anyone can submit a contact message" ON public.contact_messages;
CREATE POLICY "Anyone can submit a contact message" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (length(name) > 0 AND length(email) > 0 AND length(message) > 0);
