# ninetynine.systems landing page

Static GitHub Pages site for `ninetynine.systems`.

## Typography standard

This site uses the mandatory ninetynine.systems typography system:

- **Inter** — default UI/body/navigation/forms and the spaced `.Systems` logo suffix.
- **Source Serif 4** — primary `Ninetynine` wordmark and reading surfaces such as about/product description panels.
- **JetBrains Mono** — semantic technical metadata, platform rows, code-like identifiers.
- **Syne** — display identity for section/marketing headings only. Never use Syne for body text or the primary wordmark/logo.

The primary `Ninetynine` wordmark uses regular-weight Source Serif 4 via `--font-wordmark`; the `.Systems` suffix uses regular Inter with wider tracking. Syne stays as a display accent so the logo does not look horizontally stretched or overly bold.

Fonts are packaged locally under `assets/fonts/` so the site renders consistently without runtime Google Fonts requests.

Required scale: `12 / 14 / 16 / 18 / 24 / 32 / 48 / 64` with `16px` as the body default.

Allowed weights: `400` body, `500` labels, `600` emphasis, `700` headings.

## Validation

Run the typography guardrail check before deploying:

```bash
node scripts/check-typography.mjs
```

GitHub Pages also runs this check during deployment.
