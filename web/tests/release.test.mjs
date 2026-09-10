import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
test('deployment fails closed without a verified release tag', () => {
  const run = spawnSync(process.execPath, ['scripts/verify-release.mjs'], {
    env: { ...process.env, DESKUTILS_WEBSITE_RELEASE_TAG: '' },
    encoding: 'utf8',
  });
  assert.notEqual(run.status, 0);
  assert.match(run.stderr, /Set DESKUTILS_WEBSITE_RELEASE_TAG/);
});
test('deployment rejects a release that does not match the signed feed', () => {
  const run = spawnSync(process.execPath, ['scripts/verify-release.mjs'], {
    env: { ...process.env, DESKUTILS_WEBSITE_RELEASE_TAG: 'v999.0.0' },
    encoding: 'utf8',
  });
  assert.notEqual(run.status, 0);
  assert.match(run.stderr, /signed feed must point/);
});
