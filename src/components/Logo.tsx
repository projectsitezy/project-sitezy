import { cn } from "@/lib/utils";
import logoUrl from "@/assets/logo.png";

export function Logo({ className }: { className?: string }) {
  return (
    <a
      href="#home"
      className={cn("inline-flex items-center transition-opacity duration-500 hover:opacity-80", className)}
      aria-label="Project SITEZY"
    >
      <img
        src={logoUrl}
        alt="Project SITEZY"
        className="h-8 w-auto md:h-9 object-contain select-none"
        draggable={false}
      />
    </a>
  );
}
