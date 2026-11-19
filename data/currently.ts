/**
 * "Currently" block in the Things I've built section.
 * Column 1: school projects. Column 2: personal projects + what you're learning.
 * Add or remove items freely. An empty list hides its heading.
 */
export const currently = {
  /** Hidden for now: it repeated the project cards. Set to true to bring it back. */
  show: false,
  school: [
    { name: "Verifi", text: "an AI tool that fact-checks investment claims against credible financial sources" },
    { name: "Willow", text: "a check-in app for older adults" },
  ],
  personal: [{ name: "My Kitchen", text: "a meal-prep planner" }],
  learning: [] as string[], // e.g. ["Rust"]
};
