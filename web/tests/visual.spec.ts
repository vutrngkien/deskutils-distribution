import { test, expect } from '@playwright/test';

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
