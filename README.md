# ninetynine.systems company website

Static GitHub Pages website for **ninetynine.systems LLC**, an independent software
company. The site presents the company, its product portfolio, its software
studio, contact information, and public website policies.

## Site structure

- `/` — company homepage and product chapters
- `/products/` — portfolio overview
- `/gatekeeper/` — Gatekeeper product page with real product captures
- `/orvia/` — Orvia product page with real mobile captures
- `/studio/` — capabilities, process, and working model
- `/company/` — company identity and operating principles
- `/contact/` — direct project contact path
- `/privacy/` and `/terms/` — website notices

The site remains zero-build and GitHub Pages-native. Shared responsibilities are
split across `styles.css`, `app.js`, and semantic HTML files for each route.

## Design language

The selected direction is a restrained editorial company site: white and
near-black surfaces, thin rules, large quiet headings, real product imagery,
and black primary buttons. It is based on the approved Option 3 mockup stored at
`docs/design/option-3-reference.png`.

Inter is the only typeface. It is self-hosted under `assets/fonts/inter/` and
loaded without third-party font requests. The layout is responsive, motion is
subtle, and `prefers-reduced-motion` is respected.

Gatekeeper and Orvia use real product screenshots. Planner and Billhead use
generated concept images that are visibly labeled as in-development previews so
they are not presented as shipped interfaces.

## Contact

The working site-wide address is `sazid@ninetynine.systems`. The contact page uses a
direct mail link instead of a form, so the static site does not collect form
submissions.

## Branding

The shared header mark is `assets/brand-mark.svg`. `favicon.svg` uses the same
connected geometry in white on a dark tile; `favicon.ico` contains 16, 32, 48,
64, 128, and 256px versions. Regenerate it on macOS with
`swift scripts/generate-favicon.swift` after editing the favicon SVG. These are
static assets; GitHub Pages does not need Swift. Google Play developer icon
and header exports are kept in `output/google-play/`.

## Validation

Run the local guardrail before deployment:

```bash
node scripts/check-typography.mjs
```

The script checks every public route, shared assets, local typography, legal
identity, working links, honest concept labels, and the absence of inline
placeholder artwork.
