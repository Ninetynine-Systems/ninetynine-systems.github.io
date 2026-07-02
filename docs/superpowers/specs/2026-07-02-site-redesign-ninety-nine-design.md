# Site redesign — "Ninety-Nine" direction

**Date:** 2026-07-02
**Scope:** `index.html` (single-page landing for ninetynine.systems)
**Status:** Direction approved from three mockups (The Record / Ninety-Nine / Night Ops). User chose **Ninety-Nine**.

## Concept

Type-as-image. The name is the identity: a colossal outlined "99" anchors the hero,
a folio system (№ 01–05) paces the page, and monumental serif statements alternate
with quiet, precise blocks. The existing brand system is preserved — paper/ink/oxide
palette, the enforced three-font typography system (Source Serif 4 / Inter /
JetBrains Mono), and the wordmark lockup — but the page shifts from Inter-led,
card-heavy layouts to serif-led poster scale.

## Tokens

- **Paper** `#faf9f5`, **paper-2** `#f3f0e7`, **ink** `#141413`, ink-2 `#565247`,
  ink-3 `#7a7466`, hairline `#e3decd`, strong rule = ink.
- **Oxide** `#b84e28` (hover deep `#93391a`) — one accent moment per screen:
  the terminal period on headlines, folio №, the CTA button.
- **Type roles:** display = Source Serif 4 Variable 580–640, tight tracking;
  body = Inter (UI) and Source Serif 4 (ledes/prose); folio/meta = JetBrains Mono
  10–11px, letterspaced caps. No italics (not shipped in the font files).

## Structure (folio-numbered)

1. Absolute nav over hero → sticky paper bar after scroll.
2. **Hero** — the 99 monument as an **ink field**: ~3,500 canvas particles sampled
   from the glyphs (a few oxide grains among the ink) that breathe idly, scatter
   around the cursor/touch, and spring back into shape. Chosen from four animated
   backdrop variations (Orbital Atlas / Constellation 99 / Mission Grid / Ink Field).
   Reduced motion, no-JS, and failed-canvas paths all fall back to the static
   outlined `-webkit-text-stroke` monument. Folio rule line, serif H1 "Focused
   systems for frontier AI." with oxide period, serif deck, one internal button
   ("What we build").
3. **№ 01 Approach** — three serif statements with hairline rules.
4. **№ 02 Flagship** — full-bleed ink chapter: giant "Gatekeeper.", thesis line
   "Nothing happens until someone says yes.", description, fact list, a single
   product link, `gatekeeper ledger verify` terminal.
5. **№ 03 Index of systems** — typographic ledger rows: Gatekeeper, Islamic
   Reflections (with platform links), New systems (dim, Soon).
6. **№ 04 The studio** — about copy + four-front strip (Frontier AI / Software /
   Defense / Civilian).
7. **№ 05 Contact** — CTA with faint oxide 99 ghost, mailto + Gatekeeper buttons.
8. Footer — wordmark, est./copyright line, product + contact links.

## Motion

- Hero load sequence: folio bar, headline, deck/actions stagger in; the ink field
  fades in once seeded (after `document.fonts.ready`).
- Ink-field engine: DPR-aware canvas, mouse + touch repulsion with spring return,
  paused via IntersectionObserver when the hero leaves the viewport; particle
  density and alpha reduced on small screens.
- Section reveal on scroll (IntersectionObserver), gated behind an `html.js` class so
  content is fully visible without JavaScript.
- All motion disabled under `prefers-reduced-motion` (hero keeps the static outline).

## Quality floor

- Responsive to ~360px: monument rescales above the headline, grids collapse,
  full-width buttons at small sizes.
- Visible `:focus-visible` rings, skip link, aria labels on icon-ish links,
  `rel="noopener"` on external links.
- No external requests: self-hosted fonts only, inline CSS/JS, existing paper-grain overlay kept.
- `@supports` fallback where `-webkit-text-stroke` is unavailable (faint solid ink).

## Voice

The page establishes the studio's own identity; it does not sell or compare.
No defensive framings ("not a portfolio of demos", "not glossy magic"), no
hedging qualifiers ("actually", "right now"). Gatekeeper gets exactly one
button — inside its own chapter; everywhere else it appears as quiet index
and footer links. The primary site-wide action is "Get in touch".

## Revisions (2026-07-02, after first ship)

- Brand is always lowercase: **ninetynine.systems** — wordmark, meta, and prose.
- Audience framing is **humans and AI**, never AI alone (H1, deck, studio copy, meta).
- Industries are open-ended: the four fronts strip gained a fifth cell, "And beyond,"
  and lost its numbering; copy says "and beyond."
- The № folio headers and their horizontal rules were removed everywhere (hero folio
  bar, chapter head, index head, studio/contact labels) to keep the design clean.
  The `.folio` style survives only as quiet mono metadata (index row IDs, footer).
- Cut from copy: "paper-and-ink restraint throughout", "Few, kept for good".

## Out of scope

- No changes to `logo.svg`, `generate_logo.swift`, fonts, or deploy workflow.
- Gatekeeper/IR product pages are external; only links from this page.
