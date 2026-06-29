import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import ScrollReveal from "./ScrollReveal";
import AnnouncementBanner from "./AnnouncementBanner";

const HERO_NURSE = "https://media.base44.com/images/public/6a41d61e6ea320f7ee63f28f/871f86779_generated_683459d7.png";
const HERO_CHEF = "https://media.base44.com/images/public/6a41d61e6ea320f7ee63f28f/09e951527_generated_5b96b38c.png";
const HERO_ENGINEER = "https://media.base44.com/images/public/6a41d61e6ea320f7ee63f28f/c4d133345_generated_cd86cbdd.png";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-24 pb-16 lg:pt-0 lg:pb-0">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #0A192F 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[calc(100vh-80px)]">
          {/* Left content - 7 cols */}
          <div className="lg:col-span-7 z-10">
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-mist text-xs font-semibold tracking-wide uppercase text-deep-ochre mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                {t("hero.badge")}
              </span>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="font-heading font-semibold text-navy text-4xl sm:text-5xl lg:text-6xl xl:text-[3.75rem] leading-[1.1] tracking-tight text-balance mb-6">
                {t("hero.title")}{" "}
                <span className="text-gold">{t("hero.titleHealthcare")}</span> &{" "}
                <span className="text-gold">{t("hero.titleIndustry")}</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-lg text-navy/60 max-w-xl leading-relaxed mb-10">
                {t("hero.subtitle")}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-navy text-white font-semibold text-base hover:bg-navy/90 transition-all duration-300 shadow-[0_8px_30px_rgba(10,25,47,0.2)]"
                >
                  {t("hero.cta")}
                  <ArrowRight size={18} />
                </a>
                <a
                  href="#about"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-navy/15 text-navy font-semibold text-base hover:border-navy/30 transition-all duration-300"
                >
                  {t("hero.learnMore")}
                </a>
              </div>
            </ScrollReveal>

            {/* Quick stats */}
            <ScrollReveal delay={0.4}>
              <div className="flex flex-wrap gap-10 mt-14 pt-10 border-t border-slate-mist">
                {[
                  { num: "450+", label: t("hero.stat1") },
                  { num: "3", label: t("hero.stat2") },
                  { num: "98%", label: t("hero.stat3") },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-heading text-3xl font-bold text-navy">
                      {s.num}
                    </div>
                    <div className="text-sm text-navy/50 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Right images - 5 cols, depth stack */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full max-w-md mx-auto lg:max-w-none">
              {/* Background frame */}
              <motion.div
                initial={{ opacity: 0, x: 40, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute top-8 -right-2 w-[65%] aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(10,25,47,0.12)]"
              >
                <img src={HERO_ENGINEER} alt={t("hero.altEngineer")} className="w-full h-full object-cover" />
              </motion.div>

              {/* Middle frame */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 30 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative w-[60%] aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(10,25,47,0.15)] z-10 mt-12"
              >
                <img src={HERO_NURSE} alt={t("hero.altNurse")} className="w-full h-full object-cover" />
              </motion.div>

              {/* Front frame */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}

                transition={{ duration: 1, delay: 0.7 }}
                className="absolute bottom-0 right-4 w-[50%] aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(10,25,47,0.18)] z-20 border-4 border-white"
              >
                <img src={HERO_CHEF} alt={t("hero.altChef")} className="w-full h-full object-cover" />
              </motion.div>

              {/* Gold accent circle */}
              <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-gold/10 z-0" />
              <div className="absolute -bottom-6 right-12 w-16 h-16 rounded-full bg-gold/15 z-0" />
            </div>
          </div>
        </div>

        {/* Mobile announcement */}
        <div className="lg:hidden mt-6">
          <AnnouncementBanner overlay />
        </div>
      </div>

      {/* Desktop announcement overlay */}
      <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 z-20 hidden lg:block max-w-sm">
        <AnnouncementBanner overlay />
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1 text-navy/30"
      >
        <span className="text-xs tracking-widest uppercase">{t("hero.scroll")}</span>
        <ChevronDown size={16} />
      </motion.div>
    </section>
  );
}
