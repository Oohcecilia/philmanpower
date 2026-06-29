import React from "react";
import { useTranslation } from "react-i18next";
import { Users, Search, Languages, FileCheck, TrendingUp, LifeBuoy } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const icons = [Users, Search, Languages, FileCheck, TrendingUp, LifeBuoy];

export default function WhyChooseUs() {
  const { t } = useTranslation();

  const advantages = Array.from({ length: 6 }, (_, i) => ({
    icon: icons[i],
    title: t(`whyChooseUs.point${i + 1}Title`),
    desc: t(`whyChooseUs.point${i + 1}Desc`),
  }));

  return (
    <section id="why-us" className="py-24 lg:py-32 bg-navy relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #C5A059 1px, transparent 0)",
          backgroundSize: "48px 48px"
        }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-gold/90 mb-4">
              <span className="w-8 h-px bg-gold/50" />
              {t("whyChooseUs.label")}
            </span>
            <h2 className="font-heading font-semibold text-white text-3xl sm:text-4xl leading-tight mb-4">
              {t("whyChooseUs.title")}
            </h2>
            <p className="text-white/50 leading-relaxed">
              {t("whyChooseUs.subtitle")}
            </p>
          </ScrollReveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((a, i) => (
            <ScrollReveal key={a.title} delay={i * 0.08}>
              <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-7 hover:bg-white/[0.07] transition-all duration-500 h-full">
                <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center mb-5">
                  <a.icon size={20} className="text-gold" strokeWidth={1.8} />
                </div>
                <h3 className="font-heading font-semibold text-white text-lg mb-2">
                  {a.title}
                </h3>
                <p className="text-sm text-white/45 leading-relaxed">{a.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
