import { useState } from "react";
import { site } from "@/data/site";
import { SectionTitle } from "./SectionTitle";
import { Reveal } from "./Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Facebook, Instagram, Mail, MessageCircle, Loader2 } from "lucide-react";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hp) return; // bot
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill all fields.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: name.trim(), email: email.trim(), message: message.trim(),
    });
    setLoading(false);
    if (error) {
      toast.error("Could not send. Please WhatsApp us.");
      return;
    }
    toast.success("Message sent — we'll reply soon.");
    setName(""); setEmail(""); setMessage("");
  };

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle eyebrow="Contact" title="Let's build something premium." />

        <div className="grid gap-10 md:grid-cols-2">
          <Reveal>
            <form onSubmit={submit} className="space-y-4 rounded-3xl border border-foreground/8 bg-white p-7 shadow-luxe">
              <input type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} className="hidden" aria-hidden />
              <div className="grid gap-2">
                <Label htmlFor="c-name">Name</Label>
                <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="c-email">Email</Label>
                <Input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={120} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="c-msg">Message</Label>
                <Textarea id="c-msg" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1500} />
              </div>
              <Button type="submit" className="w-full rounded-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send message
              </Button>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-3">
              <a href={`https://wa.me/${site.whatsappIntl}`} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between rounded-3xl border border-foreground/8 bg-white p-6 shadow-luxe transition-all hover:-translate-y-0.5">
                <div className="flex items-center gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-accent/60 to-beige-soft"><MessageCircle size={18} /></div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-foreground/50">WhatsApp</div>
                    <div className="font-serif text-lg">{site.whatsapp}</div>
                  </div>
                </div>
              </a>
              <a href={`mailto:${site.email}`} className="group flex items-center justify-between rounded-3xl border border-foreground/8 bg-white p-6 shadow-luxe transition-all hover:-translate-y-0.5">
                <div className="flex items-center gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-accent/60 to-beige-soft"><Mail size={18} /></div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-foreground/50">Email</div>
                    <div className="font-serif text-lg">{site.email}</div>
                  </div>
                </div>
              </a>
              <div className="grid grid-cols-2 gap-3">
                <a href={site.socials.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-3xl border border-foreground/8 bg-white p-5 shadow-luxe transition-all hover:-translate-y-0.5">
                  <Facebook size={18} /> <span className="text-sm">Facebook</span>
                </a>
                <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-3xl border border-foreground/8 bg-white p-5 shadow-luxe transition-all hover:-translate-y-0.5">
                  <Instagram size={18} /> <span className="text-sm">Instagram</span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
