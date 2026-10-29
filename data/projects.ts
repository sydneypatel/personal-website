import type { ChapterColor } from "./site";

export type Project = {
  no: string;
  name: string;
  tag: string;
  stamp: ChapterColor;
  blurb: string;
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    no: "01",
    name: "Last Night",
    tag: "iOS · App Store",
    stamp: "boston",
    blurb: "A group photo app where everyone's shots stay hidden until sunrise. Live on the App Store.",
    links: [
      { label: "App Store ↗", href: "#" }, // TODO
      { label: "Site ↗", href: "#" }, // TODO
    ],
  },
  {
    no: "02",
    name: "Willow",
    tag: "Health · Team",
    stamp: "australia",
    blurb: "An early-warning check-in app for older adults and their caregivers. Built with a team at Cornell Tech.",
    links: [{ label: "GitHub ↗", href: "#" }], // TODO
  },
  {
    no: "03",
    name: "My Kitchen",
    tag: "Web · Wellness",
    stamp: "nashville",
    blurb: "A meal-prep and recipe planner that grew out of an HCI class project.",
    links: [
      { label: "Live ↗", href: "#" }, // TODO
      { label: "GitHub ↗", href: "#" }, // TODO
    ],
  },
  {
    no: "04",
    name: "Foyer",
    tag: "SaaS · AI",
    stamp: "world",
    blurb: "AI email triage for hotel management companies.",
    links: [{ label: "foyer-ai.com ↗", href: "https://foyer-ai.com" }],
  },
];

export type Stop = {
  code: string;
  where: string;
  color: ChapterColor;
  passes: { title: string; sub: string; dates: string }[];
  boarding?: boolean;
};

export const route: Stop[] = [
  {
    code: "BOS",
    where: "Massachusetts · Origin",
    color: "boston",
    passes: [
      { title: "[Role]", sub: "[Company] · [Town], MA", dates: "[Dates]" },
      { title: "[Role]", sub: "[Company] · [Town], MA", dates: "[Dates]" },
    ],
  },
  {
    code: "BNA",
    where: "Nashville, Tennessee · Through May 2026",
    color: "nashville",
    passes: [
      { title: "Vanderbilt University", sub: "B.S., Computer Science and Applied Mathematics", dates: "2026" },
      { title: "Teaching Assistant, CS", sub: "Data structures and algorithms · Vanderbilt", dates: "[Dates]" },
      { title: "Coding Instructor", sub: "Taught programming to teens · [Organization]", dates: "[Dates]" },
    ],
  },
  {
    code: "NYC",
    where: "New York, New York · Now",
    color: "nyc",
    passes: [{ title: "Cornell Tech", sub: "M.Eng, Computer Science · Roosevelt Island", dates: "2026–27" }],
    boarding: true,
  },
];
