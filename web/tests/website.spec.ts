import { test, expect } from '@playwright/test';
import { build } from 'esbuild';
import { routes } from '../content/routes';

const internalRoutes = routes
  .filter((route) => route.publish && !route.guide && route.path !== '/')
  .map((route) => route.path);

for (const width of [390, 768, 1200, 1440]) {
  test(`homepage works at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'Everyday Mac tools, always within reach.' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Copy now. Find it again later.' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Press ⌘ twice. Your go-to actions appear.' }),
    ).toBeVisible();
    await expect(page.getByText('$7.99', { exact: true })).toBeVisible();
    await expect(page.getByText('$14.99', { exact: true })).toHaveCSS(
      'text-decoration-line',
      'line-through',
    );
    await expect(page.getByText('Lifetime license', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Use on up to 2 devices', { exact: true })).toBeVisible();

    const proCheckout = page.getByRole('link', { name: 'Get DeskUtils Pro', exact: true });
    const checkoutURL = new URL((await proCheckout.getAttribute('href')) ?? '');
    expect(checkoutURL.origin).toBe('https://deskutils.lemonsqueezy.com');
    expect(checkoutURL.pathname).toBe('/checkout/buy/c9fb0feb-6305-4361-9f15-10c1ff9f15f6');
    expect(checkoutURL.searchParams.get('checkout[discount_code]')).toBe('LAUNCH799');

    const softwareNodes = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((elements) =>
        elements.flatMap((element) => {
          const graph = JSON.parse(element.textContent ?? '{"@graph":[]}') as {
            '@graph': { '@type': string }[];
          };
          return graph['@graph'].filter((item) => item['@type'] === 'SoftwareApplication');
        }),
      );
    expect(softwareNodes).toHaveLength(1);

    await expect(page.locator('#faq details')).toHaveCount(9);

    // Published homepage never shows an empty placeholder; temporary mockups
    // stand in until generated media is supplied.
    await expect(page.locator('[data-media-slot]')).toHaveCount(5);
    await expect(page.locator('[data-media-state="placeholder"]')).toHaveCount(0);
    await expect(page.locator('[data-media-state="ready"]')).toHaveCount(0);
    await expect(page.locator('[data-media-state="mockup"]')).toHaveCount(5);
    for (const id of ['screenshot', 'clipboard', 'quickring']) {
      await expect(
        page.locator(`[data-media-slot="${id}"][data-media-state="mockup"]`),
      ).toHaveCount(1);
    }

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    // Catch the actual fidelity regressions: responsive column ordering and clipped OCR.
    const grid = page.getByTestId('utility-grid');
    if (width >= 1200) {
      expect(
        await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length),
      ).toBe(4);
    }
    const ocrCard = page.getByTestId('capture-text-card');
    const result = ocrCard.getByTestId('ocr-result').filter({ visible: true });
    const cardBox = await ocrCard.boundingBox();
    const resultBox = await result.boundingBox();
    expect(cardBox).not.toBeNull();
    expect(resultBox).not.toBeNull();
    expect(resultBox!.y).toBeGreaterThanOrEqual(cardBox!.y);
    expect(resultBox!.y + resultBox!.height).toBeLessThanOrEqual(cardBox!.y + cardBox!.height + 1);
    expect(resultBox!.x + resultBox!.width).toBeLessThanOrEqual(cardBox!.x + cardBox!.width + 1);
    expect(errors).toEqual([]);
  });
}

test('pricing section keeps both plans and the Pro checkout action in view', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto('/');
  const pricing = page.locator('#pricing');
  await expect(
    pricing.getByRole('heading', { name: 'Free to start. Pro when you need more.' }),
  ).toBeVisible();
  await expect(pricing.locator('article')).toHaveCount(2);
  const proCheckout = page.getByRole('link', { name: 'Get DeskUtils Pro', exact: true });
  await proCheckout.scrollIntoViewIfNeeded();
  await expect(proCheckout).toBeVisible();
});

test('keyboard, mobile menu and internal routes work', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByText('Skip to content')).toBeFocused();

  await page.locator('summary[aria-label="Mobile navigation"]').click();
  await expect(page.locator('div[aria-label="Mobile navigation"]')).toBeVisible();

  for (const path of internalRoutes) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://deskutils.app${path}`,
    );
  }
});

test('unknown routes serve the exported 404 with a real 404 status', async ({ page }) => {
  const response = await page.goto('/unknown-route/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"][content="noindex, nofollow"]')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'This one got away.' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to DeskUtils →', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('desktop Features disclosure closes on Escape and restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Primary navigation' });
  const trigger = nav.locator('summary', { hasText: 'Features' });
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(nav.getByRole('link', { name: /All features/ })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toBeFocused();
});

test('mobile navigation traps focus, closes on Escape and restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const trigger = page.locator('summary[aria-label="Mobile navigation"]');
  const details = page.locator('details', { has: trigger });
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');

  const controls = await trigger.getAttribute('aria-controls');
  expect(controls).toBeTruthy();
  await expect(page.locator(`[id="${controls}"]`)).toBeVisible();

  const lastLink = details.locator('a[href]:visible').last();
  await lastLink.focus();
  await page.keyboard.press('Tab');
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(lastLink).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toBeFocused();
});

test('incomplete locales are noindex while translated routes stay indexable', async ({ page }) => {
  await page.goto('/de/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await page.goto('/de/install/');
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
});

test('sitemap reflects route-aware completeness', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  const xml = await response.text();
  expect(xml).toContain('https://deskutils.app/</loc>');
  expect(xml).not.toContain('https://deskutils.app/de/</loc>');
  expect(xml).toContain('https://deskutils.app/de/install/');
  expect(xml).not.toContain('/feedback/');
});

test('feedback page validates fields and keeps a safe email fallback without an endpoint', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/feedback/');

  await expect(page.getByRole('button', { name: 'Feedback', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: 'Bug', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Bug', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  await page.getByLabel('Your feedback').fill('The clipboard filter could be easier to discover.');
  await page.getByLabel('Email address').fill('person@example.com');
  await page.setInputFiles('#feedback-attachment', {
    name: 'not-an-image.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('not an image'),
  });
  await expect(page.getByText('Please choose an image file.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send feedback', exact: true })).toBeDisabled();
  await expect(page.getByText('Feedback submissions are temporarily unavailable.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'deskutils.app@gmail.com' }).first()).toHaveAttribute(
    'href',
    'mailto:deskutils.app@gmail.com',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('feedback is discoverable from the FAQ and footer while direct support remains available', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Get in touch/ }).click();
  await expect(page).toHaveURL(/\/feedback\/$/);
  await page.goto('/feedback/');
  const footer = page.getByRole('navigation', { name: 'Footer navigation' });
  await expect(footer.getByRole('link', { name: 'Feedback', exact: true })).toHaveAttribute(
    'href',
    '/feedback/',
  );
  await expect(footer.getByRole('link', { name: 'Support', exact: true })).toHaveAttribute(
    'href',
    'mailto:deskutils.app@gmail.com',
  );
});

test('localized header uses the translated download label', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('/de/');
  await expect(
    page.locator('header').first().getByRole('link', { name: 'Herunterladen', exact: true }),
  ).toHaveAttribute('href', '/de/install/');
});

for (const width of [375, 1024]) {
  test(`installation guide works at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/install/');

    await expect(
      page.getByRole('heading', { name: 'A few steps. Then you’re home.' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Open Privacy & Security' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Allow DeskUtils' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}

test('Umami tracks downloads and checkout only on the production domain', async ({ page }) => {
  await page.route('**/cloud.umami.is/**', (route) =>
    route.fulfill({ body: '', contentType: 'application/javascript' }),
  );
  await page.goto('/');

  const tracker = page.locator('script[data-website-id]').first();
  await expect(tracker).toHaveAttribute('data-website-id', '18c36bcd-0a9d-40a9-afb2-e95d9ca972af');
  await expect(tracker).toHaveAttribute('data-domains', 'deskutils.app');
  await expect(tracker).not.toHaveAttribute('data-do-not-track');

  const downloads = page.locator('[data-umami-event="download"]');
  expect(await downloads.count()).toBeGreaterThanOrEqual(4);

  const checkout = page.locator('[data-umami-event="checkout"]');
  await expect(checkout).toHaveCount(1);
  await expect(checkout).toHaveAttribute('data-umami-event-placement', 'pricing_pro');

  await page.goto('/privacy/');
  await expect(page.getByText(/uses Umami, a privacy-focused analytics service/)).toBeVisible();
});

test('Umami records meaningful engagement signals', async ({ page }) => {
  await page.addInitScript(() => {
    const events: { event: string; data?: Record<string, unknown> }[] = [];
    Object.assign(window, {
      __umamiEvents: events,
      umami: {
        track: (event: string, data?: Record<string, unknown>) => events.push({ event, data }),
      },
    });
  });
  await page.route('**/cloud.umami.is/**', (route) =>
    route.fulfill({ body: '', contentType: 'application/javascript' }),
  );
  await page.goto('/');

  await expect(page.locator('[data-umami-section]')).toHaveCount(8);
  await expect(page.locator('[data-umami-event="language_change"]')).toHaveCount(20);

  await page.locator('#faq').scrollIntoViewIfNeeded();
  await page.locator('#faq summary').first().click();

  await expect
    .poll(() =>
      page.evaluate(() =>
        (
          window as typeof window & {
            __umamiEvents: { event: string; data?: Record<string, unknown> }[];
          }
        ).__umamiEvents.map(({ event }) => event),
      ),
    )
    .toEqual(expect.arrayContaining(['section_view', 'faq_open']));
});

test('content and native controls work without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.locator('h1')).toBeVisible();
  const mobileDetails = page.locator('details', {
    has: page.locator('summary[aria-label="Mobile navigation"]'),
  });
  await page.locator('summary[aria-label="Mobile navigation"]').click();
  await expect(mobileDetails.getByRole('link', { name: 'All features' })).toBeVisible();
  await expect(page.locator('#faq details')).toHaveCount(9);
  await expect(page.getByText(/^No. Clipboard history stays on your Mac/)).toBeAttached();
  await expect(
    page.getByRole('link', { name: 'Download for Mac', exact: false }).first(),
  ).toHaveAttribute('href', '/install/');
  await context.close();
});

test('download opens the installation guide and starts the DMG request', async ({ page }) => {
  const downloadURL =
    'https://github.com/vutrngkien/deskutils-distribution/releases/latest/download/DeskUtils.dmg';
  await page.route(downloadURL, (route) => route.abort());
  const downloadRequest = page.context().waitForEvent('request', {
    predicate: (request) => request.url() === downloadURL,
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Download for Mac', exact: true }).first().click();

  await expect(page).toHaveURL(/\/install\/$/);
  expect((await downloadRequest).url()).toBe(downloadURL);
});

test('reduced motion and enlarged text remain usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator('main').evaluate((el) => getComputedStyle(el).animationName)).toBe(
    'none',
  );
});

test.describe('media slot fixture', () => {
  let js = '';
  test.beforeAll(async () => {
    const result = await build({
      entryPoints: ['tests/fixtures/mediaslot.tsx'],
      bundle: true,
      write: false,
      outdir: '/private/tmp/deskutils-mediaslot-test',
      format: 'iife',
      jsx: 'automatic',
      define: { 'process.env.NODE_ENV': '"production"' },
      alias: { '@/content/media': './tests/fixtures/media-stub.ts' },
    });
    js = result.outputFiles.find((file) => file.path.endsWith('.js'))!.text;
  });

  async function mount(page: import('@playwright/test').Page, generated: boolean) {
    await page.setContent(
      `<div id="root"></div><script id="slot-data" type="application/json">${JSON.stringify({
        generated,
      })}</script>`,
    );
    await page.addScriptTag({ content: js });
  }

  test('generated media replaces the temporary mockup', async ({ page }) => {
    await page.goto('/');
    await mount(page, true);
    const figure = page.locator('[data-media-slot="hero"]');
    await expect(figure).toHaveAttribute('data-media-state', 'ready');
    await expect(figure.locator('picture')).toHaveCount(1);
    await expect(figure.locator('source[type="image/avif"]')).toHaveCount(1);
    await expect(figure.locator('source[type="image/webp"]')).toHaveCount(1);
    await expect(figure.locator('img')).toHaveAttribute('srcset', /1x, .* 2x/);
    await expect(figure.locator('img')).toHaveAttribute('width', '1200');
    await expect(figure.locator('img')).toHaveAttribute('height', '700');
    await expect(page.getByTestId('fixture-mockup')).toHaveCount(0);
  });

  test('renders the temporary mockup when media is unavailable', async ({ page }) => {
    await page.goto('/');
    await mount(page, false);
    const figure = page.locator('[data-media-slot="hero"]');
    await expect(figure).toHaveAttribute('data-media-state', 'mockup');
    await expect(page.getByTestId('fixture-mockup')).toHaveCount(1);
    await expect(figure.locator('picture')).toHaveCount(0);
  });
});

test.describe('video component in an isolated test fixture', () => {
  let js = '';
  let css = '';
  test.beforeAll(async () => {
    const result = await build({
      entryPoints: ['tests/fixtures/media.tsx'],
      bundle: true,
      write: false,
      outdir: '/private/tmp/deskutils-media-test',
      format: 'iife',
      jsx: 'automatic',
      define: { 'process.env.NODE_ENV': '"production"' },
    });
    js = result.outputFiles.find((file) => file.path.endsWith('.js'))!.text;
    css = result.outputFiles.find((file) => file.path.endsWith('.css'))!.text;
  });
  async function mount(
    page: import('@playwright/test').Page,
    sources?: { src: string; type: string }[],
  ) {
    const demo = {
      title: 'capture.demoTitle',
      description: 'capture.demoDescription',
      poster: '/assets/images/color_picker_panel.webp',
      aspectRatio: '16 / 9',
      sources,
    };
    await page.setContent(
      `<style>:root{--surface:#eee;--paper:#fff;--muted:#444;--line:#ddd}body{max-width:600px}${css}</style><div id="root"></div><script id="demo-data" type="application/json">${JSON.stringify(demo)}</script>`,
    );
    await page.addScriptTag({ content: js });
  }
  test('poster-only fixture has no fake play control', async ({ page }) => {
    await page.goto('/');
    await mount(page);
    await expect(
      page.getByRole('img', {
        name: 'Capture a region, then annotate it without breaking your flow.',
      }),
    ).toBeVisible();
    await expect(page.locator('video')).toHaveCount(0);
    await expect(page.getByRole('button')).toHaveCount(0);
  });
  test('broken video falls back to the poster', async ({ page }) => {
    await page.goto('/');
    await page.route('**/missing.mp4', (route) => route.fulfill({ status: 404 }));
    await mount(page, [{ src: '/missing.mp4', type: 'video/mp4' }]);
    await expect(page.locator('video')).toHaveAttribute('preload', 'none');
    await page.locator('video').evaluate((video) => {
      void (video as HTMLVideoElement).play().catch(() => {});
    });
    await expect(page.getByRole('status')).toContainText('could not load');
    await expect(
      page.getByRole('img', {
        name: 'Capture a region, then annotate it without breaking your flow.',
      }),
    ).toBeVisible();
  });
  test('valid recording plays inline only on request', async ({ page }) => {
    await page.goto('/');
    const source = await page.evaluate(async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 90;
      const stream = canvas.captureStream(10);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks: Blob[] = [];
      const stopped = new Promise<Blob>((resolve) => {
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
      });
      recorder.start();
      for (let i = 0; i < 6; i++) {
        canvas.getContext('2d')!.fillRect(i * 10, 0, 20, 20);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      recorder.stop();
      const blob = await stopped;
      stream.getTracks().forEach((track) => track.stop());
      return URL.createObjectURL(blob);
    });
    await mount(page, [{ src: source, type: 'video/webm' }]);
    const video = page.locator('video');
    await expect(video).toHaveAttribute('playsinline', '');
    await expect(video).toHaveAttribute('controls', '');
    expect(
      await video.evaluate(
        (el) => (el as HTMLVideoElement).paused && !(el as HTMLVideoElement).autoplay,
      ),
    ).toBe(true);
    await video.evaluate((el) => (el as HTMLVideoElement).play());
    await expect
      .poll(() => video.evaluate((el) => (el as HTMLVideoElement).currentTime))
      .toBeGreaterThan(0);
  });
});

test('homepage FAQ uses divided rows and one open answer at a time', async ({ page }) => {
  await page.goto('/');
  const rows = page.locator('#faq details');
  await expect(rows).toHaveCount(9);
  await rows.nth(0).locator('summary').click();
  await expect(rows.nth(0)).toHaveAttribute('open', '');
  await expect(rows.nth(0).locator('.home-faq-minus')).toBeVisible();
  await rows.nth(1).locator('summary').click();
  await expect(page.locator('#faq details[open]')).toHaveCount(1);
  await expect(rows.nth(1)).toHaveAttribute('open', '');
  await expect(rows.nth(1)).toHaveCSS('border-bottom-width', '1px');
  await expect(rows.nth(1).locator('summary')).toHaveCSS('list-style-type', 'none');
});

test('navigation exposes Features, Pricing, Feedback and Changelog', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(nav.locator('summary', { hasText: 'Features' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Pricing', exact: true })).toHaveAttribute(
    'href',
    '/#pricing',
  );
  await expect(nav.getByRole('link', { name: 'Feedback', exact: true })).toHaveAttribute(
    'href',
    '/feedback/',
  );
  await expect(nav.getByRole('link', { name: 'Changelog', exact: true })).toHaveAttribute(
    'href',
    'https://github.com/vutrngkien/deskutils-distribution/releases',
  );
  await expect(page.locator('.home-trust')).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('summary[aria-label="Mobile navigation"]').click();
  const mobile = page.locator('div[aria-label="Mobile navigation"]');
  await expect(mobile.getByRole('link', { name: 'Feedback', exact: true })).toBeVisible();
  await expect(mobile.getByRole('link', { name: 'Pricing', exact: true })).toBeVisible();
});

test('mockup motion runs when visible and freezes with Reduce Motion', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const pointer = page.getByTestId('jiggler-pointer');
  await pointer.scrollIntoViewIfNeeded();
  const start = await pointer.getAttribute('style');
  await expect.poll(() => pointer.getAttribute('style')).not.toBe(start);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(pointer).toHaveCSS('transition-duration', '0s');
  await expect.poll(() => pointer.getAttribute('style')).toContain('left: 62%');
  const fixed = await pointer.getAttribute('style');
  await page.waitForTimeout(1600);
  expect(await pointer.getAttribute('style')).toBe(fixed);
  const shade = page.locator('[data-dim-overlay]');
  await expect(shade).toHaveCSS('opacity', '0.74');
  await expect(shade).toHaveCSS('background-color', 'rgb(8, 17, 35)');
  expect(await shade.evaluate((el) => getComputedStyle(el.parentElement!).opacity)).toBe('1');

  const ring = page.locator('.home-ring-demo');
  await ring.scrollIntoViewIfNeeded();
  const canvas = await ring.locator('.home-ring-art').boundingBox();
  const icon = await ring.locator('[data-ring-icon="0"]').boundingBox();
  expect(Math.abs(icon!.x + icon!.width / 2 - (canvas!.x + canvas!.width / 2))).toBeLessThan(1);
  expect(Math.abs(icon!.y + icon!.height / 2 - (canvas!.y + canvas!.height / 6))).toBeLessThan(1);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const phase = await ring.getAttribute('data-ring-phase');
  await expect.poll(() => ring.getAttribute('data-ring-phase')).not.toBe(phase);
});

test.describe('screenshot recording tabs', () => {
  let js = '';
  test.beforeAll(async () => {
    const result = await build({
      entryPoints: ['tests/fixtures/screenshot-tabs.tsx'],
      bundle: true,
      write: false,
      outdir: '/private/tmp/deskutils-screenshot-tabs-test',
      format: 'iife',
      jsx: 'automatic',
      define: { 'process.env.NODE_ENV': '"production"' },
    });
    js = result.outputFiles.find((file) => file.path.endsWith('.js'))!.text;
  });
  async function mount(page: import('@playwright/test').Page, broken = false) {
    await page.goto('/');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const sources = [
      { src: broken ? '/missing-tab-video.mp4' : '/videos/annotate-demo.mp4', type: 'video/mp4' },
    ];
    await page.setContent(
      `<style>.home-shot-media{position:relative;width:600px;height:384px}.home-shot-video{position:absolute;inset:0;width:100%;height:100%}</style><div id="root"></div><script id="tabs-data" type="application/json">${JSON.stringify({ videos: [sources, sources, sources] })}</script>`,
    );
    await page.addScriptTag({ content: js });
  }
  test('video ended advances the selected tab and manual selection replaces the video', async ({
    page,
  }) => {
    await mount(page);
    await expect(page.getByRole('button', { name: 'Annotate', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    const video = page.locator('video');
    await expect
      .poll(() => video.evaluate((el) => (el as HTMLVideoElement).readyState))
      .toBeGreaterThan(0);
    expect(await video.evaluate((el) => (el as HTMLVideoElement).paused)).toBe(true);
    await video.dispatchEvent('ended');
    await expect(page.getByRole('button', { name: 'Copy & save', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await page.locator('video').dispatchEvent('ended');
    await expect(page.getByRole('button', { name: 'Capture', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await page.getByRole('button', { name: 'Annotate', exact: true }).click();
    await expect(page.locator('video')).toHaveAttribute('aria-label', 'Annotate');
  });
  test('changing Reduce Motion pauses autoplay but still allows manual playback', async ({
    page,
  }) => {
    await mount(page);
    const video = page.locator('video');
    await expect
      .poll(() => video.evaluate((el) => (el as HTMLVideoElement).readyState))
      .toBeGreaterThan(0);
    // Keep this fixture playing so its short recording cannot advance tabs mid-check.
    await video.evaluate((el) => {
      (el as HTMLVideoElement).loop = true;
    });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect.poll(() => video.evaluate((el) => (el as HTMLVideoElement).paused)).toBe(false);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect.poll(() => video.evaluate((el) => (el as HTMLVideoElement).paused)).toBe(true);
    await video.evaluate((el) => (el as HTMLVideoElement).play());
    await expect.poll(() => video.evaluate((el) => (el as HTMLVideoElement).paused)).toBe(false);
    await video.evaluate((el) => (el as HTMLVideoElement).pause());
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForTimeout(300);
    expect(await video.evaluate((el) => (el as HTMLVideoElement).paused)).toBe(true);
  });

  test('broken recording keeps the mockup visible and does not advance on a timer', async ({
    page,
  }) => {
    await mount(page, true);
    await expect(page.locator('[data-video-state]')).toHaveAttribute('data-video-state', 'failed');
    await expect(page.getByTestId('screenshot-fallback')).toBeVisible();
    await expect(page.locator('video')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Annotate', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});

test('Reddit strip keeps four source comments and pauses for hover, keyboard and Reduce Motion', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const section = page.locator('.home-social-proof');
  await section.scrollIntoViewIfNeeded();
  const original = section.locator('[data-social-original]');
  await expect(original.locator('.home-social-card')).toHaveCount(4);
  await expect(section.locator('.home-social-card')).toHaveCount(8);
  await expect(original.getByText('u/mrterrycarson', { exact: true })).toBeVisible();
  await expect(original.locator('a')).toHaveCount(4);
  const ids = ['pcpf9b3', 'pd5iufo', 'pco8k5a', 'pco046c'];
  for (const group of [original, section.locator('[data-social-clone]')]) {
    for (const [index, id] of ids.entries()) {
      const link = group.locator('a').nth(index);
      await expect(link).toHaveAttribute(
        'href',
        `https://www.reddit.com/r/MacStack/comments/1wsl0hk/comment/${id}/`,
      );
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  }
  const clone = section.locator('[data-social-clone]');
  await expect(clone).toHaveAttribute('aria-hidden', 'true');
  await expect(clone).not.toHaveAttribute('inert');
  for (const link of await clone.locator('a').all()) {
    await expect(link).toHaveAttribute('tabindex', '-1');
  }
  const track = section.locator('.home-social-track');
  await expect(track).toHaveCSS('animation-name', 'home-social-scroll');
  const beginning = await track.evaluate((el) => getComputedStyle(el).transform);
  await expect
    .poll(() => track.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe(beginning);
  const groupWidth = (await original.boundingBox())!.width;
  const trackWidth = (await track.boundingBox())!.width;
  expect(Math.abs(trackWidth - groupWidth * 2)).toBeLessThan(1);
  await section.hover();
  await expect(track).toHaveCSS('animation-play-state', 'paused');
  const viewport = section.getByRole('group', { name: 'Reddit comments' });
  await viewport.focus();
  await expect(track).toHaveCSS('animation-name', 'none');
  await expect(clone).toBeHidden();
  await viewport.evaluate((el) => (el as HTMLElement).blur());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(track).toHaveCSS('animation-name', 'none');
  await expect(viewport).toHaveCSS('overflow-x', 'auto');
  await expect(clone).toBeHidden();
  await expect(page.locator('#pricing')).not.toContainText('One license key activates');
});

test('monitoring gauges match the app and reveal percentages on hover, focus and touch', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const gauges = page.locator('.home-system-visual .du-metric-gauge');
  await expect(gauges).toHaveCount(3);
  await gauges.first().scrollIntoViewIfNeeded();
  const cpu = gauges.nth(0);
  const memory = gauges.nth(1);
  const disk = gauges.nth(2);
  await expect(cpu.locator('.du-metric-arc')).toHaveAttribute('stroke-width', '5');
  await expect(cpu.locator('.du-metric-arc')).toHaveAttribute('stroke-linecap', 'round');
  await expect(cpu.locator('.du-metric-value')).toHaveCSS('opacity', '0');
  await expect(cpu.locator('.du-metric-label')).toHaveText('CPU');
  for (const arc of await gauges.locator('.du-metric-arc').all()) {
    await expect(arc).toHaveAttribute('stroke', '#00c82d');
  }
  await cpu.hover();
  await expect(cpu.locator('.du-metric-value')).toHaveCSS('opacity', '1');
  await expect(cpu.locator('.du-metric-symbol')).toHaveCSS('opacity', '0');
  await memory.focus();
  await expect(memory.locator('.du-metric-value')).toHaveCSS('opacity', '1');
  await disk.click();
  await expect(disk).toHaveAttribute('aria-pressed', 'true');
  await expect(disk.locator('.du-metric-value')).toHaveCSS('opacity', '1');
});

test('original and looping Reddit cards open the exact comment in a new tab', async ({
  page,
  context,
}) => {
  await context.route('https://www.reddit.com/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<p>Comment destination</p>' }),
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const section = page.locator('.home-social-proof');
  await section.scrollIntoViewIfNeeded();
  for (const duplicate of [false, true]) {
    await page.mouse.move(0, 0);
    await page
      .locator(':focus')
      .evaluateAll((elements) => elements.forEach((el) => (el as HTMLElement).blur()));
    await section.locator('.home-social-track').evaluate((el, duplicate) => {
      (el as HTMLElement).style.animation = 'none';
      (el as HTMLElement).style.transform = duplicate ? 'translateX(-50%)' : 'none';
    }, duplicate);
    const card = section
      .locator(duplicate ? '[data-social-clone] a' : '[data-social-original] a')
      .first();
    const opened = page.waitForEvent('popup');
    await card.click();
    const popup = await opened;
    await expect(popup).toHaveURL(
      'https://www.reddit.com/r/MacStack/comments/1wsl0hk/comment/pcpf9b3/',
    );
    await popup.close();
  }
});
