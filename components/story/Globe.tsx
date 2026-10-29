"use client";

import { memo, useId, useMemo } from "react";
import { geoInterpolate } from "d3-geo";
import landDots from "@/data/land-dots.json";
import { chapters, jobPins, type LonLat } from "@/data/site";
import { storyLegs, worldTour } from "@/data/story-routes";
import { palette, ink, paper } from "@/lib/colors";
import { circlesPath, clamp01, easeInOutCubic, graticule, legLine, lerpView, makeView } from "@/lib/globe";
import s from "./Story.module.css";

type Props = {
  /** Raw scroll progress (linear), used to time the polaroids. */
  p: number;
  /** Visitor asked for less motion: polaroids only fade. */
  calm: boolean;
  /** Eased story progress, 0 (Boston) … 5 (Open to work). */
  q: number;
  /** Explore-mode amount, 0 … 1. */
  ex: number;
  /** Extra rotation from dragging, in degrees. */
  offset: LonLat;
  dragging: boolean;
  /** World-tour progress for chapter 4, 0 … 1. */
  tp: number;
};

const dots = landDots as unknown as LonLat[];

function GlobeImpl({ p, calm, q, ex, offset, dragging, tp }: Props) {
  const hatchId = useId().replace(/:/g, "");

  const g = useMemo(() => {
    // World tour (chapter 4): which hop we're on and where the traveler is right now.
    const hops = worldTour.length - 1;
    const hopPos = tp * hops;
    const hop = Math.min(hops - 1, Math.floor(hopPos));
    const travel = easeInOutCubic(clamp01((hopPos - hop) / 0.75)); // last 25% of each hop = pause at the stop
    const head = geoInterpolate(worldTour[hop].at, worldTour[hop + 1].at)(tp >= 1 ? 1 : travel) as LonLat;
    const tourCenter: LonLat = [head[0], Math.max(-30, Math.min(40, head[1]))];
    const viewOf = (i: number): LonLat => (i === 3 ? tourCenter : chapters[i].view);

    const qi = Math.min(chapters.length - 2, Math.floor(q));
    const base = lerpView(viewOf(qi), viewOf(qi + 1), q - qi);
    const center: LonLat = [base[0] + offset[0] * ex, Math.max(-80, Math.min(80, base[1] + offset[1] * ex))];
    const view = makeView(center);
    const near = (c: number) => clamp01(1 - Math.abs(q - c) * 1.6);
    const job = clamp01((q - 4.4) / 0.6);

    // Land: three depth buckets so the globe reads as round.
    const buckets: { x: number; y: number; r: number }[][] = [[], [], []];
    for (const d of dots) {
      const pt = view.project(d);
      if (pt.z <= 0.02) continue;
      const r = 1.1 + 1.6 * Math.sqrt(pt.z); 
      buckets[pt.z > 0.66 ? 2 : pt.z > 0.33 ? 1 : 0].push({ x: pt.x, y: pt.y, r });
    }

    const legs = storyLegs.flatMap((leg) => {
      const f = clamp01(q - leg.chapter);
      if (f <= 0) return [];
      const pts = legLine(leg.from, leg.to, f);
      const head = view.project(pts[pts.length - 1]);
      return [{ d: view.path({ type: "LineString", coordinates: pts }) ?? "", color: palette[leg.color].fill, head, showHead: f < 1 && head.z > 0 }];
    });

    // Purple world-tour hops: finished hops are drawn in full, the current one grows.
    const tourLegs: typeof legs = [];
    if (tp > 0) {
      for (let k = 0; k <= hop; k++) {
        const f = k < hop || tp >= 1 ? 1 : travel;
        if (f <= 0) continue;
        const pts = legLine(worldTour[k].at, worldTour[k + 1].at, f);
        const h = view.project(pts[pts.length - 1]);
        tourLegs.push({ d: view.path({ type: "LineString", coordinates: pts }) ?? "", color: palette.world.fill, head: h, showHead: f < 1 && h.z > 0 });
      }
    }
    const tourStops = tp > 0 && tp < 1
      ? worldTour.slice(1, hop + (travel >= 1 ? 2 : 1)).flatMap((st, i) => {
          const pt = view.project(st.at);
          return pt.z > 0.05 ? [{ key: `${st.name}-${i}`, x: pt.x, y: pt.y }] : [];
        })
      : [];

    type Pin = { key: string; x: number; y: number; r: number; color: string; ring: number; ringR: number; label: string; labelO: number; o: number; delay?: number };
    const pins: Pin[] = [];
    // Job-search cities: no labels, they pop in one by one and twinkle at their own pace.
    if (job > 0) {
      jobPins.forEach((j, i) => {
        const p = view.project(j.at);
        if (p.z <= 0.05) return;
        pins.push({ key: j.name, x: p.x, y: p.y, r: 5, color: palette.open.fill, ring: 0.45, ringR: 12, label: "", labelO: 0, o: job, delay: i });
      });
    }
    chapters.forEach((ch, i) => {
      if (!ch.place) return;
      const p = view.project(ch.place.at);
      if (p.z <= 0.05) return;
      const reached = clamp01((q - i + 0.6) / 0.4);
      if (reached <= 0) return;
      const big = ch.place.name === "Boston" || ch.place.name === "New York" ? job : 0;
      const act = near(i);
      pins.push({
        key: ch.place.name,
        x: p.x,
        y: p.y,
        r: 5 + 3 * act + 6 * big,
        color: big > 0.5 ? palette.open.fill : palette[ch.color].fill,
        ring: Math.max(act, big),
        ringR: 16 + 14 * big,
        label: ch.place.name,
        labelO: Math.max(act, big, ex),
        o: reached,
      });
    });

    // Keep labels from piling on top of each other: home places win, then job cities.
    const kept: { x0: number; x1: number; y0: number; y1: number }[] = [];
    const order = [...pins].sort((a, b) => b.r - a.r);
    for (const p of order) {
      if (p.labelO <= 0.01) continue;
      const x0 = p.x + p.r + 10;
      const box = { x0, x1: x0 + p.label.length * 10.4, y0: p.y - 12, y1: p.y + 10 };
      const hit = kept.some((k) => box.x0 < k.x1 && box.x1 > k.x0 && box.y0 < k.y1 && box.y1 > k.y0);
      if (hit) p.labelO = 0;
      else kept.push(box);
    }

    // Polaroids: one per chapter while you're on it, plus the nearest home in explore mode.
    const photos: { key: string; x: number; y: number; rot: number; scale?: number; o: number; caption: string; sub: string; src?: string; tape: string; capInk: string }[] = [];
    const place = (at: LonLat | undefined) => {
      if (!at) return { x: 110, y: 560 }; // no pin (the world tour): lower left, out of the route's way
      const p = view.project(at);
      if (p.z <= 0) return null;
      return { x: Math.max(60, Math.min(560, p.x - 300)), y: Math.max(40, Math.min(560, p.y - 330)) };
    };
    chapters.forEach((ch, i) => {
      if (!ch.photo) return;
      // Timed on raw scroll: the old photo lifts away as the globe starts turning,
      // the new one is set down once the globe has nearly arrived.
      const t = p - i;
      const enter = clamp01((t + 0.4) / 0.3);
      const leave = clamp01((t - 0.3) / 0.2);
      const o = enter * (1 - leave);
      if (o <= 0.01) return;
      const pos = place(ch.photo.at ?? ch.place?.at);
      if (!pos) return;
      const e = 1 - Math.pow(1 - enter, 3); // ease-out: settles gently
      const dy = calm ? 0 : -36 * (1 - e) - 28 * leave;
      const tilt = calm ? 0 : 6 * (1 - e) - 3 * leave;
      const scale = calm ? 1 : 1.05 - 0.05 * e;
      photos.push({ key: ch.num, x: pos.x, y: pos.y + dy, rot: ch.photo.rotate + tilt, scale, o, caption: ch.photo.caption, sub: ch.photo.sub, src: ch.photo.src, tape: palette[ch.color].fill, capInk: palette[ch.color].ink });
    });
    if (ex >= 1 && !dragging) {
      let best: { i: number; z: number } | null = null;
      chapters.forEach((ch, i) => {
        if (!ch.place || !ch.photo) return;
        const z = view.project(ch.place.at).z;
        if (!best || z > best.z) best = { i, z };
      });
      const b = best as { i: number; z: number } | null;
      if (b && b.z > 0.8) {
        const ch = chapters[b.i];
        const pos = place(ch.place!.at);
        if (pos && ch.photo) photos.push({ key: `explore-${ch.num}`, x: pos.x, y: pos.y, rot: ch.photo.rotate, o: clamp01((b.z - 0.8) / 0.1), caption: ch.photo.caption, sub: ch.photo.sub, src: ch.photo.src, tape: palette[ch.color].fill, capInk: palette[ch.color].ink });
      }
    }

    return {
      graticule: view.path(graticule) ?? "",
      land: buckets.map((b) => circlesPath(b)),
      legs: [...legs, ...tourLegs],
      tourStops,
      // The colored story routes stay visible all the way through "Open to work".
      legsO: 1,
      pins,
      photos,
    };
  }, [p, calm, q, ex, offset, dragging, tp]);

  return (
    <svg viewBox="0 0 1000 1000" width="100%" height="100%" className={s.globeSvg} aria-hidden="true">
      <defs>
        <pattern id={hatchId} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" stroke={ink} strokeOpacity="0.12" strokeWidth="3" />
        </pattern>
      </defs>
      <circle cx="500" cy="500" r="470" fill="#EFE8DA" stroke={ink} strokeOpacity="0.3" strokeWidth="1.2" />
      <path d={g.graticule} fill="none" stroke={ink} strokeOpacity="0.14" strokeWidth="1" />
      <path d={g.land[0]} fill={ink} fillOpacity="0.32" />
      <path d={g.land[1]} fill={ink} fillOpacity="0.5" />
      <path d={g.land[2]} fill={ink} fillOpacity="0.7" />

      {g.legsO > 0.01 && (
        <g style={{ opacity: g.legsO }}>
          {g.legs.map((l, i) => (
            <g key={i}>
              <path d={l.d} fill="none" stroke={l.color} strokeWidth="3" strokeDasharray="8 7" strokeLinecap="round" />
              {l.showHead && <circle cx={l.head.x} cy={l.head.y} r="6" fill={l.color} />}
            </g>
          ))}
        </g>
      )}

      {g.tourStops.map((t) => (
        <circle key={t.key} cx={t.x} cy={t.y} r="4.5" fill={palette.world.fill} stroke={paper} strokeWidth="1.5" />
      ))}

      {g.pins.map((p) => (
        <g key={p.key} style={{ opacity: p.o }}>
          {p.delay !== undefined ? (
            // Job pin: pops in on its own beat, then twinkles at an uneven rhythm.
            <g className={s.pop} style={{ animationDelay: `${p.delay * 0.22}s` }}>
              <circle className={s.pulse} cx={p.x} cy={p.y} r={p.ringR} fill="none" stroke={p.color} strokeWidth="2" style={{ opacity: p.ring, animationDelay: `${(p.delay * 0.83) % 2.6}s`, animationDuration: `${2.6 + (p.delay % 3) * 0.9}s` }} />
              <circle className={s.twinkle} cx={p.x} cy={p.y} r={p.r} fill={p.color} stroke={paper} strokeWidth="2" style={{ animationDelay: `${(p.delay * 1.37) % 4}s`, animationDuration: `${3.4 + (p.delay % 4) * 0.8}s` }} />
            </g>
          ) : (
            <>
              {p.ring > 0.01 && <circle className={s.pulse} cx={p.x} cy={p.y} r={p.ringR} fill="none" stroke={p.color} strokeWidth="2" style={{ opacity: p.ring }} />}
              <circle cx={p.x} cy={p.y} r={p.r} fill={p.color} stroke={paper} strokeWidth="2" />
            </>
          )}
          {p.labelO > 0.01 && (
            <text x={p.x + p.r + 12} y={p.y + 6} className={s.pinLabel} style={{ opacity: p.labelO }}>
              {p.label}
            </text>
          )}
        </g>
      ))}

      {g.photos.map((ph) => (
        <g key={ph.key} transform={`translate(${(ph.x + 115).toFixed(1)} ${(ph.y + 134).toFixed(1)}) rotate(${ph.rot.toFixed(2)}) scale(${(ph.scale ?? 1).toFixed(3)}) translate(-115 -134)`} style={{ opacity: ph.o }}>
          <rect x="6" y="8" width="230" height="268" fill={ink} fillOpacity="0.07" />
          <rect x="0" y="0" width="230" height="268" fill="#FFFDF8" stroke={ink} strokeOpacity="0.18" />
          {ph.src ? (
            <image href={ph.src} x="12" y="12" width="206" height="196" preserveAspectRatio="xMidYMid slice" />
          ) : (
            <>
              <rect x="12" y="12" width="206" height="196" fill="#E8E1D2" />
              <rect x="12" y="12" width="206" height="196" fill={`url(#${hatchId})`} />
            </>
          )}
          <rect x="80" y="-12" width="70" height="24" fill={ph.tape} fillOpacity="0.85" transform="rotate(-3 115 0)" />
          <text x="115" y="236" textAnchor="middle" className={s.photoCap} fill={ph.capInk}>
            {ph.caption}
          </text>
          <text x="115" y="255" textAnchor="middle" className={s.photoSub}>
            {ph.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}

export const Globe = memo(GlobeImpl);
