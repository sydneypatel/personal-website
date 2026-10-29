import { geoGraticule10, geoInterpolate, geoOrthographic, geoPath, type GeoPath, type GeoProjection } from "d3-geo";
import type { LonLat } from "@/data/site";

export const SIZE = 1000;
export const R = 470;
const C = SIZE / 2;
const D = Math.PI / 180;

export type Projected = { x: number; y: number; z: number };

export type View = {
  /** Fast orthographic projection; z > 0 means the point faces the viewer. */
  project: (p: LonLat) => Projected;
  path: GeoPath;
  projection: GeoProjection;
};

export function makeView(center: LonLat): View {
  const [l0, p0] = [center[0] * D, center[1] * D];
  const sp = Math.sin(p0);
  const cp = Math.cos(p0);
  const projection = geoOrthographic()
    .scale(R)
    .translate([C, C])
    .clipAngle(90)
    .rotate([-center[0], -center[1]])
    .precision(0.5);
  return {
    projection,
    path: geoPath(projection),
    project: ([lon, lat]) => {
      const dl = lon * D - l0;
      const cl = Math.cos(lat * D);
      const sl = Math.sin(lat * D);
      const cd = Math.cos(dl);
      return {
        x: C + R * cl * Math.sin(dl),
        y: C - R * (cp * sl - sp * cl * cd),
        z: sp * sl + cp * cl * cd,
      };
    },
  };
}

/** Shortest-way interpolation between two globe views (handles the date line). */
export function lerpView(a: LonLat, b: LonLat, t: number): LonLat {
  const dl = ((b[0] - a[0] + 540) % 360) - 180;
  return [a[0] + dl * t, a[1] + (b[1] - a[1]) * t];
}

export const graticule = geoGraticule10();

/** A great-circle leg from a to b, drawn up to fraction f (0..1). */
export function legLine(a: LonLat, b: LonLat, f: number, samples = 48): LonLat[] {
  const interp = geoInterpolate(a, b);
  const pts: LonLat[] = [];
  const n = Math.max(2, Math.round(samples * f));
  for (let i = 0; i <= n; i++) pts.push(interp((i / n) * f) as LonLat);
  return pts;
}

/** Many small circles in one path string — far cheaper than thousands of <circle>s. */
export function circlesPath(points: { x: number; y: number; r: number }[]): string {
  let d = "";
  for (const { x, y, r } of points) {
    d += `M${(x - r).toFixed(1)} ${y.toFixed(1)}a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(2 * r).toFixed(2)} 0a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-2 * r).toFixed(2)} 0`;
  }
  return d;
}

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
