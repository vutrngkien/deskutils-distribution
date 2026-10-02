import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  workers: 2,
  retries: 1,
  // Tight threshold: catches missing/!shifted blocks, not just gross breakage.
  // Visual baselines are platform-suffixed and generated in the reference CI
  // environment (see tests/visual.spec.ts and RELEASE.md).
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
      caret: 'hide',
      threshold: 0.2,
    },
  },
  use: {
    baseURL: 'http://127.0.0.1:3100',
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node scripts/serve-out.mjs 3100',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: !process.env.CI,
  },
});
