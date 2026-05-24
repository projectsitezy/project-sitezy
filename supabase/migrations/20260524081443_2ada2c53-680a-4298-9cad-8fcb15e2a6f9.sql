
-- Orders table for Project SITEZY
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  package_name TEXT NOT NULL,
  package_price INTEGER NOT NULL,
  requirements TEXT,
  budget TEXT,
  brief_file_url TEXT,
  payment_method TEXT,
  transaction_id TEXT,
  sender_number TEXT,
  screenshot_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous) can submit an order
CREATE POLICY "Anyone can submit an order"
  ON public.orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No public read access — admin reads via service role in Phase 2
-- (intentionally no SELECT policy)

-- Storage bucket for order uploads (briefs + payment screenshots)
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-uploads', 'order-uploads', true);

-- Anyone can upload to order-uploads bucket
CREATE POLICY "Anyone can upload order files"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'order-uploads');

-- Public can read uploaded files (bucket is public; needed for admin review later)
CREATE POLICY "Public read order files"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'order-uploads');

-- Contact form submissions
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact message"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
