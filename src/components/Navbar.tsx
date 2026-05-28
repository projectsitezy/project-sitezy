import { useEffect, useState } from "react";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { cn } from "@/lib/utils";

const links = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#packages", label: "Packages" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-500", scrolled ? "py-3" : "py-5")}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <nav className={cn("flex items-center justify-between rounded-full px-4 py-2 transition-all duration-500 md:px-6", scrolled ? "glass shadow-luxe" : "bg-transparent")}>
          <ul className="hidden items-center gap-7 text-sm text-foreground/75 md:flex">
            {links.map((l) => (
              <li key={l.href}><a href={l.href} className="hover:text-foreground transition-colors">{l.label}</a></li>
            ))}
          </ul>

          <button className="rounded-full p-2 md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link to="/admin" className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 hover:bg-accent/40" aria-label="Admin">
                <LayoutDashboard size={14} />
              </Link>
            )}
            <Logo />
          </div>
        </nav>

        {open && (
          <div className="mt-2 rounded-3xl glass p-4 shadow-luxe md:hidden">
            <ul className="flex flex-col gap-1">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-sm hover:bg-accent/40">{l.label}</a>
                </li>
              ))}
              {isAdmin && (
                <li><Link to="/admin" onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-sm hover:bg-accent/40">Admin Dashboard</Link></li>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
