# Site redesign — Hybrid Reliability direction

**Date:** 2026-07-16

**Scope:** ninetynine.systems landing page
**Status:** Implemented

## Brand position

ninetynine.systems should read as an engineering institution with product proof: ambitious at the opening, exact in the body, and concrete wherever credibility matters. The page expresses frontier capability through scale and restraint, while reliability is communicated through layout discipline, operating language, and visible system behavior.

The core statement is:

> We make ambitious systems dependable.

The page argument is:

> ambition → engineering standard → proof → breadth → invitation

## Visual concept

The page is a hybrid of two surfaces:

- **Mission surface:** a uniform carbon-black hero with the interactive particle 99, quiet grid calibration, warm-white editorial type, and one oxide signal.
- **Research journal:** warm paper sections with a consistent 12-column grid, strong rules, measured serif statements, readable prose, and technical metadata only where it carries meaning.

The transition between the two is hard and deliberate. There is no decorative dusk fade between sections.

## Composition rules

- One 12-column grid and one 24px column gap govern every desktop section.
- Spacing uses the fixed sequence `8 / 12 / 16 / 24 / 32 / 48 / 72 / 96 / 144`.
- The particle 99 is the only spectacle on the page.
- Oxide is a signal, not a wash: punctuation, primary action, and rare live-state detail.
- Product and studio information use ruled rows rather than floating cards.
- Buttons are precise rectangles with minimal radius; large shadows and pill controls are excluded.
- Responsive layouts preserve hierarchy and symmetry instead of merely hiding content.

## Typography

The mandatory local three-font system remains:

- Source Serif 4 for the logo primary, editorial statements, and reading copy.
- Inter for navigation, controls, product headings, and general UI text.
- JetBrains Mono for identifiers, status, and instrument output.

Weights are limited to `400 / 500 / 600 / 700`, plus the logo-only Source Serif `300`. The documented `12 / 14 / 16 / 18 / 24 / 32 / 48 / 64` type scale is preserved.

## Particle 99

The 99 represents advanced capability inside a stable system:

- Mostly warm-white particles, with restrained steel and roughly one percent oxide signals.
- Local pointer repulsion followed by damped return to the exact numeral.
- Sub-pixel idle drift only; no shooting stars, colorful cosmic palette, glowing plumes, or collision spectacle.
- Adaptive density and frame rate, batched drawing, intersection/visibility pausing, and delayed idle initialization.
- Static outlined fallback for reduced motion, missing canvas, failed font sampling, and no JavaScript.

## Page sequence

1. Dark particle hero with the company thesis, one internal action, and a factual live-system rail.
2. Operating standard: explicit authority, defined failure behavior, verifiable evidence.
3. Gatekeeper flagship proof with an instrument-style approval and ledger panel.
4. Systems in operation: Gatekeeper and Islamic Reflections as a compact status ledger.
5. Studio method: products, selective partnerships, and domains expressed as ruled rows.
6. Dark contact bookend and restrained footer.

## Voice

- State the ambition once, then substantiate it.
- Prefer operating facts over startup abstractions.
- Avoid “agentic era,” “universal,” “and beyond,” empty coming-soon language, and repeated claims of consequence.
- Gatekeeper carries the strongest proof: explicit authority, a signed decision, and a verifiable record.
- Unannounced work remains unannounced.

## Quality floor

- Semantic landmarks, one H1, named sections, visible focus, skip link, and explicit new-tab labels.
- No horizontal overflow at `360`, `390`, `768`, `1024`, and desktop widths.
- Motion disabled under `prefers-reduced-motion`; the preference is also respected if it changes at runtime.
- Local fonts and assets only; no runtime third-party font requests.
- Zero-build GitHub Pages deployment with `index.html`, `styles.css`, and `app.js` separated by responsibility.
- Typography validation runs locally and in the Pages workflow.
