import { test, expect } from '@playwright/test';
import { build } from 'esbuild';

for (const width of [375, 768, 1440]) {
  test(`homepage works at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: /Small tools Right where you need them/ }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'See it before you paste' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Find it with a few letters' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Capture, annotate, and keep moving.' }),
    ).toBeVisible();
    await expect(page.getByText('Pro is coming soon', { exact: true })).toBeVisible();
    await expect(page.getByText('$7.99', { exact: true })).toBeVisible();
    const structuredData = page.locator('script[type="application/ld+json"]');
    await expect(structuredData).toHaveCount(1);
    expect(
      await structuredData.evaluate((element) => {
        const graph = JSON.parse(element.textContent ?? '{"@graph":[]}') as {
          '@graph': { '@type': string }[];
        };
        return graph['@graph'].some((item) => item['@type'] === 'SoftwareApplication');
      }),
    ).toBe(true);
    const toolLinks = page.getByRole('navigation', { name: 'Explore utilities' }).getByRole('link');
    for (const link of await toolLinks.all()) {
      const target = await link.getAttribute('href');
      await expect(page.locator(target!)).toBeAttached();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.locator('img').evaluateAll(async (images) => {
      for (const image of images) {
        image.scrollIntoView({ block: 'center' });
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      }
    });
    await expect
      .poll(() =>
        page
          .locator('img')
          .evaluateAll((images) =>
            images.every(
              (img) =>
                (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      )
      .toBe(true);
    expect(
      await page
        .locator('img')
        .evaluateAll((images) =>
          images.every(
            (img) =>
              (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    ).toBe(true);
    await expect(page.locator('a[href*="lemonsqueezy"]')).toHaveCount(0);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
    expect(errors).toEqual([]);
  });
}

test('keyboard, mobile menu and internal routes work', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByText('Skip to content')).toBeFocused();
  await page.locator('summary:visible', { hasText: 'Menu' }).click();
  const mobile = page.getByRole('navigation', { name: 'Mobile navigation', exact: true });
  await expect(mobile).toBeVisible();
  await mobile.getByRole('link', { name: 'Pricing', exact: true }).click();
  await expect(page).toHaveURL(/#pricing$/);
  await expect(mobile).not.toBeVisible();
  for (const path of ['/install/', '/privacy/', '/terms/']) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://deskutils.app${path}`,
    );
    if (path === '/install/') {
      const download = page.getByRole('link', { name: 'Download DeskUtils ↓', exact: true });
      await expect(download).toBeVisible();
      await expect(download).toHaveCSS('color', 'rgb(255, 255, 255)');
    }
  }
  await page.goto('/404.html');
  await page.getByRole('link', { name: 'Back to DeskUtils →', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto('/vi/');
  await expect(page.locator('#install a')).toHaveAttribute('href', '/vi/install/');
});

test('content and native controls work without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.locator('h1')).toBeVisible();
  await page.locator('summary:visible', { hasText: 'Menu' }).click();
  await expect(
    page.getByRole('navigation', { name: 'Mobile navigation', exact: true }),
  ).toBeVisible();
  await page.getByText('Does my clipboard leave my Mac?', { exact: true }).click();
  await expect(page.getByText(/^No. Clipboard history stays on your Mac/)).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Download for free', exact: false }).first(),
  ).toHaveAttribute('href', /releases\/latest\/download\/DeskUtils.dmg$/);
  await context.close();
});

test('clipboard demo autoplays without media controls', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');

  const video = page.locator('#features video');
  await expect(video).toHaveAttribute('autoplay', '');
  await expect(video).toHaveAttribute('loop', '');
  await expect(video).not.toHaveAttribute('controls', '');
  await expect(video).toHaveJSProperty('muted', true);
  await expect
    .poll(() => video.evaluate((element) => (element as HTMLVideoElement).currentTime))
    .toBeGreaterThan(0);
});

test('annotation demo autoplays without media controls', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');

  await page.locator('#screenshots').scrollIntoViewIfNeeded();

  const video = page.locator('#screenshots video');
  await expect(video).toHaveAttribute('autoplay', '');
  await expect(video).toHaveAttribute('loop', '');
  await expect(video).not.toHaveAttribute('controls', '');
  await expect(video).toHaveJSProperty('muted', true);
  await expect
    .poll(() => video.evaluate((element) => (element as HTMLVideoElement).currentTime))
    .toBeGreaterThan(0);
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
    // A synthetic silent video is generated only in this test, never shipped.
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
