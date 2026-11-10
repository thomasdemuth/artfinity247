// Right-sized pictures. Stored artwork images are 1600px previews (lib/storage.ts): fine for the buy page, far too
// big for a card or a 56px row thumbnail. `thumb(url, w)` asks for a copy about w pixels wide instead:
// Cloudinary resizes its own images at the edge; files under public/ go through Next's image optimizer.
// Anything else (data:, blob:, other hosts, SVG/GIF) is returned as it is. Client-safe.

/** Widths Next's optimizer accepts (its default deviceSizes + imageSizes). */
const NEXT_WIDTHS = [64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920];
/** Widths we ask Cloudinary for: a short list, so the same few renditions are reused (and cached) everywhere. */
const CLOUD_WIDTHS = [96, 160, 256, 384, 640, 960, 1280, 1600];

const snap = (w: number, list: number[]) => list.find((x) => x >= w) ?? list[list.length - 1];

const CLOUD_RE = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

/** A Cloudinary delivery URL limited to `w` pixels on its long edge (never enlarged), or null when it isn't one we can resize. */
export function cloudSized(url: string, w: number, auto = true): string | null {
  const m = CLOUD_RE.exec(url);
  if (!m) return null;
  // already transformed (c_fill, w_300, f_auto,q_auto, ...): leave it alone
  const first = m[2].split("/")[0];
  if (first.includes(",") || /^[a-z]{1,3}_[^/]+$/.test(first)) return null;
  const size = snap(w, CLOUD_WIDTHS);
  return `${m[1]}c_limit,w_${size},h_${size}${auto ? ",f_auto,q_auto" : ""}/${m[2]}`;
}

/**
 * The picture at about `w` CSS pixels wide (pass the width it's shown at; 2x screens are covered by `thumbSet`,
 * or just ask for double).
 */
export function thumb(url: string | null | undefined, w: number): string {
  if (!url) return "";
  const cloud = cloudSized(url, w);
  if (cloud) return cloud;
  if (url.startsWith("/") && !url.startsWith("//") && !url.startsWith("/api/") && !url.startsWith("/_next/") && /\.(jpe?g|png|webp|avif)(\?.*)?$/i.test(url))
    return `/_next/image?url=${encodeURIComponent(url)}&w=${snap(w, NEXT_WIDTHS)}&q=75`;
  return url;
}

/** `src` + `srcSet` for an <img> shown `w` CSS pixels wide: 1x and 2x copies. Spread it: <img {...thumbSet(url, 320)} />. */
export function thumbSet(url: string | null | undefined, w: number): { src: string; srcSet?: string } {
  const one = thumb(url, w);
  const two = thumb(url, w * 2);
  return one && two !== one ? { src: one, srcSet: `${one} 1x, ${two} 2x` } : { src: one };
}
