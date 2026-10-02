import { rename, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

/**
 * Sync the in-site changelog snapshot from the public GitHub Releases API.
 *
 * This is the ONLY place the website talks to GitHub. `npm run build` and the
 * tests read `content/releases.json` and never touch the network.
 *
 * Safety: the snapshot is only replaced after a successful fetch that yields at
 * least one release. A failed or empty sync exits non-zero and leaves the
 * existing snapshot untouched, so a release build can never publish an empty
 * changelog.
 */

const defaultApi = 'https://api.github.com/repos/vutrngkien/deskutils-distribution/releases';
const defaultOutfile = fileURLToPath(new URL('../content/releases.json', import.meta.url));

/** Parse the `rel="next"` target from a GitHub Link header, if any. */
export function nextLink(linkHeader) {
  if (!linkHeader) return null;
  for (const part of linkHeader.split(',')) {
    const match = /<([^>]+)>\s*;\s*rel="next"/.exec(part.trim());
    if (match) return match[1];
  }
  return null;
}

/** Map the API payload to the fields the site uses, dropping drafts/prereleases. */
export function normalizeReleases(raw) {
  if (!Array.isArray(raw)) throw new Error('GitHub releases payload was not an array');
  return raw
    .filter((release) => !release.draft && !release.prerelease)
    .map((release) => ({
      id: release.id,
      tag_name: release.tag_name,
      name: release.name ?? release.tag_name,
      published_at: release.published_at,
      body: release.body ?? '',
      html_url: release.html_url,
    }))
    .filter((release) => release.tag_name && release.html_url)
    .sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at));
}

async function fetchAllReleases(fetchImpl, apiUrl, headers) {
  const releases = [];
  let url = `${apiUrl}?per_page=100`;
  let guard = 0;
  while (url) {
    if (guard++ > 50) throw new Error('Too many release pages; aborting to avoid a loop');
    const response = await fetchImpl(url, { headers });
    if (!response.ok) {
      throw new Error(
        `GitHub API request failed: ${response.status} ${response.statusText} (${url})`,
      );
    }
    const page = await response.json();
    if (!Array.isArray(page)) throw new Error('GitHub API returned an unexpected payload');
    releases.push(...page);
    url = nextLink(
      typeof response.headers?.get === 'function' ? response.headers.get('link') : null,
    );
  }
  return releases;
}

/** Fetch, normalize and atomically write the snapshot. Returns the releases. */
export async function syncReleases({
  fetchImpl = fetch,
  apiUrl = defaultApi,
  outfile = defaultOutfile,
  token = process.env.GITHUB_TOKEN,
  write = writeFile,
  renameImpl = rename,
  log = console.log,
} = {}) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'deskutils-website-sync',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const raw = await fetchAllReleases(fetchImpl, apiUrl, headers);
  const releases = normalizeReleases(raw);
  if (releases.length === 0) {
    throw new Error('Sync returned no published releases; refusing to overwrite the snapshot.');
  }

  const payload = `${JSON.stringify(releases, null, 2)}\n`;
  const temp = `${outfile}.tmp`;
  await write(temp, payload);
  await renameImpl(temp, outfile);
  log(`Synced ${releases.length} releases to ${outfile}`);
  return releases;
}

if (import.meta.url === (await import('node:url')).pathToFileURL(process.argv[1] ?? '').href) {
  syncReleases().catch((error) => {
    console.error(`Release sync failed: ${error.message}`);
    console.error('The existing content/releases.json snapshot was left unchanged.');
    process.exit(1);
  });
}
