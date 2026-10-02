import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { findTranslationIssues } from '../scripts/check-translations.mjs';

const en = {
  'a11y.skip': 'Skip to content',
  'nav.product': 'Product',
  'install.title': 'A few steps.',
};

function issuesFor(deCatalog) {
  return findTranslationIssues({
    catalog: { en, de: deCatalog },
    en,
    routeRequiredKeys: { install: ['install.title'] },
    sharedRequiredKeys: ['a11y.skip', 'nav.product'],
    routeTranslations: { install: ['en', 'de'] },
  });
}

test('passes when shared and route keys are present', () => {
  assert.deepEqual(
    issuesFor({
      'a11y.skip': 'Zum Inhalt',
      'nav.product': 'Produkt',
      'install.title': 'Wenige Schritte.',
    }),
    [],
  );
});

test('fails when a shared chrome key is missing', () => {
  const issues = issuesFor({ 'a11y.skip': 'Zum Inhalt', 'install.title': 'Wenige Schritte.' });
  assert.ok(
    issues.some((issue) => issue.includes('nav.product')),
    issues.join('\n'),
  );
});

test('fails when a route body key is missing', () => {
  const issues = issuesFor({ 'a11y.skip': 'Zum Inhalt', 'nav.product': 'Produkt' });
  assert.ok(
    issues.some((issue) => issue.includes('install.title')),
    issues.join('\n'),
  );
});

test('fails when a required key does not exist in English', () => {
  const issues = findTranslationIssues({
    catalog: { en, de: { ...en } },
    en,
    routeRequiredKeys: { install: ['missing.key'] },
    sharedRequiredKeys: [],
    routeTranslations: { install: ['en', 'de'] },
  });
  assert.ok(
    issues.some((issue) => issue.includes('unknown keys')),
    issues.join('\n'),
  );
});

async function loadRealCatalog() {
  const bundle = await build({
    entryPoints: ['content/translations.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
    logLevel: 'silent',
  });
  return import(
    `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
  );
}

const allLocales = ['en', 'vi', 'de', 'es', 'fr', 'ja', 'ko', 'ru', 'zh-CN', 'zh-TW'];

test('every non-English catalog translates every English key', async () => {
  const { en, catalog } = await loadRealCatalog();
  const enKeys = Object.keys(en);
  for (const [locale, entries] of Object.entries(catalog)) {
    if (locale === 'en') continue;
    const missing = enKeys.filter((key) => !(key in entries));
    assert.deepEqual(missing, [], `${locale} is missing ${missing.length} keys`);
    assert.equal(Object.keys(entries).length, enKeys.length, `${locale} key count`);
  }
});

test('interpolation tokens match English in every locale', async () => {
  const { en, catalog } = await loadRealCatalog();
  const tokens = (value) =>
    [...String(value).matchAll(/\{(\w+)\}/g)]
      .map((match) => match[1])
      .sort()
      .join(',');
  const issues = [];
  for (const [locale, entries] of Object.entries(catalog)) {
    if (locale === 'en') continue;
    for (const key of Object.keys(en)) {
      if (tokens(en[key]) !== tokens(entries[key])) {
        issues.push(`${locale}/${key}: en{${tokens(en[key])}} got{${tokens(entries[key])}}`);
      }
    }
  }
  assert.deepEqual(issues, []);
});

test('zh-TW is a genuine Traditional catalog, not inherited Simplified', async () => {
  const { en, catalog } = await loadRealCatalog();
  const differences = Object.keys(en).filter(
    (key) => catalog['zh-CN'][key] !== catalog['zh-TW'][key],
  ).length;
  assert.ok(differences > 200, `expected many zh-TW differences, found ${differences}`);
});

test('ko and ru are real translations, not English fallback', async () => {
  const { en, catalog } = await loadRealCatalog();
  for (const locale of ['ko', 'ru']) {
    const identicalProse = Object.keys(en).filter(
      (key) => en[key].length > 12 && catalog[locale][key] === en[key],
    ).length;
    assert.ok(identicalProse < 40, `${locale} still has ${identicalProse} English prose values`);
  }
});

test('every published route is declared complete for all 10 locales', async () => {
  const { routeTranslations } = await loadRealCatalog();
  for (const [route, locales] of Object.entries(routeTranslations)) {
    assert.deepEqual([...locales].sort(), [...allLocales].sort(), `${route} locale coverage`);
  }
});

test('published localized routes require the real feature menu descriptions', async () => {
  const bundle = await build({
    entryPoints: ['content/translations.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
    logLevel: 'silent',
  });
  const content = await import(
    `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
  );
  assert.deepEqual(findTranslationIssues(content), []);
  const de = { ...content.catalog.de };
  delete de['tool.screenshot.body'];
  const issues = findTranslationIssues({ ...content, catalog: { ...content.catalog, de } });
  assert.ok(
    issues.some(
      (issue) => issue.startsWith('install/de:') && issue.includes('tool.screenshot.body'),
    ),
  );
  assert.ok(
    issues.some(
      (issue) => issue.startsWith('privacy/de:') && issue.includes('tool.screenshot.body'),
    ),
  );
});
