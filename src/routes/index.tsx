import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { WhyChoose } from "@/components/WhyChoose";
import { Services } from "@/components/Services";
import { Portfolio } from "@/components/Portfolio";
import { Packages } from "@/components/Packages";
import { Counters } from "@/components/Counters";
import { Reviews } from "@/components/Reviews";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { PopupBanner } from "@/components/PopupBanner";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { LiveChat } from "@/components/LiveChat";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Project SITEZY — Premium Websites for Bangladesh" },
      { name: "description", content: "Affordable, fast & premium web solutions. Mobile-friendly, SEO-ready websites built to grow your business — starting from ৳449." },
      { property: "og:title", content: "Project SITEZY — Premium Websites for Bangladesh" },
      { property: "og:description", content: "Affordable, fast & premium web solutions, built to grow your business." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Project SITEZY",
        url: "/",
        email: "hello@projectsitezy.com",
        sameAs: [
          "https://www.facebook.com/share/1Eh7ZBSH5E/?mibextid=wwXIfr",
          "https://www.instagram.com/project.sitezy",
        ],
        contactPoint: [{
          "@type": "ContactPoint",
          telephone: "+8801886112667",
          contactType: "sales",
          areaServed: "BD",
        }],
      }),
    }],
  }),
});

function Index() {
  return (
    <div className="relative overflow-x-clip">
      <SmoothScroll />
      <Navbar />
      <main>
        <Hero />
        <WhyChoose />
        <Services />
        <Portfolio />
        <Packages />
        <Counters />
        <Reviews />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
      <StickyMobileCTA />
      <PopupBanner />
      <LiveChat />
      <Toaster position="top-center" richColors />
    </div>
  );
}
