import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useActiveSection } from "@/hooks/useActiveSection";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "es", label: "ES" },
  { code: "zh", label: "中文" },
];

const NAV_ITEMS = [
  { id: "about", labelKey: "nav.about" },
  { id: "industries", labelKey: "nav.industries" },
  { id: "process", labelKey: "nav.process" },
  { id: "why-us", labelKey: "nav.whyUs" },
  { id: "regions", labelKey: "nav.regions" },
  { id: "faq", labelKey: "nav.faq" },
  { id: "contact", labelKey: "nav.contact" },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const isHomePage = location.pathname === "/";

  // Only run scroll spy on the landing page
  const activeSection = useActiveSection({
    offset: 100,
    enabled: isHomePage,
  });

  // On standalone pages (e.g. /imprint), no section is active.
  // On landing page, use the scroll spy result.
  const activeId = isHomePage ? activeSection : "";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const switchLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("i18nextLng", code);
    setLangOpen(false);
  };

  const navLinks = NAV_ITEMS.map((item) => ({
    id: item.id,
    label: t(item.labelKey),
    href: isHomePage ? `#${item.id}` : `/#${item.id}`,
  }));

  const currentLang = LANGUAGES.find((l) => i18n.language.startsWith(l.code))?.label || "EN";

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent">
        <motion.div
          className="h-full bg-gold"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <header
        className={`fixed top-[3px] left-0 right-0 z-50 transition-all duration-500 ${scrolled
            ? "py-3 bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(10,25,47,0.06)]"
            : "py-5 bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src="/philmanpower_logo.png"
              alt="PhilManPower GmbH — International Recruitment"
              className="h-9 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          {/* FIXED: Adjusted gaps and added px-2 to prevent hugging the logo/CTA */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-1.5 xl:gap-4 2xl:gap-7 min-w-0 px-2">
            {navLinks.map((l) => {
              const isActive = activeId === l.id;
              const isHashLink = l.href.startsWith("#");
              const isCrossPage = l.href.startsWith("/");

              {/* FIXED: Changed whitespace-nowrap to whitespace-normal, added text-center and leading-tight */ }
              const linkClasses = `
        relative
        text-xs
        xl:text-sm
        font-medium
        text-center
        leading-tight
        whitespace-normal
        lg:max-w-[120px]
        xl:max-w-none
        transition-all
        duration-200
        pb-1
        ${isActive
                  ? "text-gold font-semibold"
                  : "text-navy/70 hover:text-navy"
                }
      `;

              const content = (
                <>
                  {l.label}
                  {/* Active underline indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-gold rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </>
              );

              if (isCrossPage) {
                return (
                  <Link key={l.id} to={l.href} className={linkClasses}>
                    {content}
                  </Link>
                );
              }

              if (isHashLink) {
                return (
                  <a key={l.id} href={l.href} className={linkClasses}>
                    {content}
                  </a>
                );
              }

              return (
                <Link key={l.id} to={l.href} className={linkClasses}>
                  {content}
                </Link>
              );
            })}
          </nav>

          {/* Right side: Language switcher + CTA */}
          {/* FIXED: Slightly tighter gaps on standard lg screens to buy more space */}
          <div className="hidden lg:flex items-center gap-1.5 xl:gap-3 2xl:gap-4 flex-shrink-0">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-navy/60 hover:text-navy hover:bg-navy/5 transition-colors whitespace-nowrap"
                aria-label="Switch language"
              >
                <Globe size={14} />
                {currentLang}
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-28 bg-white rounded-xl border border-slate-mist shadow-lg overflow-hidden z-50"
                  >
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => switchLanguage(l.code)}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${i18n.language.startsWith(l.code)
                            ? "text-gold font-semibold bg-orange-50"
                            : "text-navy/70 hover:bg-slate-50"
                          }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA */}
            {isHomePage ? (
              <a
                href="#contact"
                className="inline-flex items-center px-3 xl:px-5 py-2 rounded-full bg-navy text-white text-xs xl:text-sm font-semibold hover:bg-navy/90 transition-all duration-300 whitespace-nowrap"
              >
                {t("nav.bookConsultation")}
              </a>
            ) : (
              <Link
                to="/#contact"
                className="inline-flex items-center px-3 xl:px-5 py-2 rounded-full bg-navy text-white text-xs xl:text-sm font-semibold hover:bg-navy/90 transition-all duration-300 whitespace-nowrap"
              >
                {t("nav.bookConsultation")}
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="p-2 text-navy/60 hover:text-navy"
              aria-label="Switch language"
            >
              <Globe size={18} />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-navy"
              aria-label={t("nav.toggleMenu")}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile language dropdown */}
        <AnimatePresence>
          {langOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-mist overflow-hidden"
            >
              <div className="px-5 py-3 flex gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => switchLanguage(l.code)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${i18n.language.startsWith(l.code)
                        ? "text-gold font-semibold bg-orange-50 border border-orange-200"
                        : "text-navy/70 border border-slate-200 hover:border-slate-300"
                      }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-mist overflow-hidden"
            >
              <div className="px-5 py-6 flex flex-col gap-3">
                {navLinks.map((l) => {
                  const isActive = activeId === l.id;
                  const isCrossPage = l.href.startsWith("/");

                  const linkClasses = `
                    text-base
                    font-medium
                    py-1.5
                    transition-all
                    duration-200
                    relative
                    ${isActive
                      ? "text-gold font-semibold"
                      : "text-navy/80 hover:text-navy"
                    }
                  `;

                  if (isCrossPage) {
                    return (
                      <Link
                        key={l.id}
                        to={l.href}
                        onClick={() => setMobileOpen(false)}
                        className={linkClasses}
                      >
                        {l.label}
                      </Link>
                    );
                  }

                  return (
                    <a
                      key={l.id}
                      href={l.href}
                      onClick={() => setMobileOpen(false)}
                      className={linkClasses}
                    >
                      {l.label}
                    </a>
                  );
                })}
                {isHomePage ? (
                  <a
                    href="#contact"
                    onClick={() => setMobileOpen(false)}
                    className="mt-3 inline-flex items-center justify-center px-6 py-3 rounded-full bg-navy text-white text-sm font-semibold"
                  >
                    {t("nav.bookConsultation")}
                  </a>
                ) : (
                  <Link
                    to="/#contact"
                    onClick={() => setMobileOpen(false)}
                    className="mt-3 inline-flex items-center justify-center px-6 py-3 rounded-full bg-navy text-white text-sm font-semibold"
                  >
                    {t("nav.bookConsultation")}
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
