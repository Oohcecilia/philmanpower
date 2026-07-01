import { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  User,
  Megaphone,
  Info,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
} from "lucide-react";

const ICON_MAP = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  important: AlertOctagon,
};

const BADGE_STYLES = {
  info: "bg-blue-50 text-blue-700 border-blue-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  important: "bg-orange-50 text-orange-700 border-orange-200",
};

const COLOR_HEADER_BG = {
  info: "bg-blue-50/50",
  success: "bg-emerald-50/50",
  warning: "bg-amber-50/50",
  important: "bg-orange-50/50",
};

const ACCENT_BORDER = {
  info: "border-l-blue-500",
  success: "border-l-emerald-500",
  warning: "border-l-amber-500",
  important: "border-l-orange-500",
};

const ACCENT_GRADIENT = {
  info: "from-blue-500/10 via-transparent to-transparent",
  success: "from-emerald-500/10 via-transparent to-transparent",
  warning: "from-amber-500/10 via-transparent to-transparent",
  important: "from-orange-500/10 via-transparent to-transparent",
};

const PROGRESS_BAR = {
  info: "bg-blue-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  important: "bg-orange-500",
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 320,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 12,
    transition: { duration: 0.2, ease: [0.32, 0, 0.67, 0] },
  },
};

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function AnnouncementModal({ announcement, onClose }) {
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const previousActiveElement = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  // Lock body scroll while open
  useEffect(() => {
    if (!announcement) return;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [announcement]);

  // Scroll content to top, save and restore focus on open/close
  useEffect(() => {
    if (!announcement) return;
    previousActiveElement.current = document.activeElement;
    // Small delay to let the animation start before scrolling/focusing
    const timer = setTimeout(() => {
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      modalRef.current?.focus();
      // Check scrollability after content renders
      requestAnimationFrame(() => {
        const el = contentRef.current;
        if (el) {
          setIsScrollable(el.scrollHeight > el.clientHeight + 4);
          setIsScrolledToBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 4);
        }
      });
    }, 80);
    return () => {
      clearTimeout(timer);
      previousActiveElement.current?.focus();
    };
  }, [announcement]);

  // Track scroll position for scroll indicator
  const handleContentScroll = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    setIsScrolledToBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 4);
  }, []);

  // Escape key handler
  useEffect(() => {
    if (!announcement) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    // Use capture phase to intercept before Radix toast or others
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [announcement, onClose]);

  // Focus trap
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key !== "Tab" || !modalRef.current) return;
      const focusableElements =
        modalRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusableElements.length === 0) return;
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    },
    []
  );

  if (!announcement) return null;

  const color = announcement.color || "info";
  const badgeClass = BADGE_STYLES[color] || BADGE_STYLES.info;
  const headerBg = COLOR_HEADER_BG[color] || COLOR_HEADER_BG.info;
  const accentBorder = ACCENT_BORDER[color] || ACCENT_BORDER.info;
  const accentGradient = ACCENT_GRADIENT[color] || ACCENT_GRADIENT.info;
  const progressBar = PROGRESS_BAR[color] || PROGRESS_BAR.info;
  const Icon = ICON_MAP[color] || Megaphone;

  const badgeLabel =
    color === "important"
      ? "Important"
      : color === "warning"
        ? "Notice"
        : color === "success"
          ? "Update"
          : "Announcement";

  return createPortal(
    <AnimatePresence>
      {/* Backdrop — standalone fixed element to cover ALL viewport layers */}
      <motion.div
        key="announcement-backdrop"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[9999] bg-navy/80 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container — same layer, pointer-events-none so backdrop catches clicks */}
      <motion.div
        key="announcement-modal"
        ref={modalRef}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="dialog"
        aria-modal="true"
        aria-labelledby="announcement-modal-title"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 pointer-events-none"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-navy/8 overflow-hidden flex flex-col"
        >
          {/* Top accent bar */}
          <div
            className={`absolute top-0 left-0 right-0 h-1 z-10 ${progressBar}`}
          />

          {/* Header area */}
          <div
            className={`relative flex-shrink-0 px-6 sm:px-8 pt-7 pb-5 ${headerBg} border-b border-navy/5`}
          >
            {/* Accent gradient decoration */}
            <div
              className={`absolute top-0 right-0 w-48 h-32 rounded-full bg-gradient-to-br ${accentGradient} blur-2xl pointer-events-none`}
            />

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${badgeClass}`}
                >
                  <Icon size={11} />
                  {badgeLabel}
                </span>

                {/* Title */}
                {announcement.title && (
                  <h2
                    id="announcement-modal-title"
                    className="font-heading text-xl sm:text-2xl lg:text-3xl font-semibold text-navy mt-3 leading-tight pr-4"
                  >
                    {announcement.title}
                  </h2>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="flex-shrink-0 p-2 rounded-full text-navy/40 hover:text-navy hover:bg-navy/5 transition-all duration-200 -mr-1.5 -mt-1 focus:outline-none focus:ring-2 focus:ring-navy/20"
                aria-label="Close announcement"
              >
                <X size={20} />
              </button>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-4">
              {announcement.created_date && (
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-navy/50 font-medium">
                  <Calendar size={14} className="text-navy/30" />
                  {formatDateTime(announcement.created_date)}
                </span>
              )}
              {announcement.author && (
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-navy/50 font-medium">
                  <User size={14} className="text-navy/30" />
                  {announcement.author}
                </span>
              )}
            </div>

            {/* Date range if scheduled */}
            {(announcement.start_date || announcement.end_date) && (
              <div className="mt-3 flex flex-wrap gap-3">
                {announcement.start_date && (
                  <span className="text-xs text-navy/40 bg-white/60 px-2.5 py-1 rounded-md border border-navy/5">
                    Published: {formatDate(announcement.start_date)}
                  </span>
                )}
                {announcement.end_date && (
                  <span className="text-xs text-navy/40 bg-white/60 px-2.5 py-1 rounded-md border border-navy/5">
                    Expires: {formatDate(announcement.end_date)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Content body - scrollable */}
          <div
            ref={contentRef}
            onScroll={handleContentScroll}
            className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-8 py-6 relative"
          >
            {/* Left accent strip */}
            <div
              className={`hidden sm:block absolute left-0 top-0 bottom-0 w-1 z-10 ${accentBorder}`}
            />

            {/* Featured Image */}
            {announcement.featured_image && (
              <div className="mb-6 -mx-6 sm:-mx-8 -mt-6">
                <div className="relative w-full bg-slate-50 flex items-center justify-center">
                  <img
                    src={announcement.featured_image}
                    alt={announcement.title || "Announcement image"}
                    className="w-full max-h-[50vh] object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <p className="text-sm sm:text-base text-navy/80 leading-relaxed whitespace-pre-wrap">
                {announcement.message}
              </p>

              {/* CTA */}
              {announcement.cta_text && announcement.cta_link && (
                <div className="mt-8 pt-6 border-t border-navy/8">
                  <a
                    href={announcement.cta_link}
                    target={
                      announcement.cta_link.startsWith("http")
                        ? "_blank"
                        : "_self"
                    }
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-white font-semibold text-sm hover:bg-gold/90 hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/40"
                  >
                    <Megaphone size={16} />
                    {announcement.cta_text}
                  </a>
                </div>
              )}
            </div>

            {/* Scroll indicator */}
            {isScrollable && !isScrolledToBottom && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="sticky bottom-0 left-0 right-0 h-8 -mx-6 sm:-mx-8 pointer-events-none flex items-end justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="relative flex flex-col items-center gap-0.5 pb-1"
                >
                  <span className="text-[10px] font-semibold text-navy/30 uppercase tracking-wider">
                    Scroll
                  </span>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-navy/30">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Bottom bar */}
          <div className="flex-shrink-0 px-6 sm:px-8 py-3 bg-slate-50/80 border-t border-navy/5 flex items-center justify-between">
            <span className="text-xs text-navy/30 font-medium">
              Press Esc to close
            </span>
            <button
              onClick={onClose}
              className="text-xs font-semibold text-navy/40 hover:text-navy transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-navy/5 focus:outline-none focus:ring-2 focus:ring-navy/20"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
