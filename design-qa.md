# Design QA

## Comparison target

- Source visual truth: `docs/design/option-3-reference.png`, the annotated Orvia section capture, the supplied `assets/images/orvia/Screenshot_20260902_150911_Orvia.jpg` and `assets/images/orvia/Screenshot_20260902_133129_Orvia.jpg` captures, the annotated hero capture at `C:/Users/sazid/AppData/Local/Temp/codex-clipboard-04102a1e-0876-438a-a960-fb8efc518680.png`, and the annotated Gatekeeper capture at a 763 × 1143 CSS-pixel viewport.
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

### Iteration 6 — closing CTA simplification

- [P2] The closing section presented two competing actions, while the intended primary `Start a project` action could render with insufficient contrast against the black background.
  - Fix: removed the duplicate `Email us` action and gave the remaining contact-route CTA an explicit white surface, near-black text, restrained shadow, and clear hover state scoped to the closing section.
  - Post-fix evidence: the final browser capture shows one high-contrast `Start a project` button; computed styles report a white background and `rgb(8, 8, 8)` text, the link resolves to `/contact/`, and no console warnings or errors were reported.

### Iteration 7 — product-first company positioning

- [P2] The hero gave product discovery and studio lead generation equal weight, weakening the product-first message.
  - Fix: removed the hero-level `Start a project` action and retained `See the systems` as the single primary action. The project contact path remains available in the navigation, Studio section, and closing section.
  - Post-fix evidence: the final browser capture shows one centered product-discovery CTA in the hero and the existing product chapter navigation directly below it.
- [P2] Repeated `U.S. software company` and `founder-led` language blurred the distinction between the team’s operating location and the company’s legal registration.
  - Fix: positioned ninetynine.systems as an independent software company in marketing copy, stated that the team is based in Dhaka, Bangladesh, and reserved the Missouri, United States registration detail for the location FAQ and Company details.
  - Post-fix evidence: the expanded homepage location FAQ and Company details browser captures clearly separate `Dhaka, Bangladesh` from `Missouri, United States`; the Company hero no longer uses `founder-led` or presents U.S. registration as the brand position.
- [P2] The closing CTA wrapped onto two lines at the 752-pixel browser width after the surrounding content reflowed.
  - Fix: kept short button labels on one line across breakpoints; the button remains within the available column without overflow.
  - Post-fix evidence: a fresh browser capture at the same width shows `Start a project` on one line with the existing high-contrast treatment intact.

### Iteration 8 — Gatekeeper preview legibility

- [P2] At the annotated 763-pixel viewport, the 2720 × 1700 Gatekeeper source was squeezed to approximately 167 × 94 CSS pixels, making its interface look blurred even though the source asset was sharp.
  - Fix: removed browser-default figure margins, corrected the image metadata and presentation ratio to the source’s 8:5 dimensions, and stacked product chapters below 840 pixels so the preview receives the full content width.
  - Post-fix evidence: the matched 763-pixel responsive capture shows the complete Gatekeeper preview at approximately 715 pixels wide—more than four times its previous rendered width—with no crop or horizontal overflow. The standard 1280-pixel browser capture renders it at approximately 759 × 475 CSS pixels from the original 2720 × 1700 source.

### Iteration 9 — public company-detail simplification

- [P2] The Company details and homepage FAQ disclosed the team’s operating location even though that information is not needed for the site’s public company presentation.
  - Fix: removed the Dhaka and team-location references, removed the location FAQ, and retained only the formal Missouri registration alongside the legal name, structure, business activity, and contact address.
  - Post-fix evidence: the Company details section now uses the neutral heading `Legal and business details.` and contains no operating-location field; the homepage FAQ contains three product and engagement questions with no location disclosure.

## Follow-up polish

- [P3] The real product captures require a somewhat taller homepage than the compact concept image. This is an intentional legibility tradeoff; the section order and editorial rhythm remain faithful.
- [P3] A future pass can replace the Planner and Billhead concept images one-for-one when real captures are available.

## Final result

final result: passed
