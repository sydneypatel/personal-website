import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { WishList } from "@/components/wishlist/WishList";
import { wishlist } from "@/data/wishlist";
import { site } from "@/data/site";
import { palette } from "@/lib/colors";

export const metadata: Metadata = {
  title: "Wish list — Sydney Patel",
  description: "Places I haven't been, yet. Been to one? Send me a postcard.",
};

export default function WishListPage() {
  return (
    <>
      <SiteHeader page="wishlist" />
      <main id="main" className="container" style={{ paddingTop: 96, paddingBottom: 72 }}>
        <p className="mono-label" style={{ color: palette.australia.ink, margin: "0 0 12px" }}>
          Wish list · {wishlist.length} unstamped
        </p>
        <h1 style={{ margin: "0 0 18px", fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(56px, 7vw, 104px)", lineHeight: 0.95 }}>
          Places I haven&apos;t been, yet.
        </h1>
        <p style={{ margin: "0 0 56px", fontSize: 20, color: "var(--muted)", maxWidth: 620 }}>
          Been to one of these? I&apos;d genuinely love to hear about it: where to eat, who to meet, what surprised you.
        </p>
        <WishList />
        <footer
          style={{ marginTop: 72, paddingTop: 20, borderTop: "1px solid rgba(30,29,27,0.25)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "8px 24px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)" }}
        >
          <Link href="/" style={{ padding: "10px 0" }}>← Back to the globe</Link>
          <span style={{ padding: "10px 0" }}>© {new Date().getFullYear()} {site.name}</span>
        </footer>
      </main>
    </>
  );
}
