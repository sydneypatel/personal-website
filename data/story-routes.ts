import type { ChapterColor, LonLat } from "./site";

/**
 * The colored routes drawn on the globe as the story plays.
 * `chapter` is the chapter a leg starts drawing from (it draws while the globe turns to the next one).
 */
export const storyLegs: { from: LonLat; to: LonLat; chapter: number; color: ChapterColor }[] = [
  { from: [-71.06, 42.36], to: [-86.78, 36.16], chapter: 0, color: "nashville" }, // Boston → Nashville
  { from: [-86.78, 36.16], to: [151.21, -33.87], chapter: 1, color: "australia" }, // Nashville → Sydney
  { from: [-86.78, 36.16], to: [-73.95, 40.76], chapter: 3, color: "nyc" }, // Vanderbilt → Cornell Tech
];

/**
 * Chapter 4 ("The world"): an animated trip the globe follows, hop by hop.
 * Edit the stops to change the route; each hop gets equal time.
 */
export const worldTour: { name: string; at: LonLat }[] = [
  { name: "Sydney", at: [151.21, -33.87] },
  { name: "Tokyo", at: [139.69, 35.69] },
  { name: "Bangkok", at: [100.5, 13.75] },
  { name: "Hanoi", at: [105.85, 21.03] },
  { name: "Bali", at: [115.19, -8.65] },
  { name: "Sydney", at: [151.21, -33.87] },
  { name: "Milan", at: [9.19, 45.46] },
  { name: "Marrakech", at: [-7.99, 31.63] },
  { name: "Mumbai", at: [72.88, 19.08] },
  { name: "Nashville", at: [-86.78, 36.16] },
];

/** How long the world tour takes to play, in milliseconds. */
export const WORLD_TOUR_MS = 9000; // ~1s per hop
