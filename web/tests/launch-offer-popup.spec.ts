import { test, expect, type Page } from '@playwright/test';
import { build } from 'esbuild';

const sessionKey = 'deskutils:launch-offer:seen';
const dialog = (page: Page) => page.getByRole('dialog');

test.beforeEach(async ({ page }) => {
  await page.route('https://cloud.umami.is/script.js', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: 'window.offerEvents = []; window.umami = {track: (event, data) => window.offerEvents.push({event, data})};',
    }),
  );
  await page.clock.install({ time: new Date('2026-10-06T00:00:00Z') });
  await page.clock.pauseAt(new Date('2026-10-06T00:00:01Z'));
});

async function events(page: Page, name: string) {
  return page.evaluate((eventName) => {
    const recorded =
      (
        window as unknown as {
          offerEvents?: { event: string; data: Record<string, unknown> }[];
        }
      ).offerEvents ?? [];
    return recorded.filter((item) => item.event === eventName);
  }, name);
}

async function reachQuickRing(page: Page) {
  await page
    .locator('#quickring')
    .evaluate((section) => section.scrollIntoView({ block: 'start', behavior: 'instant' }));
}

async function open(page: Page, path = '/') {
  await page.goto(path);
  await expect(page.locator('main h1')).toBeVisible();
  await reachQuickRing(page);
  await expect(dialog(page)).toBeVisible();
}

test('opens only at Quick Ring, records the impression, and restores focus and scrolling', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('main h1')).toBeVisible();
  const previous = page.locator('a[href="#main"]');
  await previous.focus();
  await page.clock.runFor(30_000);
  await expect(dialog(page)).toHaveCount(0);
  await page
    .locator('[data-umami-section="screenshots"]')
    .evaluate((section) => section.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await expect(dialog(page)).toHaveCount(0);
  await reachQuickRing(page);
  await expect(dialog(page)).toBeVisible();
  await expect(dialog(page)).toHaveAccessibleName('Get DeskUtils Pro');
  expect(await page.evaluate((key) => sessionStorage.getItem(key), sessionKey)).toBe('true');
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('hidden');
  await expect(dialog(page).locator('button').first()).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog(page).getByRole('button', { name: 'Maybe later' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog(page).locator('button').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog(page)).toHaveCount(0);
  await expect(previous).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
  expect(await events(page, 'offer_popup_view')).toHaveLength(1);
  const dismissed = await events(page, 'offer_popup_dismiss');
  expect(dismissed).toHaveLength(1);
  expect(dismissed[0].data.reason).toBe('escape');
});

for (const method of ['close', 'later', 'backdrop'] as const) {
  test(`dismisses with ${method} once`, async ({ page }) => {
    await open(page);
    if (method === 'close') await dialog(page).locator('button').first().click();
    if (method === 'later') await dialog(page).getByRole('button', { name: 'Maybe later' }).click();
    if (method === 'backdrop') await page.mouse.click(5, 5);
    await expect(dialog(page)).toHaveCount(0);
    await page.clock.runFor(10_000);
    await expect(dialog(page)).toHaveCount(0);
    const dismissed = await events(page, 'offer_popup_dismiss');
    expect(dismissed).toHaveLength(1);
    expect(dismissed[0].data.reason).toBe(method);
  });
}

test('stays dismissed across reload and locale changes; a new session shows it', async ({
  page,
  browser,
}) => {
  await open(page);
  await page.keyboard.press('Escape');
  await page.reload();
  await expect(page.locator('main h1')).toBeVisible();
  await reachQuickRing(page);
  await expect(dialog(page)).toHaveCount(0);
  await page.goto('/vi/');
  await expect(page.locator('main h1')).toBeVisible();
  await reachQuickRing(page);
  await expect(dialog(page)).toHaveCount(0);
  const context = await browser.newContext({ baseURL: new URL(page.url()).origin });
  try {
    const fresh = await context.newPage();
    await fresh.route('https://cloud.umami.is/script.js', (route) => route.abort());
    await fresh.clock.install();
    await open(fresh);
  } finally {
    await context.close();
  }
});

test('waits for a hidden tab to become visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main h1')).toBeVisible();
  await page.evaluate(() =>
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' }),
  );
  await reachQuickRing(page);
  await page.clock.runFor(1_000);
  await expect(dialog(page)).toHaveCount(0);
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(dialog(page)).toBeVisible();
});

test('CTA applies the offer in the same tab and tracks checkout once', async ({ page }) => {
  await open(page, '/vi/');
  await expect(dialog(page).getByText('Tiết kiệm 47%', { exact: true })).toBeVisible();
  await expect(dialog(page).locator('.offer-popup-price')).toHaveText('$7.99');
  const art = dialog(page).locator('img');
  await expect
    .poll(() =>
      art.evaluate(
        (image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
      ),
    )
    .toBe(true);
  const cta = dialog(page).getByRole('link', { name: 'Nhận ưu đãi $7.99' });
  const url = new URL((await cta.getAttribute('href'))!);
  expect(url.origin).toBe('https://deskutils.lemonsqueezy.com');
  expect(url.searchParams.get('checkout[discount_code]')).toBe('LAUNCH799');
  expect(await cta.getAttribute('target')).toBeNull();
  // Keep the browser on the page while exercising the real click listener.
  await cta.evaluate((link) =>
    link.addEventListener('click', (event) => event.preventDefault(), { once: true }),
  );
  await cta.click();
  const checkout = await events(page, 'checkout');
  expect(checkout).toHaveLength(1);
  expect(checkout[0].data).toMatchObject({ placement: 'offer_popup', locale: 'vi' });
  expect(JSON.stringify(checkout)).not.toContain('discount_code');
});

for (const width of [390, 768, 1440]) {
  test(`fits the viewport and scrolls at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 500 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    const box = await dialog(page).locator('.modal-box').boundingBox();
    expect(box!.width).toBeLessThanOrEqual(820);
    expect(box!.x).toBeGreaterThanOrEqual(16);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width - 16);
    expect(box!.height).toBeLessThanOrEqual(468);
    await dialog(page).getByRole('button', { name: 'Maybe later' }).click();
    await expect(dialog(page)).toHaveCount(0);
  });
}

test('does not appear on other routes', async ({ page }) => {
  await page.goto('/support/');
  await expect(page.locator('main h1')).toBeVisible();
  await page.clock.runFor(6_000);
  await expect(dialog(page)).toHaveCount(0);
});

test.describe('offer configuration and lifecycle', () => {
  const bundles: Record<string, string> = {};
  test.beforeAll(async () => {
    for (const state of ['true', 'false']) {
      const result = await build({
        entryPoints: ['tests/fixtures/launch-offer-popup.tsx'],
        bundle: true,
        write: false,
        format: 'iife',
        jsx: 'automatic',
        banner: { js: 'var process = globalThis.process || { env: {} };' },
        define: {
          'process.env.NODE_ENV': '"development"',
          'process.env.NEXT_PUBLIC_DESKUTILS_LAUNCH_OFFER': JSON.stringify(state),
        },
      });
      bundles[state] = result.outputFiles[0].text;
    }
  });

  async function mount(page: Page, enabled: boolean) {
    await page.goto('/support/');
    await expect(page.locator('main h1')).toBeVisible();
    await page.setContent('<div id="root"></div>');
    await page.addScriptTag({ content: bundles[String(enabled)] });
    await expect(page.getByRole('button', { name: 'Unmount', exact: true })).toBeVisible();
  }

  test('disabled offer never appears', async ({ page }) => {
    await mount(page, false);
    await reachQuickRing(page);
    await page.clock.runFor(10_000);
    await expect(dialog(page)).toHaveCount(0);
  });

  test('unmount disconnects the Quick Ring observer', async ({ page }) => {
    await mount(page, true);
    await page.getByRole('button', { name: 'Unmount', exact: true }).click();
    await reachQuickRing(page);
    await expect(dialog(page)).toHaveCount(0);
    await page.getByRole('button', { name: 'Remount', exact: true }).click();
    await reachQuickRing(page);
    await expect(dialog(page)).toBeVisible();
  });

  test('blocked storage falls back to document memory and tolerates StrictMode', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Storage.prototype.getItem = () => {
        throw new Error('Storage blocked');
      };
      Storage.prototype.setItem = () => {
        throw new Error('Storage blocked');
      };
    });
    await mount(page, true);
    await reachQuickRing(page);
    await expect(dialog(page)).toBeVisible();
    expect(await events(page, 'offer_popup_view')).toHaveLength(1);
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Unmount', exact: true }).click();
    await page.getByRole('button', { name: 'Remount', exact: true }).click();
    await reachQuickRing(page);
    await page.clock.runFor(6_000);
    await expect(dialog(page)).toHaveCount(0);
  });
});
