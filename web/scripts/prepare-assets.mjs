import { cp, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
const root = new URL('../', import.meta.url);
const target = new URL('public/', root);
await mkdir(target, { recursive: true });
// Keep distribution assets and signed feed in their existing release-script locations.
for (const name of ['assets/images', 'assets/icons', 'appcast.xml', 'CNAME']) {
  await cp(new URL(`../site/${name}`, root), new URL(name, target), { recursive: true });
}
const images = new URL('assets/images/', target);
await sharp(fileURLToPath(new URL('deskutils-icon.png', images)))
  .resize(176, 176)
  .webp({ quality: 90, effort: 6 })
  .toFile(fileURLToPath(new URL('deskutils-icon.webp', images)));
console.log(`Prepared distribution assets in ${fileURLToPath(target)}`);
