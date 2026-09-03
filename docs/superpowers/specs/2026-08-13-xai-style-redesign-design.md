# Site redesign: x.ai-style, studio-first — design spec

Date: 2026-08-13
Status: approved direction "E — Index rows, expanded" (validated as rendered mockup in the visual companion)

## Goal

Redesign ninetynine.systems using the design language of x.ai and x.ai/bot as the
base: white background, one grotesque sans, pill buttons, rounded app-window
cards, and a calm product index. The studio leads; no single product dominates.
Scope is the homepage (`index.html`, `styles.css`, `app.js`) and the Orvia page
(`orvia/`), brought onto the same system.

## What we take from x.ai

- Pure white page, near-black text, muted gray secondary text.
- One sans typeface at every size. Large headlines with tight letter-spacing
  (about -0.03em), medium weight (600), not bold.
- Thin top nav: small wordmark left, a few quiet links, one solid-black pill
  button right.
- Huge centered hero headline, centered gray subhead, pill CTAs beneath
  (solid black primary, light gray secondary).
- Product vignettes: small fake-UI windows with rounded corners (12-14px),
  1px #e8e8e8 borders, a slim title bar with three gray dots, soft shadow.
- A full-width product index where rows alternate white and faint gray
  (#fafafa).
- Multi-column footer.
- Sections fade in subtly on scroll (respecting `prefers-reduced-motion`).

## What we deliberately do NOT take

- No announcement pills, "NEW"/"LIVE"/"EARLY BETA" tags, or any chips — the
  user finds they read as "AI company" filler.
- No stats rows, code blocks, pricing tables, or news lists — wrong scale for
  a four-product studio.
- No sales language. Brand rules hold: identity-first, never salesy, one CTA
  per product, the site-wide action is "Get in touch".

## What we remove from the current site

- The serif (Source Serif 4) and its "cinematic" titles — one sans everywhere.
- The VHS-glitched "99" hero mark and its SVG pixelation filters. The 99
  survives only in the wordmark and favicon.
- The "Someone has to stay accountable" mission chapter and the
  "Three questions / 01 02 03" section.
- The standalone Gatekeeper feature section — Gatekeeper becomes one of four
  equal rows.
- JetBrains Mono: the ident/label styling that used it is gone; labels use
  Inter. The Source Serif 4 and JetBrains Mono font directories under
  `assets/fonts/` are deleted once nothing references them.

## Typography

- Inter (already self-hosted at `assets/fonts/inter/`) for everything.
- Hero: ~64px desktop / ~40px mobile, weight 600, letter-spacing -0.035em,
  line-height ~1.06.
- Section titles: ~32px, weight 600, letter-spacing -0.03em.
- Body: 16-17px, #666-#777 for secondary text, line-height ~1.55.
- Small labels: 13-14px, #999. No uppercase-tracked "ident" styling.

## Page structure (homepage)

1. **Nav** — wordmark `ninetynine.systems` (bold "ninetynine", gray
   ".systems"); links: Systems, Studio (anchor links); right: black pill
   "Get in touch" → `mailto:sazid@ninetynine.systems`.

2. **Hero** — centered:
   - H1: "Software that has to keep working."
   - Subhead: "Four systems, each built to do one job well — and to still be
     doing it years from now." (The "independent software studio" line is
     removed per user feedback.)
   - CTAs: black pill "Get in touch" (mailto), gray pill "See the systems"
     (anchor to the index).

3. **Systems index** — a small gray "Systems" label, then four full-width
   rows, alternating white / #fafafa. Each row: vignette left (~300px wide on
   desktop), text right — product name (~19-20px, 600), one-line description,
   a longer detail paragraph in lighter gray, then the row's single link.
   Rows stack vertically on mobile (vignette above text).

   | Product | One-liner | Detail | Link | Vignette |
   |---|---|---|---|---|
   | Gatekeeper | Holds an action until a person approves it. | A service or an agent asks for permission. The request goes to whoever is responsible. Nothing runs until they answer, and the answer is kept as a signed record. | gatekeeper.now ↗ | Pending approval card ("Promote model v4.2 → production", requested by ci-runner, Approve / Refuse pills) with one resolved item below ("✓ Rotate signing key — approved by sarah, 2h ago"). |
   | Orvia | A mobile agent that helps with your daily life, and is part of it. | It rides along on your phone: appointments, errands, the small logistics of a day. It learns your patterns and handles what it can, and asks when it shouldn't decide alone. | Coming soon → (links to /orvia/) | Three chat bubbles: "dentist at 4 — traffic's building, leave by 3:20" / "book the cab" / "done. also — you're out of coffee, want it on the list?". |
   | Planner | Your whole week on one page. | Exactly like the paper diaries that put seven days on a spread: the week at a glance, room to write, nothing to configure. A place for notes, not another calendar. | In the workshop (no link) | A week spread: dated cells Mon-Sun (e.g. week 33) with faint note lines, plus a Notes cell. |
   | Billhead | Invoices for businesses that run on paper and handshakes. | Track what you've billed, share it over any app, print it when the customer wants paper. Built for small businesses and people just starting out, especially in the physical market. | Coming soon → (no page yet; render as plain text until one exists) | Invoice: customer name + date, three line items, total due, then Print / Share / Mark paid pills. |

   Vignettes are hand-built HTML/CSS (no screenshots); the existing Gatekeeper
   PNG is retired from the homepage. They are `aria-hidden` decoration with the
   real information in the row text.

4. **Studio section** — centered, quiet:
   - H2: "We also build for other people."
   - Paragraph: "The same standard we hold our own systems to, applied to
     yours. Client work, in any line of work that touches software."
   - Black pill "Get in touch" (mailto).

5. **Footer** — multi-column: studio blurb column ("ninetynine.systems" over
   the line "An independent software studio." — the line moves here from the
   hero, it does not disappear from the site), Systems column (four product
   links), Studio column (anchor links), Contact column (sazid@ninetynine.systems).
   Below: thin copyright bar "© 2026 ninetynine.systems".

## Orvia page (`orvia/`)

Brought onto the same system, keeping its splash character:

- White background, Inter instead of Archivo, drop the page's own light/dark
  tint themes (site is light-only).
- Add the same slim nav (wordmark links back to the homepage, "Get in touch"
  pill) and the thin copyright bar.
- Keep the orb canvas as the page's visual, on white.
- Copy aligns with the homepage one-liner: "A mobile agent that helps with
  your daily life, and is part of it." plus "Coming soon". No other CTA.
- The Archivo font files can be removed once unused.

## Behavior and quality bars

- `app.js` is reduced to: nav state (if any) and an IntersectionObserver that
  fades sections in on scroll; both skipped under `prefers-reduced-motion`.
- Contact email is `sazid@ninetynine.systems` across the site.
  everywhere (nav, studio CTA, footer, JSON-LD).
- Meta/OG descriptions rewritten to the studio-first framing; title stays
  "ninetynine.systems — software that has to keep working".
- Accessibility: keep skip-link, one h1, landmarks, visible focus states, and
  AA contrast (gray secondary text no lighter than #767676 on white for body
  sizes; the mockup's decorative grays stay decorative).
- No new dependencies; static HTML/CSS/JS as today. Fonts stay self-hosted.
- `scripts/check-typography.mjs` currently enforces the old 3-font system
  (serif wordmark, Gatekeeper PNG reference, README wording). It gets
  rewritten in the same change to enforce the new rules: Inter only, no
  serif/mono tokens, self-hosted fonts, allowed weights 400/500/600, no
  inline `<style>`, README statements updated to match. The README's
  typography section is rewritten alongside it.

## Out of scope

- A Billhead page (row renders without a link until one exists).
- Dark mode.
- Any change to gatekeeper.now itself.
