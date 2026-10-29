import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { FlightStats, SiteFooter } from "@/components/sections/Sections";
import { wishlist } from "@/data/wishlist";
import { palette } from "@/lib/colors";
import s from "@/components/sections/sections.module.css";

export const metadata: Metadata = {
  title: "Travels — Sydney Patel",
  description: "Where I've been, where I'm headed, and notes from along the way.",
};

export default function TravelsPage() {
  return (
    <>
      <SiteHeader page="travels" />
      <main id="main" className="container" style={{ paddingTop: 96, paddingBottom: 48 }}>
        <p className="mono-label" style={{ color: palette.nyc.ink, margin: "0 0 12px" }}>Travels</p>
        <h1 className={s.bigH2} style={{ marginBottom: 18 }}>Notes from the road.</h1>
        <p className={s.lede}>Where I&apos;ve been, where I&apos;m headed, and (soon) stories from along the way.</p>

        <FlightStats />

        <div className={s.travelCards}>
          <Link href="/wishlist" className={s.travelCard}>
            <span className="mono-label" style={{ color: palette.australia.ink }}>Wish list · {wishlist.length} unstamped</span>
            <h2 className={s.travelCardTitle}>Places I haven&apos;t been, yet.</h2>
            <p className={s.cardBody}>Been to one? Send me a postcard with your tips.</p>
            <span className="mono-label" style={{ marginTop: "auto" }}>See the list →</span>
          </Link>
          <div className={s.travelCard}>
            <span className="mono-label" style={{ color: "var(--muted)" }}>Field notes</span>
            <h2 className={s.travelCardTitle}>Stories from the trips.</h2>
            <p className={s.cardBody}>Posts about the places I&apos;ve been are coming soon.</p>
          </div>
        </div>

        <div style={{ marginTop: 72 }}>
          <Link href="/" style={{ fontFamily: "var(--font-mono)", fontSize: 12, padding: "10px 0", display: "inline-block" }}>← Back to the globe</Link>
          <SiteFooter />
        </div>
      </main>
    </>
  );
}
