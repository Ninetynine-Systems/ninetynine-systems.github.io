import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pages = [
  'index.html',
  'products/index.html',
  'gatekeeper/index.html',
  'orvia/index.html',
  'studio/index.html',
  'company/index.html',
  'contact/index.html',
  'privacy/index.html',
  'terms/index.html',
];
const pageSource = pages.map((page) => readFileSync(join(root, page), 'utf8'));
const css = readFileSync(join(root, 'styles.css'), 'utf8');
const app = readFileSync(join(root, 'app.js'), 'utf8');
const source = `${pageSource.join('\n')}\n${css}\n${app}`;

function assert(condition, message) {
  if (!condition) {
    console.error(`Guardrail failed: ${message}`);
    process.exitCode = 1;
  }
}

for (const page of pages) {
  assert(existsSync(join(root, page)), `${page} should exist`);
}

for (const [index, html] of pageSource.entries()) {
  const page = pages[index];
  assert(html.includes('href="/styles.css"'), `${page} should load the shared stylesheet`);
  assert(html.includes('href="/assets/fonts/inter/index.css"'), `${page} should load the local Inter package`);
  assert(html.includes('src="/app.js"'), `${page} should load the shared interaction script`);
  assert(html.includes('href="/favicon.svg"'), `${page} should load the favicon`);
  assert(html.includes('class="legalmark" href="/" aria-label="ninetynine.systems home"'), `${page} should label the company home link`);
  assert(html.includes('class="legalmark__symbol" src="/assets/brand-mark.svg"'), `${page} should use the shared connected header mark`);
  assert(html.includes('<span>ninetynine.systems</span></a>'), `${page} should keep the company name as readable text`);
  assert(html.includes('href="/favicon.ico"'), `${page} should load the ICO fallback`);
  assert(html.includes('class="site-footer__identity">ninetynine.systems LLC</p>'), `${page} should state the LLC identity in the footer`);
  assert(!html.includes('<style'), `${page} should not contain inline style blocks`);
  assert(!html.includes('<svg'), `${page} should not use hand-built inline SVG imagery`);
  assert(!html.includes('href="#"'), `${page} should not contain placeholder links`);
}

assert(existsSync(join(root, 'favicon.svg')), 'favicon.svg should exist');
assert(existsSync(join(root, 'favicon.ico')), 'favicon.ico should exist');
assert(existsSync(join(root, 'assets/brand-mark.svg')), 'the shared header mark should exist');
assert(existsSync(join(root, 'app.js')), 'app.js should exist');
assert(css.includes('--font-sans: "Inter Variable"'), 'the shared Inter token should exist');
assert(css.includes('figure { margin: 0; }'), 'figure defaults should not shrink product media');
assert(css.includes('.product-media--gatekeeper img { aspect-ratio: 8 / 5;'), 'the Gatekeeper preview should preserve its source aspect ratio');
assert(!source.includes('fonts.googleapis.com'), 'runtime Google Fonts requests are not allowed');
assert(!source.includes('fonts.gstatic.com'), 'runtime Google Fonts requests are not allowed');
assert(!source.includes('linear-gradient('), 'the selected design does not use gradients');
assert(!source.includes('radial-gradient('), 'the selected design does not use gradients');

const interFiles = join(root, 'assets/fonts/inter/files');
assert(existsSync(interFiles), 'Inter files should exist');
assert(readdirSync(interFiles).some((name) => name.endsWith('.woff2')), 'Inter should include local woff2 files');

for (const asset of [
  'assets/images/gatekeeper/approval-legal-nda.png',
  'assets/images/gatekeeper/approval-finance-invoice.png',
  'assets/images/gatekeeper/approval-devops-rollback.png',
  'assets/images/gatekeeper/approval-healthcare-protocol.png',
  'assets/images/products/planner-concept.png',
  'assets/images/products/billhead-concept.png',
  'assets/images/orvia/Screenshot_20260902_133129_Orvia.jpg',
  'assets/images/orvia/Screenshot_20260902_133223_Orvia.jpg',
  'assets/images/orvia/Screenshot_20260902_134439_Orvia.jpg',
  'assets/images/orvia/Screenshot_20260902_134520_Orvia.jpg',
  'assets/images/orvia/Screenshot_20260902_150911_Orvia.jpg',
]) {
  const path = join(root, asset);
  assert(existsSync(path), `${asset} should exist`);
  if (existsSync(path)) assert(statSync(path).size > 10_000, `${asset} should be a real image asset`);
}

const home = pageSource[0];
const company = pageSource[5];
assert(home.includes('Software systems built to keep working.'), 'the selected homepage headline should be present');
assert(!home.includes('hero__identity'), 'the homepage should not repeat the legal identity in the hero');
assert(home.includes('/assets/images/orvia/Screenshot_20260902_133223_Orvia.jpg'), 'the homepage should use the selected Orvia bots screen');
assert(home.includes('/assets/images/orvia/Screenshot_20260902_133129_Orvia.jpg'), 'the homepage should use the supplied Orvia home-screen capture');
assert(home.includes('/assets/images/orvia/Screenshot_20260902_150911_Orvia.jpg'), 'the homepage should use the supplied Orvia conversation capture');
assert(!home.includes('/assets/images/orvia/Screenshot_20260902_134520_Orvia.jpg'), 'the replaced Orvia guides screen should not remain on the homepage');
assert(home.includes('class="button button--on-dark" href="/contact/">Start a project</a>'), 'the homepage should keep one clear closing action');
assert(!home.includes('class="button button--light" href="/contact/">Start a project</a>'), 'the homepage hero should focus on the product systems');
assert(!home.includes('Email us'), 'the homepage closing action should not be duplicated');
assert(!home.includes('founder-led U.S. software company'), 'the homepage should not conflate leadership, registration, and team location');
assert(!source.includes('founder-led'), 'company positioning should not rely on founder-led language');
assert(!source.includes('Dhaka'), 'the public website should not disclose the team location');
assert(!source.includes('Where are you based?'), 'the homepage should not foreground operating location');
assert(company.includes('Legal and business details.'), 'the company page should introduce the formal company information plainly');
assert(!company.includes('Team location'), 'the company details should not publish the team location');
assert(company.includes('<strong>Registration</strong><span>Missouri, United States</span>'), 'the company page should identify the registration jurisdiction');
assert(home.includes('Concept preview · in development'), 'generated product images should be labeled honestly');
assert(home.includes('target="_blank" rel="noopener noreferrer"'), 'external product actions should be safe');

const mailtoTargets = [...pageSource.join('\n').matchAll(/mailto:([^?"']+)/g)].map((match) => match[1]);
assert(mailtoTargets.length > 0, 'the site should include contact email links');
for (const address of mailtoTargets) {
  assert(address === 'sazid@ninetynine.systems', `unexpected contact email: ${address}`);
}

const declaredWeights = [...css.matchAll(/font-weight:\s*([0-9]+)/g)].map((match) => Number(match[1]));
for (const weight of declaredWeights) {
  assert(weight >= 400 && weight <= 700, `font weight ${weight} is outside the Inter system`);
}

if (process.exitCode) process.exit(process.exitCode);
console.log(`Guardrail passed for ${pages.length} pages.`);
