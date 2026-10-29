import Link from "next/link";
import flights from "@/data/flights.json";
import { projects, route } from "@/data/projects";
import { site } from "@/data/site";
import { palette } from "@/lib/colors";
import { newTab } from "@/lib/links";
import s from "./sections.module.css";

export function Postcards() {
  return (
    <section id="postcards" className={s.section}>
      <div className="container">
        <p className="mono-label" style={{ color: palette.boston.ink, margin: "0 0 12px" }}>Postcards</p>
        <h2 className={s.h2}>Things I&apos;ve built</h2>
        <p className={s.lede}>Souvenirs from the trip so far. Apps I&apos;ve shipped solo, and projects built with teams.</p>
        <div className={s.currently}>
          <span className={`mono-label ${s.currentlyLabel}`}>
            <span className={s.blink} aria-hidden="true" />
            Currently
          </span>
          <ul className={s.currentlyList}>
            {site.currently.map((c) => (
              <li key={c.label}>
                <span className="mono-label" style={{ color: palette[c.color].ink }}>{c.label}</span>
                <span>{c.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={s.cards}>
          {projects.map((p) => (
            <article key={p.name} className={s.card}>
              <div className={s.cardTop}>
                <span className={s.tag}>{p.tag}</span>
                <span className={s.stamp} style={{ background: palette[p.stamp].fill, outlineColor: palette[p.stamp].fill, color: palette[p.stamp].on }}>
                  No. {p.no}
                </span>
              </div>
              <h3 className={s.cardTitle}>{p.name}</h3>
              <p className={s.cardBody}>{p.blurb}</p>
              <div className={s.cardLinks}>
                {p.links.map((l) => (
                  <a key={l.label} href={l.href} {...newTab(l.href)}>{l.label}</a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Flight totals from Flighty. Lives on the Travels page. */
export function FlightStats() {
  const st = flights.stats;
  const month = (ym: string) => new Date(`${ym}-15`).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  const stats = [
    { n: st.flights.toLocaleString(), label: "Flights", color: palette.boston.ink },
    { n: st.miles.toLocaleString(), label: `Miles · ${st.timesAroundEarth}× around Earth`, color: palette.nashville.ink },
    { n: String(st.airports), label: "Airports", color: palette.australia.ink },
    { n: String(st.countries), label: "Countries & territories", color: palette.nyc.ink },
  ];
  return (
    <div className={s.statsWrap}>
      <div className={s.stats}>
        {stats.map((x) => (
          <div key={x.label}>
            <div className={s.statN} style={{ color: x.color }}>{x.n}</div>
            <div className={`mono-label ${s.statLabel}`}>{x.label}</div>
          </div>
        ))}
      </div>
      <p className={s.statNote}>
        Logged in Flighty, {month(st.from)} – {month(st.to)}. Every route is drawn on the globe on the home page.
      </p>
    </div>
  );
}

export function FlightLog() {
  return (
    <section id="flightlog" className={`${s.section} ${s.deep}`}>
      <div className="container">
        <div className={s.logHead}>
          <div>
            <p className="mono-label" style={{ color: palette.nyc.ink, margin: "0 0 12px" }}>Flight log</p>
            <h2 className={s.h2}>My résumé, by route</h2>
            <p className={s.lede} style={{ margin: 0 }}>Every stop, every role, in the order I flew it.</p>
          </div>
          <a href={site.links.resume} className="pill pill--ink" {...newTab(site.links.resume)}>Download résumé (PDF) ↓</a>
        </div>

        <div className={s.route}>
          {route.map((stop) => (
            <div key={stop.code} className={s.stop} style={{ borderTopColor: palette[stop.color].fill }}>
              <span className={s.stopDot} style={{ background: palette[stop.color].fill }} />
              <div>
                <div className={s.code} style={{ color: palette[stop.color].ink }}>{stop.code}</div>
                <div className={`mono-label ${s.where}`}>{stop.where}</div>
              </div>
              {stop.passes.map((pass, i) => (
                <div key={i} className={s.pass}>
                  <div className={s.passMain}>
                    <div className={s.passTitle}>{pass.title}</div>
                    <div className={s.passSub}>{pass.sub}</div>
                  </div>
                  <div className={s.stub} style={{ background: palette[stop.color].fill, color: palette[stop.color].on }}>{pass.dates}</div>
                </div>
              ))}
              {stop.boarding && (
                <div className={s.boarding}>
                  <span className="mono-label">Now boarding</span>
                  <span className={s.boardingHead}>Software engineering roles. Health tech especially.</span>
                  <a href="#contact">Get in touch →</a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className={s.section} style={{ paddingBottom: 48 }}>
      <div className="container">
        <h2 className={s.bigH2}>
          Where to <span style={{ color: palette.open.ink }}>next?</span>
        </h2>
        <p className={s.lede} style={{ fontSize: 21, maxWidth: 620 }}>
          I&apos;m looking for software engineering roles where the work helps people. Let&apos;s talk.
        </p>
        <div className={s.contactLinks}>
          <a href={site.links.email}>Email ↗</a>
          <a href={site.links.github} {...newTab(site.links.github)}>GitHub ↗</a>
          <a href={site.links.linkedin} {...newTab(site.links.linkedin)}>LinkedIn ↗</a>
          <a href={site.links.resume} {...newTab(site.links.resume)}>Résumé ↓</a>
        </div>
        <SiteFooter />
      </div>
    </section>
  );
}

/** Footer shared by every page. Travels and the wish list are linked from here. */
export function SiteFooter() {
  return (
    <footer className={s.footer}>
      <span>© {new Date().getFullYear()} {site.name}</span>
      <nav aria-label="More" className={s.footerLinks}>
        <Link href="/travels">Travels</Link>
        <Link href="/wishlist">Wish list</Link>
      </nav>
      <span>Made in New York</span>
    </footer>
  );
}
