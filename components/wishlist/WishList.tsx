"use client";

import { useState } from "react";
import { wishlist } from "@/data/wishlist";
import { palette } from "@/lib/colors";
import s from "./WishList.module.css";

// Set NEXT_PUBLIC_FORMSPREE_ID in .env.local (free at formspree.io) to receive postcards by email.
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

type Status = "idle" | "sending" | "sent" | "error";

export function WishList() {
  const [place, setPlace] = useState(wishlist[0].name);
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!FORMSPREE_ID) {
      console.warn("NEXT_PUBLIC_FORMSPREE_ID is not set — postcard not sent.", Object.fromEntries(data));
      setStatus("sent");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <ul className={s.grid}>
        {wishlist.map((w, i) => (
          <li key={w.name} className={s.card} data-picked={place === w.name}>
            <div className={s.cardTop}>
              <span className="mono-label">Unstamped · No. {String(i + 1).padStart(2, "0")}</span>
              <span className={s.ring} style={{ borderColor: palette[w.color].ink }} aria-hidden="true" />
            </div>
            <h2 className={s.name}>{w.name}</h2>
            <p className={s.why}>{w.why}</p>
            <a href="#note" className={s.tell} style={{ color: palette[w.color].ink }} onClick={() => setPlace(w.name)}>
              Been there? Tell me →
            </a>
          </li>
        ))}
      </ul>

      <div id="note" className={s.note}>
        {status === "sent" ? (
          <div className={s.sent} role="status">
            <span className="mono-label" style={{ color: palette.australia.ink }}>Postcard received</span>
            <span className={s.sentHead}>Thank you! I&apos;ll read every word.</span>
            <button type="button" className={s.again} onClick={() => setStatus("idle")}>Send another</button>
          </div>
        ) : (
          <form className={s.form} onSubmit={onSubmit}>
            <div className={s.formHead}>
              <h2 className={s.formTitle}>Send me a postcard</h2>
              <span className={s.hint}>Goes straight to my inbox</span>
            </div>
            <label className={s.label}>
              Your name
              <input className={s.input} type="text" name="name" autoComplete="name" required />
            </label>
            <label className={s.label}>
              The place
              <select className={s.input} name="place" value={place} onChange={(e) => setPlace(e.target.value)}>
                {wishlist.map((w) => (
                  <option key={w.name} value={w.name}>{w.name}</option>
                ))}
                <option value="Somewhere else">Somewhere else</option>
              </select>
            </label>
            <label className={`${s.label} ${s.full}`}>
              Your story or tips
              <textarea className={s.input} name="message" rows={4} required />
            </label>
            <label className={s.label}>
              Email, if you want a reply (optional)
              <input className={s.input} type="email" name="email" autoComplete="email" />
            </label>
            <div className={s.submitRow}>
              <button type="submit" className={s.submit} disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send postcard →"}
              </button>
            </div>
            {status === "error" && (
              <p className={`${s.full} ${s.error}`} role="alert">
                That didn&apos;t go through. Mind trying again in a moment?
              </p>
            )}
          </form>
        )}
      </div>
    </>
  );
}
