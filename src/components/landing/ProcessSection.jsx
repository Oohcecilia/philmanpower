import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useInView } from "framer-motion";
import { MessageSquare, Users, BookOpen, FileText, Plane, Award } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import SectionLabel from "./SectionLabel";

const icons = [MessageSquare, Users, BookOpen, FileText, Plane, Award];

export default function ProcessSection() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const steps = Array.from({ length: 6 }, (_, i) => ({
    num: `0${i + 1}`,
    icon: icons[i],
    title: t(`process.step${i + 1}Title`),
    desc: t(`process.step${i + 1}Desc`),
  }));

  return (
    <section id="process" className="py-24 lg:py-32 bg-white" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <ScrollReveal>
            <SectionLabel>{t("process.label")}</SectionLabel>
            <h2 className="font-heading font-semibold text-navy text-3xl sm:text-4xl leading-tight mb-4">
              {t("process.title")}
            </h2>
            <p className="text-navy/55 leading-relaxed">
              {t("process.subtitle")}
            </p>
          </ScrollReveal>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Golden thread line */}
          <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-navy/8 lg:-translate-x-px">
            <motion.div
              initial={{ height: 0 }}
              animate={isInView ? { height: "100%" } : {}}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="w-full bg-gold"
            />
          </div>

          <div className="space-y-12 lg:space-y-16">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <ScrollReveal key={step.num} delay={i * 0.1}>
                  <div className={`relative flex items-start gap-6 lg:gap-0 ${isLeft ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                    {/* Content */}
                    <div className={`flex-1 lg:w-[calc(50%-40px)] ${isLeft ? "lg:pr-16 lg:text-right" : "lg:pl-16 lg:text-left"}`}>
                      <span className="font-heading text-sm text-gold font-semibold tracking-wide">
                        {step.num}
                      </span>
                      <h3 className="font-heading font-semibold text-navy text-xl mt-1 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-navy/55 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    {/* Center node */}
                    <div className="absolute left-4 lg:left-1/2 lg:-translate-x-1/2 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white border-2 border-gold flex items-center justify-center shadow-[0_4px_15px_rgba(211,98,22,0.2)]">
                        <step.icon size={16} className="text-navy" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Spacer for opposite side */}
                    <div className="hidden lg:block flex-1 lg:w-[calc(50%-40px)]" />
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
