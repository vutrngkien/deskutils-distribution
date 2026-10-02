import { mkdir, readFile, readdir, rm, stat } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

/**
 * Generate responsive AVIF/WebP/PNG variants for declared media slots.
 *
 * Safety: this script only ever removes the generated output directory
 * (`web/public/media/` by default). It never touches the copied distribution
 * assets, `appcast.xml` or `CNAME`, which are owned by the release scripts and
 * `prepare-assets.mjs`.
 *
 * Source of truth: `content/media.manifest.json`. Masters are read from
 * `web/media-src/<master>` (gitignored). Missing masters are skipped, so the
 * site builds with honest placeholders until final English captures arrive.
 *
 * `DESKUTILS_MEDIA_SRC` / `DESKUTILS_MEDIA_OUT` override those directories.
 * Tests use them so a test run can never delete real masters or generated
 * media.
 */
const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('content/media.manifest.json', root), 'utf8'));
const dirUrl = (envValue, fallback) =>
  envValue ? pathToFileURL(`${envValue.replace(/\/+$/, '')}/`) : fallback;
const sourcesDir = dirUrl(process.env.DESKUTILS_MEDIA_SRC, new URL('media-src/', root));
const outDir = dirUrl(process.env.DESKUTILS_MEDIA_OUT, new URL('public/media/', root));

// Clean ONLY generated media output.
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

let availableSources = [];
try {
  availableSources = await readdir(sourcesDir);
} catch {
  console.log('No media-src/ directory yet — using placeholders.');
}

const generated = [];
for (const slot of manifest.slots) {
  if (!availableSources.includes(slot.master)) continue;
  const source = new URL(slot.master, sourcesDir);
  const image = sharp(fileURLToPath(source));
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Unreadable master for slot "${slot.id}": ${slot.master}`);
  }
  if (metadata.width < slot.width * 2 || metadata.height < slot.height * 2) {
    throw new Error(
      `Master "${slot.master}" is ${metadata.width}×${metadata.height}; expected at least ` +
        `${slot.width * 2}×${slot.height * 2} (2x of the declared slot).`,
    );
  }
  // Never crop product UI: the master must match the declared slot aspect ratio.
  const slotAspect = slot.width / slot.height;
  const masterAspect = metadata.width / metadata.height;
  if (Math.abs(masterAspect - slotAspect) / slotAspect > 0.01) {
    throw new Error(
      `Master "${slot.master}" aspect ${masterAspect.toFixed(3)} does not match slot ` +
        `"${slot.id}" aspect ${slotAspect.toFixed(3)}. Resize the source instead of cropping.`,
    );
  }

  for (const scale of [1, 2]) {
    const width = slot.width * scale;
    const height = slot.height * scale;
    // contain preserves all UI content; matching aspect ratios keep exact dims.
    const resized = image
      .clone()
      .resize(width, height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });
    for (const ext of ['avif', 'webp', 'png']) {
      const outfile = new URL(`${slot.id}@${scale}x.${ext}`, outDir);
      const outputPath = fileURLToPath(outfile);
      if (ext === 'avif') await resized.clone().avif({ quality: 50 }).toFile(outputPath);
      else if (ext === 'webp')
        await resized.clone().webp({ quality: 82, effort: 6 }).toFile(outputPath);
      else await resized.clone().png({ compressionLevel: 9 }).toFile(outputPath);

      const result = await sharp(outputPath).metadata();
      if (result.width !== width || result.height !== height) {
        throw new Error(
          `Variant ${slot.id}@${scale}x.${ext} is ${result.width}×${result.height}, expected ${width}×${height}.`,
        );
      }
      await stat(outputPath);
    }
  }
  generated.push(slot.id);
}

console.log(
  generated.length > 0
    ? `Generated media variants for: ${generated.join(', ')}`
    : 'No media masters found — placeholders in use.',
);
