import { cp, mkdir, stat } from 'node:fs/promises';
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
const generated = [
  ['quickpreview-demo.png', 'quickpreview-demo.webp'],
  ['search-demo.png', 'search-demo.webp'],
];
for (const [source, destination] of generated) {
  const output = new URL(destination, images);
  await sharp(new URL(source, images).pathname)
    .resize(1094, 771, { fit: 'cover', position: 'north' })
    .webp({ quality: 82, effort: 6 })
    .toFile(output.pathname);
  if ((await stat(output)).size > 350 * 1024)
    throw new Error(`${destination} exceeds the 350 KB budget.`);
}
await sharp(new URL('deskutils-icon.png', images).pathname)
  .resize(176, 176)
  .webp({ quality: 90, effort: 6 })
  .toFile(new URL('deskutils-icon.webp', images).pathname);
console.log(`Prepared distribution assets in ${fileURLToPath(target)}`);
