import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { site } from "@/data/site";
import heroGlow from "@/assets/hero-glow.png";

export function Hero() {
  const wa = `https://wa.me/${site.whatsappIntl}?text=${encodeURIComponent("Hi Project SITEZY, I want a website.")}`;
  return (
    <section id="home" className="relative isolate overflow-hidden pt-36 pb-28 md:pt-44 md:pb-40">
      {/* Background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[1200px] -translate-x-1/2 opacity-80" style={{ background: "var(--gradient-warm)" }} />
        <motion.img
          src={heroGlow}
          alt=""
          aria-hidden
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute left-1/2 top-10 h-[700px] w-[700px] -translate-x-1/2 select-none"
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-white/60 px-4 py-1.5 text-xs tracking-wide text-foreground/70 backdrop-blur"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Premium Web Solutions · Bangladesh
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-4xl leading-[1.05] text-balance md:text-6xl lg:text-7xl"
        >
          আপনার Business-এর জন্য{" "}
          <span className="italic text-foreground/85">Professional Website</span>{" "}
          এখন সহজ
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-foreground/70 md:text-xl"
        >
          Affordable, Fast &amp; Premium Web Solutions
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mx-auto mt-3 max-w-xl text-sm text-foreground/55 md:text-base"
        >
          Modern, mobile-friendly &amp; SEO-ready websites — built to grow your business.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href="#packages"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm text-background transition-all duration-500 hover:shadow-luxe hover:-translate-y-0.5"
          >
            View Packages
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-white/60 px-7 py-3.5 text-sm backdrop-blur transition-all duration-500 hover:bg-white hover:shadow-luxe"
          >
            <MessageCircle size={16} />
            WhatsApp Now
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-20 text-xs uppercase tracking-[0.25em] text-foreground/40"
        >
          ↓ Scroll
        </motion.div>
      </div>
    </section>
  );
}
