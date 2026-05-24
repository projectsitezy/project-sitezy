export const site = {
  brand: "PROJECT SITEZY",
  whatsapp: "01886112667",
  whatsappIntl: "8801886112667",
  email: "hello@projectsitezy.com",
  socials: {
    facebook: "https://www.facebook.com/share/1Eh7ZBSH5E/?mibextid=wwXIfr",
    instagram: "https://www.instagram.com/project.sitezy",
  },
  payments: {
    bkash: "01886112667",
    nagad: "01886112667",
    rocket: "01886112667",
    upay: "01886112667",
  },
};

export const whyChoose = [
  { icon: "Zap", title: "Fast Delivery", desc: "Most projects ship in 1–2 days, not weeks." },
  { icon: "BadgePercent", title: "Affordable Pricing", desc: "Premium quality, transparent pricing that fits Bangladesh." },
  { icon: "Smartphone", title: "Mobile Responsive", desc: "Pixel-perfect on every device, mobile-first by default." },
  { icon: "Search", title: "SEO Ready", desc: "Structured, fast and indexable from day one." },
  { icon: "Sparkles", title: "Premium Design", desc: "Luxury, minimal aesthetic that earns trust." },
  { icon: "Headphones", title: "Full Support", desc: "We're with you long after launch." },
  { icon: "ShieldCheck", title: "Secure & SSL", desc: "Hardened, SSL-ready and built for production." },
];

export const services = [
  { title: "Business Websites", desc: "Multi-page professional sites that convert visitors." },
  { title: "E-commerce Stores", desc: "Sell online with payment gateways, dashboards & analytics." },
  { title: "Landing Pages", desc: "Single-page funnels optimised to win leads." },
  { title: "Portfolio Sites", desc: "Editorial showcases for creators, agencies & studios." },
  { title: "Custom Web Apps", desc: "Bespoke tools, dashboards and admin panels." },
  { title: "SEO & Speed", desc: "Make your existing site rank higher and load faster." },
];

export type Pkg = {
  name: string;
  price: number;
  tagline: string;
  features: string[];
  popular?: boolean;
};

export const packages: Pkg[] = [
  {
    name: "Starter",
    price: 449,
    tagline: "One-page presence, premium feel.",
    features: [
      "1 Page Website",
      "Mobile Responsive",
      "Modern Clean Design",
      "Contact Form",
      "Social Media Links",
      "WhatsApp Button",
      "Basic SEO",
      "Fast Loading",
      "1 Day Delivery",
      "1 Free Revision",
    ],
  },
  {
    name: "Business",
    price: 999,
    tagline: "A full professional site for your brand.",
    popular: true,
    features: [
      "5 Page Website",
      "Mobile Responsive",
      "Professional Design",
      "Contact Form",
      "Photo Gallery",
      "Social Media Integration",
      "Basic SEO",
      "WhatsApp Button",
      "Speed Optimization",
      "Google Map Integration",
      "Free Domain Setup Support",
      "2 Day Delivery",
      "3 Free Revisions",
      "6 Month Free Support",
    ],
  },
  {
    name: "Small E-commerce",
    price: 1899,
    tagline: "Start selling online with confidence.",
    features: [
      "Custom Homepage Design",
      "Unlimited Products",
      "Popup Banner",
      "Product Detail Page",
      "Shopping Cart",
      "Checkout Page",
      "Order Confirmation",
      "Bkash / Nagad / Upay Payment",
      "Search & Filter System",
      "Mobile Responsive",
      "WhatsApp Order Button",
      "Full Admin Dashboard",
      "Contact & About Page",
      "SSL Security",
      "Product & Order Management",
      "Basic Stock Management",
      "2 Day Delivery",
      "1 Year Free Support",
      "3 Free Revisions",
    ],
  },
  {
    name: "Premium E-commerce",
    price: 3499,
    tagline: "The complete commerce platform.",
    features: [
      "Everything in Small E-commerce",
      "Premium Custom UI/UX",
      "Multi-category System",
      "Advanced Search & Filter",
      "User Login & Registration",
      "Order Tracking",
      "Wishlist System",
      "Review & Rating",
      "Coupon & Discount",
      "Bkash, Nagad, Rocket, Bank",
      "Sales Analytics",
      "Inventory Management",
      "Full SEO + Schema",
      "Google Analytics + FB Pixel",
      "Live Chat",
      "Email Notifications",
      "Abandoned Cart Recovery",
      "Multi Admin Access",
      "Premium Security",
      "Lifetime Free Support",
      "Unlimited Revisions",
    ],
  },
];

export const portfolio = [
  { title: "Aurora Atelier", category: "Fashion E-commerce", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80", url: "#" },
  { title: "Northwind Studio", category: "Agency Portfolio", img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80", url: "#" },
  { title: "Verde Café", category: "Restaurant", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80", url: "#" },
  { title: "Lumen Real Estate", category: "Real Estate", img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80", url: "#" },
  { title: "Solace Wellness", category: "Booking Site", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80", url: "#" },
  { title: "Mono Books", category: "Online Store", img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&q=80", url: "#" },
];

export const reviews = [
  { name: "Tahmid R.", role: "Founder, Aurora Atelier", text: "They delivered in 2 days — and it looks like a $5k site. Sales doubled the first month.", rating: 5 },
  { name: "Nafisa H.", role: "Owner, Verde Café", text: "Most professional team I've worked with. The site is beautiful and the WhatsApp orders never stop.", rating: 5 },
  { name: "Rakib A.", role: "Director, Lumen RE", text: "Premium quality at unbeatable pricing. Support has been incredible.", rating: 5 },
  { name: "Sumaiya K.", role: "Creator", text: "My portfolio finally feels like me. Smooth, fast, gorgeous.", rating: 5 },
  { name: "Imran S.", role: "CEO, Mono Books", text: "Full e-commerce up and running in 48 hours. Mind blown.", rating: 5 },
];

export const counters = [
  { label: "Websites Delivered", value: 248, suffix: "+" },
  { label: "Happy Clients", value: 180, suffix: "+" },
  { label: "Active Projects", value: 22, suffix: "" },
  { label: "Client Satisfaction", value: 99, suffix: "%" },
];

export const faqs = [
  { q: "How long does delivery take?", a: "Starter sites ship in 1 day, Business in 2 days, and E-commerce in 2–4 days depending on complexity." },
  { q: "Do you provide hosting and domain?", a: "We help you set up your domain and recommend hosting. Hosting/domain costs are separate from package pricing." },
  { q: "Can I edit the site after delivery?", a: "Yes. We provide a simple admin panel for E-commerce and CMS-style edits on request." },
  { q: "Do you offer revisions?", a: "Every package includes free revisions. Premium E-commerce includes unlimited revisions." },
  { q: "What payment methods do you accept?", a: "Bkash, Nagad, Rocket, and Upay. After payment, share the transaction ID via our order form." },
  { q: "Is the website mobile responsive?", a: "Every site we build is mobile-first and pixel-perfect across phones, tablets and desktops." },
  { q: "Do you provide SEO?", a: "All packages include base SEO. Premium E-commerce includes full SEO setup with schema markup and analytics." },
];
