import { useState, useEffect, useRef } from "react";

const SECTION_IDS = [
  "about",
  "industries",
  "process",
  "why-us",
  "regions",
  "faq",
  "contact",
];

/**
 * Scroll spy hook that tracks which section is currently visible in the viewport.
 * Uses IntersectionObserver with a root margin that accounts for the fixed navbar.
 *
 * @param {object} options
 * @param {number}  options.offset  – Fixed navbar height in px (default 80)
 * @param {boolean} options.enabled – Enable/disable observation (default true)
 * @returns {string} The id of the currently active section
 */
export function useActiveSection(options = {}) {
  const { offset = 80, enabled = true } = options;
  const [activeId, setActiveId] = useState("");
  const observerRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setActiveId("");
      return;
    }

    const elements = SECTION_IDS.map((id) =>
      document.getElementById(id)
    ).filter(Boolean);

    if (elements.length === 0) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const handleIntersect = (entries) => {
      // Entries that are intersecting within our root margin zone
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort(
          (a, b) =>
            Math.abs(a.boundingClientRect.top - offset) -
            Math.abs(b.boundingClientRect.top - offset)
        );

      if (visible.length > 0) {
        setActiveId(visible[0].target.id);
        return;
      }

      // Nothing is intersecting — pick the section closest to the viewport top
      const byProximity = [...entries]
        .filter((e) => e.boundingClientRect.top > offset - 20)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (byProximity.length > 0) {
        setActiveId(byProximity[0].target.id);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: `-${offset}px 0px -50% 0px`,
      threshold: [0, 0.25, 0.5],
    });

    elements.forEach((el) => observer.observe(el));
    observerRef.current = observer;

    // Initial detection — pick the first section already in view
    const initialVisible = elements
      .map((el) => ({ el, rect: el.getBoundingClientRect() }))
      .filter(
        ({ rect }) => rect.top < window.innerHeight && rect.bottom > offset
      )
      .sort((a, b) => a.rect.top - b.rect.top);

    if (initialVisible.length > 0) {
      setActiveId(initialVisible[0].el.id);
    } else {
      // Nothing visible yet — pick the one closest to the viewport top
      const nearest = elements
        .map((el) => ({
          el,
          dist: Math.abs(el.getBoundingClientRect().top - offset),
        }))
        .sort((a, b) => a.dist - b.dist);
      if (nearest.length > 0) {
        setActiveId(nearest[0].el.id);
      }
    }

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [offset, enabled]);

  return activeId;
}
