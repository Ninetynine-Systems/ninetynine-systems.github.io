import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = join(root, 'index.html');
const readmePath = join(root, 'README.md');
const html = readFileSync(indexPath, 'utf8');
const readme = readFileSync(readmePath, 'utf8');

function assert(condition, message) {
  if (!condition) {
    console.error(`Typography check failed: ${message}`);
    process.exitCode = 1;
  }
}

for (const href of [
  './assets/fonts/inter/index.css',
  './assets/fonts/source-serif-4/index.css',
  './assets/fonts/jetbrains-mono/index.css',
]) {
  assert(html.includes(`href="${href}"`), `index.html should load ${href}`);
  const cssPath = join(root, href.replace(/^\.\//, ''));
  assert(existsSync(cssPath), `${href} should exist`);
  const filesDir = join(dirname(cssPath), 'files');
  assert(existsSync(filesDir), `${href} should have a files directory`);
  assert(readdirSync(filesDir).some((name) => name.endsWith('.woff2')), `${href} should include packaged woff2 fonts`);
}

assert(!existsSync(join(root, 'assets/fonts/syne')), 'Syne font assets must not be present');
assert(!html.includes('assets/fonts/syne'), 'index.html must not load Syne');

for (const token of [
  '--font-sans: "Inter Variable"',
  '--font-serif: "Source Serif 4 Variable"',
  '--font-mono: "JetBrains Mono Variable"',
  '--font-ui: var(--font-sans)',
  '--font-reading: var(--font-serif)',
  '--font-code: var(--font-mono)',
  '--font-user-message: var(--font-ui)',
  '--font-ai-response: var(--font-reading)',
  '--font-dashboard: var(--font-ui)',
  '--font-diagram: var(--font-ui)',
]) {
  assert(html.includes(token), `missing CSS token ${token}`);
}

for (const removedToken of [
  '--font-display',
  '--font-brand',
  '--font-wordmark',
  '--font-heading',
]) {
  assert(!html.includes(removedToken), `remove unnecessary/display token ${removedToken}`);
}

for (const scale of [
  '--text-xs: 12px',
  '--text-sm: 14px',
  '--text-md: 16px',
  '--text-lg: 18px',
  '--text-xl: 24px',
  '--text-2xl: 32px',
  '--text-3xl: 48px',
  '--text-4xl: 64px',
]) {
  assert(html.includes(scale), `missing type scale value ${scale}`);
}

const selectorRules = [
  [/html, body \{[\s\S]*?font-family: var\(--font-ui\);[\s\S]*?font-size: var\(--text-md\);[\s\S]*?font-weight: 400;/, 'body defaults to Inter/UI at 16px/400'],
  [/\.logo__primary \{[\s\S]*?font-family: var\(--font-reading\);[\s\S]*?font-weight: 300;[\s\S]*?letter-spacing: -0\.045em;/, 'primary logo uses accepted Source Serif 4 300 logo exception'],
  [/\.logo__secondary \{[\s\S]*?font-family: var\(--font-ui\);[\s\S]*?font-weight: 400;[\s\S]*?letter-spacing: 0\.14em;[\s\S]*?color: var\(--accent\);/, 'secondary logo uses accepted spaced red Inter/UI exception'],
  [/\.overlay-panel__body \{[\s\S]*?font-family: var\(--font-reading\);/, 'reading panels use Source Serif 4'],
  [/\.ident \{[\s\S]*?font-family: var\(--font-code\);/, 'identifier metadata uses JetBrains Mono'],
  [/\.app-panel__platform \{[\s\S]*?font-family: var\(--font-code\);/, 'structured platform rows use JetBrains Mono'],
  [/\.app-panel__title \{[\s\S]*?font-family: var\(--font-ui\);/, 'product headings use Inter/UI'],
  [/\.about-toggle \{[\s\S]*?font-family: var\(--font-ui\);/, 'controls use Inter/UI'],
  [/\.app-nav \{[\s\S]*?font-family: var\(--font-ui\);/, 'navigation uses Inter/UI'],
];

for (const [pattern, message] of selectorRules) {
  assert(pattern.test(html), message);
}

for (const forbidden of [
  'Syne',
  'Cormorant Garamond',
  'DM Mono',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'font-weight: 800',
  'font-weight: 900',
]) {
  assert(!html.includes(forbidden), `remove stale/forbidden typography from index.html: ${forbidden}`);
}

const lightWeightMatches = html.match(/font-weight:\s*300/g) ?? [];
assert(lightWeightMatches.length === 1, 'font-weight 300 is allowed only once for the Ninetynine logo');

assert(readme.includes('Logo-only exception'), 'README should document the logo-only exception');
assert(readme.includes('Ninetynine` — Source Serif 4, weight `300`'), 'README should document the Ninetynine logo typography');
assert(readme.includes('3-font typography system'), 'README should document the 3-font typography system');
assert(readme.includes('Syne is explicitly removed'), 'README should document that Syne is removed');

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log('Typography check passed.');
