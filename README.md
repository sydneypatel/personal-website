# Sydney Patel — personal website

**Live:** [sydney-patel.vercel.app](https://sydney-patel.vercel.app) <!-- TODO: update if you use a custom domain -->

My portfolio, told as a journey on a globe: **Boston → Nashville → Sydney → New York → open to work.**
As you scroll, the globe turns to each place I've lived, a polaroid pins itself to the map, and a new fact about me slides in under my name. At the end, the globe unlocks so you can spin it and see every flight I've taken.

<!-- TODO: add a screenshot or GIF, e.g. ![Scrolling the globe](preview.gif) -->

## Highlights

- **Scroll-driven globe story.** Six chapters drive an orthographic globe built with `d3-geo`. Real coastlines come from Natural Earth, rendered as a dotted land grid in SVG.
- **Guided tour.** "Scroll or click to travel" plays the story on its own with eased, scroll-like glides. Any wheel, touch or key press hands control straight back to the visitor.
- **Explorable at the end.** Drag the globe (or use the arrow buttons) to see all **76 flights across 46 routes** from my Flighty history, the cities I'm job-hunting in, and hollow pins for the places still on my wish list.
- **Real travel data, privately processed.** A small Node script turns my Flighty export into route lines and totals. Dates and flight numbers never leave my machine.
- **Wish list page.** Nine places I haven't been yet, with a "send me a postcard" form for anyone who has.
- **Accessible throughout.** Keyboard-friendly, WCAG AA contrast, and *Reduce motion* / *High contrast* settings in the header.

## Built with

- **Next.js 16** (App Router), **React 19**, **TypeScript**
- **d3-geo** for the globe projection and great-circle flight routes; **Natural Earth** map data via `world-atlas`
- Plain **CSS Modules** with design tokens (no UI framework)
- **Instrument Serif**, **Newsreader** and **IBM Plex Mono**, self-hosted
- **Formspree** for the postcard form, **Vercel** for hosting

## Design

Newspaper-light: cream paper, near-black ink, and a big serif name. Each stop on the journey has its own color (Boston red, Nashville mustard, Sydney teal, mission violet, New York cobalt and open-to-work berry), and those colors carry through the pins, routes, polaroid tape, project stamps and boarding-pass résumé.

## Credits

- Map data: [Natural Earth](https://www.naturalearthdata.com) (public domain) via `world-atlas`
- Fonts: Instrument Serif, Newsreader and IBM Plex Mono, all under the SIL Open Font License
- Flight history: my own, exported from [Flighty](https://flighty.com)

---

© 2026 Sydney Patel. The code is public to read. Please don't reuse the design, content or photos as your own site.

[LinkedIn](#) · [Email](#) <!-- TODO: links -->
