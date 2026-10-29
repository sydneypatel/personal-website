// Turns a Flighty CSV export into the routes + stats the globe uses.
// Usage: npm run flights            (reads data/private/flighty-export.csv)
//        node scripts/flighty-to-routes.mjs path/to/export.csv
//
// Only aggregate data is written to data/flights.json (airports, unique routes,
// totals). Dates, flight numbers and seats stay in the private CSV, which is gitignored.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const csvPath = process.argv[2] ?? join(here, "../data/private/flighty-export.csv");
const airports = JSON.parse(readFileSync(join(here, "airports.json"), "utf8"));

// Minimal CSV parser that handles quoted fields.
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((v) => v !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows;
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

const toRad = (d) => (d * Math.PI) / 180;
function miles(a, b) {
  const [lo1, la1] = airports[a].coords.map(toRad);
  const [lo2, la2] = airports[b].coords.map(toRad);
  const c = Math.sin(la1) * Math.sin(la2) + Math.cos(la1) * Math.cos(la2) * Math.cos(lo1 - lo2);
  return Math.acos(Math.min(1, Math.max(-1, c))) * 3958.8;
}

const flights = parseCsv(readFileSync(csvPath, "utf8")).filter(
  (f) => f.Date && f.Canceled !== "true",
);

const missing = new Set();
for (const f of flights) for (const code of [f.From, f.To]) if (!airports[code]) missing.add(code);
if (missing.size) {
  console.error(`Add these airports to scripts/airports.json: ${[...missing].join(", ")}`);
  process.exit(1);
}

const routeKeys = new Set();
const used = new Set();
const countries = new Set();
let totalMiles = 0;
for (const f of flights) {
  totalMiles += miles(f.From, f.To);
  used.add(f.From); used.add(f.To);
  countries.add(airports[f.From].country); countries.add(airports[f.To].country);
  routeKeys.add([f.From, f.To].sort().join("-"));
}

const dates = flights.map((f) => f.Date).sort();
const out = {
  stats: {
    flights: flights.length,
    miles: Math.round(totalMiles),
    timesAroundEarth: Math.round((totalMiles / 24901) * 10) / 10,
    airports: used.size,
    countries: countries.size,
    from: dates[0].slice(0, 7),
    to: dates[dates.length - 1].slice(0, 7),
  },
  airports: Object.fromEntries([...used].sort().map((c) => [c, airports[c].coords])),
  routes: [...routeKeys].map((k) => k.split("-")),
};

writeFileSync(join(here, "../data/flights.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote data/flights.json: ${out.stats.flights} flights, ${out.routes.length} routes, ${out.stats.miles.toLocaleString()} mi`);
