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

/**
 * The generator and `hasGeneratedMedia` are pointed at a temporary directory
 * via `DESKUTILS_MEDIA_SRC` / `DESKUTILS_MEDIA_OUT`, so a test run can never
 * delete or overwrite real masters (`web/media-src/`) or generated media
 * (`web/public/media/`).
 */
async function withMediaDirs(fn) {
  const project = await mkdtemp(join(tmpdir(), 'deskutils-media-'));
  const src = join(project, 'media sources');
  const out = join(project, 'public', 'generated media');
  await mkdir(src, { recursive: true });
  await mkdir(out, { recursive: true });
  const env = {
    ...process.env,
    DESKUTILS_MEDIA_SRC: src,
    DESKUTILS_MEDIA_OUT: out,
  };
  try {
    return await fn({ project, src, out, env });
  } finally {
    await rm(project, { recursive: true, force: true });
  }
}

test('media generator emits variants and flips slot availability', async () => {
  await withMediaDirs(async ({ src, out, env }) => {
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
      .toFile(join(src, 'hero.png'));

    await run('node', ['scripts/media.mjs'], { cwd: web, env });

    for (const ext of ['avif', 'webp', 'png']) {
      const one = await sharp(join(out, `hero@1x.${ext}`)).metadata();
      const two = await sharp(join(out, `hero@2x.${ext}`)).metadata();
      assert.equal(`${one.width}×${one.height}`, '1200×700', `${ext} 1x`);
      assert.equal(`${two.width}×${two.height}`, '2400×1400', `${ext} 2x`);
    }

    const bundleDir = await mkdtemp(join(tmpdir(), 'deskutils-media-bundle-'));
    try {
      const outfile = join(bundleDir, 'media.mjs');
      await build({
        entryPoints: [join(web, 'content/media.ts')],
        bundle: true,
        platform: 'node',
        format: 'esm',
        outfile,
        logLevel: 'silent',
        define: { 'process.env.DESKUTILS_MEDIA_OUT': JSON.stringify(out) },
      });
      const { hasGeneratedMedia } = await import(pathToFileURL(outfile).href);
      assert.equal(hasGeneratedMedia('hero'), true, 'hero should be available');
      assert.equal(hasGeneratedMedia('clipboard'), false, 'clipboard has no master');
    } finally {
      await rm(bundleDir, { recursive: true, force: true });
    }
  });
});

test('media generator rejects a mismatched aspect ratio instead of cropping', async () => {
  await withMediaDirs(async ({ src, env }) => {
    await sharp({
      create: {
        width: 2800,
        height: 1400,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 },
      },
    })
      .png()
      .toFile(join(src, 'hero.png'));
    await assert.rejects(() => run('node', ['scripts/media.mjs'], { cwd: web, env }), /aspect/);
  });
});
