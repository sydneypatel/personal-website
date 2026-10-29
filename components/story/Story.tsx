"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { chapters, site, type LonLat } from "@/data/site";
import { palette } from "@/lib/colors";
import { newTab } from "@/lib/links";
import { clamp01, easeInOutCubic, smooth } from "@/lib/globe";
import { useA11y } from "../A11yProvider";
import { Globe } from "./Globe";
import s from "./Story.module.css";

const LAST = chapters.length - 1; // 5
const EXPLORE_AT = LAST - 0.2;
const GLIDE_MS = 2600; // one chapter of auto-tour travel
const DWELL_MS = 4200; // time to read each chapter

export function Story() {
  const { calm } = useA11y();
  const sectionRef = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  const [offset, setOffset] = useState<LonLat>([0, 0]);
  const [dragging, setDragging] = useState(false);
  const [touring, setTouring] = useState(false);

  const live = useRef({ calm, dragging, touring, p, lastTouch: 0, offset });
  live.current = { ...live.current, calm, dragging, touring, p, offset };

  // Scroll → progress (0 … 5), one chapter per viewport height.
  const sectionTop = useCallback(() => {
    const el = sectionRef.current;
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  }, []);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const np = Math.max(0, Math.min(LAST, (window.scrollY - sectionTop()) / window.innerHeight));
      setP((cur) => (Math.abs(cur - np) > 0.002 ? np : cur));
      if (np < EXPLORE_AT) setOffset((o) => (o[0] || o[1] ? [0, 0] : o));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [sectionTop]);

  // Eased progress: the globe holds still on each chapter and turns between them.
  const i0 = Math.min(LAST - 1, Math.floor(p));
  const t = clamp01((p - i0 - 0.25) / 0.5);
  const q = i0 + smooth(t);
  const active = Math.round(q);
  const ex = clamp01((p - EXPLORE_AT) / 0.2);

  // ---------- Auto tour ----------
  const tour = useRef({ raf: 0, timer: 0 as unknown as ReturnType<typeof setTimeout> });

  const stopTour = useCallback(() => {
    cancelAnimationFrame(tour.current.raf);
    clearTimeout(tour.current.timer);
    setTouring(false);
  }, []);

  const glideTo = useCallback((y: number, ms: number, done: () => void) => {
    const from = window.scrollY;
    if (ms <= 0) {
      window.scrollTo(0, y);
      done();
      return;
    }
    let t0 = 0;
    const frame = (now: number) => {
      if (!live.current.touring) return;
      if (!t0) t0 = now;
      const k = Math.min(1, (now - t0) / ms);
      window.scrollTo(0, from + (y - from) * easeInOutCubic(k));
      if (k < 1) tour.current.raf = requestAnimationFrame(frame);
      else done();
    };
    tour.current.raf = requestAnimationFrame(frame);
  }, []);

  const startTour = useCallback(() => {
    if (live.current.touring) return stopTour();
    setTouring(true);
    live.current.touring = true;
    const step = (i: number) => {
      if (!live.current.touring) return;
      if (i > LAST) return stopTour();
      glideTo(sectionTop() + i * window.innerHeight, live.current.calm ? 0 : GLIDE_MS, () => {
        tour.current.timer = setTimeout(() => step(i + 1), i === LAST ? 1500 : DWELL_MS);
      });
    };
    step(Math.min(LAST, Math.round(live.current.p) + 1));
  }, [glideTo, sectionTop, stopTour]);

  // Any input from the visitor hands control back to them.
  useEffect(() => {
    if (!touring) return;
    const stop = (e: Event) => {
      if (e instanceof KeyboardEvent && ["Tab", "Shift"].includes(e.key)) return;
      stopTour();
    };
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", stop);
    return () => {
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };
  }, [touring, stopTour]);

  useEffect(() => () => stopTour(), [stopTour]);

  const goTo = (i: number) => {
    stopTour();
    window.scrollTo({ top: sectionTop() + i * window.innerHeight, behavior: calm ? "auto" : "smooth" });
  };

  // ---------- Explore mode: drag + gentle auto-spin ----------
  const drag = useRef<{ x: number; y: number; o: LonLat; k: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const w = e.currentTarget.getBoundingClientRect().width || 600;
    drag.current = { x: e.clientX, y: e.clientY, o: offset, k: 200 / w };
    live.current.lastTouch = performance.now();
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    live.current.lastTouch = performance.now();
    setOffset([d.o[0] - (e.clientX - d.x) * d.k, Math.max(-75, Math.min(45, d.o[1] + (e.clientY - d.y) * d.k))]);
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    live.current.lastTouch = performance.now();
    setDragging(false);
  };
  const nudge = (deg: number) => {
    live.current.lastTouch = performance.now();
    setOffset((o) => [o[0] + deg, o[1]]);
  };

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const l = live.current;
      if (!l.calm && !l.dragging && l.p >= LAST - 0.02 && performance.now() - l.lastTouch > 2500) {
        setOffset((o) => [o[0] - 0.08, o[1]]);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const current = chapters[Math.max(0, Math.min(LAST, active))];
  const hintVisible = touring || p < 0.3;

  return (
    <section id="itinerary" ref={sectionRef} className={s.section} aria-label="My story so far">
      <div className={s.stage}>
        <div className={s.globeWrap}>
          <Globe p={p} calm={calm} q={q} ex={ex} offset={offset} dragging={dragging} />
          <div
            className={s.hit}
            style={{ pointerEvents: ex >= 1 ? "auto" : "none", cursor: dragging ? "grabbing" : "grab" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          />
        </div>

        <div className={s.copy}>
          <div className={`${s.strip} mono-label`}>
            <span>Est. Boston, MA</span>
            <span>Now: New York, NY</span>
            <span>{site.tagline}</span>
          </div>
          <h1 className={s.name}>
            {site.name}
            <span style={{ color: palette[current.color].fill }} className={s.period}>.</span>
          </h1>
          <div className={s.underName}>
            <div className={s.bar} aria-hidden="true" style={{ width: 90 + active * 34, background: palette[current.color].fill }} />
            <button
              type="button"
              className={s.tourBtn}
              onClick={startTour}
              aria-pressed={touring}
              style={{ opacity: hintVisible ? 1 : 0, pointerEvents: hintVisible ? "auto" : "none" }}
              tabIndex={hintVisible ? 0 : -1}
            >
              {touring ? "Stop the tour" : "Scroll or click to travel"}{" "}
              <span className={touring ? undefined : s.nudge} aria-hidden="true">
                {touring ? "×" : "↓"}
              </span>
            </button>
          </div>

          <div className={s.facts} aria-live="polite">
            {chapters.map((ch, i) => {
              const d = q - i;
              const o = clamp01(1 - Math.abs(d) * 1.8);
              const ink = palette[ch.color].ink;
              return (
                <div
                  key={ch.num}
                  className={s.fact}
                  style={{ opacity: o, transform: calm ? undefined : `translateY(${(-d * 28).toFixed(1)}px)`, pointerEvents: o > 0.5 ? "auto" : "none" }}
                  aria-hidden={o < 0.5}
                >
                  <p className={`${s.kicker} mono-label`} style={{ color: ink }}>
                    {ch.num} — {ch.kicker}
                  </p>
                  <p className={s.headline}>
                    {ch.headline[0]}
                    <span style={{ boxShadow: `inset 0 -0.34em 0 ${palette[ch.color].fill}55` }}>{ch.headline[1]}</span>
                    {ch.headline[2]}
                  </p>
                  <p className={s.body}>{ch.body}</p>
                  {i === LAST && (
                    <div className={s.ctas}>
                      <a href="#flightlog" className="pill pill--berry" tabIndex={o > 0.5 ? 0 : -1}>See the flight log ↓</a>
                      <a href={site.links.resume} {...newTab(site.links.resume)} className="pill" tabIndex={o > 0.5 ? 0 : -1}>Résumé (PDF)</a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className={s.explore} style={{ opacity: ex, pointerEvents: ex >= 1 ? "auto" : "none", transform: `translateY(${((1 - ex) * 16).toFixed(1)}px)` }}>
          <span className="mono-label">{dragging ? "Exploring…" : "Drag the globe to explore"}</span>
          <button type="button" onClick={() => nudge(-30)} aria-label="Rotate globe west" tabIndex={ex >= 1 ? 0 : -1}>←</button>
          <button type="button" onClick={() => nudge(30)} aria-label="Rotate globe east" tabIndex={ex >= 1 ? 0 : -1}>→</button>
          <button type="button" className={s.reset} onClick={() => setOffset([0, 0])} tabIndex={ex >= 1 ? 0 : -1}>Reset</button>
        </div>

        <nav className={s.chapnav} aria-label="Story chapters">
          {chapters.map((ch, i) => (
            <button key={ch.num} type="button" onClick={() => goTo(i)} aria-current={active === i ? "step" : undefined} className={s.chap}>
              <span className={s.chapBar} style={{ width: active === i ? 30 : 8, background: palette[ch.color].fill }} />
              {ch.num}
              <span className={s.chapLabel}> {ch.nav}</span>
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
