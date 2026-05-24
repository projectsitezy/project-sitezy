import { useEffect, useRef, useState } from "react";
import { counters } from "@/data/site";
import { Reveal } from "./Reveal";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const start = performance.now();
        const dur = 1600;
        const step = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          setN(Math.floor(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <div ref={ref} className="font-serif text-5xl md:text-6xl tabular-nums">{n}{suffix}</div>;
}

export function Counters() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-foreground/8 bg-foreground/8 md:grid-cols-4">
          {counters.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.06}>
              <div className="bg-background p-8 text-center">
                <Counter value={c.value} suffix={c.suffix} />
                <div className="mt-3 text-xs uppercase tracking-[0.2em] text-foreground/50">{c.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
