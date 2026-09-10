import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
// Operator enables deployment only after checking the actual DMG against RELEASE.md.
const tag = process.env.DESKUTILS_WEBSITE_RELEASE_TAG;
assert.ok(
  tag && /^v\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/.test(tag),
  'Set DESKUTILS_WEBSITE_RELEASE_TAG to the verified release tag.',
);
const feed = await readFile(new URL('../../site/appcast.xml', import.meta.url), 'utf8');
const item = feed.match(/<item>[\s\S]*?<\/item>/)?.[0] ?? '';
assert.ok(
  item.includes(`/releases/tag/${tag}</sparkle:fullReleaseNotesLink>`),
  'The signed feed must point to the verified release.',
);
const productSource = await readFile(new URL('../content/product.ts', import.meta.url), 'utf8');
const minimum = productSource.match(/minimumMacOS: '([^']+)'/)?.[1];
const actual = item.match(/<sparkle:minimumSystemVersion>([^<]+)</)?.[1];
assert.equal(
  actual?.replace(/\.0$/, ''),
  minimum,
  'Published app minimum macOS differs from the website.',
);
const response = await fetch(
  'https://api.github.com/repos/vutrngkien/deskutils-distribution/releases/latest',
  { headers: { Accept: 'application/vnd.github+json' } },
);
assert.ok(response.ok, `GitHub release lookup failed: ${response.status}`);
const release = await response.json();
assert.equal(release.tag_name, tag, 'The latest download link must serve the verified release.');
assert.ok(!release.draft && !release.prerelease, 'The latest stable release must be public.');
assert.ok(
  release.assets.some((asset) => asset.name === 'DeskUtils.dmg'),
  'The release has no DMG.',
);
console.log(`Website release verified: ${tag}`);
