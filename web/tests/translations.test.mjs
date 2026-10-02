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
