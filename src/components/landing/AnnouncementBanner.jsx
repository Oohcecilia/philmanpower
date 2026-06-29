import React, { useEffect, useState, useRef } from "react";
import jsonService from "@/lib/jsonService";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Info, CheckCircle, AlertTriangle, AlertOctagon, ChevronDown, Megaphone } from "lucide-react";

const ICON_MAP = {
  info:      Info,
  success:   CheckCircle,
  warning:   AlertTriangle,
  important: AlertOctagon,
};

const COLOR_ACCENT = {
  info:      "border-l-blue-500",
  success:   "border-l-emerald-500",
  warning:   "border-l-amber-500",
  important: "border-l-orange-500",
};

const BADGE_STYLES = {
  info:      "bg-blue-50 text-blue-700 border-blue-200",
  success:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning:   "bg-amber-50 text-amber-700 border-amber-200",
  important: "bg-orange-50 text-orange-700 border-orange-200",
};

function getDismissKey(id) {
  return `dismissed_announcement_${id}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AnnouncementBanner({ overlay = false }) {
  const [announcements, setAnnouncements] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(new Set());
  const [showAll, setShowAll] = useState(false);
  const dismissedRef = useRef(new Set());

  useEffect(() => {
    async function load() {
      try {
        const entity = await jsonService.getEntity("Announcement");
        const records = await entity.list("-created_date", 50);
        const now = new Date();

        const active = records.filter((a) => {
          const hasDates = a.start_date || a.end_date;
          if (hasDates) {
            if (a.start_date && new Date(a.start_date) > now) return false;
            if (a.end_date && new Date(a.end_date) < now) return false;
            return true;
          }
          return a.is_enabled;
        });

        setAnnouncements(active);
      } catch {}
    }
    load();
  }, []);

  const handleDismiss = (id) => {
    localStorage.setItem(getDismissKey(id), "true");
    dismissedRef.current.add(id);
    setDismissedIds(new Set(dismissedRef.current));
  };

  const visibleAnnouncements = announcements.filter(
    (a) => !dismissedIds.has(a.id)
  );

  if (visibleAnnouncements.length === 0) return null;

  const featured = visibleAnnouncements[0];
  const rest = visibleAnnouncements.slice(1);

  const renderContent = () => (
    <>
      {/* Featured announcement — premium card */}
      <motion.div
        initial={{ opacity: 0, y: -20, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="group relative overflow-hidden rounded-2xl border border-navy/8 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(10,25,47,0.06)] hover:shadow-[0_12px_40px_rgba(10,25,47,0.10)] transition-all duration-500"
      >
        {/* Left accent bar */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 ${
            COLOR_ACCENT[featured.color] || COLOR_ACCENT.info
          } rounded-l-2xl`}
        />

        {/* Inner glow gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative flex items-start gap-4 px-5 py-4 sm:px-7 sm:py-5">
          {/* Icon circle */}
          <div className="hidden sm:flex flex-shrink-0 w-10 h-10 rounded-xl bg-navy items-center justify-center mt-0.5">
            {(() => {
              const Icon = ICON_MAP[featured.color] || Info;
              return <Icon size={18} className="text-gold" />;
            })()}
          </div>

          <div className="flex-1 min-w-0">
            {/* Top row: badge + title */}
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  BADGE_STYLES[featured.color] || BADGE_STYLES.info
                }`}
              >
                <Megaphone size={10} />
                {featured.color === "important"
                  ? "Important"
                  : featured.color === "warning"
                  ? "Notice"
                  : featured.color === "success"
                  ? "Update"
                  : "Announcement"}
              </span>
              {featured.title && (
                <span className="font-heading font-semibold text-navy text-base sm:text-lg truncate">
                  {featured.title}
                </span>
              )}
            </div>

            {/* Message */}
            <p className="text-sm text-navy/65 leading-relaxed max-w-2xl">
              {featured.message}
            </p>

            {/* Bottom row: CTA + date */}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {featured.cta_text && featured.cta_link && (
                <a
                  href={featured.cta_link}
                  target={
                    featured.cta_link.startsWith("http")
                      ? "_blank"
                      : "_self"
                  }
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-deep-ochre transition-colors duration-200 group/cta"
                >
                  {featured.cta_text}
                  <ArrowRight
                    size={12}
                    className="transition-transform duration-200 group-hover/cta:translate-x-0.5"
                  />
                </a>
              )}
              {featured.created_date && (
                <span className="text-[11px] text-navy/40">
                  {formatDate(featured.created_date)}
                </span>
              )}
            </div>
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => handleDismiss(featured.id)}
            className="flex-shrink-0 w-7 h-7 rounded-lg bg-navy/5 hover:bg-navy/10 text-navy/40 hover:text-navy/70 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      </motion.div>

      {/* Additional announcements */}
      <AnimatePresence>
        {rest.length > 0 && (
          <>
            {/* Toggle button */}
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-3 flex items-center gap-1.5 text-xs font-medium text-navy/45 hover:text-navy/70 transition-colors duration-200"
            >
              <span>
                {showAll
                  ? "Hide"
                  : `+${rest.length} more announcement${
                      rest.length > 1 ? "s" : ""
                    }`}
              </span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-300 ${
                  showAll ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Expanded list */}
            {showAll && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="mt-2 space-y-2 overflow-hidden"
              >
                {rest.map((item, idx) => {
                  const Icon = ICON_MAP[item.color] || Info;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: idx * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="group flex items-start gap-3 px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-navy/5 hover:border-navy/10 hover:bg-white/80 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center">
                        <Icon size={14} className="text-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.title && (
                            <span className="font-heading font-semibold text-navy text-sm truncate">
                              {item.title}
                            </span>
                          )}
                          {item.created_date && (
                            <span className="text-[11px] text-navy/40 flex-shrink-0">
                              {formatDate(item.created_date)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-navy/60 mt-0.5 leading-relaxed">
                          {item.message}
                        </p>
                        {item.cta_text && item.cta_link && (
                          <a
                            href={item.cta_link}
                            target={
                              item.cta_link.startsWith("http")
                                ? "_blank"
                                : "_self"
                            }
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-gold hover:text-deep-ochre mt-1.5 transition-colors"
                          >
                            {item.cta_text}
                            <ArrowRight size={10} />
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => handleDismiss(item.id)}
                        className="flex-shrink-0 w-6 h-6 rounded-lg hover:bg-navy/5 text-navy/30 hover:text-navy/50 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label="Dismiss"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );

  if (overlay) {
    return (
      <div className="w-full max-w-sm">
        {renderContent()}
      </div>
    );
  }

  return (
    <section className="relative z-40">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-6 pb-4">
        {renderContent()}
      </div>
    </section>
  );
}
