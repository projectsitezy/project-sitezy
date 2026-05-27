// @lovable.dev/vite-tanstack-config ships TanStack Start, React, Tailwind, paths, etc.
// We disable the Cloudflare adapter and add Nitro so the same project deploys to Vercel.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

// NITRO_PRESET=vercel (set in vercel.json build env) makes Nitro emit
// .vercel/output in Vercel's Build Output API v3 format.
export default defineConfig({
  cloudflare: false,
  plugins: [nitro()],
});
