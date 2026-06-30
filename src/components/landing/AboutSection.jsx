import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import ScrollReveal from "./ScrollReveal";
import SectionLabel from "./SectionLabel";

const ABOUT_IMG = "/images/pages/about.png";

export default function AboutSection() {
  const { t } = useTranslation();
  const values = [
    t("about.value1"),
    t("about.value2"),
    t("about.value3"),
    t("about.value4"),
  ];

  return (
    <section id="about" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <ScrollReveal direction="left">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(10,25,47,0.1)]">
                <img
                  src={ABOUT_IMG}
                  alt={t("about.altImage")}
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -right-4 sm:right-6 bg-navy text-white rounded-xl px-6 py-4 shadow-[0_15px_40px_rgba(10,25,47,0.25)]">
                <div className="font-heading text-2xl font-bold text-gold">
                  450+
                </div>
                <div className="text-xs text-white/70 mt-0.5">
                  {t("about.statLabel")}
                </div>
              </div>
              {/* Gold accent */}
              <div className="absolute -top-4 -left-4 w-20 h-20 border-2 border-gold/20 rounded-2xl -z-10" />
            </div>
          </ScrollReveal>

          {/* Content */}
          <div>
            <ScrollReveal>
              <SectionLabel>{t("about.label")}</SectionLabel>
              <h2 className="font-heading font-semibold text-navy text-3xl sm:text-4xl leading-tight mb-6">
                {t("about.title")}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="text-navy/60 leading-relaxed mb-4">
                {t("about.para1")}
              </p>
              <p className="text-navy/60 leading-relaxed mb-8">
                {t("about.para2")}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="space-y-4">
                {values.map((v) => (
                  <div key={v} className="flex items-start gap-3">
                    <CheckCircle2
                      size={20}
                      className="text-gold flex-shrink-0 mt-0.5"
                    />
                    <span className="text-navy/70 text-[15px] leading-relaxed">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
