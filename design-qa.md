# Design QA

## Comparison target

- Source visual truth: `docs/design/option-3-reference.png`, the annotated Orvia section capture, and the supplied `assets/images/orvia/Screenshot_20260902_150911_Orvia.jpg` and `assets/images/orvia/Screenshot_20260902_133129_Orvia.jpg` captures.
- Source pixels: 864 × 1821
- Implementation: `http://127.0.0.1:4173/`
- Implementation screenshot: captured and emitted from the Codex in-app Browser during this task. The browser capture API did not expose a filesystem save path.
- Desktop viewport: 901 × 1270 CSS pixels, device pixel ratio 1.5. The visible content width was 886 CSS pixels after the browser scrollbar.
- Responsive check: homepage rendered inside a 390 × 844 CSS-pixel iframe using the same local build.
- State: homepage top viewport, default theme, FAQ closed. Additional interaction checks used the Gatekeeper anchor, first FAQ open, and the contact route.
- Density normalization: the source was inspected at its native 864-pixel width. The desktop implementation was inspected at an effective 886-pixel content width, a 2.5% difference small enough for direct layout comparison. The mobile check was evaluated separately.

## Evidence

The source reference and the final desktop implementation were emitted together in the final Option 3 fidelity comparison. Full-page Browser capture was not used as evidence because the in-app browser's tiled full-page capture duplicated scrolled regions; instead, the implementation was inspected through stable viewport captures at the hero, product, portfolio, Gatekeeper, Orvia, and mobile states.

Focused comparison was required for the hero and Gatekeeper chapter because the full source image makes the typography and product media too small to judge. The focused comparison confirmed the two-line hero lockup, primary black CTA, four-part product index, two-column Gatekeeper composition, and the start of the Orvia chapter. User annotations intentionally simplified the repeated identity treatment after the initial comparison.

## Required fidelity surfaces

- Fonts and typography: passed. The implementation uses the local Inter variable font throughout, with restrained weights, tight display tracking, and the selected two-line hero break. Headings remain readable at desktop and mobile sizes.
- Spacing and layout rhythm: passed. Thin rules, compact company navigation, centered hero, four-column product index, two-column product chapters, development rows, information grids, and black closing section follow the selected direction. Responsive stacking begins below 760px.
- Colors and visual tokens: passed. The page uses white, near-black, quiet gray, and a cool off-white product section without decorative gradients. Contrast is clear in normal and dark sections.
- Image quality and asset fidelity: passed. Gatekeeper and Orvia use supplied product captures. The homepage Orvia chapter now presents four distinct, sharp captures as a large layered device showcase on desktop and a 2 × 2 grid on mobile. Planner and Billhead use generated raster concept images sized for their slots and visibly labeled as in-development previews. No visible product imagery was recreated with CSS, inline SVG, or placeholder boxes.
- Copy and content: passed. The exact selected headline, product names, company positioning, product status, and primary actions are present. The header uses `ninetynine.systems`, the hero does not repeat the company identity, and the footer uses `ninetynine.systems LLC` per the annotated direction. Unreleased product visuals are not described as shipped functionality.

## Interaction and responsive checks

- Product jump: `See the systems` updated the hash to `#gatekeeper` and aligned the Gatekeeper section at the top of the viewport.
- FAQ: the first disclosure opened and exposed its answer.
- Contact path: `Start a project` navigated to `/contact/`, where the direct project email link was present.
- Routes: all nine public routes returned content with the expected H1, and no route had horizontal page overflow in the desktop check.
- Images: all referenced Orvia, Gatekeeper, Planner, and Billhead images loaded with non-zero natural dimensions. The homepage Orvia chapter exposed exactly four accessible images.
- Mobile: the 390 × 844 render showed the brand mark, Products and Contact navigation, readable hero, full-width CTAs, horizontally scrollable product index, and all four Orvia captures in a balanced 2 × 2 grid without page overflow.
- Console: no warnings or errors were reported by the in-app Browser.

## Comparison history

### Iteration 1

- [P1] Orvia and concept images rendered at their HTML attribute heights instead of their responsive widths, producing a 6802-pixel homepage and repeated-looking product regions in full-page capture.
  - Fix: added the shared `height: auto` image rule while preserving explicit component overrides.
  - Post-fix evidence: Orvia captures rendered at approximately 268 × 580 CSS pixels and concept images at approximately 702 × 351 CSS pixels; the homepage scroll height dropped to 4017 pixels.
- [P1] The approximately 900-pixel desktop viewport switched product chapters to a stacked tablet layout, unlike the selected reference.
  - Fix: moved the desktop-to-stacked breakpoint from 980px to 760px.
  - Post-fix evidence: the final desktop capture shows Gatekeeper copy and product media side by side and the Orvia phones beside their chapter copy.
- [P2] The hero wrapped after “systems” instead of after “built,” and the Gatekeeper chapter headline was too large for its column.
  - Fix: restored the selected explicit hero line break, tightened the hero rhythm, reduced product chapter display sizing, and kept one primary Gatekeeper action on the homepage.
  - Post-fix evidence: final comparison shows the correct two-line hero and a three-to-four-line Gatekeeper headline close to the reference proportions.

### Iteration 2

No actionable P0, P1, or P2 mismatches remained in the stable desktop, interior-page, interaction, or mobile checks.

### Iteration 3 — annotated refinements

- Removed the repeated company identity from the homepage hero.
- Simplified the global header mark to `ninetynine.systems`.
- Simplified the global footer identity to `ninetynine.systems LLC` while preserving the full company and legal context on substantive pages.
- Replaced the homepage's second Orvia capture with the supplied Bots screen. The updated capture loaded at full natural dimensions with no broken images.
- Post-change Browser evidence confirmed the exact header and footer text, absence of `.hero__identity`, the Bots image source and alt text, and a clean browser console.

### Iteration 4 — expanded Orvia showcase

- Added the supplied Orvia conversation and home-screen captures to the homepage, bringing the chapter to four real product images.
- Changed the desktop media treatment from two columns to a four-image strip while preserving the chapter copy, CTA, palette, spacing system, and staggered visual rhythm.
- Added a responsive 2 × 2 treatment below 760px so the captures remain distinct without horizontal page overflow.
- Post-change Browser evidence at 1418 × 1270 showed all four images fully visible in the Orvia chapter. The 390 × 844 iframe check showed all four images in two rows. A fresh in-app Browser tab reported no console warnings or errors.

### Iteration 5 — larger Orvia device showcase

- [P2] The four-across strip made each Orvia capture approximately 107 pixels wide at the 1418-pixel desktop viewport, leaving important product details too small to read.
  - Fix: replaced the equal-width strip with a layered, slightly rotated device composition using controlled overlap, depth, and hover lift while preserving all four supplied captures.
  - Post-fix evidence: the four desktop cards measured 212–223 pixels wide and 444–449 pixels tall—roughly twice their previous rendered width—with zero horizontal page overflow.
- [P2] The first responsive pass retained desktop overlap rules inside the intended mobile grid.
  - Fix: explicitly reset overlap margins and card transforms below 760px, then retained only a restrained vertical stagger.
  - Post-fix evidence: the 390 × 844 iframe showed two large, non-overlapping cards per row; the second row and transition to Planner were inspected separately.
- A fresh in-app Browser tab loaded all four images and reported no console warnings or errors.

## Follow-up polish

- [P3] The real product captures require a somewhat taller homepage than the compact concept image. This is an intentional legibility tradeoff; the section order and editorial rhythm remain faithful.
- [P3] A future pass can replace the Planner and Billhead concept images one-for-one when real captures are available.

## Final result

final result: passed
