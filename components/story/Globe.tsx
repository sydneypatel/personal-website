"use client";

import { memo, useId, useMemo } from "react";
import landDots from "@/data/land-dots.json";
import flights from "@/data/flights.json";
import { chapters, jobPins, storyLegs, type LonLat } from "@/data/site";
import { wishlist } from "@/data/wishlist";
import { palette, ink, paper } from "@/lib/colors";
import { circlesPath, clamp01, graticule, legLine, lerpView, makeView } from "@/lib/globe";
import s from "./Story.module.css";

type Props = {
  /** Eased story progress, 0 (Boston) … 5 (Open to work). */
  q: number;
  /** Explore-mode amount, 0 … 1. */
  ex: number;
  /** Extra rotation from dragging, in degrees. */
  offset: LonLat;
  dragging: boolean;
};

const dots = landDots as unknown as LonLat[];
const airports = flights.airports as unknown as Record<string, LonLat>;
const routes = flights.routes as unknown as [string, string][];

function GlobeImpl({ q, ex, offset, dragging }: Props) {
  const hatchId = useId().replace(/:/g, "");

  const g = useMemo(() => {
    const qi = Math.min(chapters.length - 2, Math.floor(q));
    const base = lerpView(chapters[qi].view, chapters[qi + 1].view, q - qi);
    const center: LonLat = [base[0] + offset[0] * ex, Math.max(-80, Math.min(80, base[1] + offset[1] * ex))];
    const view = makeView(center);
    const near = (c: number) => clamp01(1 - Math.abs(q - c) * 1.6);
    const job = clamp01((q - 4.4) / 0.6);

    // Land: three depth buckets so the globe reads as round.
    const buckets: { x: number; y: number; r: number }[][] = [[], [], []];
    for (const d of dots) {
      const p = view.project(d);
      if (p.z <= 0.02) continue;
      const r = 1.3 + 1.9 * Math.sqrt(p.z);
      buckets[p.z > 0.66 ? 2 : p.z > 0.33 ? 1 : 0].push({ x: p.x, y: p.y, r });
    }

    // Every real flight from Flighty, shown once the globe is explorable.
    let flightPath = "";
    const airportDots: { x: number; y: number; r: number }[] = [];
    if (ex > 0) {
      flightPath =
        view.path({
          type: "MultiLineString",
          coordinates: routes.map(([a, b]) => legLine(airports[a], airports[b], 1, 24)),
        }) ?? "";
      for (const code in airports) {
        const p = view.project(airports[code]);
        if (p.z > 0.05) airportDots.push({ x: p.x, y: p.y, r: 3 });
      }
    }

    const legs = storyLegs.flatMap((leg) => {
      const f = clamp01(q - leg.chapter);
      if (f <= 0) return [];
      const pts = legLine(leg.from, leg.to, f);
      const head = view.project(pts[pts.length - 1]);
      return [{ d: view.path({ type: "LineString", coordinates: pts }) ?? "", color: palette[leg.color].fill, head, showHead: f < 1 && head.z > 0 }];
    });

    const pins: { key: string; x: number; y: number; r: number; color: string; ring: number; ringR: number; label: string; labelO: number; o: number }[] = [];
    if (job > 0) {
      for (const j of jobPins) {
        const p = view.project(j.at);
        if (p.z <= 0.05) continue;
        pins.push({ key: j.name, x: p.x, y: p.y, r: 5, color: palette.open.fill, ring: job * 0.5, ringR: 12, label: j.name, labelO: ex * clamp01((p.z - 0.3) / 0.3), o: job });
      }
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

    const dreams = ex > 0
      ? wishlist.flatMap((w) => {
          const p = view.project(w.at);
          return p.z > 0.05 ? [{ key: w.name, x: p.x, y: p.y, label: `${w.name} ?`, o: ex * clamp01((p.z - 0.05) / 0.25) }] : [];
        })
      : [];

    // Polaroids: one per chapter while you're on it, plus the nearest home in explore mode.
    const photos: { key: string; x: number; y: number; rot: number; o: number; caption: string; sub: string; src?: string; tape: string; capInk: string }[] = [];
    const place = (at: LonLat | undefined) => {
      if (!at) return { x: 150, y: 170 };
      const p = view.project(at);
      if (p.z <= 0) return null;
      return { x: Math.max(60, Math.min(560, p.x - 300)), y: Math.max(40, Math.min(560, p.y - 330)) };
    };
    chapters.forEach((ch, i) => {
      if (!ch.photo) return;
      const o = clamp01(1 - Math.abs(q - i) * 2.2);
      if (o <= 0.01) return;
      const pos = place(ch.photo.at ?? ch.place?.at);
      if (!pos) return;
      photos.push({ key: ch.num, x: pos.x, y: pos.y + (1 - o) * 24, rot: ch.photo.rotate, o, caption: ch.photo.caption, sub: ch.photo.sub, src: ch.photo.src, tape: palette[ch.color].fill, capInk: palette[ch.color].ink });
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
      flightPath,
      airportPath: circlesPath(airportDots),
      legs,
      pins,
      dreams,
      photos,
    };
  }, [q, ex, offset, dragging]);

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

      {ex > 0 && (
        <g style={{ opacity: ex }}>
          <path d={g.flightPath} fill="none" stroke={ink} strokeOpacity="0.32" strokeWidth="1.3" strokeLinecap="round" />
          <path d={g.airportPath} fill={ink} fillOpacity="0.55" />
        </g>
      )}

      {g.legs.map((l, i) => (
        <g key={i}>
          <path d={l.d} fill="none" stroke={l.color} strokeWidth="3" strokeDasharray="8 7" strokeLinecap="round" />
          {l.showHead && <circle cx={l.head.x} cy={l.head.y} r="6" fill={l.color} />}
        </g>
      ))}

      {g.pins.map((p) => (
        <g key={p.key} style={{ opacity: p.o }}>
          {p.ring > 0.01 && <circle className={s.pulse} cx={p.x} cy={p.y} r={p.ringR} fill="none" stroke={p.color} strokeWidth="2" style={{ opacity: p.ring }} />}
          <circle cx={p.x} cy={p.y} r={p.r} fill={p.color} stroke={paper} strokeWidth="2" />
          {p.labelO > 0.01 && (
            <text x={p.x + p.r + 12} y={p.y + 6} className={s.pinLabel} style={{ opacity: p.labelO }}>
              {p.label}
            </text>
          )}
        </g>
      ))}

      {g.dreams.map((d) => (
        <g key={d.key} style={{ opacity: d.o }}>
          <circle cx={d.x} cy={d.y} r="8" fill={paper} stroke={ink} strokeWidth="2" strokeDasharray="3 3" />
          <text x={d.x + 14} y={d.y + 5} className={`${s.pinLabel} ${s.dreamLabel}`}>
            {d.label}
          </text>
        </g>
      ))}

      {g.photos.map((ph) => (
        <g key={ph.key} transform={`translate(${ph.x.toFixed(1)} ${ph.y.toFixed(1)}) rotate(${ph.rot})`} style={{ opacity: ph.o }}>
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
