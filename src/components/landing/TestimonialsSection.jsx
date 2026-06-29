import React from "react";
import { useTranslation } from "react-i18next";
import { Star, Quote } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import SectionLabel from "./SectionLabel";

export default function TestimonialsSection() {
  const { t } = useTranslation();

  const testimonials = Array.from({ length: 4 }, (_, i) => ({
    name: t(`testimonials.${i + 1}name`),
    role: t(`testimonials.${i + 1}role`),
    company: t(`testimonials.${i + 1}company`),
    text: t(`testimonials.${i + 1}text`),
  }));

  return (
    <section className="py-24 lg:py-32 bg-slate-mist">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ScrollReveal>
            <SectionLabel>{t("testimonials.label")}</SectionLabel>
            <h2 className="font-heading font-semibold text-navy text-3xl sm:text-4xl leading-tight mb-4">
              {t("testimonials.title")}
            </h2>
            <p className="text-navy/55 leading-relaxed">
              {t("testimonials.subtitle")}
            </p>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((tItem, i) => (
            <ScrollReveal key={tItem.name} delay={i * 0.1}>
              <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(10,25,47,0.04)] h-full flex flex-col">
                <Quote size={28} className="text-gold/30 mb-4" />
                <p className="text-navy/65 leading-relaxed flex-1 mb-6">
                  &ldquo;{tItem.text}&rdquo;
                </p>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star
                      key={si}
                      size={14}
                      className="text-gold fill-gold"
                    />
                  ))}
                </div>
                <div>
                  <div className="font-semibold text-navy text-sm">
                    {tItem.name}
                  </div>
                  <div className="text-xs text-navy/45">
                    {tItem.role}, {tItem.company}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
