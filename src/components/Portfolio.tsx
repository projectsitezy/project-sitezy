import { useQuery } from "@tanstack/react-query";
import { portfolio as fallbackPortfolio } from "@/data/site";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeInvalidate } from "@/hooks/use-realtime-invalidate";
import { SectionTitle } from "./SectionTitle";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";
import { ExternalLink } from "lucide-react";

type Item = { title: string; category: string | null; image_url: string | null; live_url: string | null };

export function Portfolio() {
  useRealtimeInvalidate("portfolio_items", ["portfolio_items"]);
  const { data } = useQuery({
    queryKey: ["portfolio_items"],
    queryFn: async (): Promise<Item[]> => {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("title, category, image_url, live_url, sort_order")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const items =
    data && data.length > 0
      ? data.map((p) => ({
          title: p.title,
          category: p.category ?? "",
          img: p.image_url ?? "",
          url: p.live_url ?? "#",
        }))
      : fallbackPortfolio;

  return (
    <section id="portfolio" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle
          eyebrow="Selected Work"
          title="A glimpse of what we build."
          description="Live demos and recent launches across industries."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <Reveal key={`${p.title}-${i}`} delay={i * 0.05}>
              <TiltCard intensity={6}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-3xl border border-foreground/8 bg-white shadow-luxe transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {p.img ? (
                      <img
                        src={p.img}
                        alt={p.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-foreground/5" />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-background opacity-0 transition-all duration-500 group-hover:opacity-100">
                      <span className="text-xs uppercase tracking-[0.2em]">Live Preview</span>
                      <ExternalLink size={16} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-5">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-foreground/45">{p.category}</div>
                      <h3 className="mt-1 font-serif text-xl">{p.title}</h3>
                    </div>
                  </div>
                </a>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
