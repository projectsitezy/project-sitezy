
-- ============================================================
-- PHASE 2 FOUNDATION: Auth, Roles, CMS tables, Storage
-- ============================================================

-- 1. PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles readable by owner" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- 2. ROLES (security definer pattern)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. UPDATED_AT helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. SITE SETTINGS (key/value)
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site settings public read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage site settings" ON public.site_settings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. PACKAGES
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT,
  price INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BDT',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  badge TEXT,
  highlighted BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active packages public read" ON public.packages
  FOR SELECT USING (active = true);
CREATE POLICY "Admins read all packages" ON public.packages
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage packages" ON public.packages
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER packages_updated_at BEFORE UPDATE ON public.packages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. REVIEWS
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  avatar_url TEXT,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  body TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active reviews public read" ON public.reviews FOR SELECT USING (active = true);
CREATE POLICY "Admins read all reviews" ON public.reviews FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage reviews" ON public.reviews FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. PORTFOLIO
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,
  image_url TEXT,
  live_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active portfolio public read" ON public.portfolio_items FOR SELECT USING (active = true);
CREATE POLICY "Admins read all portfolio" ON public.portfolio_items FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage portfolio" ON public.portfolio_items FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER portfolio_updated_at BEFORE UPDATE ON public.portfolio_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. FAQS
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active faqs public read" ON public.faqs FOR SELECT USING (active = true);
CREATE POLICY "Admins read all faqs" ON public.faqs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage faqs" ON public.faqs FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER faqs_updated_at BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10. POPUP BANNER (single row config)
CREATE TABLE public.popup_banner (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enabled BOOLEAN NOT NULL DEFAULT false,
  title TEXT,
  message TEXT,
  cta_label TEXT,
  cta_url TEXT,
  image_url TEXT,
  frequency TEXT NOT NULL DEFAULT 'session', -- 'session' | 'always' | 'once'
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.popup_banner ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Popup banner public read" ON public.popup_banner FOR SELECT USING (true);
CREATE POLICY "Admins manage popup" ON public.popup_banner FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER popup_updated_at BEFORE UPDATE ON public.popup_banner
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.popup_banner (enabled) VALUES (false);

-- 11. ORDERS: admin select + update access
CREATE POLICY "Admins can view orders" ON public.orders
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 12. CONTACT MESSAGES: admin access + read flag
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN NOT NULL DEFAULT false;
CREATE POLICY "Admins can view contact messages" ON public.contact_messages
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contact messages" ON public.contact_messages
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 13. STORAGE: site-assets bucket (public)
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Site assets public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-assets');
CREATE POLICY "Admins upload site assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update site assets" ON storage.objects
  FOR UPDATE USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete site assets" ON storage.objects
  FOR DELETE USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

-- 14. Order uploads: admin read access
CREATE POLICY "Admins read order uploads" ON storage.objects
  FOR SELECT USING (bucket_id = 'order-uploads' AND public.has_role(auth.uid(), 'admin'));
