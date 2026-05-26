-- Enable realtime + add list-perf indexes
ALTER TABLE public.portfolio_items REPLICA IDENTITY FULL;
ALTER TABLE public.packages REPLICA IDENTITY FULL;
ALTER TABLE public.reviews REPLICA IDENTITY FULL;
ALTER TABLE public.faqs REPLICA IDENTITY FULL;
ALTER TABLE public.popup_banner REPLICA IDENTITY FULL;
ALTER TABLE public.site_settings REPLICA IDENTITY FULL;

DO $$
BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_items; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.packages; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.faqs; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.popup_banner; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings; EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

CREATE INDEX IF NOT EXISTS idx_portfolio_items_active_sort ON public.portfolio_items (active, sort_order);
CREATE INDEX IF NOT EXISTS idx_packages_active_sort ON public.packages (active, sort_order);
CREATE INDEX IF NOT EXISTS idx_reviews_active_sort ON public.reviews (active, sort_order);
CREATE INDEX IF NOT EXISTS idx_faqs_active_sort ON public.faqs (active, sort_order);