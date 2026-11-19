// Shared by the server layout (no-flash script) and the client toggle.
export const THEME_KEY = "sp-theme";

/**
 * Runs in <head> before the page paints, so a saved dark choice never flashes light first.
 * Default is light (the cream "newspaper" look); visitors opt in to dark.
 * To follow the visitor's OS setting instead, change the fallback to:
 *   matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
 */
export const themeScript = `try{var t=localStorage.getItem("${THEME_KEY}");document.documentElement.dataset.theme=t==="dark"?"dark":"light"}catch(e){}`;

