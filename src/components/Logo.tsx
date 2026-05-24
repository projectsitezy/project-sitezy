import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#home" className={cn("group inline-flex items-center gap-2 transition-transform duration-500 hover:scale-105", className)} aria-label="Project SITEZY">
      <span className="relative grid h-9 w-9 place-items-center rounded-full border border-foreground/15 bg-gradient-to-br from-accent/60 to-beige-soft transition-all duration-500 group-hover:shadow-glow">
        <span className="font-serif text-lg leading-none text-foreground">S</span>
      </span>
      <span className="font-serif text-lg tracking-tight">
        Project <span className="italic">Sitezy</span>
      </span>
    </a>
  );
}
