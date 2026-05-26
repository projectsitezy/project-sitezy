import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { packages as fallbackPackages, type Pkg } from "@/data/site";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeInvalidate } from "@/hooks/use-realtime-invalidate";
import { SectionTitle } from "./SectionTitle";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";
import { Check, Sparkles } from "lucide-react";
import { OrderDialog } from "./OrderDialog";
import { cn } from "@/lib/utils";

export function Packages() {
  const [selected, setSelected] = useState<Pkg | null>(null);
  useRealtimeInvalidate("packages", ["packages"]);

  const { data } = useQuery({
    queryKey: ["packages"],
    queryFn: async (): Promise<Pkg[]> => {
      const { data, error } = await supabase
        .from("packages")
        .select("name, tagline, price, features, highlighted, sort_order")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((p) => ({
        name: p.name,
        tagline: p.tagline ?? "",
        price: p.price,
        features: Array.isArray(p.features) ? (p.features as string[]) : [],
        popular: !!p.highlighted,
      }));
    },
  });

  const items = data && data.length > 0 ? data : fallbackPackages;

  return (
    <section id="packages" className="relative py-24 md:py-32 bg-gradient-to-b from-transparent via-beige-soft/30 to-transparent">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle
          eyebrow="Packages"
          title="Premium pricing, premium delivery."
          description="Pick a package. Submit your brief. We handle the rest."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {items.map((p, i) => (
            <Reveal key={`${p.name}-${i}`} delay={i * 0.06}>
              <TiltCard intensity={5} className="h-full">
                <div
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white p-7 shadow-luxe transition-all duration-500 hover:-translate-y-1",
                    p.popular ? "border-foreground/25" : "border-foreground/8",
                  )}
                >
                  {p.popular && (
                    <div className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-background">
                      <Sparkles size={10} /> Popular
                    </div>
                  )}
                  <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accent/30 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                  <div>
                    <h3 className="font-serif text-2xl">{p.name}</h3>
                    <p className="mt-1 text-sm text-foreground/55">{p.tagline}</p>
                    <div className="mt-6 flex items-end gap-1">
                      <span className="font-serif text-5xl">৳{p.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <ul className="mt-7 flex-1 space-y-2.5 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2.5">
                        <Check size={16} className="mt-0.5 shrink-0 text-foreground/70" />
                        <span className="text-foreground/75">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setSelected(p)}
                    className={cn(
                      "mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm transition-all duration-500",
                      p.popular
                        ? "bg-foreground text-background hover:shadow-luxe"
                        : "border border-foreground/15 hover:bg-foreground hover:text-background",
                    )}
                  >
                    Order this package
                  </button>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>

      <OrderDialog pkg={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </section>
  );
}
