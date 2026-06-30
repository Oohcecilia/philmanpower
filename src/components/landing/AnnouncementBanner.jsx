import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  Info,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Megaphone,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import jsonService from "@/lib/jsonService";

const ICON_MAP = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  important: AlertOctagon,
};

const COLOR_ACCENT = {
  info: "border-l-blue-500",
  success: "border-l-emerald-500",
  warning: "border-l-amber-500",
  important: "border-l-orange-500",
};

const BADGE_STYLES = {
  info: "bg-blue-50 text-blue-700 border-blue-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  important: "bg-orange-50 text-orange-700 border-orange-200",
};

const PROGRESS_COLORS = {
  info: "bg-blue-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  important: "bg-orange-500",
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

const AUTOPLAY_DURATION = 5000;

export default function AnnouncementBanner({ overlay = false }) {
  const [announcements, setAnnouncements] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const carouselRef = useRef(null);
  const dismissedRef = useRef(new Set());

  // Carousel State
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Autoplay State
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // --- UPDATED: Clears local storage and starts fresh on every reload ---
  useEffect(() => {
    announcements.forEach((a) => {
      localStorage.removeItem(getDismissKey(a.id));
    });

    const freshDismissedSet = new Set();
    dismissedRef.current = freshDismissedSet;
    setDismissedIds(freshDismissedSet);
  }, [announcements]);

  // --- UPDATED: Only dismisses in temporary state, not local storage ---
  const handleDismiss = (id) => {
    dismissedRef.current.add(id);
    setDismissedIds(new Set(dismissedRef.current));
  };

  const visibleAnnouncements = announcements.filter(
    (a) => !dismissedIds.has(a.id)
  );

  const visibleCount = visibleAnnouncements.length;
  const isSingle = visibleCount === 1;

  const handleScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const scrollPos = carouselRef.current.scrollLeft;
    const cardWidth = carouselRef.current.children[0]?.offsetWidth || 1;
    const newIndex = Math.round(scrollPos / cardWidth);

    if (newIndex !== activeIndex) {
      setActiveIndex(Math.min(newIndex, visibleCount - 1));
    }
  }, [activeIndex, visibleCount]);

  useEffect(() => {
    if (isSingle || isPaused || visibleCount === 0) return;

    const timer = setInterval(() => {
      if (carouselRef.current) {
        const current = carouselRef.current;
        const maxScroll = current.scrollWidth - current.clientWidth;

        if (current.scrollLeft >= maxScroll - 10) {
          current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollCarousel("right");
        }
      }
    }, AUTOPLAY_DURATION);

    return () => clearInterval(timer);
  }, [isSingle, isPaused, overlay, visibleCount]);

  const handleMouseDown = (e) => {
    if (isSingle || !carouselRef.current) return;
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !carouselRef.current || isSingle) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2.5;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? (overlay ? -300 : -400) : (overlay ? 300 : 400);
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (isLoading) return null; 
  if (visibleCount === 0) return null;

  return (
    <section className="relative z-40 w-full bg-transparent py-4 sm:py-6">
      <div
        className={`relative group/carousel ${overlay
            ? "w-full p-0"
            : "max-w-7xl mx-auto px-4 sm:px-8"
          }`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={handleMouseLeave}
      >

        {!isSingle && (
          <>
{/* Left Chevron with bg-transparent */}
            <button
              onClick={() => scrollCarousel("left")}
              className={`hidden md:flex absolute bottom-[5%] -translate-y-1/2 z-50 items-center justify-center w-8 h-8 rounded-full bg-transparent shadow-[0_4px_14px_rgba(0,0,0,0.12)] border border-navy/5 text-navy/70 hover:text-navy hover:bg-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 backdrop-blur-sm ${overlay ? "left-2" : "-left-3 lg:-left-3"
                }`}
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            {/* Right Chevron with bg-transparent */}
            <button
              onClick={() => scrollCarousel("right")}
              className={`hidden md:flex absolute bottom-[5%] -translate-y-1/2 z-50 items-center justify-center w-8 h-8 rounded-full bg-transparent shadow-[0_4px_14px_rgba(0,0,0,0.12)] border border-navy/5 text-navy/70 hover:text-navy hover:bg-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 backdrop-blur-sm ${overlay ? "right-2" : "-right-3 lg:-right-3"
                }`}
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        <div
          ref={carouselRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex ${isSingle
              ? "w-full justify-center"
              : `overflow-x-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${overlay ? "gap-4 pb-4" : "gap-6 pb-8 pt-2 px-1"
              }`
            } ${isDragging ? "cursor-grabbing snap-none" : "cursor-grab scroll-smooth"}`}
        >
          <AnimatePresence mode="popLayout">
            {visibleAnnouncements.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: overlay ? 10 : -20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`group/card relative overflow-hidden rounded-2xl border border-navy/8 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(10,25,47,0.06)] hover:shadow-[0_12px_40px_rgba(10,25,47,0.10)] transition-shadow duration-500 flex flex-col shrink-0 ${isSingle || overlay
                    ? "w-full snap-center"
                    : "snap-center sm:snap-start w-[88vw] sm:w-[480px] lg:w-[560px]"
                  }`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 z-10 ${COLOR_ACCENT?.[item.color] || COLOR_ACCENT?.info || "bg-blue-500"}`} />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-transparent pointer-events-none" />

                <div className="relative flex items-start gap-4 px-5 py-4 sm:px-6 sm:py-5 flex-1 select-none pb-6 sm:pb-8">
                  <div className="flex-1 min-w-0 flex flex-col h-full">

                    <div className="flex items-center flex-wrap gap-2.5 mb-2">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${BADGE_STYLES?.[item.color] || BADGE_STYLES?.info || "border-blue-200 text-blue-700"}`}>
                        <Megaphone size={10} />
                        {item.color === "important" ? "Important" : item.color === "warning" ? "Notice" : item.color === "success" ? "Update" : "Announcement"}
                      </span>
                      {item.title && (
                        <span className="font-heading font-semibold text-navy text-sm sm:text-base truncate">
                          {item.title}
                        </span>
                      )}
                    </div>

                    <p className="text-sm sm:text-xs text-navy/70 leading-relaxed flex-1 mt-1">
                      {item.message}
                    </p>

                    <div className="flex items-center gap-4 mt-4 flex-wrap mt-auto">
                      {item.cta_text && item.cta_link && (
                        <a
                          href={item.cta_link}
                          target={item.cta_link.startsWith("http") ? "_blank" : "_self"}
                          rel="noopener noreferrer"
                          onDragStart={(e) => e.preventDefault()}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-gold hover:text-deep-ochre transition-colors duration-200 group/cta"
                        >
                          {item.cta_text}
                          <ArrowRight size={14} className="transition-transform duration-200 group-hover/cta:translate-x-0.5" />
                        </a>
                      )}
                      {item.created_date && (
                        <span className="text-xs text-navy/40 font-medium">
                          {formatDate(item.created_date)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDismiss(item.id)}
                    className="p-1.5 text-navy/30 hover:text-navy/70 hover:bg-navy/5 rounded-full transition-colors duration-200 z-10 -mr-2"
                    aria-label="Dismiss announcement"
                  >
                    <X size={16} />
                  </button>
                </div>

                {!isSingle && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-navy/5">
                    {activeIndex === idx && !isPaused && (
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: AUTOPLAY_DURATION / 1000,
                          ease: "linear"
                        }}
                        className={`h-full ${PROGRESS_COLORS[item.color] || "bg-blue-500"
                          }`}
                      />
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}