/**
 * Scroll to an element matching the current URL hash.
 *
 * Uses document.querySelector() so it works with id="contact",
 * name="contact", [data-section="contact"], etc.
 *
 * Features:
 *  - Scrolls on initial page load if a hash is present
 *  - Listens for hash changes (SPA navigation, back/forward)
 *  - Smooth scrolling with configurable offset (for fixed navbars)
 *  - Decodes URI-encoded hashes (e.g. %C3%A9 → é)
 *  - Cleans up the event listener when disposed
 *
 * Usage (vanilla JS):
 *   import { initHashScroll } from "./lib/scrollToHash.js";
 *   const dispose = initHashScroll({ offset: 80 });
 *   // Later: dispose();
 *
 * Usage (React):
 *   useEffect(() => initHashScroll({ offset: 80 }), []);
 */

/**
 * @param {object}   options
 * @param {number}   [options.offset=0]    - Pixels to subtract from the top
 *                                            (e.g., fixed navbar height)
 * @param {number}   [options.delay=100]   - ms to wait before scrolling
 *                                            (lets the DOM settle after route change)
 * @param {string}   [options.behavior]    - "smooth" (default) or "instant"
 * @returns {() => void}  Dispose function to remove the event listener
 */
export function initHashScroll(options = {}) {
  const {
    offset = 0,
    delay = 100,
    behavior = "smooth",
  } = options;

  /** Decode and strip the leading "#" from a hash string */
  function parseHash(raw) {
    if (!raw || raw === "#") return null;
    try {
      return decodeURIComponent(raw.slice(1));
    } catch {
      return raw.slice(1);
    }
  }

  /** Attempt to scroll to the element matching the given hash value */
  function scrollToHash(rawHash) {
    const selector = parseHash(rawHash);
    if (!selector) return;

    // querySelector accepts id selectors (#contact), name selectors, etc.
    const el =
      document.querySelector(`[id="${CSS.escape(selector)}"]`) ||
      document.querySelector(`[name="${CSS.escape(selector)}"]`) ||
      document.getElementById(selector);

    if (!el) return;

    setTimeout(() => {
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior });
    }, delay);
  }

  // Scroll on initial load if URL already has a hash
  if (window.location.hash) {
    scrollToHash(window.location.hash);
  }

  // Listen for hash changes (SPA navigation, back/forward)
  function onHashChange() {
    scrollToHash(window.location.hash);
  }
  window.addEventListener("hashchange", onHashChange);

  // Return a dispose function for cleanup
  return () => {
    window.removeEventListener("hashchange", onHashChange);
  };
}
