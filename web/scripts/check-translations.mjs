import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

/**
 * Pure validation: for every route, each locale declared complete must define
 * every required key — the route's own keys PLUS the shared chrome keys. Also
 * flags required keys that do not exist in the canonical English catalog.
 */
export function findTranslationIssues({
  catalog,
  en,
  routeRequiredKeys,
  sharedRequiredKeys,
  routeTranslations,
}) {
  const enKeys = new Set(Object.keys(en));
  const issues = [];
  for (const [route, locales] of Object.entries(routeTranslations)) {
    const required = [...sharedRequiredKeys, ...(routeRequiredKeys[route] ?? [])];
    const unknown = required.filter((key) => !enKeys.has(key));
    if (unknown.length > 0) {
      issues.push(`${route}: unknown keys (${unknown.join(', ')})`);
    }
    for (const locale of locales) {
      const keys = new Set(Object.keys(catalog[locale] ?? {}));
      const missing = required.filter((key) => !keys.has(key));
      if (missing.length > 0) {
        issues.push(
          `${route}/${locale}: ${missing.length} missing (${missing.slice(0, 8).join(', ')}…)`,
        );
      }
    }
  }
  return issues;
}

/** Bundle the content modules and run the completeness contract. */
export async function checkTranslations() {
  const dir = await mkdtemp(join(tmpdir(), 'deskutils-i18n-'));
  const outfile = join(dir, 'translations.mjs');
  try {
    await build({
      entryPoints: [new URL('../content/translations.ts', import.meta.url).pathname],
      bundle: true,
      platform: 'node',
      format: 'esm',
      outfile,
      logLevel: 'silent',
    });
    const modules = await import(pathToFileURL(outfile).href);
    const issues = findTranslationIssues(modules);
    if (issues.length > 0) {
      throw new Error(
        `Routes marked complete are missing required translated keys:\n  ${issues.join('\n  ')}\n` +
          'Translate the missing keys or remove the locale from content/translations.ts.',
      );
    }
    console.log('Route translations verified.');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  checkTranslations().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
