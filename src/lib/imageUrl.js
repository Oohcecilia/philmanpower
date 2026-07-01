/**
 * Resolve an image URL for use in <img> tags.
 *
 * Handles the case where the frontend is served from a different origin than
 * the API server. In development, Vite proxies /uploads to the API server,
 * so relative paths work fine. In production, we need to resolve relative
 * image URLs (e.g. "/uploads/abc.jpg") against the API server's origin when
 * VITE_API_BASE is an absolute URL pointing to a different host.
 *
 * Usage:
 *   <img src={getImageUrl(announcement.featured_image)} />
 *
 * Environment variables:
 *   VITE_API_BASE  – API base URL (e.g. "/api" or "https://api.example.com/api")
 */
export function getImageUrl(path) {
  if (!path) return "";
  // Already absolute – use as-is
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // Relative path – check if we need to resolve against the API origin
  if (path.startsWith("/")) {
    const apiBase = import.meta.env.VITE_API_BASE;
    if (apiBase && apiBase.startsWith("http")) {
      try {
        const origin = new URL(apiBase).origin;
        return `${origin}${path}`;
      } catch {
        // Invalid URL – fall through
      }
    }
  }
  // Same-origin or no VITE_API_BASE set – use path as-is
  return path;
}
