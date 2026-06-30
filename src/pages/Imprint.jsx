import React from "react";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, Scale, Shield, Copyright } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ScrollReveal from "@/components/landing/ScrollReveal";
import ScrollToTopButton from "@/components/landing/ScrollToTopButton";
import { Helmet } from "react-helmet-async";

export default function Imprint() {
  const { t } = useTranslation();

  const sections = [
    {
      key: "companyInfo",
      icon: MapPin,
      title: t("imprint.companyInfoTitle"),
      items: [
        { label: t("imprint.companyInfoName") },
        { label: t("imprint.companyInfoDirector") },
        { label: t("imprint.companyInfoAddress") },
      ],
    },
    {
      key: "contact",
      icon: Mail,
      title: t("imprint.contactTitle"),
      items: [
        {
          label: t("imprint.contactEmail"),
          href: "mailto:info@philmanpower.de",
        },
        {
          label: t("imprint.contactPhone"),
          href: "tel:+49234821168718530",
        },
      ],
    },
    {
      key: "registration",
      icon: Scale,
      title: t("imprint.registrationTitle"),
      items: [
        { label: t("imprint.shareholdersLabel") },
        { label: t("imprint.registrationCourt") },
        { label: t("imprint.registrationVat") },
      ],
    },
    {
      key: "responsible",
      icon: Shield,
      title: t("imprint.responsibleTitle"),
      items: [{ label: t("imprint.responsiblePerson") }],
    },
    {
      key: "disclaimer",
      icon: Scale,
      title: t("imprint.disclaimerTitle"),
      items: [
        { label: t("imprint.disclaimerText") },
        {
          label: t("imprint.disclaimerOdrUrl"),
          href: t("imprint.disclaimerOdrUrl"),
        },
        { label: t("imprint.disclaimerParticipation") },
      ],
    },
    {
      key: "copyright",
      icon: Copyright,
      title: t("imprint.copyrightTitle"),
      items: [{ label: t("imprint.copyrightText") }],
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t("imprint.metaTitle")}</title>
        <meta name="description" content={t("imprint.metaDescription")} />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Navbar />

        {/* Hero header */}
        <section className="relative pt-36 pb-20 lg:pb-24 bg-slate-mist overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #C5A059 1px, transparent 0)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-gold/90 mb-4">
                <span className="w-8 h-px bg-gold/50" />
                {t("footer.legal")}
              </span>
              <h1 className="font-heading font-semibold text-navy text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4">
                {t("imprint.pageTitle")}
              </h1>
              <p className="text-white/50 leading-relaxed max-w-2xl">
                {t("imprint.pageSubtitle")}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-5 sm:px-8">
            <div className="grid gap-10 lg:gap-14">
              {sections.map((section, i) => (
                <ScrollReveal key={section.key} delay={i * 0.04}>
                  <section className="pb-10 border-b border-navy/10 last:border-0">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-gold shrink-0">
                        <section.icon
                          size={18}
                          strokeWidth={1.8}
                        />
                      </div>

                      <h2 className="font-heading font-semibold text-navy text-lg lg:text-xl">
                        {section.title}
                      </h2>
                    </div>

                    <div className="pl-7 space-y-3">
                      {section.items.map((item, j) => (
                        <p
                          key={j}
                          className="
                            text-sm
                            sm:text-[15px]
                            text-navy/70
                            leading-7
                        "
                        >
                          {item.href ? (
                            <a
                              href={item.href}
                              target={
                                item.href.startsWith("http")
                                  ? "_blank"
                                  : undefined
                              }
                              rel={
                                item.href.startsWith("http")
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                              className="
                                    text-gold
                                    hover:text-deep-ochre
                                    transition-colors
                                "
                            >
                              {item.label}
                            </a>
                          ) : (
                            item.label
                          )}
                        </p>
                      ))}
                    </div>
                  </section>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <Footer />
        <ScrollToTopButton />
      </div>
    </>
  );
}
