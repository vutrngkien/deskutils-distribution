import { test, expect } from '@playwright/test';
import releaseSnapshot from '../content/releases.json';

/**
 * Visual regression checks. These are opt-in (`RUN_VISUAL=1`) and are intended
 * to run in ONE pinned Linux/Chromium environment (the CI reference renderer),
 * not on developer macOS machines. Snapshot file names include the platform, so
 * macOS and Linux baselines never collide.
 *
 * Generate/refresh baselines in the reference environment:
 *   RUN_VISUAL=1 npx playwright install --with-deps chromium
 *   RUN_VISUAL=1 npx playwright test tests/visual.spec.ts --update-snapshots
 */
test.skip(!process.env.RUN_VISUAL, 'Visual checks run only with RUN_VISUAL=1');

test.beforeEach(async ({ page }) => {
  await page.route(
    'https://api.github.com/repos/vutrngkien/deskutils-distribution/releases**',
    (route) => route.fulfill({ json: releaseSnapshot }),
  );
});

const regions: [name: string, selector: string][] = [
  ['hero-trust', 'main > header'],
  ['social-proof', '.home-social-proof'],
  ['screenshot', '[data-umami-section="screenshots"]'],
  ['clipboard', '[data-umami-section="clipboard"]'],
  ['quickring', '[data-umami-section="quickring"]'],
  ['focused-tools', '[data-umami-section="tools"]'],
  ['utilities', '[data-umami-section="utilities"]'],
  ['pricing', '#pricing'],
  ['faq', '#faq'],
  ['final-cta', '[data-testid="final-cta"]'],
];

const screenshotRegions: [name: string, selector: string][] = [
  ['hero', 'main > header'],
  ['modes', '[data-umami-section="screenshot-modes"]'],
  ['annotate', '[data-umami-section="screenshot-annotate"]'],
  ['quick-access', '[data-umami-section="quick-access"]'],
  ['scrolling', '[data-umami-section="screenshot-scrolling"]'],
  ['cards', '[data-umami-section="screenshot-cards"]'],
  ['faq', '#faq'],
  ['final-cta', '[data-testid="final-cta"]'],
];

for (const width of [1440, 390]) {
  test(`homepage regions at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    // Make the nav non-sticky so it never overlays a region capture.
    await page.addStyleTag({ content: 'header { position: static !important; }' });

    for (const [name, selector] of regions) {
      const region = page.locator(selector);
      await region.scrollIntoViewIfNeeded();
      await expect(region).toHaveScreenshot(`home-${name}-${width}.png`);
    }
    const faq = page.locator('#faq');
    await faq.locator('summary').first().click();
    await expect(faq).toHaveScreenshot(`home-faq-open-${width}.png`);
  });
}

const p4Pages = [
  '/support/',
  '/install/',
  '/feedback/',
  '/pricing/',
  '/changelog/',
  '/privacy/',
  '/terms/',
];

for (const path of p4Pages) {
  for (const width of [1440, 390]) {
    test(`${path} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      await page.addStyleTag({ content: 'header { position: static !important; }' });
      const slug = path.replaceAll('/', '');
      await expect(page.locator('main header').first()).toHaveScreenshot(
        `${slug}-hero-${width}.png`,
      );
    });
  }
}

for (const width of [1440, 390]) {
  test(`404 page at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/unknown-route/');
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: 'header { position: static !important; }' });
    await expect(page.locator('main')).toHaveScreenshot(`not-found-${width}.png`);
  });
}

const featurePagePaths = [
  '/features/',
  '/clipboard-manager/',
  '/quick-ring/',
  '/capture-text/',
  '/color-picker/',
  '/window-switcher/',
  '/prevent-sleep/',
  '/mouse-jiggler/',
  '/clean-keyboard/',
  '/display-dimming/',
  '/external-display-only/',
  '/system-monitoring/',
];

for (const path of featurePagePaths) {
  for (const width of [1440, 390]) {
    test(`${path} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      await page.addStyleTag({ content: 'header { position: static !important; }' });
      const slug = path.replaceAll('/', '');
      await expect(page.locator('main > header')).toHaveScreenshot(`${slug}-hero-${width}.png`);
      if ((await page.locator('#faq').count()) > 0) {
        await page.locator('#faq').scrollIntoViewIfNeeded();
        await expect(page.locator('#faq')).toHaveScreenshot(`${slug}-faq-${width}.png`);
      }
    });
  }
}

for (const width of [1440, 390]) {
  test(`screenshot page regions at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/screenshot/');
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: 'header { position: static !important; }' });

    for (const [name, selector] of screenshotRegions) {
      const region = page.locator(selector);
      await region.scrollIntoViewIfNeeded();
      await expect(region).toHaveScreenshot(`screenshot-${name}-${width}.png`);
    }
  });
}
