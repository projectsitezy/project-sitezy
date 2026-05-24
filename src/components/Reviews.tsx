import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { reviews } from "@/data/site";
import { SectionTitle } from "./SectionTitle";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export function Reviews() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  const [, setIdx] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setIdx(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    onSelect();
  }, [embla]);

  return (
    <section id="reviews" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle eyebrow="Client Reviews" title="Loved by founders & teams." />

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {reviews.map((r) => (
                <div key={r.name} className="min-w-0 shrink-0 grow-0 basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="h-full rounded-3xl border border-foreground/8 bg-white p-8 shadow-luxe">
                    <div className="mb-4 flex gap-1 text-foreground">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                    <p className="font-serif text-xl leading-snug text-balance">"{r.text}"</p>
                    <div className="mt-6 text-sm">
                      <div className="font-medium">{r.name}</div>
                      <div className="text-foreground/55">{r.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <button onClick={() => embla?.scrollPrev()} className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15 transition-colors hover:bg-foreground hover:text-background">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => embla?.scrollNext()} className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15 transition-colors hover:bg-foreground hover:text-background">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
