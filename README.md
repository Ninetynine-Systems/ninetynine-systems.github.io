# ninetynine.systems landing page

Static GitHub Pages site for `ninetynine.systems`.

## Typography standard

This site uses the mandatory ninetynine.systems 3-font typography system:

- **Inter** — default UI/body/navigation/forms/cards/general interface text.
- **Source Serif 4** — the editorial voice: hero and section statements plus reading surfaces.
- **JetBrains Mono** — semantic technical metadata, platform rows, code-like identifiers.

No display fonts are used. **Syne is explicitly removed** and must not return.

### Logo-only exception

The wordmark is the only exception to the broader typography rules. It is set in one typeface, at one size, in one weight:

- `Ninetynine` — Source Serif 4, weight `300`, at `23px`, slight negative tracking.
- `.systems` — the same font, size, weight and tracking. It differs only in colour, which is the red accent.

The two spans exist so that `.systems` can take the accent colour. Neither one sets its own font family, size or weight, and they must not start to.

This exception applies only to the wordmark. Do not generalize it to headings, UI, dashboards, docs, or product surfaces.

Fonts are packaged locally under `assets/fonts/` so the site renders consistently without runtime Google Fonts requests.

The site remains zero-build and GitHub Pages-native, with responsibilities split across:

- `index.html` — semantic content and metadata.
- `styles.css` — the section layout, the type scale, and the 99 glitch.
- `app.js` — the header hairline on scroll and the active nav link. Nothing else.
- `assets/images/` — local, owned screenshots used on the page.

The page is deliberately plain: flat dark bands separated by hairlines, one light band for the three build questions, no background gradients, no glows, no small label text above headings, and no scroll animations.

The single piece of motion is the `99` in the header, and it behaves like a worn VHS tape.

Inside `.hero__mark` are eight stacked copies of the same glyphs: a faint grey base, three full copies tinted pure red, green and blue, three more clipped to one thin horizontal row each, and one bright copy that sweeps slowly down the mark like a tape head losing alignment. When it fires, the coloured copies pull apart sideways; `mix-blend-mode: screen` adds them back towards white where they still line up and leaves coloured fringes where they do not.

The whole group is then pixelated by the `#pixel-99` SVG filter in `index.html` and masked by a row grid and a column grid, so the glyphs are drawn as separate square blocks with scanline gutters between the rows. Both the filter and the masks apply to the group after its children are composited, which means every displacement is snapped to the block grid and the scanline gaps are cut out of the glyphs themselves — there is no overlay rectangle to give the trick away.

The cell size is the custom property `--px` on `.hero__mark`, and every displacement is written as a whole multiple of it, so changing `--px` scales the blocks, the scanlines and the tearing together. Phones get a smaller `--px` and the finer `#pixel-99-fine` filter, because at full strength a 200px mark comes apart too far to read as a 99.

Layer cycles are short and share no common factor, so blocks tear roughly every second and never in the same combination twice. It is pure CSS keyframes and is disabled under `prefers-reduced-motion`.

Required scale: `12 / 14 / 16 / 18 / 24 / 32 / 48 / 64` with `16px` as the body default.

Allowed weights: `400` body, `500` labels, `600` emphasis, `700` headings. Avoid `800`/`900`; the logo-only `300` weight is intentionally scoped to `Ninetynine`.

## Validation

Run the typography guardrail check before deploying:

```bash
node scripts/check-typography.mjs
```

GitHub Pages also runs this check during deployment.
