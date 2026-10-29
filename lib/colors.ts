import type { ChapterColor } from "@/data/site";

/** Chapter palette from the style tile. `fill` for shapes, `ink` for text on paper (passes AA). */
export const palette: Record<ChapterColor, { fill: string; ink: string; on: string }> = {
  boston: { fill: "#E4513B", ink: "#B23420", on: "#000000" }, // pure black needed for AA on this red
  nashville: { fill: "#F0AE2E", ink: "#8A5A00", on: "#1E1D1B" },
  australia: { fill: "#18A090", ink: "#0F6B60", on: "#1E1D1B" },
  world: { fill: "#7A5CF0", ink: "#5B3CD4", on: "#FFFFFF" },
  nyc: { fill: "#2E5BE0", ink: "#2246B5", on: "#FFFFFF" },
  open: { fill: "#B5284F", ink: "#B5284F", on: "#FFFFFF" },
};

export const ink = "#1E1D1B";
export const paper = "#F7F3EA";
