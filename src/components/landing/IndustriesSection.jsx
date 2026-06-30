import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import ScrollReveal from "./ScrollReveal";
import SectionLabel from "./SectionLabel";

export default function IndustriesSection() {
  const { t } = useTranslation();

  const industries = [
    {
      image: "/expertise/healthcare_&_nursing.webp",
      title: t("industries.healthcareTitle"),
      desc: t("industries.healthcareDesc"),
      roles: [t("industries.healthcareRole1"), t("industries.healthcareRole2"), t("industries.healthcareRole3")],
    },
    {
      image: "/expertise/hospitality_&_gastronomy.webp",
      title: t("industries.hospitalityTitle"),
      desc: t("industries.hospitalityDesc"),
      roles: [t("industries.hospitalityRole1"), t("industries.hospitalityRole2"), t("industries.hospitalityRole3")],
    },
    {
      image: "/expertise/technical_&_skilled_trades.jpg",
      title: t("industries.technicalTitle"),
      desc: t("industries.technicalDesc"),
      roles: [t("industries.technicalRole1"), t("industries.technicalRole2"), t("industries.technicalRole3")],
    },
  ];

  const imageAlt = [
    t("hero.altNurse"),
    t("hero.altChef"),
    t("hero.altEngineer"),
  ];

  return (
    <section id="industries" className="py-24 lg:py-32 bg-slate-mist">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ScrollReveal>
            <SectionLabel>{t("industries.label")}</SectionLabel>
            <h2 className="font-heading font-semibold text-navy text-3xl sm:text-4xl leading-tight mb-4">
              {t("industries.title")}
            </h2>
            <p className="text-navy/55 leading-relaxed">
              {t("industries.subtitle")}
            </p>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {industries.map((ind, i) => (
            <ScrollReveal key={ind.title} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(10,25,47,0.04)] hover:shadow-[0_20px_50px_rgba(10,25,47,0.12)] transition-all duration-500 h-full flex flex-col"
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={ind.image}
                    alt={imageAlt[i]}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="p-8 lg:p-10 flex flex-col flex-1">
                  <h3 className="font-heading font-semibold text-navy text-xl mb-3">{ind.title}</h3>
                  <p className="text-sm text-navy/55 leading-relaxed mb-6">{ind.desc}</p>
                  <div className="mt-auto space-y-2.5">
                    {ind.roles.map((r) => (
                      <div key={r} className="flex items-center gap-2 text-sm text-navy/65">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                        {r}
                      </div>
                    ))}
                  </div>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-deep-ochre mt-8 transition-colors duration-200"
                  >
                    {t("industries.viewTalentPool")} <ArrowRight size={15} />
                  </a>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
