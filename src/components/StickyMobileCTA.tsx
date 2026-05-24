import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { site } from "@/data/site";

export function StickyMobileCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-foreground/10 bg-background/90 px-3 py-3 backdrop-blur-xl transition-transform duration-500 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex gap-2">
        <a
          href="#packages"
          className="flex-1 rounded-full bg-primary py-3 text-center text-sm font-medium text-primary-foreground"
        >
          Order Now
        </a>
        <a
          href={`https://wa.me/${site.whatsappIntl}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-full border border-foreground/15 px-4 py-3 text-sm"
        >
          <MessageCircle size={16} /> Chat
        </a>
      </div>
    </div>
  );
}
