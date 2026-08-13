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
  's@ninetynine.systems',
]) {
  assert(!source.includes(forbidden), `remove stale or forbidden content: ${forbidden}`);
}

const declaredWeights = [...css.matchAll(/font-weight:\s*([0-9]+)/g)].map((m) => Number(m[1]));
const allowedWeights = new Set([400, 500, 600, 700]);
for (const weight of declaredWeights) {
  assert(allowedWeights.has(weight), `font weight ${weight} is outside the documented system`);
}

// --- contact ---
assert(html.includes('mailto:sazidozon@gmail.com'), 'the site-wide action must mail sazidozon@gmail.com');

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
  'sazidozon@gmail.com',
]) {
  assert(readme.includes(claim), `README should state: ${claim}`);
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log('Guardrail passed.');
