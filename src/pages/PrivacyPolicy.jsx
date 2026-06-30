import React from "react";
import { useTranslation } from "react-i18next";
import {
  Shield,
  FileText,
  Database,
  Mail,
  Users,
  Cookie,
  Scale,
  Clock,
  Share2,
  UserCheck,
  AlertTriangle,
  Lock,
  RefreshCw,
  Info,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ScrollReveal from "@/components/landing/ScrollReveal";
import ScrollToTopButton from "@/components/landing/ScrollToTopButton";
import { Helmet } from "react-helmet-async";

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  const sections = [
    {
      key: "controller",
      icon: Shield,
      title: t("privacy.controllerTitle"),
      items: [
        { label: t("privacy.controllerName") },
        { label: t("privacy.controllerAddress") },
        {
          label: t("privacy.controllerEmail"),
          href: "mailto:info@philmanpower.de",
        },
      ],
    },
    {
      key: "general",
      icon: Info,
      title: t("privacy.generalTitle"),
      items: [
        { label: t("privacy.generalIntro") },
        { label: t("privacy.generalDetail") },
      ],
    },
    {
      key: "dataCollection",
      icon: Database,
      title: t("privacy.dataCollectionTitle"),
      items: [
        { label: t("privacy.dataCollectionIntro") },
        { label: `• ${t("privacy.dataCollectionItem1")}` },
        { label: `• ${t("privacy.dataCollectionItem2")}` },
        { label: `• ${t("privacy.dataCollectionItem3")}` },
        { label: `• ${t("privacy.dataCollectionItem4")}` },
        { label: `• ${t("privacy.dataCollectionItem5")}` },
        { label: t("privacy.dataCollectionLegal") },
      ],
    },
    {
      key: "contactForms",
      icon: Mail,
      title: t("privacy.contactFormsTitle"),
      items: [
        { label: t("privacy.contactFormsIntro") },
        { label: t("privacy.contactFormsLegal") },
      ],
    },
    {
      key: "recruitment",
      icon: Users,
      title: t("privacy.recruitmentTitle"),
      items: [
        { label: t("privacy.recruitmentIntro") },
        { label: t("privacy.recruitmentLegal") },
        { label: t("privacy.recruitmentRetention") },
      ],
    },
    {
      key: "cookies",
      icon: Cookie,
      title: t("privacy.cookiesTitle"),
      items: [{ label: t("privacy.cookiesText") }],
    },
    {
      key: "legalBasis",
      icon: Scale,
      title: t("privacy.legalBasisTitle"),
      items: [
        { label: t("privacy.legalBasisIntro") },
        { label: `• ${t("privacy.legalBasisItem1")}` },
        { label: `• ${t("privacy.legalBasisItem2")}` },
        { label: `• ${t("privacy.legalBasisItem3")}` },
        { label: `• ${t("privacy.legalBasisItem4")}` },
      ],
    },
    {
      key: "dataStorage",
      icon: Clock,
      title: t("privacy.dataStorageTitle"),
      items: [{ label: t("privacy.dataStorageText") }],
    },
    {
      key: "dataSharing",
      icon: Share2,
      title: t("privacy.dataSharingTitle"),
      items: [
        { label: t("privacy.dataSharingIntro") },
        { label: `• ${t("privacy.dataSharingItem1")}` },
        { label: `• ${t("privacy.dataSharingItem2")}` },
        { label: `• ${t("privacy.dataSharingItem3")}` },
        { label: `• ${t("privacy.dataSharingItem4")}` },
        { label: t("privacy.dataSharingThirdCountry") },
      ],
    },
    {
      key: "userRights",
      icon: UserCheck,
      title: t("privacy.userRightsTitle"),
      items: [
        { label: t("privacy.userRightsIntro") },
        { label: `• ${t("privacy.userRightsItem1")}` },
        { label: `• ${t("privacy.userRightsItem2")}` },
        { label: `• ${t("privacy.userRightsItem3")}` },
        { label: `• ${t("privacy.userRightsItem4")}` },
        { label: `• ${t("privacy.userRightsItem5")}` },
        { label: `• ${t("privacy.userRightsItem6")}` },
        { label: `• ${t("privacy.userRightsItem7")}` },
        { label: t("privacy.userRightsAction") },
      ],
    },
    {
      key: "complaint",
      icon: AlertTriangle,
      title: t("privacy.complaintTitle"),
      items: [
        { label: t("privacy.complaintText") },
        {
          label: t("privacy.complaintAuthority"),
          href: "https://www.datenschutz.hessen.de",
        },
      ],
    },
    {
      key: "security",
      icon: Lock,
      title: t("privacy.securityTitle"),
      items: [{ label: t("privacy.securityText") }],
    },
    {
      key: "changes",
      icon: RefreshCw,
      title: t("privacy.changesTitle"),
      items: [{ label: t("privacy.changesText") }],
    },
    {
      key: "contactInfo",
      icon: FileText,
      title: t("privacy.contactInfoTitle"),
      items: [
        { label: t("privacy.contactInfoText") },
        {
          label: t("privacy.contactInfoEmail"),
          href: "mailto:info@philmanpower.de",
        },
        { label: t("privacy.contactInfoAddress") },
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t("privacy.metaTitle")}</title>
        <meta name="description" content={t("privacy.metaDescription")} />
        <meta property="og:title" content={t("privacy.metaTitle")} />
        <meta
          property="og:description"
          content={t("privacy.metaDescription")}
        />
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
                {t("privacy.pageTitle")}
              </h1>
              <p className="text-white/50 leading-relaxed max-w-2xl">
                {t("privacy.pageSubtitle")}
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
                        <section.icon size={18} strokeWidth={1.8} />
                      </div>
                      <h2 className="font-heading font-semibold text-navy text-lg lg:text-xl">
                        {section.title}
                      </h2>
                    </div>

                    <div className="pl-7 space-y-3">
                      {section.items.map((item, j) => (
                        <p
                          key={j}
                          className="text-sm sm:text-[15px] text-navy/70 leading-7"
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
                              className="text-gold hover:text-deep-ochre transition-colors"
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
