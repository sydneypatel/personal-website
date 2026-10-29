"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { site } from "@/data/site";
import { palette } from "@/lib/colors";
import { useA11y } from "./A11yProvider";
import s from "./SiteHeader.module.css";

type Props = { page: "home" | "wishlist" };

export function SiteHeader({ page }: Props) {
  const { calm, contrast, setCalm, setContrast } = useA11y();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const panelId = useId();
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const home = page === "home";
  const anchor = (id: string) => (home ? `#${id}` : `/#${id}`);

  // Close the accessibility panel on Escape or a click outside it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <header className={s.header}>
      <div className={s.row}>
        <Link href="/" className={s.brand}>
          <span className={s.dots} aria-hidden="true">
            {(["boston", "nashville", "australia", "nyc"] as const).map((c) => (
              <span key={c} style={{ background: palette[c].fill }} />
            ))}
          </span>
          <span className={s.brandName}>{site.shortName}</span>
        </Link>

        <button
          type="button"
          className={s.menuBtn}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        <nav id={menuId} aria-label="Primary" className={s.nav} data-open={menuOpen} onClick={(e) => (e.target as HTMLElement).closest("a") && setMenuOpen(false)}>
          <a className={s.link} href={anchor("itinerary")}>Itinerary</a>
          <a className={s.link} href={anchor("postcards")}>Postcards</a>
          <a className={s.link} href={anchor("flightlog")}>Flight log</a>
          <Link className={s.link} href="/wishlist" aria-current={page === "wishlist" ? "page" : undefined}>
            Wish list
          </Link>
          <a className={s.link} href={site.links.github}>GitHub ↗</a>

          <div className={s.a11yWrap} ref={wrapRef}>
            <button
              type="button"
              className={s.a11yBtn}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((v) => !v)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="4.5" r="1.8" />
                <path d="M5 8.5l7 1.5 7-1.5M12 10v5M12 15l-3 6M12 15l3 6" />
              </svg>
              Accessibility
            </button>
            {open && (
              <div id={panelId} role="group" aria-label="Accessibility settings" className={s.panel}>
                <span className={`mono-label ${s.panelLabel}`}>Make this site work for you</span>
                <Toggle label="Reduce motion" on={calm} onChange={setCalm} />
                <Toggle label="High contrast" on={contrast} onChange={setContrast} />
              </div>
            )}
          </div>

          <a className="pill pill--berry" href={site.links.resume}>Résumé ↓</a>
        </nav>
      </div>

      {home && (
        <div className={s.currently}>
          <div className={s.currentlyRow}>
            <span className={`${s.currentlyLabel} mono-label`}>
              <span className={s.blink} aria-hidden="true" />
              Currently
            </span>
            {site.currently.map((c) => (
              <span key={c.label}>
                <span style={{ color: palette[c.color].ink }}>{c.label} ·</span> {c.text}
              </span>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" className={s.toggle} aria-pressed={on} onClick={() => onChange(!on)}>
      {label}
      <span className={s.track} data-on={on}>
        <span className={s.knob} />
      </span>
    </button>
  );
}
