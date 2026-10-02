import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { build } from 'esbuild';

const run = promisify(execFile);
const web = process.cwd();
const mediaSrc = join(web, 'media-src');
const publicMedia = join(web, 'public', 'media');

test('media generator emits variants and flips slot availability', async () => {
  await rm(mediaSrc, { recursive: true, force: true });
  await rm(publicMedia, { recursive: true, force: true });
  await mkdir(mediaSrc, { recursive: true });

  // hero slot is 12/7 (1200×700); master at 2x (2400×1400) satisfies the contract.
  await sharp({
    create: {
      width: 2400,
      height: 1400,
      channels: 4,
      background: { r: 20, g: 80, b: 245, alpha: 1 },
    },
  })
    .png()
    .toFile(join(mediaSrc, 'hero.png'));

  const bundleDir = await mkdtemp(join(tmpdir(), 'deskutils-media-'));
  try {
    await run('node', ['scripts/media.mjs'], { cwd: web });

    for (const ext of ['avif', 'webp', 'png']) {
      const one = await sharp(join(publicMedia, `hero@1x.${ext}`)).metadata();
      const two = await sharp(join(publicMedia, `hero@2x.${ext}`)).metadata();
      assert.equal(`${one.width}×${one.height}`, '1200×700', `${ext} 1x`);
      assert.equal(`${two.width}×${two.height}`, '2400×1400', `${ext} 2x`);
    }

    const outfile = join(bundleDir, 'media.mjs');
    await build({
      entryPoints: [join(web, 'content/media.ts')],
      bundle: true,
      platform: 'node',
      format: 'esm',
      outfile,
      logLevel: 'silent',
    });
    const { hasGeneratedMedia } = await import(pathToFileURL(outfile).href);
    assert.equal(hasGeneratedMedia('hero'), true, 'hero should be available');
    assert.equal(hasGeneratedMedia('clipboard'), false, 'clipboard has no master');
  } finally {
    await rm(mediaSrc, { recursive: true, force: true });
    await rm(publicMedia, { recursive: true, force: true });
    await rm(bundleDir, { recursive: true, force: true });
  }
});

test('media generator rejects a mismatched aspect ratio instead of cropping', async () => {
  await rm(mediaSrc, { recursive: true, force: true });
  await mkdir(mediaSrc, { recursive: true });
  await sharp({
    create: {
      width: 2800,
      height: 1400,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .png()
    .toFile(join(mediaSrc, 'hero.png'));
  try {
    await assert.rejects(() => run('node', ['scripts/media.mjs'], { cwd: web }), /aspect/);
  } finally {
    await rm(mediaSrc, { recursive: true, force: true });
    await rm(publicMedia, { recursive: true, force: true });
  }
});
