import assert from 'node:assert/strict';
import { readFile, readdir, access, stat } from 'node:fs/promises';
const web = new URL('../', import.meta.url);
const out = new URL('out/', web);
const origin = 'https://deskutils.app';
const languages = ['en', 'vi', 'zh-CN', 'zh-TW', 'es', 'ja', 'ko', 'ru', 'fr', 'de'];
const contentRoutes = languages.flatMap((locale) => {
  const prefix = locale === 'en' ? '' : `${locale}/`;
  return [
    `${prefix}index.html`,
    `${prefix}install/index.html`,
    `${prefix}privacy/index.html`,
    `${prefix}terms/index.html`,
  ];
});
const routes = [...contentRoutes, '404.html'];
const homeRoutes = new Set([
  'index.html',
  ...languages.filter((locale) => locale !== 'en').map((locale) => `${locale}/index.html`),
]);
for (const route of routes) {
  const html = await readFile(new URL(route, out), 'utf8');
  const firstSegment = route.split('/')[0];
  const locale = languages.includes(firstSegment) ? firstSegment : 'en';
  assert.match(html, new RegExp(`<html lang="${locale}"`), `${route}: incorrect document language`);
  assert.match(html, /<main\b[^>]*id="main"/, `${route}: missing main landmark`);
  assert.match(html, /<h1[\s>]/, `${route}: missing rendered heading`);
  assert.doesNotMatch(
    html,
    /\$19\.99|\$29\.99|Multi-Mac|annual license|USD \/ year|Pro is coming soon|macOS 26|Notarized by Apple/i,
    `${route}: outdated product copy`,
  );
  if (route !== '404.html') {
    const path = route.replace('index.html', '');
    assert.ok(
      html.includes(`rel="canonical" href="${origin}/${path}"`),
      `${route}: canonical missing`,
    );
    assert.match(html, /property="og:image"/, `${route}: social metadata missing`);
  }
  if (homeRoutes.has(route)) {
    assert.match(html, /application\/ld\+json/, 'homepage: structured data missing');
    assert.match(html, /SoftwareApplication/, 'homepage: app schema missing');
    assert.match(html, /\$7\.99/, `${route}: launch price missing`);
    assert.match(html, /\$14\.99/, `${route}: regular price missing`);
  }
  for (const [, value] of html.matchAll(/(?:href|src)="(\/[^"?#]*)/g)) {
    // Check local files and internal page destinations, including Next.js bundles.
    if (!value || value === '/' || value.includes('_not-found')) continue;
    await access(new URL(`.${value.endsWith('/') ? `${value}index.html` : value}`, out));
  }
}
const notFound = await readFile(new URL('404.html', out), 'utf8');
assert.match(notFound, /name="robots" content="noindex, nofollow"/, '404: must not be indexed');
for (const name of ['quickpreview-demo.webp', 'search-demo.webp']) {
  assert.ok(
    (await stat(new URL(`assets/images/${name}`, out))).size < 350 * 1024,
    `${name} exceeds the 350 KB budget`,
  );
}
for (const name of ['appcast.xml', 'CNAME']) {
  assert.deepEqual(
    await readFile(new URL(name, out)),
    await readFile(new URL(`../site/${name}`, web)),
    `${name} must be copied without changes`,
  );
}
for (const kind of ['images', 'icons']) {
  for (const name of await readdir(new URL(`../site/assets/${kind}/`, web))) {
    assert.deepEqual(
      await readFile(new URL(`assets/${kind}/${name}`, out)),
      await readFile(new URL(`../site/assets/${kind}/${name}`, web)),
      `Public asset changed: ${name}`,
    );
  }
}
await access(new URL('robots.txt', out));
await access(new URL('sitemap.xml', out));
console.log('Static routes, links, metadata, assets and signed appcast verified.');
