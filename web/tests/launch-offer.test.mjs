import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

async function loadProduct(launchOffer) {
  const dir = await mkdtemp(join(tmpdir(), 'deskutils-product-'));
  const outfile = join(dir, 'product.mjs');
  await build({
    entryPoints: ['content/product.ts'],
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

test('launch offer enabled prices at $7.99 with the discount code', async () => {
  const { mod, cleanup } = await loadProduct('true');
  try {
    assert.equal(mod.launchOffer.enabled, true);
    assert.equal(mod.product.pricing.amount, '7.99');
    assert.equal(mod.product.pricing.originalAmount, '14.99');
    assert.equal(mod.product.pricing.showOriginal, true);
    const code = new URL(mod.product.pricing.purchaseURL).searchParams.get(
      'checkout[discount_code]',
    );
    assert.equal(code, 'LAUNCH799');
  } finally {
    await cleanup();
  }
});

test('launch offer disabled prices at $14.99 without the discount code', async () => {
  const { mod, cleanup } = await loadProduct('false');
  try {
    assert.equal(mod.launchOffer.enabled, false);
    assert.equal(mod.product.pricing.amount, '14.99');
    assert.equal(mod.product.pricing.showOriginal, false);
    const discount = new URL(mod.product.pricing.purchaseURL).searchParams.get(
      'checkout[discount_code]',
    );
    assert.equal(discount, null);
  } finally {
    await cleanup();
  }
});
