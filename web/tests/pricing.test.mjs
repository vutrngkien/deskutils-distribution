import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const web = new URL('../', import.meta.url).pathname;

test('obsolete pricing environment cannot restore checkout or a paid offer', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'deskutils-free-'));
  try {
    const outfile = join(dir, 'product.mjs');
    await build({
      stdin: {
        contents: `export { product } from '${web}content/product.ts'; export { homeStructuredData, pricingStructuredData } from '${web}content/structured-data.ts'; export { pricingFaqs } from '${web}content/pricing.ts';`,
        resolveDir: web,
      },
      bundle: true,
      platform: 'node',
      format: 'esm',
      outfile,
      logLevel: 'silent',
      define: {
        'process.env.NEXT_PUBLIC_DESKUTILS_LAUNCH_OFFER': '"true"',
        'process.env.NEXT_PUBLIC_DESKUTILS_CHECKOUT_URL': '"https://example.com/checkout"',
        'process.env.NEXT_PUBLIC_DESKUTILS_DISCOUNT_CODE': '"OLD"',
      },
    });
    const { product, homeStructuredData, pricingStructuredData, pricingFaqs } = await import(
      pathToFileURL(outfile).href
    );
    assert.equal(product.donationURL, 'https://ko-fi.com/vutrngkien');
    for (const locale of ['en', 'vi', 'ja', 'de']) {
      for (const app of [
        pricingStructuredData(locale),
        homeStructuredData(locale)['@graph'].find(
          (item) => item['@type'] === 'SoftwareApplication',
        ),
      ]) {
        assert.equal(app.offers.price, '0');
        assert.equal(app.offers.url, product.downloadURL);
        assert.equal(app.isAccessibleForFree, true);
      }
    }
    assert.ok(pricingFaqs().some((faq) => faq.id === 'donation'));
    assert.ok(!pricingFaqs().some((faq) => faq.id === 'launch-price'));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
