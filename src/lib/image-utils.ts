/**
 * Image utility helpers.
 *
 * Business rule: images are stored on disk at ADVERTISEMENTS_SAVE_PATH_LOCAL.
 * The database stores only the FILENAME (e.g. "1234-uuid.png"), NOT the full
 * absolute path.  The Route Handler at /api/images/[filename] reads the file
 * from disk and serves it to the browser.
 *
 * This module provides the single source of truth for that mapping so that UI
 * components never need to know about the filesystem layout.
 */

/** Public URL placeholder shown when an ad has no image. */
export const PLACEHOLDER_IMAGE_URL = "/placeholder-ad.svg";

/**
 * Converts a stored image value to a browser-accessible URL.
 *
 * Handles two cases for backwards-compatibility:
 *   1. The DB stores only a filename  → served via /api/images/[filename]
 *   2. The DB stores a full Windows path (legacy rows) → extract the basename
 *
 * @param filePath - The value stored in AdImage.filePath
 * @returns A relative URL suitable for use in an <img> or Next.js <Image> src.
 */
export function getAdImageUrl(filePath: string | null | undefined): string {
  if (!filePath) return PLACEHOLDER_IMAGE_URL;

  // If it looks like an absolute path (contains a drive letter or leading slash)
  // extract just the filename portion so we can serve it via the API route.
  const filename = filePath.includes("\\") || filePath.includes("/")
    ? filePath.replace(/\\/g, "/").split("/").pop()!
    : filePath;

  if (!filename) return PLACEHOLDER_IMAGE_URL;

  return `/api/images/${encodeURIComponent(filename)}`;
}
