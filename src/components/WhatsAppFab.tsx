import { site } from "@/data/site";
import { MessageCircle } from "lucide-react";

export function WhatsAppFab() {
  const href = `https://wa.me/${site.whatsappIntl}?text=${encodeURIComponent("Hello Project SITEZY — I'd like to know more.")}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-foreground text-background shadow-luxe transition-all duration-500 hover:scale-110 hover:shadow-glow"
    >
      <span className="absolute inset-0 -z-10 rounded-full bg-accent/60 blur-xl opacity-70 group-hover:opacity-100 transition" />
      <MessageCircle size={22} />
    </a>
  );
}
