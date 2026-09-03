# x.ai-Style Studio-First Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the ninetynine.systems homepage and Orvia page in the x.ai design language — white page, Inter only, pill buttons, four equal product index rows with hand-built window vignettes — per the approved spec `docs/superpowers/specs/2026-08-13-xai-style-redesign-design.md`.

**Architecture:** Static GitHub Pages site, zero build. The homepage is three files (`index.html`, `styles.css`, `app.js`); the Orvia page is `orvia/index.html` + `orvia/styles.css` + the untouched `orvia/orb.js`. A Node guardrail script (`scripts/check-typography.mjs`) is the test suite: it is rewritten FIRST to encode the new one-font system, verified red against the old site, and everything after drives it green.

**Tech Stack:** Plain HTML/CSS/JS, self-hosted Inter Variable (already in `assets/fonts/inter/`), Node ≥18 for the guardrail script (uses `node:fs`/`node:path`/`node:url`, same as today).

## Global Constraints

- Brand name is ALWAYS lowercase: `ninetynine.systems`.
- Contact email is `sazid@ninetynine.systems` everywhere (mailto links, footer, JSON-LD).
- No badge chips of any kind ("NEW", "LIVE", "EARLY BETA") and no numbered stat rows.
- One typeface: `"Inter Variable"`. Allowed weights: 400/500/600/700. Type scale: 12/14/16/18/24/32/48/64, body 16px.
- Text colors: `--ink: #111111` and `--muted: #6b6b6b` only. Lighter grays (`#9a9a9a`) may appear ONLY inside `aria-hidden` vignettes.
- No new dependencies, no Google Fonts requests, no inline `<style>` in HTML.
- Commit after every task, but do NOT `git push` until Task 6 passes — the deploy workflow runs the guardrail, which is red mid-plan.
- Commit messages: lowercase imperative, no AI attribution lines (user's global rule).

---

### Task 1: Rewrite the guardrail script (the failing test)

**Files:**
- Modify: `scripts/check-typography.mjs` (full replacement)

**Interfaces:**
- Produces: `node scripts/check-typography.mjs` exits 0 only when the whole redesign (Tasks 2–5) is in place. Later tasks run it and check which failures disappear.

- [ ] **Step 1: Replace the script contents entirely with:**

```js
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const html = readFileSync(join(root, 'index.html'), 'utf8');
const css = readFileSync(join(root, 'styles.css'), 'utf8');
const readme = readFileSync(join(root, 'README.md'), 'utf8');
const orviaHtml = readFileSync(join(root, 'orvia/index.html'), 'utf8');
const orviaCss = readFileSync(join(root, 'orvia/styles.css'), 'utf8');
const source = `${html}\n${css}`;

function assert(condition, message) {
  if (!condition) {
    console.error(`Guardrail failed: ${message}`);
    process.exitCode = 1;
  }
}

// --- wiring ---
assert(existsSync(join(root, 'app.js')), 'app.js should exist');
assert(html.includes('href="./styles.css"'), 'index.html should load styles.css');
assert(html.includes('src="./app.js"'), 'index.html should load app.js');
assert(html.includes('href="./favicon.svg"'), 'index.html should load favicon.svg');
assert(existsSync(join(root, 'favicon.svg')), 'favicon.svg should exist');
assert(!html.includes('<style'), 'site styles should stay in styles.css');

// --- one typeface, self-hosted ---
assert(html.includes('href="./assets/fonts/inter/index.css"'), 'index.html should load the Inter package');
const interFiles = join(root, 'assets/fonts/inter/files');
assert(existsSync(interFiles), 'Inter woff2 files directory should exist');
assert(readdirSync(interFiles).some((n) => n.endsWith('.woff2')), 'Inter package should contain woff2 files');

for (const dir of ['assets/fonts/source-serif-4', 'assets/fonts/jetbrains-mono']) {
  assert(!existsSync(join(root, dir)), `${dir} must be deleted — Inter is the only typeface`);
}
assert(!existsSync(join(root, 'assets/images/gatekeeper-model-promotion.png')),
  'the Gatekeeper screenshot is retired; vignettes are hand-built HTML');

// --- tokens ---
assert(css.includes('--font-sans: "Inter Variable"'), 'missing --font-sans token');
assert(!css.includes('--font-serif'), 'the serif token must be gone');
assert(!css.includes('--font-mono'), 'the mono token must be gone');

for (const scale of [
  '--text-xs: 12px', '--text-sm: 14px', '--text-md: 16px', '--text-lg: 18px',
  '--text-xl: 24px', '--text-2xl: 32px', '--text-3xl: 48px', '--text-4xl: 64px',
]) {
  assert(css.includes(scale), `missing type scale value ${scale}`);
}

// --- selector rules ---
const selectorRules = [
  [/html,\s*body\s*\{[\s\S]*?font-family:\s*var\(--font-sans\);[\s\S]*?font-size:\s*var\(--text-md\);[\s\S]*?font-weight:\s*400;/, 'body defaults to Inter at 16px/400'],
  [/\.logo\s*\{[\s\S]*?font-weight:\s*700;/, 'the wordmark is Inter 700'],
  [/\.logo__secondary\s*\{\s*color:\s*var\(--muted\);\s*\}/, 'the .systems half only changes color, never font or size'],
];
for (const [pattern, message] of selectorRules) {
  assert(pattern.test(css), message);
}

// --- forbidden ---
for (const forbidden of [
  'Source Serif', 'JetBrains Mono', 'Syne', 'Archivo',
  'fonts.googleapis.com', 'fonts.gstatic.com',
  'font-weight: 300', 'font-weight: 800', 'font-weight: 900',
  'pixel-99', 'hero__mark', 'cinematic-title',
]) {
  assert(!source.includes(forbidden), `remove stale or forbidden content: ${forbidden}`);
}

const declaredWeights = [...css.matchAll(/font-weight:\s*([0-9]+)/g)].map((m) => Number(m[1]));
const allowedWeights = new Set([400, 500, 600, 700]);
for (const weight of declaredWeights) {
  assert(allowedWeights.has(weight), `font weight ${weight} is outside the documented system`);
}

// --- contact ---
assert(html.includes('mailto:sazid@ninetynine.systems'), 'the site-wide action must mail sazid@ninetynine.systems');

// --- the Orvia page is on the same system ---
assert(orviaHtml.includes('href="../assets/fonts/inter/index.css"'), 'orvia/index.html should load the shared Inter package');
assert(!`${orviaHtml}\n${orviaCss}`.includes('Archivo'), 'Archivo is retired from the Orvia page');
assert(!existsSync(join(root, 'orvia/fonts/archivo-variable.woff2')), 'the Archivo woff2 must be deleted');
assert(existsSync(join(root, 'orvia/LICENSE-thinking-orbs.txt')), 'the Thinking Orbs licence must stay');
assert(orviaCss.includes('--orb-ink'), 'the orb still reads --orb-ink from CSS');

// --- README documents the system ---
for (const claim of [
  'Inter is the only typeface',
  '12 / 14 / 16 / 18 / 24 / 32 / 48 / 64',
  'sazid@ninetynine.systems',
]) {
  assert(readme.includes(claim), `README should state: ${claim}`);
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log('Guardrail passed.');
```

- [ ] **Step 2: Run it to verify it fails against the old site**

Run: `node scripts/check-typography.mjs`
Expected: many `Guardrail failed:` lines (serif/mono dirs exist, old tokens present, `pixel-99` present, Orvia loads Archivo…), exit code 1. If it PASSES, the script is wrong — stop and fix.

- [ ] **Step 3: Do NOT commit yet** — the script is committed together with the homepage in Task 2 so no commit on `main` has a red gate against its own files. Move on.

---

### Task 2: Rewrite the homepage (index.html, styles.css, app.js)

**Files:**
- Modify: `index.html` (full replacement)
- Modify: `styles.css` (full replacement)
- Modify: `app.js` (full replacement)

**Interfaces:**
- Consumes: guardrail from Task 1.
- Produces: section ids `#systems`, `#studio` (Task 4's Orvia page links back to `/#systems`); classes `.reveal`/`.is-visible` shared between styles.css and app.js; `has-js` class on `<html>`.

- [ ] **Step 1: Replace `index.html` entirely with:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ninetynine.systems — software that has to keep working</title>
  <meta name="description" content="ninetynine.systems is a software studio. Four systems, each built to do one job well: Gatekeeper, Orvia, Planner, and Billhead.">
  <meta name="theme-color" content="#ffffff">

  <link rel="canonical" href="https://ninetynine.systems/">
  <link rel="icon" href="./favicon.svg" type="image/svg+xml">
  <link rel="preload" href="./assets/fonts/inter/files/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="./assets/fonts/inter/index.css">
  <link rel="stylesheet" href="./styles.css">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="ninetynine.systems">
  <meta property="og:url" content="https://ninetynine.systems/">
  <meta property="og:title" content="ninetynine.systems — software that has to keep working">
  <meta property="og:description" content="A software studio. Four systems, each built to do one job well: Gatekeeper, Orvia, Planner, and Billhead.">
  <meta name="twitter:card" content="summary">

  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ninetynine.systems",
      "url": "https://ninetynine.systems/",
      "email": "sazid@ninetynine.systems"
    }
  </script>
</head>
<body id="top">
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="site-nav" id="site-nav">
    <div class="shell site-nav__inner">
      <a class="logo" href="#top" aria-label="ninetynine.systems home">
        <span class="logo__primary">ninetynine</span><span class="logo__secondary">.systems</span>
      </a>

      <nav class="site-nav__links" aria-label="Primary navigation">
        <a href="#systems">Systems</a>
        <a href="#studio">Studio</a>
      </nav>

      <a class="pill pill--dark site-nav__cta" href="mailto:sazid@ninetynine.systems">Get in touch</a>
    </div>
  </header>

  <main id="main">
    <section class="hero" aria-labelledby="hero-title">
      <div class="shell">
        <h1 class="hero__title" id="hero-title">Software that has to<br>keep working.</h1>
        <p class="hero__deck">Four systems, each built to do one job well — and to still be doing it years from now.</p>
        <div class="hero__actions">
          <a class="pill pill--dark" href="mailto:sazid@ninetynine.systems">Get in touch</a>
          <a class="pill pill--light" href="#systems">See the systems</a>
        </div>
      </div>
    </section>

    <section class="systems" id="systems" aria-label="Systems">
      <p class="shell systems__label" aria-hidden="true">Systems</p>

      <article class="system reveal">
        <div class="shell system__inner">
          <div class="vig" aria-hidden="true">
            <div class="vig__bar"><span class="vig__dot"></span><span class="vig__dot"></span><span class="vig__dot"></span><span class="vig__name">gatekeeper — pending approvals</span></div>
            <div class="vig__body">
              <div class="approval">
                <p class="approval__title">Promote model v4.2 → production</p>
                <p class="approval__meta">requested by ci-runner · waiting on you</p>
                <p class="approval__actions"><span class="vig-pill vig-pill--dark">Approve</span><span class="vig-pill">Refuse</span></p>
              </div>
              <p class="approval__done">✓ Rotate signing key — approved by sarah, 2h ago</p>
            </div>
          </div>
          <div class="system__meta">
            <h2>Gatekeeper</h2>
            <p class="system__desc">Holds an action until a person approves it.</p>
            <p class="system__detail">A service or an agent asks for permission. The request goes to whoever is responsible. Nothing runs until they answer, and the answer is kept as a signed record.</p>
            <a class="system__link" href="https://gatekeeper.now/" target="_blank" rel="noopener noreferrer" aria-label="Visit gatekeeper.now (opens in a new tab)">gatekeeper.now <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </article>

      <article class="system system--alt reveal">
        <div class="shell system__inner">
          <div class="vig" aria-hidden="true">
            <div class="vig__bar"><span class="vig__dot"></span><span class="vig__dot"></span><span class="vig__dot"></span><span class="vig__name">orvia</span></div>
            <div class="vig__body">
              <p class="chat chat--theirs">dentist at 4 — traffic's building, leave by 3:20</p>
              <p class="chat chat--mine">book the cab</p>
              <p class="chat chat--theirs">done. also — you're out of coffee, want it on the list?</p>
            </div>
          </div>
          <div class="system__meta">
            <h2>Orvia</h2>
            <p class="system__desc">A mobile agent that helps with your daily life, and is part of it.</p>
            <p class="system__detail">It rides along on your phone: appointments, errands, the small logistics of a day. It learns your patterns and handles what it can, and asks when it shouldn't decide alone.</p>
            <a class="system__link" href="./orvia/">Coming soon <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </article>

      <article class="system reveal">
        <div class="shell system__inner">
          <div class="vig" aria-hidden="true">
            <div class="vig__bar"><span class="vig__dot"></span><span class="vig__dot"></span><span class="vig__dot"></span><span class="vig__name">planner — week 33</span></div>
            <div class="week">
              <div class="week__cell"><b>Mon 10</b><span class="week__note" style="width:85%"></span><span class="week__note" style="width:60%"></span></div>
              <div class="week__cell"><b>Tue 11</b><span class="week__note" style="width:70%"></span></div>
              <div class="week__cell"><b>Wed 12</b><span class="week__note" style="width:80%"></span><span class="week__note" style="width:45%"></span></div>
              <div class="week__cell"><b>Thu 13</b><span class="week__note" style="width:55%"></span></div>
              <div class="week__cell"><b>Fri 14</b><span class="week__note" style="width:75%"></span></div>
              <div class="week__cell"><b>Sat 15</b></div>
              <div class="week__cell"><b>Sun 16</b><span class="week__note" style="width:35%"></span></div>
              <div class="week__cell week__cell--notes"><b>Notes</b><span class="week__note" style="width:80%"></span><span class="week__note" style="width:65%"></span></div>
            </div>
          </div>
          <div class="system__meta">
            <h2>Planner</h2>
            <p class="system__desc">Your whole week on one page.</p>
            <p class="system__detail">Exactly like the paper diaries that put seven days on a spread: the week at a glance, room to write, nothing to configure. A place for notes, not another calendar.</p>
            <p class="system__status">In the workshop</p>
          </div>
        </div>
      </article>

      <article class="system system--alt reveal">
        <div class="shell system__inner">
          <div class="vig" aria-hidden="true">
            <div class="vig__bar"><span class="vig__dot"></span><span class="vig__dot"></span><span class="vig__dot"></span><span class="vig__name">billhead — invoice #0042</span></div>
            <div class="vig__body">
              <p class="invoice__head"><span class="invoice__customer">Rahman Timber &amp; Sons</span><span>12 Aug 2026</span></p>
              <p class="invoice__row"><span>Timber, 40 ft</span><span>2,400</span></p>
              <p class="invoice__row"><span>Cutting charge</span><span>150</span></p>
              <p class="invoice__row"><span>Delivery</span><span>300</span></p>
              <p class="invoice__row invoice__row--total"><span>Total due</span><span>2,850</span></p>
              <p class="invoice__actions"><span class="vig-pill">Print</span><span class="vig-pill">Share</span><span class="vig-pill">Mark paid</span></p>
            </div>
          </div>
          <div class="system__meta">
            <h2>Billhead</h2>
            <p class="system__desc">Invoices for businesses that run on paper and handshakes.</p>
            <p class="system__detail">Track what you've billed, share it over any app, print it when the customer wants paper. Built for small businesses and people just starting out, especially in the physical market.</p>
            <p class="system__status">Coming soon</p>
          </div>
        </div>
      </article>
    </section>

    <section class="studio reveal" id="studio" aria-labelledby="studio-title">
      <div class="shell">
        <h2 id="studio-title">We also build for other people.</h2>
        <p class="studio__deck">The same standard we hold our own systems to, applied to yours. Client work, in any line of work that touches software.</p>
        <a class="pill pill--dark" href="mailto:sazid@ninetynine.systems">Get in touch</a>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="shell footer__grid">
      <div class="footer__col footer__col--studio">
        <p class="footer__wordmark">ninetynine<span>.systems</span></p>
        <p class="footer__blurb">An independent software studio.</p>
      </div>
      <nav class="footer__col" aria-label="Systems">
        <p class="footer__head">Systems</p>
        <a href="https://gatekeeper.now/" target="_blank" rel="noopener noreferrer">Gatekeeper</a>
        <a href="./orvia/">Orvia</a>
        <span>Planner</span>
        <span>Billhead</span>
      </nav>
      <nav class="footer__col" aria-label="Studio">
        <p class="footer__head">Studio</p>
        <a href="#studio">Client work</a>
      </nav>
      <div class="footer__col">
        <p class="footer__head">Contact</p>
        <a href="mailto:sazid@ninetynine.systems">sazid@ninetynine.systems</a>
      </div>
    </div>
    <div class="shell footer__legal">
      <p>© 2026 ninetynine.systems</p>
    </div>
  </footer>

  <script src="./app.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Replace `styles.css` entirely with:**

```css
/* ninetynine.systems — x.ai-style system: white page, Inter only, pill
   controls, four equal product rows with hand-built window vignettes.
   Spec: docs/superpowers/specs/2026-08-13-xai-style-redesign-design.md */

:root {
  --font-sans: "Inter Variable", system-ui, -apple-system, "Segoe UI", sans-serif;

  --text-xs: 12px;
  --text-sm: 14px;
  --text-md: 16px;
  --text-lg: 18px;
  --text-xl: 24px;
  --text-2xl: 32px;
  --text-3xl: 48px;
  --text-4xl: 64px;

  --page: #ffffff;
  --ink: #111111;
  --muted: #6b6b6b;
  /* Decorative only: inside aria-hidden vignettes, never on real text. */
  --faint: #9a9a9a;
  --line: #ececec;
  --card: #fafafa;
  --vig-edge: #e8e8e8;
  --pill-bg: #f2f2f2;

  --radius-control: 999px;
  --radius-card: 14px;
  --radius-vig: 12px;

  --shell: 1080px;
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}

html, body {
  margin: 0;
  padding: 0;
  background: var(--page);
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: var(--text-md);
  font-weight: 400;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

p { margin: 0; }

a { color: inherit; }

:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 2px;
  border-radius: 2px;
}

.shell {
  max-width: var(--shell);
  margin-inline: auto;
  padding-inline: 24px;
}

.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  background: var(--ink);
  color: var(--page);
  padding: 10px 18px;
  border-radius: 0 0 8px 0;
  z-index: 100;
}

.skip-link:focus { left: 0; }

/* --- nav ------------------------------------------------------------- */

.site-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--page);
  border-bottom: 1px solid transparent;
}

.site-nav.is-scrolled { border-bottom-color: var(--line); }

.site-nav__inner {
  display: flex;
  align-items: center;
  gap: 28px;
  padding-block: 14px;
}

.logo {
  font-size: var(--text-lg);
  font-weight: 700;
  letter-spacing: -0.02em;
  text-decoration: none;
  padding-block: 4px;
}

.logo__secondary { color: var(--muted); }

.site-nav__links {
  display: flex;
  gap: 22px;
  margin-inline: auto;
}

.site-nav__links a {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--muted);
  text-decoration: none;
  padding-block: 6px;
}

.site-nav__links a:hover { color: var(--ink); }

/* --- pills ----------------------------------------------------------- */

.pill {
  display: inline-block;
  border-radius: var(--radius-control);
  padding: 10px 20px;
  font-size: var(--text-sm);
  font-weight: 500;
  line-height: 1.2;
  text-decoration: none;
  white-space: nowrap;
}

.pill--dark {
  background: var(--ink);
  color: var(--page);
}

.pill--dark:hover { background: #2c2c2c; }

.pill--light {
  background: var(--pill-bg);
  color: var(--ink);
}

.pill--light:hover { background: #e8e8e8; }

.site-nav__cta { padding: 8px 18px; }

/* --- hero ------------------------------------------------------------ */

.hero {
  text-align: center;
  padding-block: 96px 88px;
}

.hero__title {
  margin: 0 0 20px;
  font-size: clamp(40px, 7vw, var(--text-4xl));
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.06;
}

.hero__deck {
  max-width: 460px;
  margin-inline: auto;
  font-size: var(--text-lg);
  color: var(--muted);
  text-wrap: balance;
}

.hero__actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 30px;
}

/* --- systems index --------------------------------------------------- */

.systems__label {
  font-size: var(--text-sm);
  color: var(--muted);
  padding-block: 20px 14px;
  border-top: 1px solid var(--line);
}

.system { border-top: 1px solid var(--line); }

.system--alt { background: var(--card); }

.system__inner {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 48px;
  align-items: center;
  padding-block: 56px;
}

.system__meta h2 {
  margin: 0 0 8px;
  font-size: var(--text-xl);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.system__desc {
  font-size: var(--text-md);
  color: var(--ink);
  margin-bottom: 8px;
}

.system__detail {
  font-size: var(--text-sm);
  color: var(--muted);
  max-width: 52ch;
  margin-bottom: 16px;
}

.system__link {
  font-size: var(--text-sm);
  font-weight: 500;
  text-decoration: none;
}

.system__link:hover { text-decoration: underline; }

.system__status {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--muted);
}

/* --- vignettes (decorative, aria-hidden) ------------------------------ */

.vig {
  background: var(--page);
  border: 1px solid var(--vig-edge);
  border-radius: var(--radius-vig);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  font-size: var(--text-sm);
}

.vig__bar {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 9px 12px;
  background: var(--card);
  border-bottom: 1px solid var(--line);
}

.vig__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #dddddd;
}

.vig__name {
  margin-left: 6px;
  font-size: var(--text-xs);
  color: var(--faint);
}

.vig__body { padding: 14px; }

.approval {
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 10px;
}

.approval__title { font-weight: 600; margin-bottom: 2px; }

.approval__meta {
  font-size: var(--text-xs);
  color: var(--faint);
  margin-bottom: 10px;
}

.approval__actions { display: flex; gap: 6px; }

.approval__done {
  font-size: var(--text-xs);
  color: var(--faint);
}

.vig-pill {
  display: inline-block;
  border-radius: var(--radius-control);
  padding: 5px 14px;
  font-size: var(--text-xs);
  font-weight: 500;
  background: var(--pill-bg);
}

.vig-pill--dark {
  background: var(--ink);
  color: var(--page);
}

.chat {
  border-radius: 10px;
  padding: 8px 11px;
  margin-bottom: 8px;
  max-width: 80%;
  line-height: 1.4;
}

.chat--theirs { background: var(--pill-bg); }

.chat--mine {
  background: var(--ink);
  color: var(--page);
  max-width: 55%;
  margin-left: auto;
}

.week {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  font-size: var(--text-xs);
}

.week__cell {
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: 9px;
  min-height: 56px;
}

.week__cell:nth-child(4n) { border-right: none; }
.week__cell:nth-child(n+5) { border-bottom: none; }

.week__cell b {
  display: block;
  font-weight: 600;
  margin-bottom: 5px;
}

.week__cell--notes { background: var(--card); }

.week__note {
  display: block;
  height: 4px;
  border-radius: 2px;
  background: var(--line);
  margin-block: 5px;
}

.invoice__head {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-xs);
  color: var(--faint);
  margin-bottom: 8px;
}

.invoice__customer { font-weight: 600; color: #333333; }

.invoice__row {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-xs);
  color: var(--muted);
  padding-block: 3px;
}

.invoice__row--total {
  border-top: 1px solid var(--line);
  margin-top: 5px;
  padding-top: 7px;
  color: var(--ink);
  font-weight: 600;
}

.invoice__actions {
  display: flex;
  gap: 6px;
  margin-top: 10px;
}

/* --- studio ----------------------------------------------------------- */

.studio {
  text-align: center;
  padding-block: 88px;
  border-top: 1px solid var(--line);
}

.studio h2 {
  margin: 0 0 12px;
  font-size: var(--text-2xl);
  font-weight: 600;
  letter-spacing: -0.03em;
}

.studio__deck {
  max-width: 440px;
  margin-inline: auto;
  color: var(--muted);
  margin-bottom: 24px;
  text-wrap: balance;
}

/* --- footer ----------------------------------------------------------- */

.footer { border-top: 1px solid var(--line); }

.footer__grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 32px;
  padding-block: 44px;
}

.footer__wordmark {
  font-size: var(--text-md);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.footer__wordmark span { color: var(--muted); }

.footer__blurb {
  font-size: var(--text-sm);
  color: var(--muted);
  margin-top: 6px;
}

.footer__col { display: flex; flex-direction: column; gap: 8px; }

.footer__head {
  font-size: var(--text-sm);
  font-weight: 600;
}

.footer__col a,
.footer__col span {
  font-size: var(--text-sm);
  color: var(--muted);
  text-decoration: none;
  width: fit-content;
}

.footer__col a:hover { color: var(--ink); }

.footer__legal {
  border-top: 1px solid var(--line);
  padding-block: 16px;
  font-size: var(--text-xs);
  color: var(--muted);
}

/* --- reveal on scroll -------------------------------------------------
   JS adds .is-visible as rows enter the viewport. Without JS (no .has-js)
   or with reduced motion, everything is simply visible. */

@media (prefers-reduced-motion: no-preference) {
  .has-js .reveal {
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  .has-js .reveal.is-visible {
    opacity: 1;
    transform: none;
  }
}

/* --- small screens ----------------------------------------------------- */

@media (max-width: 820px) {
  .site-nav__links { display: none; }

  .site-nav__inner { justify-content: space-between; }

  .hero { padding-block: 64px 56px; }

  .system__inner {
    grid-template-columns: 1fr;
    gap: 28px;
    padding-block: 40px;
  }

  .vig { max-width: 440px; }

  .footer__grid { grid-template-columns: 1fr 1fr; padding-block: 32px; }
}
```

- [ ] **Step 3: Replace `app.js` entirely with:**

```js
document.documentElement.classList.add("has-js");

// Hairline under the sticky header once you have scrolled.
(function initNav() {
  var nav = document.getElementById("site-nav");
  if (!nav) return;

  var queued = false;

  var update = function () {
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
    queued = false;
  };

  var requestUpdate = function () {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(update);
  };

  requestUpdate();
  window.addEventListener("scroll", requestUpdate, { passive: true });
})();

// Rows fade in as they enter the viewport. Skipped entirely under reduced
// motion; without JavaScript the page renders fully visible.
(function initReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  var targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });

  targets.forEach(function (target) { observer.observe(target); });
})();
```

- [ ] **Step 4: Syntax-check and run the guardrail**

Run: `node --check app.js && node scripts/check-typography.mjs; echo "exit: $?"`
Expected: still exit 1, but the ONLY remaining failures are:
- the two font directories and the Gatekeeper PNG still existing (Task 3),
- the Orvia assertions (Task 4),
- the README assertions (Task 5).

No failure may mention index.html, styles.css, tokens, weights, or forbidden strings. If one does, fix the file it names before moving on.

- [ ] **Step 5: Commit**

```bash
git add scripts/check-typography.mjs index.html styles.css app.js
git commit -m "rebuild the homepage in the x.ai design language"
```

---

### Task 3: Delete retired assets

**Files:**
- Delete: `assets/fonts/source-serif-4/` (whole directory)
- Delete: `assets/fonts/jetbrains-mono/` (whole directory)
- Delete: `assets/images/gatekeeper-model-promotion.png`

**Interfaces:**
- Consumes: Task 2's index.html, which no longer references any of these.

- [ ] **Step 1: Verify nothing references them anymore**

Run: `grep -rn "source-serif-4\|jetbrains-mono\|gatekeeper-model-promotion" index.html styles.css app.js orvia/ README.md; echo "exit: $?"`
Expected: no matches — `exit: 1` (grep exits 1 when nothing matches). Any match in index.html/styles.css means Task 2 was done wrong — fix it first. A match in README.md is tolerable only until Task 5 replaces it.

- [ ] **Step 2: Delete**

```bash
git rm -r assets/fonts/source-serif-4 assets/fonts/jetbrains-mono
git rm assets/images/gatekeeper-model-promotion.png
```

- [ ] **Step 3: Run the guardrail**

Run: `node scripts/check-typography.mjs; echo "exit: $?"`
Expected: exit 1, remaining failures ONLY about Orvia (Task 4) and README (Task 5).

- [ ] **Step 4: Commit**

```bash
git commit -m "delete the serif and mono font packages and the gatekeeper screenshot"
```

---

### Task 4: Bring the Orvia page onto the system

**Files:**
- Modify: `orvia/index.html` (full replacement)
- Modify: `orvia/styles.css` (full replacement)
- Delete: `orvia/fonts/archivo-variable.woff2`, `orvia/fonts/OFL.txt`
- Keep untouched: `orvia/orb.js`, `orvia/LICENSE-thinking-orbs.txt`, `orvia/favicon.svg`

**Interfaces:**
- Consumes: `../assets/fonts/inter/index.css` (family `"Inter Variable"`); `orb.js`'s `mountOrb(canvas)` which reads the CSS custom property `--orb-ink` (an "R, G, B" string) from the canvas.
- Produces: nothing later tasks use.

- [ ] **Step 1: Replace `orvia/index.html` entirely with:**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Orvia — a mobile agent for your daily life</title>
<meta name="description" content="Orvia is a mobile agent that helps with your daily life, and is part of it. Coming soon from ninetynine.systems.">
<meta name="theme-color" content="#ffffff">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../assets/fonts/inter/index.css">
<link rel="stylesheet" href="styles.css">
</head>
<body>

<header class="page-nav">
  <a class="logo" href="../">ninetynine<span>.systems</span></a>
  <a class="pill" href="mailto:sazid@ninetynine.systems">Get in touch</a>
</header>

<main>
  <canvas id="orb" role="img" aria-label="The Orvia mark: a ribbon of dots, composing."></canvas>

  <h1>Orvia</h1>
  <p class="tagline">A mobile agent that helps with your daily life, and is part of it.</p>
  <p class="soon">Coming soon</p>
</main>

<footer>
  <p>© 2026 ninetynine.systems</p>
</footer>

<script src="orb.js" defer></script>
<script defer>
  addEventListener("DOMContentLoaded", function () {
    mountOrb(document.getElementById("orb"));
  });
</script>
</body>
</html>
```

- [ ] **Step 2: Replace `orvia/styles.css` entirely with:**

```css
/* Orvia — one screen, no scroll, on the site-wide system: white page,
   Inter only. The orb in the middle is Thinking Orbs (MIT) — see orb.js.
   It reads --orb-ink ("R, G, B") from the canvas's computed style. */

:root {
  --page: #ffffff;
  --ink: #111111;
  --muted: #6b6b6b;
  --line: #ececec;
  --orb-ink: 17, 17, 17;
  --font-sans: "Inter Variable", system-ui, -apple-system, "Segoe UI", sans-serif;
}

* { box-sizing: border-box; }

html, body {
  height: 100%;
  overflow: hidden;
}

body {
  margin: 0;
  display: flex;
  flex-direction: column;
  padding: max(16px, env(safe-area-inset-top)) 24px max(16px, env(safe-area-inset-bottom));
  background: var(--page);
  color: var(--ink);
  font-family: var(--font-sans);
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  text-align: center;
}

.page-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink);
  text-decoration: none;
  padding-block: 6px;
}

.logo span { color: var(--muted); }

.pill {
  border-radius: 999px;
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 500;
  background: var(--ink);
  color: var(--page);
  text-decoration: none;
}

.pill:hover { background: #2c2c2c; }

:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 2px;
  border-radius: 2px;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
}

#orb {
  display: block;
  width: clamp(44px, 9.5vmin, 85px);
  height: clamp(44px, 9.5vmin, 85px);
  margin-bottom: clamp(22px, 5vh, 52px);
}

h1 {
  margin: 0 0 clamp(14px, 2.2vh, 24px);
  font-weight: 600;
  font-size: clamp(44px, 8vmin, 72px);
  line-height: 1;
  letter-spacing: -0.035em;
}

.tagline {
  margin: 0;
  max-width: 34ch;
  font-size: clamp(16px, 2.5vmin, 20px);
  line-height: 1.5;
  color: var(--muted);
  text-wrap: balance;
}

.soon {
  margin: clamp(22px, 4.2vh, 46px) 0 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--muted);
}

footer {
  border-top: 1px solid var(--line);
  padding-top: 14px;
}

footer p {
  margin: 0;
  font-size: 12px;
  color: var(--muted);
}

/* Short landscape windows: keep everything on one screen. */
@media (max-height: 560px) {
  #orb {
    width: clamp(34px, 6.5vmin, 46px);
    height: clamp(34px, 6.5vmin, 46px);
    margin-bottom: 18px;
  }
  h1 {
    font-size: clamp(30px, 6.5vmin, 52px);
    margin-bottom: 10px;
  }
  .tagline { font-size: clamp(14px, 2.2vmin, 17px); }
  .soon { margin-top: 18px; }
}
```

- [ ] **Step 3: Delete the Archivo files**

```bash
git rm orvia/fonts/archivo-variable.woff2 orvia/fonts/OFL.txt
```

(If `orvia/fonts/` is now empty, git removes the directory automatically.)

- [ ] **Step 4: Run the guardrail**

Run: `node scripts/check-typography.mjs; echo "exit: $?"`
Expected: exit 1, remaining failures ONLY about the three README claims (Task 5).

- [ ] **Step 5: Commit**

```bash
git add orvia/
git commit -m "restyle the orvia page onto the site-wide system"
```

---

### Task 5: Rewrite the README

**Files:**
- Modify: `README.md` (full replacement)

**Interfaces:**
- Consumes: guardrail asserts the README contains the exact strings `Inter is the only typeface`, `12 / 14 / 16 / 18 / 24 / 32 / 48 / 64`, and `sazid@ninetynine.systems` — all present below.

- [ ] **Step 1: Replace `README.md` entirely with:**

```markdown
# ninetynine.systems landing page

Static GitHub Pages site for `ninetynine.systems`.

## Design language

The site follows the x.ai-style system specified in
`docs/superpowers/specs/2026-08-13-xai-style-redesign-design.md`: a pure white
page (`#ffffff`), near-black text, pill-shaped controls, and the four products
presented as equal full-width index rows that alternate white and faint gray.
No badge chips ("NEW", "LIVE"), no numbered stat rows, no sales language. The
site-wide action is "Get in touch", which mails sazid@ninetynine.systems.

## Typography

**Inter is the only typeface.** It is packaged locally under
`assets/fonts/inter/` (family `"Inter Variable"`) so the site renders
consistently without runtime Google Fonts requests. Source Serif 4, JetBrains
Mono, Archivo, and Syne are all retired and must not return.

Required scale: `12 / 14 / 16 / 18 / 24 / 32 / 48 / 64` with `16px` as the
body default. The hero clamps down from `64px` on small screens.

Allowed weights: `400` body, `500` labels and controls, `600` headings,
`700` the wordmark. `300`, `800` and `900` are forbidden.

Headlines use tight negative tracking (about `-0.03em`) at weight `600` —
large and quiet, never bold and loud.

## Layout

The site remains zero-build and GitHub Pages-native, with responsibilities
split across:

- `index.html` — semantic content and metadata.
- `styles.css` — tokens, layout, vignettes, and the reveal transition.
- `app.js` — the header hairline on scroll and the reveal-on-scroll
  IntersectionObserver. Nothing else.
- `orvia/` — the Orvia product page, served at `/orvia/`. See below.

The four product rows each pair a decorative window vignette (hand-built
HTML/CSS, `aria-hidden`) with the real text. The vignettes are the only place
lighter grays are allowed; real text uses only `--ink` and `--muted`, both of
which clear WCAG 2.2 AA against white.

Rows fade in as they enter the viewport. The effect is additive: it only
engages when JavaScript is running (`.has-js`) AND the user has no
reduced-motion preference. In every other case the page renders fully visible.

## The Orvia page

`orvia/` is a one-screen splash on the same system: white page, Inter, the
slim nav, and a thin copyright bar. The orb is
[Thinking Orbs](https://github.com/Jakubantalik/thinking-orbs) by Jakub
Antalik, MIT licensed, ported to plain browser JavaScript in `orvia/orb.js`.
The licence is kept beside it in `orvia/LICENSE-thinking-orbs.txt` and must
stay there. The orb reads its color from the `--orb-ink` custom property.

## Validation

Run the guardrail before deploying:

```bash
node scripts/check-typography.mjs
```

It checks the wiring, the one-typeface rule, the type scale, the allowed
weights, the retired assets, the contact address, and that the Orvia page
stays on the system. GitHub Pages runs it during deployment.
```

- [ ] **Step 2: Run the guardrail — first full green**

Run: `node scripts/check-typography.mjs; echo "exit: $?"`
Expected: `Guardrail passed.` and `exit: 0`. If anything fails, fix the file the message names.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "document the single-typeface x.ai-style system"
```

---

### Task 6: Browser verification

**Files:**
- None expected; fix-ups go into the file the problem names.

- [ ] **Step 1: Start the preview and load the homepage**

Use the `site` entry in `.claude/launch.json` (python3 http.server on port 4599). Load `http://localhost:4599/`.

- [ ] **Step 2: Check for errors**

Read the browser console and network log. Expected: no console errors; every request 200 (fonts, styles.css, app.js, favicon). A 404 means a stale path in index.html.

- [ ] **Step 3: Verify structure and content**

Read the rendered page (accessibility tree) and confirm:
- One h1 ("Software that has to keep working."), h2s: Gatekeeper, Orvia, Planner, Billhead, "We also build for other people."
- No "NEW"/"LIVE"/"EARLY BETA" text anywhere. No "01"/"02"/"03" row.
- All three "Get in touch" links (nav, studio, footer) point to `mailto:sazid@ninetynine.systems`.
- Gatekeeper row links to `https://gatekeeper.now/`; Orvia row links to `./orvia/`; Planner shows "In the workshop" and Billhead "Coming soon" as plain text, not links.
- Tab through the page: skip link appears first; every link shows a visible focus outline.

- [ ] **Step 4: Verify the reveal behaves**

Scroll to the bottom; all four rows and the studio section must become fully visible (opacity 1). Then emulate `prefers-reduced-motion: reduce` (browser dev tools or resize_window colorScheme equivalent) and reload: content must be visible immediately with no transitions.

- [ ] **Step 5: Verify mobile layout**

Resize to 375px width and reload. Confirm: nav shows wordmark + pill only, rows stack with the vignette above the text, no horizontal scrolling anywhere on the page.

- [ ] **Step 6: Verify the Orvia page**

Load `http://localhost:4599/orvia/`. Confirm: white page, Inter rendering (no Archivo request in the network log), orb animating in dark ink, tagline "A mobile agent that helps with your daily life, and is part of it.", nav wordmark links back to `../`, no console errors, everything on one screen without scrolling at desktop and at 375px.

- [ ] **Step 7: Take screenshots**

Capture the homepage (desktop and 375px) and the Orvia page; share them with the user as the proof of the change.

- [ ] **Step 8: Final green run and wrap-up**

Run: `node --check app.js && node scripts/check-typography.mjs && git status --short; echo "exit: $?"`
Expected: `Guardrail passed.`, exit 0, and a clean tree (or only intentional fix-ups staged — commit those with a message naming what they fix). After this passes, the branch is safe to push; pushing to `main` triggers the Pages deploy which reruns the guardrail.

---

## Self-review notes

- Spec coverage: nav/hero/index/studio/footer → Task 2; chip ban and email → Tasks 1–2 (guardrail-enforced); font/PNG removals → Task 3; Orvia → Task 4; README + guardrail rewrite → Tasks 1 and 5; fade-in + reduced motion → Tasks 2 and 6; AA constraints → Task 2 tokens + Task 6 checks. The old mission/three-questions/Gatekeeper-feature sections disappear because index.html is replaced wholesale.
- The guardrail's `hero__mark`/`pixel-99`/`cinematic-title` forbidden strings pin the removal of the glitch mark and serif titles.
- Planner/Billhead have no links by design (spec: render as plain text until pages exist).
```
