import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "sitezy-popup-dismissed";

export function PopupBanner() {
  const [open, setOpen] = useState(false);
  const { data } = useQuery({
    queryKey: ["popup_banner"],
    queryFn: async () => {
      const { data } = await supabase.from("popup_banner").select("*").limit(1).maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (!data?.enabled) return;
    const freq = data.frequency ?? "session";
    const storage = freq === "always" ? null : freq === "once" ? localStorage : sessionStorage;
    if (storage && storage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), 1800);
    return () => clearTimeout(t);
  }, [data]);

  const dismiss = () => {
    setOpen(false);
    if (!data) return;
    if (data.frequency === "session") sessionStorage.setItem(STORAGE_KEY, "1");
    else if (data.frequency === "once") localStorage.setItem(STORAGE_KEY, "1");
  };

  if (!data?.enabled) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={dismiss}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 220 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-foreground/10 bg-card shadow-luxe"
          >
            <button onClick={dismiss} className="absolute right-4 top-4 z-10 rounded-full bg-background/70 p-1.5 backdrop-blur">
              <X size={16} />
            </button>
            {data.image_url && (
              <img src={data.image_url} alt="" className="h-44 w-full object-cover" />
            )}
            <div className="p-8 text-center">
              {data.title && <h3 className="font-serif text-2xl text-foreground">{data.title}</h3>}
              {data.message && <p className="mt-2 text-sm text-muted-foreground">{data.message}</p>}
              {data.cta_label && data.cta_url && (
                <a
                  href={data.cta_url}
                  onClick={dismiss}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                  {data.cta_label}
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
