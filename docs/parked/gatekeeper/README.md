# Gatekeeper — parked public listings

Gatekeeper is temporarily hidden from the public company website until it is
release-ready. Restore from this folder when ready to list it again.

## What is parked here

| File | Restores to |
| --- | --- |
| `landing-snippets.html` | Homepage hero CTA target, chapter nav link, product chapter, and footer Products link |
| `products-card.html` | `/products/` portfolio card and meta description mention |
| `product-page.html` | Public route at `/gatekeeper/index.html` |

## Assets to keep

Product captures remain under `assets/images/gatekeeper/`. Shared CSS for
`.product-media--gatekeeper` remains in `styles.css`. Do not delete those when
restoring or while parked.

## Restore checklist

1. Copy `product-page.html` to `/gatekeeper/index.html`.
2. Reinsert snippets from `landing-snippets.html` into `index.html` (hero CTA,
   chapter nav, product chapter before Orvia, footer Products link).
3. Reinsert `products-card.html` into `/products/index.html` and restore the
   products meta description to include Gatekeeper.
4. Add `<a href="/gatekeeper/">Gatekeeper</a>` back to the Products footer
   column on every public page.
5. Update `README.md` site structure and AGENTS.md / CLAUDE.md parking notes.
6. Re-add `gatekeeper/index.html` to `scripts/check-typography.mjs` pages list
   and restore homepage external-link expectations if needed.
7. Run `node scripts/check-typography.mjs`.
