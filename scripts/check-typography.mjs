import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = join(root, 'index.html');
const cssPath = join(root, 'styles.css');
const scriptPath = join(root, 'app.js');
const readmePath = join(root, 'README.md');

const html = readFileSync(htmlPath, 'utf8');
const css = readFileSync(cssPath, 'utf8');
const readme = readFileSync(readmePath, 'utf8');
const source = `${html}\n${css}`;

function assert(condition, message) {
  if (!condition) {
    console.error(`Typography check failed: ${message}`);
    process.exitCode = 1;
  }
}

assert(existsSync(scriptPath), 'app.js should exist');
assert(html.includes('href="./styles.css"'), 'index.html should load styles.css');
assert(html.includes('src="./app.js"'), 'index.html should load app.js');
assert(html.includes('href="./favicon.svg"'), 'index.html should load favicon.svg');
assert(existsSync(join(root, 'favicon.svg')), 'favicon.svg should exist');

for (const asset of [
  './assets/images/gatekeeper-model-promotion.png',
]) {
  assert(html.includes(asset), `index.html should reference ${asset}`);
  assert(existsSync(join(root, asset.replace(/^\.\//, ''))), `${asset} should exist`);
}

for (const href of [
  './assets/fonts/inter/index.css',
  './assets/fonts/source-serif-4/index.css',
  './assets/fonts/jetbrains-mono/index.css',
]) {
  assert(html.includes(`href="${href}"`), `index.html should load ${href}`);
  const fontCssPath = join(root, href.replace(/^\.\//, ''));
  assert(existsSync(fontCssPath), `${href} should exist`);
  const filesDir = join(dirname(fontCssPath), 'files');
  assert(existsSync(filesDir), `${href} should have a files directory`);
  assert(readdirSync(filesDir).some((name) => name.endsWith('.woff2')), `${href} should include packaged woff2 fonts`);
}

assert(!existsSync(join(root, 'assets/fonts/syne')), 'Syne font assets must not be present');

for (const token of [
  '--font-sans: "Inter Variable"',
  '--font-serif: "Source Serif 4 Variable"',
  '--font-mono: "JetBrains Mono Variable"',
  '--font-ui: var(--font-sans)',
  '--font-reading: var(--font-serif)',
  '--font-code: var(--font-mono)',
]) {
  assert(css.includes(token), `missing CSS token ${token}`);
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
  assert(css.includes(scale), `missing type scale value ${scale}`);
}

const selectorRules = [
  [/html,\s*body\s*\{[\s\S]*?font-family:\s*var\(--font-ui\);[\s\S]*?font-size:\s*var\(--text-md\);[\s\S]*?font-weight:\s*400;/, 'body defaults to Inter/UI at 16px/400'],
  [/\.logo\s*\{[\s\S]*?font-family:\s*var\(--font-reading\);[\s\S]*?font-size:\s*23px;[\s\S]*?font-weight:\s*300;[\s\S]*?letter-spacing:\s*-0\.045em;/, 'the whole wordmark uses Source Serif 4 300 at one size'],
  [/\.logo__secondary\s*\{\s*color:\s*var\(--accent\);\s*\}/, 'the .systems half only sets the accent colour, never its own font or size'],
  [/\.hero__title\s*\{[\s\S]*?font-family:\s*var\(--font-reading\);/, 'hero title uses Source Serif 4'],
  [/\.section-title\s*\{[\s\S]*?font-family:\s*var\(--font-reading\);/, 'editorial section titles use Source Serif 4'],
  [/\.cinematic-title\s*\{[\s\S]*?font-family:\s*var\(--font-reading\);/, 'cinematic chapter titles use Source Serif 4'],
  [/\.reading\s*\{[\s\S]*?font-family:\s*var\(--font-reading\);/, 'reading text uses Source Serif 4'],
  [/\.ident\s*\{[\s\S]*?font-family:\s*var\(--font-code\);/, 'technical identifiers use JetBrains Mono'],
  [/\.system-row h3\s*\{[\s\S]*?font-family:\s*var\(--font-ui\);/, 'product headings use Inter/UI'],
  [/\.action\s*\{[\s\S]*?font-family:\s*var\(--font-ui\);/, 'controls use Inter/UI'],
  [/\.app-nav\s*\{[\s\S]*?font-family:\s*var\(--font-ui\);/, 'navigation uses Inter/UI'],
];

for (const [pattern, message] of selectorRules) {
  assert(pattern.test(css), message);
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
  assert(!source.includes(forbidden), `remove stale or forbidden typography: ${forbidden}`);
}

const declaredWeights = [...css.matchAll(/font-weight:\s*([0-9]+)/g)].map((match) => Number(match[1]));
const allowedWeights = new Set([300, 400, 500, 600, 700]);
for (const weight of declaredWeights) {
  assert(allowedWeights.has(weight), `font weight ${weight} is outside the documented system`);
}

const lightWeightMatches = css.match(/font-weight:\s*300/g) ?? [];
assert(lightWeightMatches.length === 1, 'font-weight 300 is allowed only once for the ninetynine logo');

assert(!html.includes('<style'), 'site styles should stay in styles.css');
assert(readme.includes('Logo-only exception'), 'README should document the logo-only exception');
assert(readme.includes('Ninetynine` — Source Serif 4, weight `300`'), 'README should document the ninetynine logo typography');
assert(readme.includes('3-font typography system'), 'README should document the 3-font typography system');
assert(readme.includes('Syne is explicitly removed'), 'README should document that Syne is removed');

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log('Typography check passed.');
