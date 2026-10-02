import assert from 'node:assert/strict';
import { readFile, readdir, access, stat } from 'node:fs/promises';
import { loadContent } from './load-content.mjs';

const web = new URL('../', import.meta.url);
const out = new URL('out/', web);
const origin = 'https://deskutils.app';
const launchOfferEnabled =
  (process.env.NEXT_PUBLIC_DESKUTILS_LAUNCH_OFFER ?? 'true').trim().toLowerCase() !== 'false';

const { mod, cleanup } = await loadContent();
const { routes, languages, localePath, translatedLocalesFor } = mod;

function fileFor(locale, path) {
  return `${localePath(locale, path).replace(/^\//, '')}index.html`;
}

try {
  for (const route of routes) {
    if (!route.publish) continue;
    const translated = translatedLocalesFor(route.id);

    for (const { code: locale } of languages) {
      const file = fileFor(locale, route.path);
      const html = await readFile(new URL(file, out), 'utf8');
      const complete = translated.includes(locale);

      assert.match(html, new RegExp(`<html lang="${locale}"`), `${file}: document language`);
      assert.match(html, /<main\b[^>]*id="main"/, `${file}: main landmark`);
      assert.match(html, /<h1[\s>]/, `${file}: heading`);
      // The changelog mirrors GitHub release notes verbatim, including
      // historical wording (older macOS names, notarization). It is the only
      // page exempt from the outdated-marketing-copy guard.
      if (route.id !== 'changelog') {
        assert.doesNotMatch(
          html,
          /\$19\.99|\$29\.99|Multi-Mac|annual license|USD \/ year|Pro is coming soon|macOS 26|Notarized by Apple/i,
          `${file}: outdated product copy`,
        );
      }

      const canonical = `${origin}${localePath(locale, route.path)}`;
      assert.ok(
        html.includes(`rel="canonical" href="${canonical}"`),
        `${file}: canonical must be ${canonical}`,
      );
      assert.match(html, /property="og:image"/, `${file}: social metadata`);
      assert.ok(
        html.includes('https://cloud.umami.is/script.js') &&
          html.includes('18c36bcd-0a9d-40a9-afb2-e95d9ca972af'),
        `${file}: Umami analytics`,
      );

      // Index only when the route is indexable AND this locale is complete.
      const shouldIndex = route.index && complete;
      const hasNoindex = html.includes('name="robots" content="noindex');
      assert.equal(hasNoindex, !shouldIndex, `${file}: unexpected robots index state`);

      if (route.id === 'home') {
        assert.match(html, /SoftwareApplication/, `${file}: app schema`);
        if (launchOfferEnabled) {
          assert.match(html, /\$7\.99/, `${file}: launch price`);
          assert.match(html, /\$14\.99/, `${file}: regular price`);
        } else {
          assert.match(html, /\$14\.99/, `${file}: regular price`);
          assert.doesNotMatch(html, /\$7\.99/, `${file}: launch price hidden`);
        }
        assert.match(html, /data-track-event="download"/, `${file}: download event`);
        assert.match(html, /data-track-event="checkout"/, `${file}: checkout event`);
      }
      if (route.id === 'privacy') {
        assert.match(html, /Umami/, `${file}: analytics disclosure`);
      }
    }
  }

  const notFound = await readFile(new URL('404.html', out), 'utf8');
  assert.match(notFound, /name="robots" content="noindex, nofollow"/, '404: must not be indexed');

  // Sitemap: every complete route is listed per locale. The homepage is now
  // localized too; feedback stays excluded by design (index: false).
  const sitemap = await readFile(new URL('sitemap.xml', out), 'utf8');
  assert.ok(sitemap.includes(`${origin}/</loc>`), 'sitemap: home missing');
  assert.ok(sitemap.includes(`${origin}/de/</loc>`), 'sitemap: localized home missing');
  assert.ok(sitemap.includes(`${origin}/de/install/`), 'sitemap: localized install missing');
  assert.ok(sitemap.includes(`${origin}/ja/pricing/`), 'sitemap: localized pricing missing');
  assert.ok(!sitemap.includes('/feedback/'), 'sitemap: feedback must be excluded');

  // Every local link/asset must resolve inside out/.
  const htmlFiles = await collectHtml(out);
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    for (const [, value] of html.matchAll(/(?:href|src)="(\/[^"?#]*)/g)) {
      if (!value || value === '/' || value.includes('_not-found')) continue;
      await access(new URL(`.${value.endsWith('/') ? `${value}index.html` : value}`, out));
    }
  }

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
} finally {
  await cleanup();
}

async function collectHtml(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, dir);
    if (entry.isDirectory()) files.push(...(await collectHtml(child)));
    else if (entry.name.endsWith('.html')) files.push(child);
  }
  return files;
}
