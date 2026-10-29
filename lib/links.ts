/**
 * Extra props for links that should open in a new tab: other websites and PDFs.
 * Usage: <a href={url} {...newTab(url)}>
 * `rel="noopener noreferrer"` stops the new tab from controlling this page.
 */
export function newTab(href: string) {
  const external = /^https?:\/\//.test(href);
  const pdf = href.toLowerCase().endsWith(".pdf");
  return external || pdf ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
