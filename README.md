# ninetynine.systems landing page

Static GitHub Pages site for `ninetynine.systems`.

## Typography standard

This site uses the mandatory ninetynine.systems 3-font typography system:

- **Inter** — default UI/body/navigation/forms/cards/general interface text.
- **Source Serif 4** — reading surfaces such as about/product description panels.
- **JetBrains Mono** — semantic technical metadata, platform rows, code-like identifiers.

No display fonts are used. **Syne is explicitly removed** and must not return.

### Logo-only exception

The primary logo lockup is the only exception to the broader typography rules:

- `Ninetynine` — Source Serif 4, weight `300`, ink color, slight negative tracking.
- `.Systems` — Inter, weight `400`, spaced tracking, red accent color.

This exception applies only to the logo. Do not generalize it to headings, UI, dashboards, docs, or product surfaces.

Fonts are packaged locally under `assets/fonts/` so the site renders consistently without runtime Google Fonts requests.

Required scale: `12 / 14 / 16 / 18 / 24 / 32 / 48 / 64` with `16px` as the body default.

Allowed weights: `400` body, `500` labels, `600` emphasis, `700` headings. Avoid `800`/`900`; the logo-only `300` weight is intentionally scoped to `Ninetynine`.

## Validation

Run the typography guardrail check before deploying:

```bash
node scripts/check-typography.mjs
```

GitHub Pages also runs this check during deployment.
