import React from "react";
import { Shield, Heart, Scale, Headphones } from "lucide-react";
import { useTranslation } from "react-i18next";
import ScrollReveal from "./ScrollReveal";

const pillars = [
  { icon: Shield, titleKey: "trust.pillar1Title", descKey: "trust.pillar1Desc" },
  { icon: Heart, titleKey: "trust.pillar2Title", descKey: "trust.pillar2Desc" },
  { icon: Scale, titleKey: "trust.pillar3Title", descKey: "trust.pillar3Desc" },
  { icon: Headphones, titleKey: "trust.pillar4Title", descKey: "trust.pillar4Desc" },
];

export default function TrustPillars() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-slate-mist">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, i) => (
            <ScrollReveal key={p.titleKey} delay={i * 0.1}>
              <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(10,25,47,0.04)] hover:shadow-[0_12px_40px_rgba(10,25,47,0.08)] transition-shadow duration-500 h-full">
                <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center mb-5">
                  <p.icon size={22} className="text-gold" strokeWidth={1.8} />
                </div>
                <h3 className="font-heading font-semibold text-navy text-lg mb-2">
                  {t(p.titleKey)}
                </h3>
                <p className="text-sm text-navy/55 leading-relaxed">{t(p.descKey)}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
