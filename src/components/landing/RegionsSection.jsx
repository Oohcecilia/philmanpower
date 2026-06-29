import React from "react";
import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import SectionLabel from "./SectionLabel";

const IMG_GERMANY = "https://media.base44.com/images/public/6a41d61e6ea320f7ee63f28f/8b591d616_generated_7070d6ea.png";
const IMG_AUSTRIA = "https://media.base44.com/images/public/6a41d61e6ea320f7ee63f28f/b2dc283d2_generated_d60b2f0c.png";
const IMG_SPAIN = "https://media.base44.com/images/public/6a41d61e6ea320f7ee63f28f/f80f4e55c_generated_4aa2007c.png";

const regionData = [
  { key: "germany", flag: "🇩🇪", img: IMG_GERMANY, alt: "regions.altGermany" },
  { key: "austria", flag: "🇦🇹", img: IMG_AUSTRIA, alt: "regions.altAustria" },
  { key: "spain", flag: "🇪🇸", img: IMG_SPAIN, alt: "regions.altSpain" },
];

export default function RegionsSection() {
  const { t } = useTranslation();

  const regions = regionData.map((r) => ({
    ...r,
    country: t(`regions.${r.key}`),
    highlights: [
      t(`regions.${r.key}Highlight1`),
      t(`regions.${r.key}Highlight2`),
      t(`regions.${r.key}Highlight3`),
    ],
  }));

  return (
    <section id="regions" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ScrollReveal>
            <SectionLabel>{t("regions.label")}</SectionLabel>
            <h2 className="font-heading font-semibold text-navy text-3xl sm:text-4xl leading-tight mb-4">
              {t("regions.title")}
            </h2>
            <p className="text-navy/55 leading-relaxed">
              {t("regions.subtitle")}
            </p>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {regions.map((r, i) => (
            <ScrollReveal key={r.country} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(10,25,47,0.06)] hover:shadow-[0_20px_50px_rgba(10,25,47,0.1)] transition-all duration-500 bg-white"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={r.img}
                    alt={t(r.alt)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                  <div className="absolute bottom-4 left-5 flex items-center gap-2">
                    <span className="text-2xl">{r.flag}</span>
                    <span className="text-white font-heading font-semibold text-xl">
                      {r.country}
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  {r.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2.5 text-sm text-navy/65">
                      <MapPin size={14} className="text-gold flex-shrink-0 mt-0.5" />
                      {h}
                    </div>
                  ))}
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
