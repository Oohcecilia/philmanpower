import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { initHashScroll } from "@/lib/scrollToHash";

const NAVBAR_HEIGHT = 80;

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const disposerRef = useRef(null);

  useEffect(() => {
    // Dispose previous listener if any
    disposerRef.current?.();

    if (hash) {
      // Use the shared hash-scroll utility with a navbar offset
      disposerRef.current = initHashScroll({
        offset: NAVBAR_HEIGHT,
        delay: 80,
        behavior: "smooth",
      });
      // The utility already handles the initial hash on mount
    } else {
      // No hash → scroll to top
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    return () => disposerRef.current?.();
  }, [pathname, hash]);

  return null;
}
