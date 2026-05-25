import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { site } from "@/data/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative border-t border-foreground/10 bg-gradient-to-b from-transparent to-beige-soft/40">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-foreground/60">
              Premium web solutions for ambitious brands across Bangladesh.
            </p>
          </div>
          <div className="text-sm">
            <div className="mb-3 text-xs uppercase tracking-[0.2em] text-foreground/50">
              Explore
            </div>
            <ul className="space-y-2 text-foreground/75">
              <li>
                <a href="#services" className="hover:text-foreground">
                  Services
                </a>
              </li>
              <li>
                <a href="#packages" className="hover:text-foreground">
                  Packages
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-foreground">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-foreground">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div className="text-sm">
            <div className="mb-3 text-xs uppercase tracking-[0.2em] text-foreground/50">
              Contact
            </div>
            <ul className="space-y-2 text-foreground/75">
              <li>
                <a
                  href={`https://wa.me/${site.whatsappIntl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  WhatsApp · {site.whatsapp}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-foreground">
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href={site.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  Instagram
                </a>
              </li>
            </ul>

            <div className="mt-6 rounded-2xl border border-foreground/10 bg-card/70 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/50">
                <ShieldCheck size={14} className="text-foreground/60" />
                Admin
              </div>
              <p className="text-sm text-foreground/65">Site owner login and dashboard access.</p>
              <Link
                to="/login"
                search={{ redirect: "/admin" }}
                className="mt-3 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground transition hover:opacity-90"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-foreground/10 pt-6 text-xs text-foreground/50 md:flex-row">
          <div>© {new Date().getFullYear()} Project SITEZY. All rights reserved.</div>
          <div>Crafted with care in Bangladesh.</div>
        </div>
      </div>
    </footer>
  );
}
