import type { Metadata, Viewport } from "next";
import { A11yProvider } from "@/components/A11yProvider";
// Self-hosted fonts (no request to Google at runtime or build time).
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "@fontsource-variable/newsreader/index.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sydney Patel — Software Engineer",
  description:
      "Software engineer who designs for the person on the other end. Building human-centered tech, and open to work.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#F7F3EA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <A11yProvider>{children}</A11yProvider>
      </body>
    </html>
  );
}
