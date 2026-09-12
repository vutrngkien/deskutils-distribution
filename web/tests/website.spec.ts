import { test, expect } from '@playwright/test';
import { build } from 'esbuild';

for (const width of [375, 640, 768, 1440]) {
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
    await expect(page.getByText('🚀 Launch Offer', { exact: true })).toBeVisible();
    await expect(page.getByText('$7.99', { exact: true })).toBeVisible();
    await expect(page.getByText('$14.99', { exact: true })).toHaveCSS(
      'text-decoration-line',
      'line-through',
    );
    await expect(page.getByText('Lifetime license', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Use on up to 2 devices', { exact: true })).toBeVisible();
    await expect(page.getByText('Everything in Free', { exact: true })).toBeVisible();
    await expect(page.getByText('Extended clipboard history', { exact: true })).toBeVisible();
    await expect(page.getByText('Scrolling Capture', { exact: true }).last()).toBeVisible();
    await expect(page.getByText('Capture Subject', { exact: true }).last()).toBeVisible();
    await expect(page.getByText('Monitor dimming', { exact: true })).toBeVisible();
    await expect(page.getByText('Display dimming preview', { exact: true })).toHaveCount(0);
    await expect(page.getByText('All DeskUtils Pro utilities', { exact: true })).toHaveCount(0);
    await expect(page.getByText('License key delivered instantly', { exact: true })).toHaveCount(0);
    await expect(page.getByText('No recurring fees', { exact: true })).toHaveCount(0);
    await expect(page.getByText('500 clipboard items', { exact: true })).toHaveCount(0);
    await expect(page.getByText('Launch code', { exact: true })).toBeVisible();
    await expect(page.getByText('LAUNCH799', { exact: true })).toBeVisible();
    await expect(page.getByText('Why is DeskUtils $7.99?', { exact: true })).toBeVisible();
    const proCheckout = page.getByRole('link', { name: 'Get DeskUtils Pro', exact: true });
    const checkoutURL = new URL((await proCheckout.getAttribute('href')) ?? '');
    expect(checkoutURL.origin).toBe('https://deskutils.lemonsqueezy.com');
    expect(checkoutURL.pathname).toBe('/checkout/buy/c9fb0feb-6305-4361-9f15-10c1ff9f15f6');
    expect(checkoutURL.searchParams.get('checkout[discount_code]')).toBe('LAUNCH799');
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
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
    expect(errors).toEqual([]);
  });
}

test('pricing anchor keeps both plans and the Pro checkout action in view on a laptop', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto('/');
  await page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Pricing', exact: true })
    .click();
  await expect(page).toHaveURL(/#pricing$/);

  const pricing = page.locator('#pricing');
  await expect(
    pricing.getByRole('heading', { name: 'Use it free. Go Pro when you need more.' }),
  ).toBeInViewport();
  await expect(page.getByRole('link', { name: 'Get DeskUtils Pro', exact: true })).toBeInViewport();

  await expect(pricing.locator('article')).toHaveCount(2);
  for (const plan of await pricing.locator('article').all()) {
    const box = await plan.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBeGreaterThanOrEqual(76);
    expect(box!.y + box!.height).toBeLessThanOrEqual(900);
  }
});

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
  for (const path of ['/install/', '/privacy/', '/terms/', '/feedback/']) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://deskutils.app${path}`,
    );
    if (path === '/install/') {
      const download = page.getByRole('link', { name: 'Download DeskUtils', exact: true });
      await expect(download).toBeVisible();
      await expect(download).toHaveCSS('color', 'rgb(255, 255, 255)');
      await expect(page.getByRole('heading', { name: 'Open Privacy & Security' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Allow DeskUtils' })).toBeVisible();
    }
    if (path === '/feedback/') {
      await expect(page.getByRole('heading', { name: 'Found a bug? Have an idea?' })).toBeVisible();
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        'noindex, nofollow',
      );
    }
  }
  await page.goto('/404.html');
  await page.getByRole('link', { name: 'Back to DeskUtils →', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto('/vi/');
  await expect(page.locator('#install a')).toHaveAttribute('href', '/vi/install/');
  const localizedFeedback = await page.goto('/vi/feedback/');
  expect(localizedFeedback?.status()).toBe(200);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://deskutils.app/vi/feedback/',
  );
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
  await expect(page.getByRole('link', { name: 'deskutils.app@gmail.com' })).toHaveAttribute(
    'href',
    'mailto:deskutils.app@gmail.com',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('feedback is discoverable from the FAQ and footer while direct support remains available', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Get in touch', exact: true }).click();
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
    await expect(page.getByText('Verify the app before overriding macOS')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: `test-results/install-${width}.png`, fullPage: true });
  });
}

test('Umami tracks downloads and checkout only on the production domain', async ({ page }) => {
  await page.route('https://cloud.umami.is/script.js', (route) =>
    route.fulfill({ body: '', contentType: 'application/javascript' }),
  );
  await page.goto('/');

  const tracker = page.locator('script#umami-analytics');
  await expect(tracker).toHaveAttribute('data-website-id', '18c36bcd-0a9d-40a9-afb2-e95d9ca972af');
  await expect(tracker).toHaveAttribute('data-domains', 'deskutils.app');
  await expect(tracker).not.toHaveAttribute('data-do-not-track');

  const downloads = page.locator('[data-umami-event="download"]');
  await expect(downloads).toHaveCount(6);
  expect(
    await downloads.evaluateAll((links) =>
      links.every(
        (link) =>
          link.getAttribute('data-umami-event-locale') === 'en' &&
          Boolean(link.getAttribute('data-umami-event-placement')) &&
          link.getAttribute('href') === '/install/',
      ),
    ),
  ).toBe(true);

  const checkout = page.locator('[data-umami-event="checkout"]');
  await expect(checkout).toHaveCount(1);
  await expect(checkout).toHaveAttribute('data-umami-event-locale', 'en');
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
  await page.route('https://cloud.umami.is/script.js', (route) =>
    route.fulfill({ body: '', contentType: 'application/javascript' }),
  );
  await page.goto('/');

  await expect(page.locator('[data-umami-section]')).toHaveCount(8);
  await expect(
    page.locator('[data-umami-event="nav_click"][data-umami-event-target="features"]'),
  ).toHaveCount(1);
  await expect(page.locator('[data-umami-event="language_change"]')).toHaveCount(40);

  await page.locator('#faq').scrollIntoViewIfNeeded();
  await page.locator('#faq summary').first().click();
  await page.locator('#dimming').scrollIntoViewIfNeeded();
  await page.locator('#dimming-level').press('ArrowLeft');

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
    .toEqual(expect.arrayContaining(['section_view', 'faq_open', 'dimming_interact']));
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
  await page.getByRole('link', { name: 'Download for free', exact: true }).first().click();

  await expect(page).toHaveURL(/\/install\/$/);
  expect((await downloadRequest).url()).toBe(downloadURL);
  await expect(page.getByRole('link', { name: 'Download DeskUtils', exact: true })).toHaveAttribute(
    'href',
    /releases\/latest\/download\/DeskUtils.dmg$/,
  );
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
