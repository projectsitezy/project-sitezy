import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function SectionTitle({
  eyebrow,
  title,
  description,
  className,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cn(align === "center" ? "text-center mx-auto" : "text-left", "max-w-3xl mb-16", className)}>
      {eyebrow && (
        <Reveal>
          <div className="mb-4 text-xs uppercase tracking-[0.25em] text-foreground/50">{eyebrow}</div>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="font-serif text-3xl md:text-5xl leading-tight text-balance">{title}</h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p className="mt-5 text-foreground/65 md:text-lg">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
