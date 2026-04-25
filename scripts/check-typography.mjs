import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = join(root, 'index.html');
const html = readFileSync(indexPath, 'utf8');

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
  './assets/fonts/syne/index.css',
]) {
  assert(html.includes(`href="${href}"`), `index.html should load ${href}`);
  const cssPath = join(root, href.replace(/^\.\//, ''));
  assert(existsSync(cssPath), `${href} should exist`);
  const filesDir = join(dirname(cssPath), 'files');
  assert(existsSync(filesDir), `${href} should have a files directory`);
  assert(readdirSync(filesDir).some((name) => name.endsWith('.woff2')), `${href} should include packaged woff2 fonts`);
}

for (const token of [
  '--font-sans: "Inter Variable"',
  '--font-serif: "Source Serif 4 Variable"',
  '--font-mono: "JetBrains Mono Variable"',
  '--font-display: "Syne Variable"',
  '--font-ui: var(--font-sans)',
  '--font-reading: var(--font-serif)',
  '--font-code: var(--font-mono)',
  '--font-brand: var(--font-display)',
  '--font-wordmark: var(--font-serif)',
  '--font-user-message: var(--font-ui)',
  '--font-ai-response: var(--font-reading)',
  '--font-heading: var(--font-brand)',
  '--font-dashboard: var(--font-ui)',
  '--font-diagram: var(--font-ui)',
]) {
  assert(html.includes(token), `missing CSS token ${token}`);
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
  [/html, body \{[\s\S]*?font-family: var\(--font-ui\);/, 'body defaults to Inter/UI'],
  [/\.logo__primary \{[\s\S]*?font-family: var\(--font-wordmark\);[\s\S]*?font-weight: 400;/, 'primary logo uses regular Source Serif 4 wordmark font'],
  [/\.logo__secondary \{[\s\S]*?font-family: var\(--font-ui\);[\s\S]*?font-weight: 400;[\s\S]*?letter-spacing: 0\.14em;/, 'secondary logo uses regular spaced Inter/UI font'],
  [/\.overlay-panel__body \{[\s\S]*?font-family: var\(--font-reading\);/, 'reading panels use Source Serif 4'],
  [/\.ident \{[\s\S]*?font-family: var\(--font-code\);/, 'identifier metadata uses JetBrains Mono'],
  [/\.app-panel__platform \{[\s\S]*?font-family: var\(--font-code\);/, 'structured platform rows use JetBrains Mono'],
  [/\.about-toggle \{[\s\S]*?font-family: var\(--font-ui\);/, 'controls use Inter/UI'],
  [/\.app-nav \{[\s\S]*?font-family: var\(--font-ui\);/, 'navigation uses Inter/UI'],
];

for (const [pattern, message] of selectorRules) {
  assert(pattern.test(html), message);
}

for (const forbidden of [
  'Cormorant Garamond',
  'DM Mono',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'font-weight: 300',
  'font-weight: 800',
  'font-weight: 900',
]) {
  assert(!html.includes(forbidden), `remove stale/forbidden typography: ${forbidden}`);
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log('Typography check passed.');
