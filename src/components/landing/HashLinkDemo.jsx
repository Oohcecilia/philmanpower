import React, { useState, useEffect } from "react";
import { ArrowRight, Link2, ExternalLink, Hash } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const hashLinks = [
  { hash: "#about", label: "About Us" },
  { hash: "#industries", label: "Industries" },
  { hash: "#process", label: "Process" },
  { hash: "#contact", label: "Contact (demo target)" },
  { hash: "#faq", label: "FAQ" },
];

export default function HashLinkDemo() {
  const [activeHash, setActiveHash] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    // Read once after mount (avoids SSR issues)
    setOrigin(window.location.origin);
    setActiveHash(window.location.hash);

    // Listen for hash changes (native <a> clicks, back/forward)
    const onHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-slate-mist/50">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <ScrollReveal>
          {/* Section label */}
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-gold/70 mb-4">
            <span className="w-8 h-px bg-gold/60" />
            Demo
          </span>

          <h2 className="font-heading font-semibold text-navy text-3xl sm:text-4xl leading-tight mb-4">
            Smooth Hash Scrolling
          </h2>
          <p className="text-navy/55 leading-relaxed max-w-2xl mb-10">
            This page uses URL hash links for smooth, in-page navigation. Click any
            link below to smoothly scroll to that section. The URL updates too —
            you can share or bookmark the link to land directly on that section.
          </p>
        </ScrollReveal>

        {/* Demo link cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {hashLinks.map((item, i) => {
            const isActive = activeHash === item.hash;
            const isContact = item.hash === "#contact";

            return (
              <ScrollReveal key={item.hash} delay={i * 0.05}>
                <a
                  href={item.hash}
                  onClick={() => setActiveHash(item.hash)}
                  className={`
                    group relative block rounded-xl border p-4 transition-all duration-300
                    ${
                      isActive
                        ? "bg-white border-gold/40 shadow-[0_4px_20px_rgba(212,175,55,0.12)]"
                        : "bg-white border-navy/[0.06] hover:border-gold/25 hover:shadow-[0_4px_16px_rgba(10,25,47,0.06)]"
                    }
                    ${isContact ? "ring-2 ring-gold/20" : ""}
                  `}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Icon */}
                      <div
                        className={`
                          w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                          transition-colors duration-300
                          ${isActive ? "bg-gold/10" : "bg-navy/[0.04] group-hover:bg-gold/8"}
                        `}
                      >
                        {isContact ? (
                          <ExternalLink
                            size={15}
                            className={`transition-colors duration-300 ${
                              isActive ? "text-gold" : "text-navy/40 group-hover:text-gold"
                            }`}
                          />
                        ) : (
                          <Hash
                            size={15}
                            className={`transition-colors duration-300 ${
                              isActive ? "text-gold" : "text-navy/40 group-hover:text-gold"
                            }`}
                          />
                        )}
                      </div>

                      {/* Text */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono font-semibold text-navy">
                            {item.hash}
                          </code>
                          {isContact && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-gold bg-gold/10 px-1.5 py-0.5 rounded-full">
                              target
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-navy/45 mt-0.5 truncate">
                          {item.label}
                        </div>
                      </div>
                    </div>

                    {/* Active indicator */}
                    <ArrowRight
                      size={14}
                      className={`flex-shrink-0 mt-1 transition-all duration-300 ${
                        isActive
                          ? "text-gold translate-x-0.5"
                          : "text-navy/20 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                      }`}
                    />
                  </div>

                  {/* Active glow */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl ring-1 ring-gold/20 pointer-events-none" />
                  )}
                </a>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Live demo hint */}
        <ScrollReveal delay={0.3}>
          <div className="bg-navy rounded-2xl p-6 sm:p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Link2 size={18} className="text-gold" />
              <code className="text-sm font-mono font-semibold text-white">
                {origin}/#contact
              </code>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-lg mx-auto">
              Visiting this URL brings you directly to the contact form with a
              smooth scroll animation — no extra page load required.
            </p>
            <a
              href="/#contact"
              className="
                inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full
                bg-gold text-white text-sm font-semibold
                hover:bg-gold/90 transition-all duration-300
              "
            >
              Try it: <code className="text-white/80">/#contact</code>
              <ArrowRight size={14} />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
