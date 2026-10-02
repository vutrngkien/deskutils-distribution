import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

/**
 * Bundle the TypeScript content modules (route registry, locales, route-aware
 * translations) so Node scripts can consume them as the single source of truth.
 */
export async function loadContent() {
  const dir = await mkdtemp(join(tmpdir(), 'deskutils-content-'));
  const outfile = join(dir, 'content.mjs');
  const abs = (relative) => new URL(relative, import.meta.url).pathname;
  const entry = `
    export { routes, routesById, sitemapRoutes, publishedRoutes, routeHref, getRoute } from '${abs(
      '../content/routes.ts',
    )}';
    export { languages, localePath, isLocale } from '${abs('../content/locales.ts')}';
    export { translatedLocalesFor, isRouteComplete, routeTranslations } from '${abs(
      '../content/translations.ts',
    )}';
  `;
  await build({
    stdin: { contents: entry, resolveDir: abs('../') },
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile,
    logLevel: 'silent',
  });
  const mod = await import(`${pathToFileURL(outfile).href}?v=${Date.now()}`);
  return { mod, cleanup: () => rm(dir, { recursive: true, force: true }) };
}
