import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "es", label: "ES" },
  { code: "zh", label: "中文" },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

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
    setLangOpen(false);
  };

  const navLinks = [
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.industries"), href: "#industries" },
    { label: t("nav.process"), href: "#process" },
    { label: t("nav.whyUs"), href: "#why-us" },
    { label: t("nav.regions"), href: "#regions" },
    { label: t("nav.faq"), href: "#faq" },
    { label: t("nav.contact"), href: "#contact" },
  ];

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
        className={`fixed top-[3px] left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "py-3 bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(10,25,47,0.06)]"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center flex-shrink-0">
            <img
              src="/philmanpower_logo.png"
              alt="PhilManPower GmbH — International Recruitment"
              className="h-9 w-auto"
            />
          </a>

          {/* Desktop nav — flex-1 allows it to expand/shrink naturally */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-4 xl:gap-6 2xl:gap-8 min-w-0">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-navy/70 hover:text-navy transition-colors duration-200 whitespace-nowrap"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right side: Language switcher + CTA */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4 flex-shrink-0">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-medium text-navy/60 hover:text-navy hover:bg-navy/5 transition-colors whitespace-nowrap"
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
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          i18n.language.startsWith(l.code)
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
            <a
              href="#contact"
              className="inline-flex items-center px-5 xl:px-6 py-2.5 rounded-full bg-navy text-white text-sm font-semibold hover:bg-navy/90 transition-all duration-300 whitespace-nowrap"
            >
              {t("nav.bookConsultation")}
            </a>
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
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      i18n.language.startsWith(l.code)
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
                {navLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-base font-medium text-navy/80 hover:text-navy py-1.5"
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="mt-3 inline-flex items-center justify-center px-6 py-3 rounded-full bg-navy text-white text-sm font-semibold"
                >
                  {t("nav.bookConsultation")}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
