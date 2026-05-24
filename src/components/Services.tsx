import { services } from "@/data/site";
import { SectionTitle } from "./SectionTitle";
import { Reveal } from "./Reveal";
import { ArrowUpRight } from "lucide-react";

export function Services() {
  return (
    <section id="services" className="relative py-24 md:py-32 bg-gradient-to-b from-transparent via-beige-soft/30 to-transparent">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle
          eyebrow="Services"
          title="Everything your brand needs online."
          description="From single-page launches to full-scale e-commerce — handcrafted, end to end."
        />
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-foreground/8 bg-foreground/8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.04}>
              <div className="group relative flex h-full flex-col justify-between bg-background p-8 transition-colors duration-500 hover:bg-beige-soft">
                <div>
                  <div className="mb-6 text-xs tabular-nums text-foreground/40">0{i + 1}</div>
                  <h3 className="font-serif text-2xl">{s.title}</h3>
                  <p className="mt-3 text-sm text-foreground/65">{s.desc}</p>
                </div>
                <div className="mt-10 inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-foreground/40 transition-all duration-500 group-hover:text-foreground">
                  Learn more <ArrowUpRight size={14} className="transition-transform group-hover:rotate-45" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
