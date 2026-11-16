# Agent notes — ninetynine.systems website

Static GitHub Pages site. Every page has `class="plain"` on its body; keep to that plain,
text-first look (the `.plain` rules at the end of `styles.css`) and semantic HTML per route. Run `node scripts/check-typography.mjs` before
claiming a change is ready.

A product's name always links to its page on this site (`/uslides/`, `/orvia/`). Links that
open a product app itself (for example `https://uslides.ninetynine.systems/`) carry
`target="_blank" rel="noopener"` so the app opens in a new tab.

## Gatekeeper temporarily unlisted

Gatekeeper is **parked until release-ready**. Do not re-add it to the homepage,
`/products/`, or footer Product links unless explicitly asked to restore it.

- Parked copy and restore checklist: `docs/parked/gatekeeper/`
- Product images remain at `assets/images/gatekeeper/`
- Public product page `/gatekeeper/` is removed while parked; restore from
  `docs/parked/gatekeeper/product-page.html`
