import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const web = new URL('../', import.meta.url).pathname;

async function loadPricing(launchOffer) {
  const dir = await mkdtemp(join(tmpdir(), 'deskutils-pricing-'));
  const outfile = join(dir, 'pricing.mjs');
  await build({
    stdin: {
      contents: `
        export { pricingFaqs, pricingComparison } from '${web}content/pricing.ts';
        export { pricingStructuredData } from '${web}content/structured-data.ts';
        export { product } from '${web}content/product.ts';
      `,
      resolveDir: web,
    },
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile,
    logLevel: 'silent',
    define: { 'process.env.NEXT_PUBLIC_DESKUTILS_LAUNCH_OFFER': JSON.stringify(launchOffer) },
  });
  const mod = await import(`${pathToFileURL(outfile).href}?v=${Math.random()}`);
  return { mod, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

test('pricing table never overclaims the Free toolkit and lists External Display Only', async () => {
  const { mod, cleanup } = await loadPricing('true');
  try {
    const { pricingComparison } = mod;

    // The old misleading aggregate "All 12 tools" row must be gone.
    assert.equal(
      pricingComparison.some((row) => row.id === 'tools'),
      false,
      'aggregate "All 12 tools" row should not exist',
    );
    // Feature labels must be plain (no unresolved placeholders).
    for (const row of pricingComparison) {
      assert.doesNotMatch(
        row.feature,
        /\{count\}/,
        `feature label leaked a placeholder: ${row.feature}`,
      );
    }
    // External Display Only is present with a Free limitation and a Pro value.
    const external = pricingComparison.find((row) => row.id === 'external-display');
    assert.ok(external, 'External Display Only row is missing');
    assert.equal(external.free.kind, 'text');
    assert.equal(external.pro.kind, 'text');
    assert.notEqual(external.free.key, external.pro.key);
  } finally {
    await cleanup();
  }
});

test('launch off drops the launch FAQ and syncs the offer price', async () => {
  const { mod, cleanup } = await loadPricing('false');
  try {
    const { pricingFaqs, pricingStructuredData, product } = mod;
    assert.equal(product.pricing.amount, '14.99');
    assert.equal(
      pricingFaqs().some((faq) => faq.id === 'launch-price'),
      false,
    );
    const offer = pricingStructuredData('en').offers;
    assert.equal(offer.price, product.pricing.amount);
    assert.equal(new URL(offer.url).searchParams.get('checkout[discount_code]'), null);
    assert.match(offer.url, /^https:\/\/deskutils\.lemonsqueezy\.com\/checkout\/buy\//);
  } finally {
    await cleanup();
  }
});

test('launch on includes the launch FAQ and discount checkout', async () => {
  const { mod, cleanup } = await loadPricing('true');
  try {
    const { pricingFaqs, pricingStructuredData, product } = mod;
    assert.equal(product.pricing.amount, '7.99');
    const faqs = pricingFaqs();
    assert.equal(faqs[0].id, 'launch-price');
    const offer = pricingStructuredData('en').offers;
    assert.equal(offer.price, '7.99');
    assert.equal(new URL(offer.url).searchParams.get('checkout[discount_code]'), 'LAUNCH799');
  } finally {
    await cleanup();
  }
});
