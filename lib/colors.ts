import type { ChapterColor } from "@/data/site";

/**
 * Chapter palette from the style tile.
 * `fill` for shapes (same in light and dark), `ink` for text on the page (a CSS variable that
 * switches with the theme), `paperInk` for text on the always-white polaroids, `on` for text on a fill.
 */
export const palette: Record<ChapterColor, { fill: string; ink: string; paperInk: string; on: string }> = {
  boston: { fill: "#E4513B", ink: "var(--c-boston-ink)", paperInk: "#B23420", on: "#000000" }, // pure black needed for AA on this red
  nashville: { fill: "#F0AE2E", ink: "var(--c-nashville-ink)", paperInk: "#8A5A00", on: "#1E1D1B" },
  australia: { fill: "#18A090", ink: "var(--c-australia-ink)", paperInk: "#0F6B60", on: "#1E1D1B" },
  world: { fill: "#7A5CF0", ink: "var(--c-world-ink)", paperInk: "#5B3CD4", on: "#FFFFFF" },
  nyc: { fill: "#2E5BE0", ink: "var(--c-nyc-ink)", paperInk: "#2246B5", on: "#FFFFFF" },
  open: { fill: "#B5284F", ink: "var(--c-open-ink)", paperInk: "#B5284F", on: "#FFFFFF" },
};

/** Theme-aware page colors (CSS variables). In SVG, use them via `style`, not attributes. */
export const ink = "var(--ink)";
export const paper = "var(--paper)";
/** Fixed ink for things printed on the polaroids, which stay white in both themes. */
export const photoInk = "#1E1D1B";
