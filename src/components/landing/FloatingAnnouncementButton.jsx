import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, ChevronRight, Bell, X } from "lucide-react";
import jsonService from "@/lib/jsonService";
import AnnouncementModal from "./AnnouncementModal";

const COLOR_DOT = {
  info: "bg-blue-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  important: "bg-orange-500",
};

export default function FloatingAnnouncementButton() {
  const [announcements, setAnnouncements] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const hasNew = announcements.length > 0;

  // Fetch announcements
  useEffect(() => {
    async function load() {
      try {
        const entity = await jsonService.getEntity("Announcement");
        const records = await entity.list("-created_date", 20);
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
      } catch {
        // silently fail
      }
    }
    load();
  }, []);

  // Show button after scrolling past hero
  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close popup on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close popup on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSelect = (item) => {
    setSelectedAnnouncement(item);
    setIsOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <div className="fixed bottom-24 right-8 z-50 flex flex-col items-end">
            {/* Popup */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  ref={popupRef}
                  initial={{ opacity: 0, scale: 0.92, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 8 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-3 w-72 sm:w-80 bg-white rounded-xl shadow-[0_12px_40px_rgba(10,25,47,0.18)] border border-navy/8 overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-navy/5 bg-slate-50/60">
                    <span className="text-xs font-semibold text-navy/50 uppercase tracking-wide">
                      Announcements
                    </span>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-0.5 rounded text-navy/30 hover:text-navy/60 transition-colors"
                      aria-label="Close"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* List */}
                  <div className="max-h-64 overflow-y-auto overscroll-contain">
                    {announcements.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 py-8 px-4 text-center">
                        <Bell size={20} className="text-slate-200" />
                        <p className="text-xs text-slate-400 font-medium">
                          No announcements available
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-navy/4">
                        {announcements.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors group/item flex items-start gap-3"
                          >
                            <span
                              className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                                COLOR_DOT[item.color] || COLOR_DOT.info
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-navy truncate group-hover/item:text-gold transition-colors">
                                {item.title || "Announcement"}
                              </p>
                              {item.message && (
                                <p className="text-xs text-navy/40 mt-0.5 line-clamp-2 leading-relaxed">
                                  {item.message}
                                </p>
                              )}
                            </div>
                            <ChevronRight
                              size={14}
                              className="mt-1 text-navy/20 group-hover/item:text-navy/40 flex-shrink-0 transition-colors"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Floating button */}
            <motion.button
              ref={buttonRef}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setIsOpen((p) => !p)}
              className="relative w-12 h-12 rounded-full bg-gold text-white shadow-[0_8px_25px_rgba(10,25,47,0.25)] flex items-center justify-center hover:bg-gold/90 transition-colors duration-200"
              aria-label={isOpen ? "Close announcements" : "Open announcements"}
            >
              <Megaphone size={18} />
              {hasNew && !isOpen && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-orange-500 border-2 border-white rounded-full" />
              )}
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Announcement detail modal */}
      <AnnouncementModal
        announcement={selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
      />
    </>
  );
}
