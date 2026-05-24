import { faqs } from "@/data/site";
import { SectionTitle } from "./SectionTitle";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "./Reveal";

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 md:py-32 bg-gradient-to-b from-transparent via-beige-soft/30 to-transparent">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <SectionTitle eyebrow="FAQ" title="Questions, answered." />
        <Reveal>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="rounded-2xl border border-foreground/10 bg-white px-5">
                <AccordionTrigger className="text-left font-serif text-lg hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-foreground/65">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
