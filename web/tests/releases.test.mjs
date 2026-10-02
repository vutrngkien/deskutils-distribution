import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeReleases, nextLink, syncReleases } from '../scripts/sync-releases.mjs';

function release(overrides) {
  return {
    id: 1,
    tag_name: 'v1.0.0',
    name: 'DeskUtils 1.0.0',
    draft: false,
    prerelease: false,
    published_at: '2026-01-01T00:00:00Z',
    body: 'notes',
    html_url: 'https://github.com/vutrngkien/deskutils-distribution/releases/tag/v1.0.0',
    ...overrides,
  };
}

function response(json, link = null) {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => json,
    headers: { get: (name) => (name === 'link' ? link : null) },
  };
}

test('normalizeReleases drops drafts/prereleases and sorts newest first', () => {
  const out = normalizeReleases([
    release({ id: 1, tag_name: 'v0.1.0', published_at: '2026-01-01T00:00:00Z' }),
    release({ id: 2, tag_name: 'v0.1.2', published_at: '2026-03-01T00:00:00Z' }),
    release({ id: 3, tag_name: 'v0.2.0', draft: true }),
    release({ id: 4, tag_name: 'v0.1.1', prerelease: true }),
    release({ id: 5, tag_name: 'v0.1.3', published_at: '2026-02-01T00:00:00Z' }),
  ]);
  assert.deepEqual(
    out.map((r) => r.tag_name),
    ['v0.1.2', 'v0.1.3', 'v0.1.0'],
  );
  assert.deepEqual(Object.keys(out[0]).sort(), [
    'body',
    'html_url',
    'id',
    'name',
    'published_at',
    'tag_name',
  ]);
});

test('normalizeReleases keeps releases with an empty body', () => {
  const out = normalizeReleases([release({ body: null })]);
  assert.equal(out[0].body, '');
});

test('nextLink extracts only the rel="next" target', () => {
  const header =
    '<https://api.github.com/repos/x/y/releases?page=2>; rel="next", <https://api.github.com/repos/x/y/releases?page=5>; rel="last"';
  assert.equal(nextLink(header), 'https://api.github.com/repos/x/y/releases?page=2');
  assert.equal(nextLink(null), null);
  assert.equal(nextLink('<https://api.github.com/repos/x/y/releases?page=5>; rel="last"'), null);
});

test('syncReleases follows pagination and writes a snapshot', async () => {
  const pages = [
    response(
      [release({ id: 2, tag_name: 'v0.2.0', published_at: '2026-02-01T00:00:00Z' })],
      '<https://api.github.com/x?page=2>; rel="next"',
    ),
    response([release({ id: 1, tag_name: 'v0.1.0', published_at: '2026-01-01T00:00:00Z' })]),
  ];
  let call = 0;
  const writes = [];
  const renames = [];
  const out = await syncReleases({
    fetchImpl: async () => pages[call++],
    write: async (file, payload) => writes.push({ file, payload }),
    renameImpl: async (from, to) => renames.push({ from, to }),
    log: () => {},
  });
  assert.equal(call, 2);
  assert.deepEqual(
    out.map((r) => r.tag_name),
    ['v0.2.0', 'v0.1.0'],
  );
  assert.equal(writes.length, 1);
  assert.equal(renames.length, 1);
  assert.deepEqual(
    JSON.parse(writes[0].payload).map((r) => r.tag_name),
    ['v0.2.0', 'v0.1.0'],
  );
});

test('syncReleases refuses to overwrite the snapshot when the sync yields nothing', async () => {
  let wrote = false;
  await assert.rejects(
    () =>
      syncReleases({
        fetchImpl: async () => response([]),
        write: async () => {
          wrote = true;
        },
        renameImpl: async () => {},
        log: () => {},
      }),
    /no published releases/i,
  );
  assert.equal(wrote, false, 'snapshot must not be written on an empty sync');
});

test('syncReleases leaves the snapshot untouched when the API fails', async () => {
  let wrote = false;
  await assert.rejects(
    () =>
      syncReleases({
        fetchImpl: async () => ({
          ok: false,
          status: 500,
          statusText: 'Server Error',
          headers: { get: () => null },
        }),
        write: async () => {
          wrote = true;
        },
        renameImpl: async () => {},
        log: () => {},
      }),
    /GitHub API request failed: 500/,
  );
  assert.equal(wrote, false, 'snapshot must not be written on an API error');
});
