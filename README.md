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
- `/orvia/privacy/` and `/orvia/terms/` — Orvia app and hosted-service notices
- `/orvia/delete-account/` — account and associated-data deletion requests through support
- `/orvia/support/` — support, AI-response reporting, and subscription help

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

Orvia uses the selected Orbit mark in its product chapter, portfolio card, product
page, and public notices. Its SVG/ICO favicons are under `orvia/`; the company
favicon and header keep the company mark. `orvia/mark.svg` is the transparent
standalone version. These are generated copies of `branding/orvia-orbit.svg`
in the Orvia Android repository. Refresh them from that checkout with:

```bash
python3 scripts/export-orvia-brand.py --website-dir ../ninetyninesystems.github.io
```

For an ICO-only export on macOS, run `swift scripts/generate-favicon.swift orvia`.
Keep visible Orvia text beside decorative logo images. Historical product
screenshots are not edited to simulate branding from a newer app build.

## Validation

Run the local guardrail before deployment:

```bash
node scripts/check-typography.mjs
```

The script checks every public route, shared assets, local typography, legal
identity, working links, honest concept labels, and the absence of inline
placeholder artwork.

## Orvia public documents

The Orvia notices were prepared on 7 October 2026 from the Android/gateway release
records. They cover the current internal test service, the deployed company-hosted
deletion page, and the upcoming response-only reporting app update. The full
conversation email remains a separate optional choice. The deletion page links
to the verified HTTPS/Google sign-in flow and retains support email as an alternative.
No deletion or email occurs merely by opening a page. The source privacy paragraphs
are also copied into Android's bundled current-service notice, with link URLs
preserved. Publish the website update before uploading the matching Android build.

The company report-retention policy is 30 days from receipt with manual cleanup;
provider recovery copies and user email copies have separate retention. Publication
does not establish that the pending release, live deletion execution, inbox cleanup,
or Play declarations have passed live verification. Keep the Android release
checklist and bundled notices in sync when that rollout completes.
