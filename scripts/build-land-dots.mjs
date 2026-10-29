// Precomputes the dotted-land grid for the globe from Natural Earth (world-atlas),
// so the browser never has to run point-in-polygon tests.
// Usage: node scripts/build-land-dots.mjs   (writes data/land-dots.json)
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { geoContains } from "d3-geo";
import { feature } from "topojson-client";

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const topo = JSON.parse(readFileSync(require.resolve("world-atlas/land-110m.json"), "utf8"));
const land = feature(topo, topo.objects.land);

const STEP = 2.2; // degrees between rows
const dots = [];
let row = 0;
for (let lat = -84; lat <= 84; lat += STEP) {
  const step = STEP / Math.max(Math.cos((lat * Math.PI) / 180), 0.2);
  const offset = (row++ % 2) * (step / 2);
  for (let lon = -180 + offset; lon < 180; lon += step) {
    if (geoContains(land, [lon, lat])) dots.push([Math.round(lon * 100) / 100, Math.round(lat * 100) / 100]);
  }
}

writeFileSync(join(here, "../data/land-dots.json"), JSON.stringify(dots));
console.log(`Wrote data/land-dots.json with ${dots.length} dots`);
