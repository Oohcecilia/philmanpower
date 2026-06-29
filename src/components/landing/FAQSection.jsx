import React from "react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ScrollReveal from "./ScrollReveal";
import SectionLabel from "./SectionLabel";

export default function FAQSection() {
  const { t } = useTranslation();

  const faqs = Array.from({ length: 6 }, (_, i) => ({
    q: t(`faq.q${i + 1}`),
    a: t(`faq.a${i + 1}`),
  }));

  return (
    <section id="faq" className="py-24 lg:py-32 bg-white">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-16">
          <ScrollReveal>
            <SectionLabel>{t("faq.label")}</SectionLabel>
            <h2 className="font-heading font-semibold text-navy text-3xl sm:text-4xl leading-tight mb-4">
              {t("faq.title")}
            </h2>
            <p className="text-navy/55 leading-relaxed">
              {t("faq.subtitle")}
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-slate-mist border-none rounded-xl px-6 data-[state=open]:shadow-[0_4px_20px_rgba(10,25,47,0.06)]"
              >
                <AccordionTrigger className="text-left text-navy font-semibold text-[15px] hover:no-underline py-5">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-navy/55 text-sm leading-relaxed pb-5">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
}
