import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { Linkedin, Mail, Phone, MapPin } from "lucide-react";

function AnimatedCounter({ target, label }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 2000;
          const step = (ts) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-3xl font-bold text-gold">{count}+</div>
      <div className="text-xs text-white/50 mt-1">{label}</div>
    </div>
  );
}

export default function Footer() {
  const { t } = useTranslation();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <footer className="bg-navy text-white">
      {/* Success Pulse */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
          <div className="flex flex-wrap justify-center gap-12 sm:gap-20">
            <AnimatedCounter target={450} label={t("footer.counter1")} />
            <AnimatedCounter target={3} label={t("footer.counter2")} />
            <AnimatedCounter target={98} label={t("footer.counter3")} />
            <AnimatedCounter target={50} label={t("footer.counter4")} />
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <img
              src="/philmanpower_logo.png"
              alt="PhilManPower GmbH — International Recruitment"
              className="h-8 w-auto brightness-0 invert mb-5"
            />
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              {t("footer.brand")}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 tracking-wide">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-gold/60" />
                <a href="mailto:info@philmanpower.com" className="hover:text-white/80 transition-colors">
                  info@philmanpower.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-gold/60" />
                <a href="tel:+4912345678" className="hover:text-white/80 transition-colors">
                  +49 123 456 78
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-gold/60 mt-0.5 flex-shrink-0" />
                <span>Germany · Austria · Spain</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 tracking-wide">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              {[
                { label: t("footer.aboutUs"), id: "about" },
                { label: t("nav.industries"), id: "industries" },
                { label: t("nav.process"), id: "process" },
                { label: t("nav.faq"), id: "faq" },
                { label: t("nav.contact"), id: "contact" },
              ].map((l) => (
                <li key={l.label}>
                  {isHomePage ? (
                    <a href={`#${l.id}`} className="hover:text-white/80 transition-colors">
                      {l.label}
                    </a>
                  ) : (
                    <Link to={`/#${l.id}`} className="hover:text-white/80 transition-colors">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 tracking-wide">
              {t("footer.legal")}
            </h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li>
                <a href="/imprint" className="hover:text-white/80 transition-colors">
                  {t("footer.impressum")}
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="hover:text-white/80 transition-colors">
                  {t("footer.privacyPolicy")}
                </a>
              </li>
            </ul>

            <h4 className="font-semibold text-white text-sm mt-6 mb-3 tracking-wide">
              {t("footer.followUs")}
            </h4>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              <Linkedin size={16} className="text-gold/60" />
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
          <p className="text-xs text-white/30">
            {t("footer.tagline")}
          </p>
        </div>
      </div>
    </footer>
  );
}
