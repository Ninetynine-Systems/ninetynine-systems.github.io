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

- `Ninetynine` — Source Serif 4, weight `600`, at `23px`, slight negative tracking.
- `.systems` — the same font, size, weight and tracking. It differs only in colour, which is the red accent.

The two spans exist so that `.systems` can take the accent colour. Neither one sets its own font family, size or weight, and they must not start to.

The exception is now only the `23px` size, which is off the type scale. Weight `300` used to be permitted here and nowhere else; the wordmark is bold now, so that weight is gone from the site entirely and the allowed set is `400` / `500` / `600` / `700`.

This exception applies only to the wordmark. Do not generalize it to headings, UI, dashboards, docs, or product surfaces.

Fonts are packaged locally under `assets/fonts/` so the site renders consistently without runtime Google Fonts requests.

The site remains zero-build and GitHub Pages-native, with responsibilities split across:

- `index.html` — semantic content and metadata.
- `styles.css` — the section layout, the type scale, and the 99 glitch.
- `app.js` — the header hairline on scroll and the active nav link. Nothing else.
- `assets/images/` — local, owned screenshots used on the page.
- `orvia/` — the Orvia product page, served at `/orvia/`. See below.

## The Orvia page

`orvia/` is a self-contained one-screen page for Orvia, copied from the product repo (`firstlight/site`). It is served at `/orvia/` and linked from the `SYS-02` row on the landing page.

**It does not follow this site's typography or palette, and that is deliberate.** Orvia has its own identity: Archivo (the face the app itself ships, self-hosted in `orvia/fonts/`), a blue brand colour, and its own light and dark themes driven by `prefers-color-scheme`. The typography guardrail only reads the root `index.html` and `styles.css`, so nothing in `orvia/` is checked against the 3-font system. Do not "fix" it to match the landing page.

Every path inside it is relative, so the whole directory can be moved or re-copied from the product repo without rewriting anything.

The orb is [Thinking Orbs](https://github.com/Jakubantalik/thinking-orbs) by Jakub Antalik, MIT licensed, ported from React to plain browser JavaScript in `orvia/orb.js`. The licence is kept beside it in `orvia/LICENSE-thinking-orbs.txt` and must stay there. Archivo's licence is in `orvia/fonts/OFL.txt`.

## The landing page

The page is deliberately plain: pure white (`#ffffff`, not an off-white) with dark text, sections separated only by hairlines, no background gradients, no glows, no small label text above headings, and no scroll animations.

The palette is six tokens — `--page`, `--ink`, `--muted`, `--edge`, `--line`, `--hairline` — plus `--accent`. Nothing else should introduce a colour.

## Accessibility

The colour tokens are chosen to hit WCAG 2.2 AA, and the split between them exists for that reason:

- `--ink` and `--muted` are the only colours allowed on text. Both clear 4.5:1 against `--page`; the weakest is `--muted` at 5.5:1. Do not invent a third, lighter text colour — anything below about `rgba(17, 21, 22, 0.585)` fails.
- `--accent` is `#b85332`, darkened from the original `#c85a36`. The old value was 4.22:1, which failed for the small mono numerals and for white text on the accent fill. The new one is 4.86:1 both ways.
- `--edge` encloses controls (`.action`, `.nav-contact`) and clears the 3:1 required of UI component boundaries. `--line` and `--hairline` only ever divide content, so they are allowed to stay faint.
- `.logo` carries `padding-block` with a matching negative margin, purely so the wordmark link clears the 24px minimum target size without moving in the layout.

Below 1000px the hero stacks and the `99` moves above the copy. It must never sit behind text: body copy over a pixel grid is unreadable. Above 1000px, `.hero__copy` is capped at `min(720px, 55vw)` so the text cannot grow across into it.

`prefers-reduced-motion: reduce` stops the glitch and the smooth scrolling. `prefers-contrast: more` pushes every secondary text to full `--ink`, darkens the accent to `#8f3d21` (7.35:1), solidifies the control borders, and hides the `99` along with the space reserved for it.

The single piece of motion is the `99` in the header, and it behaves like a worn VHS tape.

Inside `.hero__mark` are eight stacked copies of the same glyphs: a faint grey base, three full copies tinted pure red, green and blue, three more clipped to one thin horizontal row each, and one darker copy that sweeps slowly down the mark like a tape head losing alignment. When it fires, the coloured copies pull apart sideways; `mix-blend-mode: multiply` subtracts them from each other, so they go almost black where they still line up and leave coloured fringes where they do not, the way misregistered colour plates do on white paper.

Because the blending is subtractive, the coloured layers need a high opacity to register on white. Halve those values and the glitch fades to pastel.

The whole group is then pixelated by the `#pixel-99` SVG filter in `index.html` and masked by a row grid and a column grid, so the glyphs are drawn as separate square blocks with scanline gutters between the rows. Both the filter and the masks apply to the group after its children are composited, which means every displacement is snapped to the block grid and the scanline gaps are cut out of the glyphs themselves — there is no overlay rectangle to give the trick away.

The cell size is the custom property `--px` on `.hero__mark`, and every displacement is written as a whole multiple of it, so changing `--px` scales the blocks, the scanlines and the tearing together. Phones get a smaller `--px` and the finer `#pixel-99-fine` filter, because at full strength a 200px mark comes apart too far to read as a 99.

Layer cycles are short and share no common factor, so blocks tear roughly every second and never in the same combination twice. It is pure CSS keyframes and is disabled under `prefers-reduced-motion`.

Required scale: `12 / 14 / 16 / 18 / 24 / 32 / 48 / 64` with `16px` as the body default.

Allowed weights: `400` body, `500` labels, `600` emphasis and the wordmark, `700` headings. Avoid `300`, `800` and `900`.

## Validation

Run the typography guardrail check before deploying:

```bash
node scripts/check-typography.mjs
```

GitHub Pages also runs this check during deployment.
