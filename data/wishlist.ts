import type { ChapterColor, LonLat } from "./site";

// Leave `why` empty to show just the place name.
export type WishPlace = { name: string; at: LonLat; why: string; color: ChapterColor };

export const wishlist: WishPlace[] = [
  { name: "Antarctica", at: [-62.0, -64.5], why: "", color: "nyc" },
  { name: "Taiwan", at: [121.0, 23.7], why: "", color: "boston" },
  { name: "Kazakhstan", at: [67.0, 48.0], why: "", color: "nashville" },
  { name: "Patagonia", at: [-72.5, -49.5], why: "", color: "australia" },
  { name: "Wyoming", at: [-107.5, 43.0], why: "", color: "world" },
  { name: "New Zealand", at: [172.5, -41.5], why: "", color: "nyc" },
  { name: "Tanzania", at: [35.0, -6.4], why: "", color: "boston" },
  { name: "Hungary", at: [19.0, 47.5], why: "", color: "nashville" },
  { name: "Nicaragua", at: [-85.2, 12.9], why: "", color: "australia" },
];
