// Everything you'll want to edit lives in this folder.
// Links marked TODO are placeholders until you fill them in.

export type ChapterColor = "boston" | "nashville" | "australia" | "world" | "nyc" | "open";
export type LonLat = [number, number];

export const site = {
  name: "Sydney Patel",
  shortName: "S. Patel",
  tagline: "Software engineer",
  links: {
    github: "https://github.com/sydneypatel", 
    linkedin: "https://www.linkedin.com/in/sydney-patel", 
    email: "mailto:sydney.j.patel@gmail.com",
    resume: "/Sydney_Patel_Resume.pdf", 
  },
  currently: [
    { label: "School", color: "nyc", text: "Building Willow, a check-in app for older adults" },
    { label: "Personal", color: "australia", text: "Cooking up My Kitchen, a meal-prep planner" },
    { label: "Learning", color: "nashville", text: "[new tool or language]" },
  ] as { label: string; color: ChapterColor; text: string }[],
};

export type Chapter = {
  num: string;
  color: ChapterColor;
  nav: string;
  kicker: string;
  /** Headline split so one phrase gets the highlighter swipe. */
  headline: [before: string, highlight: string, after: string];
  body: string;
  /** Where the globe faces (lon, lat). */
  view: LonLat;
  /** Home pin for this chapter, if any. */
  place?: { name: string; at: LonLat };
  /** Polaroid. Put images in /public/photos and set src, e.g. "/photos/boston.jpg". */
  photo?: { caption: string; sub: string; rotate: number; src?: string; at?: LonLat };
};

export const chapters: Chapter[] = [
  {
    num: "01",
    color: "boston",
    nav: "Boston",
    kicker: "Boston, Massachusetts · 42.36° N, 71.06° W",
    headline: ["I grew up in ", "Boston", "."],
    body: "Home base, and the first pin on the map. (Go Pats.)",
    view: [-46, 28],
    place: { name: "Boston", at: [-71.06, 42.36] },
    photo: { caption: "[Photo · Boston]", sub: "Where it started", rotate: -4 },
  },
  {
    num: "02",
    color: "nashville",
    nav: "Nashville",
    kicker: "Nashville, Tennessee · 36.16° N, 86.78° W",
    headline: ["I studied Computer Science and Applied Mathematics at ", "Vanderbilt", "."],
    body: "B.S., May 2026. TA for data structures and algorithms, and I taught coding to teens on the side.",
    view: [-62, 26],
    place: { name: "Nashville", at: [-86.78, 36.16] },
    photo: { caption: "[Photo · Vanderbilt]", sub: "Nashville, TN", rotate: 3 },
  },
  {
    num: "03",
    color: "australia",
    nav: "Australia",
    kicker: "Sydney, Australia · Spring 2025",
    headline: ["I studied abroad in ", "Sydney", ", and caught the travel bug for good."],
    body: "Breaks turned into Melbourne, Cairns, Perth, Japan, Thailand, Vietnam and Bali. New cultures, new people, and a new sense of who technology is for.",
    view: [176, -18],
    place: { name: "Sydney", at: [151.21, -33.87] },
    photo: { caption: "[Photo · Sydney]", sub: "Semester abroad, 2025", rotate: -3 },
  },
  {
    num: "04",
    color: "world",
    nav: "The world",
    kicker: "Everywhere · The mission",
    headline: ["I want to build technology that makes life better for ", "everyone, everywhere", "."],
    body: "Tech that's healthy, human and built for everyone.",
    view: [28, 16],
    photo: { caption: "[Photo · your travels]", sub: "Around the world", rotate: 4 },
  },
  {
    num: "05",
    color: "nyc",
    nav: "New York",
    kicker: "New York, New York · 40.76° N, 73.95° W",
    headline: ["Now I'm at ", "Cornell Tech", ", earning my M.Eng in Computer Science."],
    body: "Roosevelt Island, 2026–2027.",
    view: [-50, 30],
    place: { name: "New York", at: [-73.95, 40.76] },
    photo: { caption: "[Photo · Cornell Tech]", sub: "Roosevelt Island", rotate: -3 },
  },
  {
    num: "06",
    color: "open",
    nav: "Open to work",
    kicker: "Next destination",
    headline: ["I'm ", "open to work", "."],
    body: "Software engineering roles, especially in health tech. Open to anywhere, with New York and Boston at the top of the list.",
    view: [-68, 30],
  },
];

/** The dashed story routes, drawn as you scroll. `chapter` is when the leg starts. */
export const storyLegs: { from: LonLat; to: LonLat; chapter: number; color: ChapterColor }[] = [
  { from: [-71.06, 42.36], to: [-86.78, 36.16], chapter: 0, color: "nashville" },
  { from: [-86.78, 36.16], to: [151.21, -33.87], chapter: 1, color: "australia" },
  { from: [151.21, -33.87], to: [-73.95, 40.76], chapter: 3, color: "nyc" },
];

/** Where you're looking for jobs. Boston and New York get the big pins. */
export const jobPins: { name: string; at: LonLat }[] = [
  { name: "San Francisco", at: [-122.42, 37.77] },
  { name: "Seattle", at: [-122.33, 47.61] },
  { name: "Los Angeles", at: [-118.24, 34.05] },
  { name: "Austin", at: [-97.74, 30.27] },
  { name: "Chicago", at: [-87.63, 41.88] },
  { name: "D.C.", at: [-77.04, 38.9] },
  { name: "Denver", at: [-104.99, 39.74] },
  { name: "Atlanta", at: [-84.39, 33.75] },
  { name: "Toronto", at: [-79.38, 43.65] },
  { name: "London", at: [-0.13, 51.5] },
];
