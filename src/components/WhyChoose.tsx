import { whyChoose } from "@/data/site";
import { SectionTitle } from "./SectionTitle";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";
import * as Icons from "lucide-react";

export function WhyChoose() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle
          eyebrow="Why Project SITEZY"
          title="Crafted for brands that care."
          description="Every site we deliver is built on the same premium standards — fast, beautiful, and made to convert."
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyChoose.map((item, i) => {
            const Icon = ((Icons as unknown as Record<string, typeof Icons.Sparkles>)[item.icon]) ?? Icons.Sparkles;
            return (
              <Reveal key={item.title} delay={i * 0.05}>
                <TiltCard className="h-full">
                  <div className="group relative h-full overflow-hidden rounded-3xl border border-foreground/8 bg-white/60 p-7 shadow-luxe backdrop-blur transition-all duration-500 hover:-translate-y-1">
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/30 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-accent/60 to-beige-soft text-foreground">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-serif text-xl">{item.title}</h3>
                    <p className="mt-2 text-sm text-foreground/65">{item.desc}</p>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
