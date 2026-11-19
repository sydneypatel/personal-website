import type { ChapterColor } from "./site";

export type Project = {
  no: string;
  name: string;
  tag: string;
  stamp: ChapterColor;
  blurb: string;
  /** Short tech line shown under the blurb. */
  stack?: string;
  links: { label: string; href: string }[];
};

// Remove a link entry if it isn't public yet. A card with no links just hides the row.
export const projects: Project[] = [
  {
    no: "01",
    name: "last night.",
    tag: "iOS · App Store",
    stamp: "boston",
    blurb:
      "A social photo app where group albums stay hidden until a scheduled reveal. Built solo end-to-end, from the iOS interface to the backend APIs and photo infrastructure, through App Store launch.",
    stack: "SwiftUI · Node.js · PostgreSQL · AWS · Firebase",
    links: [
      { label: "App Store ↗", href: "#" }, // TODO: App Store link
      { label: "Site ↗", href: "https://last-night-app.com" },
    ],
  },
  {
    no: "02",
    name: "Verifi",
    tag: "AI · Team",
    stamp: "world",
    blurb:
      "An AI-powered tool that fact-checks investment claims against credible financial sources, to make financial information easier to evaluate. Built with a Cornell Tech team.",
    stack: "AI · LLMs · Financial data · Product development",
    links: [], // TODO: add a link if there's a demo or repo
  },
  {
    no: "03",
    name: "Willow",
    tag: "Health · Team",
    stamp: "australia",
    blurb:
      "A check-in app exploring how changes in daily activities could signal when older adults may need more support. Team project using longitudinal aging data to find predictive signals.",
    stack: "Machine learning · Health tech · Data analysis",
    links: [], // TODO: add GitHub link if public
  },
  {
    no: "04",
    name: "My Kitchen",
    tag: "Web · Wellness",
    stamp: "nashville",
    blurb: "A meal-prep and recipe planner that grew out of an HCI class project.",
    links: [
      { label: "Live ↗", href: "#" }, // TODO
      { label: "GitHub ↗", href: "#" }, // TODO
    ],
  },
  // Foyer: hidden while it's being reworked. Uncomment to bring it back.
  // {
  //   no: "05",
  //   name: "Foyer",
  //   tag: "SaaS · AI",
  //   stamp: "nyc",
  //   blurb: "AI email triage for hotel management companies.",
  //   links: [{ label: "foyer-ai.com ↗", href: "https://foyer-ai.com" }],
  // },
];

export type Stop = {
  code: string;
  where: string;
  color: ChapterColor;
  passes: { title: string; sub: string; dates: string; note?: string }[];
  boarding?: boolean;
};

export const route: Stop[] = [
  {
    code: "BOS",
    where: "Massachusetts · Summers",
    color: "boston",
    passes: [
      {
        title: "Software Engineering & IT Intern",
        sub: "JNR Management · Newton, MA",
        dates: "Summer 2025",
        note: "Built and deployed a full-stack React and Node.js site with an admin dashboard for property, fund and renovation management.",
      },
      {
        title: "Lead Instructor, iD Tech",
        sub: "Python, AI & ML courses at MIT · Cambridge, MA",
        dates: "Summer 2024",
        note: "Led a team of instructors teaching 1,000 campers, including neural networks with TensorFlow and Keras.",
      },
    ],
  },
  {
    code: "BNA",
    where: "Nashville, Tennessee · Through May 2026",
    color: "nashville",
    passes: [
      { title: "Vanderbilt University", sub: "B.S., Computer Science & Applied Math · Minor in Data Science", dates: "May 2026" },
      { title: "Teaching Assistant, CS 2201", sub: "Program Design & Data Structures · Vanderbilt", dates: "2024–26" },
    ],
  },
  {
    code: "NYC",
    where: "New York, New York · Now",
    color: "nyc",
    passes: [
      { title: "Cornell Tech", sub: "M.Eng, Computer Science · Roosevelt Island", dates: "May 2027" },
      { title: "Verifi & Willow", sub: "Team projects in applied AI and health tech", dates: "Fall 2026" },
    ],
    boarding: true,
  },
];
