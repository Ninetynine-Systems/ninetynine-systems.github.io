# ninetynine.systems landing page

Static GitHub Pages site for `ninetynine.systems`.

## Design language

The site follows the x.ai-style system specified in
`docs/superpowers/specs/2026-08-13-xai-style-redesign-design.md`: a pure white
page (`#ffffff`), near-black text, pill-shaped controls, and the four products
presented as equal full-width index rows that alternate white and faint gray.
No badge chips ("NEW", "LIVE"), no numbered stat rows, no sales language. The
site-wide action is "Get in touch", which mails sazidozon@gmail.com.

## Typography

**Inter is the only typeface.** It is packaged locally under
`assets/fonts/inter/` (family `"Inter Variable"`) so the site renders
consistently without runtime Google Fonts requests. Source Serif 4, JetBrains
Mono, Archivo, and Syne are all retired and must not return.

Required scale: `12 / 14 / 16 / 18 / 24 / 32 / 48 / 64` with `16px` as the
body default. The hero clamps down from `64px` on small screens.

Allowed weights: `400` body, `500` labels and controls, `600` headings,
`700` the wordmark. `300`, `800` and `900` are forbidden.

Headlines use tight negative tracking (about `-0.03em`) at weight `600` —
large and quiet, never bold and loud.

## Layout

The site remains zero-build and GitHub Pages-native, with responsibilities
split across:

- `index.html` — semantic content and metadata.
- `styles.css` — tokens, layout, and the vignettes.
- `app.js` — the header hairline on scroll. Nothing else.
- `orvia/` — the Orvia product page, served at `/orvia/`. See below.

The four product rows each pair a decorative window vignette (hand-built
HTML/CSS, `aria-hidden`) with the real text. The vignettes are the only place
lighter grays are allowed; real text uses only `--ink` and `--muted`, both of
which clear WCAG 2.2 AA against white.

One vignette-only exception: the Orvia notes illustrations (homepage strip
and `/orvia/`) use the generic system monospace stack, because the product's
notes page is monospaced. That is illustration, not site typography — no
mono font is shipped, and real text stays Inter.

The page is static: no scroll animations, no transitions on content. The
only scroll behavior is the hairline that appears under the sticky header.

## The Orvia page

`orvia/` is a one-screen splash on the same system: white page, Inter, the
slim nav, and a thin copyright bar. The orb is
[Thinking Orbs](https://github.com/Jakubantalik/thinking-orbs) by Jakub
Antalik, MIT licensed, ported to plain browser JavaScript in `orvia/orb.js`.
The licence is kept beside it in `orvia/LICENSE-thinking-orbs.txt` and must
stay there. The orb reads its color from the `--orb-ink` custom property.

## Validation

Run the guardrail before deploying:

```bash
node scripts/check-typography.mjs
```

It checks the wiring, the one-typeface rule, the type scale, the allowed
weights, the retired assets, the contact address, and that the Orvia page
stays on the system. GitHub Pages runs it during deployment.
