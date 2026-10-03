import type { Release } from '@/content/releases';

const endpoint = 'https://api.github.com/repos/vutrngkien/deskutils-distribution/releases';

/** Public API only: never send a GitHub token from the browser. */
export async function fetchGithubReleases(signal: AbortSignal): Promise<Release[]> {
  const releases: Release[] = [];
  for (let page = 1; page <= 50; page++) {
    const response = await fetch(`${endpoint}?per_page=100&page=${page}`, {
      signal,
      cache: 'no-store',
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!response.ok) throw new Error(`GitHub Releases request failed (${response.status})`);
    const batch: unknown = await response.json();
    if (!Array.isArray(batch)) throw new Error('Invalid GitHub Releases response');
    for (const item of batch) {
      if (!item || typeof item !== 'object') throw new Error('Invalid GitHub release');
      if (item.draft || item.prerelease) continue;
      if (
        typeof item.id !== 'number' ||
        typeof item.tag_name !== 'string' ||
        !item.tag_name ||
        typeof item.published_at !== 'string' ||
        !Number.isFinite(Date.parse(item.published_at)) ||
        typeof item.html_url !== 'string' ||
        !item.html_url.startsWith(
          'https://github.com/vutrngkien/deskutils-distribution/releases/tag/',
        ) ||
        (item.body != null && typeof item.body !== 'string') ||
        (item.name != null && typeof item.name !== 'string')
      )
        throw new Error('Invalid published GitHub release');
      releases.push({
        id: item.id,
        tag_name: item.tag_name,
        name: item.name ?? item.tag_name,
        published_at: item.published_at,
        body: item.body ?? '',
        html_url: item.html_url,
      });
    }
    // Count the raw API page, including filtered releases, for pagination.
    if (batch.length < 100) {
      if (!releases.length) throw new Error('No published releases returned');
      return releases.sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at));
    }
  }
  throw new Error('Too many GitHub release pages');
}
