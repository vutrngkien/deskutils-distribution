import { test, expect } from '@playwright/test';
import { build } from 'esbuild';
import { routes } from '../content/routes';
import releaseSnapshot from '../content/releases.json';

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
      page.getByRole('heading', { name: 'Your favorite tools. Two taps away.' }),
    ).toBeVisible();
    await expect(page.getByText('$7.99', { exact: true })).toBeVisible();
    await expect(page.getByText('$14.99', { exact: true })).toHaveCSS(
      'text-decoration-line',
      'line-through',
    );
    await expect(page.getByText('Lifetime license', { exact: true })).toBeVisible();
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

    await expect(page.locator('#faq details')).toHaveCount(7);

    // Published homepage never shows an empty placeholder; temporary mockups
    // stand in until generated media is supplied.
    await expect(page.locator('[data-media-slot]')).toHaveCount(4);
    await expect(page.locator('[data-media-state="placeholder"]')).toHaveCount(0);
    await expect(
      page.locator('[data-media-state="ready"], [data-media-state="mockup"]'),
    ).toHaveCount(4);
    for (const id of ['quickring', 'color-picker-panel']) {
      await expect(page.locator(`[data-media-slot="${id}"]`)).toHaveAttribute(
        'data-media-state',
        /^(mockup|ready)$/,
      );
    }

    const screenshotDemo = page.locator('.home-shot-demo');
    await expect(screenshotDemo.locator('.home-shot-tabs')).toHaveCount(0);
    await screenshotDemo.scrollIntoViewIfNeeded();
    const video = screenshotDemo.locator('video');
    await expect(video).toHaveAttribute('poster', '/videos/annotate-poster.webp');
    await expect(video.locator('source')).toHaveAttribute('src', '/videos/annotate-demo.mp4');
    await expect
      .poll(() => video.evaluate((el) => (el as HTMLVideoElement).readyState))
      .toBeGreaterThanOrEqual(2);
    const box = await video.boundingBox();
    if (width < 768) {
      expect(box!.height).toBe(352);
    } else {
      expect(box!.width / box!.height).toBeCloseTo(1000 / 640, 2);
    }
    await expect(video).toHaveCSS('object-fit', 'cover');

    const clipboardFrame = page.locator('.home-clip-visual');
    await clipboardFrame.scrollIntoViewIfNeeded();
    const clipboardVideo = clipboardFrame.locator('video');
    await expect(clipboardVideo.locator('source')).toHaveAttribute(
      'src',
      '/videos/clipboard-demo.mp4',
    );
    await expect(clipboardVideo).toHaveAttribute('poster', '/videos/clipboard-poster.webp');
    await expect
      .poll(() => clipboardVideo.evaluate((el) => (el as HTMLVideoElement).readyState))
      .toBeGreaterThanOrEqual(2);
    const clipboardBox = (await clipboardFrame.boundingBox())!;
    const clipVideoBox = (await clipboardVideo.boundingBox())!;
    expect(clipboardBox.height).toBe(width >= 1200 ? 520 : 310);
    expect(clipVideoBox.width).toBeGreaterThan(clipboardBox.width);
    expect(clipVideoBox.x).toBeLessThan(clipboardBox.x);
    expect(clipVideoBox.width / clipVideoBox.height).toBeCloseTo(8 / 5, 2);

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    // Catch responsive column ordering and a clipped Capture Text recording.
    const grid = page.getByTestId('utility-grid');
    if (width >= 1200) {
      expect(
        await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length),
      ).toBe(4);
    }
    const ocrCard = page.getByTestId('capture-text-card');
    const result = ocrCard.locator('.home-ocr-recording');
    await result.scrollIntoViewIfNeeded();
    const ocrVideo = result.locator('video');
    await expect(ocrVideo.locator('source')).toHaveAttribute(
      'src',
      '/videos/capture-text-demo.mp4',
    );
    await expect(ocrVideo).toHaveAttribute('poster', '/videos/capture-text-poster.webp');
    await expect
      .poll(() => ocrVideo.evaluate((el) => (el as HTMLVideoElement).readyState))
      .toBeGreaterThanOrEqual(2);
    const cardBox = await ocrCard.boundingBox();
    const resultBox = await result.boundingBox();
    expect(cardBox).not.toBeNull();
    expect(resultBox).not.toBeNull();
    expect(resultBox!.y).toBeGreaterThanOrEqual(cardBox!.y);
    expect(resultBox!.y + resultBox!.height).toBeLessThanOrEqual(cardBox!.y + cardBox!.height + 1);
    expect(resultBox!.x + resultBox!.width).toBeLessThanOrEqual(cardBox!.x + cardBox!.width + 1);
    if (width >= 1200) {
      const colorCard = (await page.getByTestId('color-picker-card').boundingBox())!;
      const panel = (await page.locator('.home-color-art').boundingBox())!;
      const rightInset = colorCard.x + colorCard.width - panel.x - panel.width;
      const bottomInset = colorCard.y + colorCard.height - panel.y - panel.height;
      expect(rightInset).toBeCloseTo(bottomInset, 0);
    }
    await expect(ocrVideo).toHaveCSS('transform', 'matrix(1.42, 0, 0, 1.42, 0, 0)');
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
  await expect(page.getByRole('heading', { name: 'We couldn’t find that page' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'All features' })).toHaveAttribute(
    'href',
    '/features/',
  );
  await expect(page.getByRole('link', { name: 'Support', exact: true })).toHaveAttribute(
    'href',
    '/support/',
  );
  await page.getByRole('link', { name: 'Go to homepage' }).click();
  await expect(page).toHaveURL(/\/$/);
});

for (const width of [1200, 1440]) {
  test(`Features shows its open state and anchors the panel below its trigger at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary navigation' });
    const trigger = nav.locator('summary', { hasText: 'Features' });
    const panel = nav.locator('.home-features-panel');
    const chevron = trigger.locator('svg');
    await expect(panel).toBeHidden();
    await expect(trigger).toHaveCSS('color', 'rgb(43, 53, 80)');
    await expect(chevron).toHaveCSS('transform', 'none');
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(trigger).toHaveCSS('color', 'rgb(20, 80, 245)');
    await expect(chevron).toHaveCSS('transform', 'matrix(-1, 0, 0, -1, 0, 0)');
    await expect(panel).toBeVisible();
    const triggerBox = (await trigger.boundingBox())!;
    const panelBox = (await panel.boundingBox())!;
    const header = page.locator('body > header');
    const headerBox = (await header.boundingBox())!;
    const border = await header.evaluate((el) =>
      parseFloat(getComputedStyle(el).borderBottomWidth),
    );
    expect(Math.abs(panelBox.x - triggerBox.x)).toBeLessThan(1);
    expect(Math.abs(panelBox.y - (headerBox.y + headerBox.height - border + 8))).toBeLessThan(1);
    expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(width - 20);
    if (width === 1440)
      await page.screenshot({ path: test.info().outputPath('features-open.png') });
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();
    await page.keyboard.press('Enter');
    await expect(panel).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
    await trigger.click();
    await page.getByRole('heading', { name: 'Everyday Mac tools, always within reach.' }).click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();
  });
}

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

test('all published locales are indexable while feedback stays noindex', async ({ page }) => {
  for (const locale of ['de', 'ko', 'zh-TW']) {
    await page.goto(`/${locale}/`);
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await page.goto(`/${locale}/install/`);
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  }
  await page.goto('/de/feedback/');
  await expect(page.locator('meta[name="robots"][content="noindex, nofollow"]')).toHaveCount(1);
});

test('sitemap lists every localized published route and excludes feedback', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  const xml = await response.text();
  expect(xml).toContain('https://deskutils.app/</loc>');
  expect(xml).toContain('https://deskutils.app/de/</loc>');
  expect(xml).toContain('https://deskutils.app/de/install/');
  expect(xml).toContain('https://deskutils.app/ja/pricing/');
  expect(xml).toContain('https://deskutils.app/zh-TW/changelog/');
  expect(xml).not.toContain('/feedback/');
});

test('feedback page validates attachments and keeps email support available', async ({ page }) => {
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

  await page
    .getByLabel('What went wrong?')
    .fill('The clipboard filter could be easier to discover.');
  await page.getByLabel('Email address').fill('person@example.com');
  await page.setInputFiles('#feedback-attachment', {
    name: 'not-an-image.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('not an image'),
  });
  await expect(page.getByText('Please choose an image file.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send feedback', exact: true })).toBeDisabled();
  await expect(page.getByRole('link', { name: 'deskutils.app@gmail.com' }).first()).toHaveAttribute(
    'href',
    'mailto:deskutils.app@gmail.com',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test.describe('feedback submission against a mock endpoint', () => {
  let js = '';
  let fallbackJs = '';
  const endpoint = 'https://feedback.test/submit';
  test.beforeAll(async () => {
    const options = {
      entryPoints: ['tests/fixtures/feedback.tsx'],
      bundle: true,
      write: false as const,
      outdir: '/private/tmp/deskutils-feedback-test',
      format: 'iife' as const,
      jsx: 'automatic' as const,
      // content/product.ts reads several env vars at import time.
      banner: { js: 'var process = globalThis.process || { env: {} };' },
      define: {
        'process.env.NODE_ENV': '"production"',
        'process.env.NEXT_PUBLIC_DESKUTILS_FEEDBACK_FORM_ENDPOINT': `"${endpoint}"`,
      },
    };
    const result = await build(options);
    js = result.outputFiles.find((file) => file.path.endsWith('.js'))!.text;
    const fallbackResult = await build({
      ...options,
      define: {
        ...options.define,
        'process.env.NEXT_PUBLIC_DESKUTILS_FEEDBACK_FORM_ENDPOINT': '""',
      },
    });
    fallbackJs = fallbackResult.outputFiles.find((file) => file.path.endsWith('.js'))!.text;
  });

  async function mount(page: import('@playwright/test').Page) {
    await page.setContent('<div id="root"></div>');
    await page.addScriptTag({ content: js });
  }

  test('keeps the email fallback and disables submission without an endpoint', async ({ page }) => {
    await page.goto('/');
    await page.setContent('<div id="root"></div>');
    await page.addScriptTag({ content: fallbackJs });
    await expect(page.getByText('Feedback submissions are temporarily unavailable.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send feedback', exact: true })).toBeDisabled();
    await expect(page.getByRole('link', { name: 'deskutils.app@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:deskutils.app@gmail.com',
    );
  });

  test('blocks an empty message before any request is sent', async ({ page }) => {
    let requests = 0;
    await page.route(endpoint, (route) => {
      requests += 1;
      route.fulfill({ status: 200, body: '{}' });
    });
    await page.goto('/');
    await mount(page);

    await page.getByRole('button', { name: 'Send feedback', exact: true }).click();
    await expect(page.getByText('Please describe your feedback before sending.')).toBeVisible();
    expect(requests).toBe(0);
  });

  test('rejects an invalid email', async ({ page }) => {
    let requests = 0;
    await page.route(endpoint, (route) => {
      requests += 1;
      route.fulfill({ status: 200, body: '{}' });
    });
    await page.goto('/');
    await mount(page);

    await page.getByLabel('Your feedback').fill('The clipboard filter is hard to find.');
    await page.getByLabel('Email address').fill('not-an-email');
    await page.getByRole('button', { name: 'Send feedback', exact: true }).click();
    await expect(page.getByText('Enter a valid email address so we can reply.')).toBeVisible();
    expect(requests).toBe(0);
  });

  test('posts the real payload and shows the success state', async ({ page }) => {
    const captured: { method: string; body: string }[] = [];
    await page.route(endpoint, (route) => {
      captured.push({ method: route.request().method(), body: route.request().postData() ?? '' });
      route.fulfill({ status: 200, body: '{"ok":true}', contentType: 'application/json' });
    });
    await page.goto('/');
    await mount(page);

    await page.getByRole('button', { name: 'Bug', exact: true }).click();
    await page.getByLabel('What went wrong?').fill('Saving a capture closes the window.');
    await page.getByLabel('Email address').fill('person@example.com');
    await page.getByRole('button', { name: 'Send feedback', exact: true }).click();

    await expect(page.getByText('Thank you for the feedback.')).toBeVisible();
    expect(captured).toHaveLength(1);
    expect(captured[0].method).toBe('POST');
    expect(captured[0].body).toContain('name="feedback_type"');
    expect(captured[0].body).toContain('bug');
    expect(captured[0].body).toContain('Saving a capture closes the window.');
    expect(captured[0].body).toContain('name="email"');
    expect(captured[0].body).toContain('person@example.com');
    expect(captured[0].body).toContain('DeskUtils website');
  });

  test('resets the form and tips to Feedback after sending another', async ({ page }) => {
    await page.route(endpoint, (route) =>
      route.fulfill({ status: 200, body: '{"ok":true}', contentType: 'application/json' }),
    );
    await page.goto('/');
    await mount(page);

    await page.getByRole('button', { name: 'Idea', exact: true }).click();
    await expect(
      page.getByRole('heading', { name: 'What helps us understand an idea' }),
    ).toBeVisible();
    await page.getByLabel('Your idea').fill('A menu bar timer.');
    await page.getByLabel('Email address').fill('person@example.com');
    await page.getByRole('button', { name: 'Send feedback', exact: true }).click();
    await expect(page.getByText('Thank you for the feedback.')).toBeVisible();

    await page.getByRole('button', { name: 'Send another response' }).click();
    await expect(page.getByRole('button', { name: 'Feedback', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.getByRole('heading', { name: 'What makes feedback useful' })).toBeVisible();
  });

  test('surfaces a failure banner when the endpoint errors', async ({ page }) => {
    await page.route(endpoint, (route) => route.fulfill({ status: 500, body: 'nope' }));
    await page.goto('/');
    await mount(page);

    await page.getByLabel('Your feedback').fill('Something broke.');
    await page.getByLabel('Email address').fill('person@example.com');
    await page.getByRole('button', { name: 'Send feedback', exact: true }).click();
    await expect(
      page.getByText('We could not send your feedback. Please try again or email support.'),
    ).toBeVisible();
  });
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
    '/support/',
  );
  await expect(footer.getByRole('link', { name: 'deskutils.app@gmail.com' })).toHaveAttribute(
    'href',
    'mailto:deskutils.app@gmail.com',
  );
  await page.goto('/vi/feedback/');
  await expect(
    page.locator('footer').getByRole('link', { name: 'Hỗ trợ', exact: true }),
  ).toHaveAttribute('href', '/vi/support/');
});

test('localized header uses the translated download label', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('/de/');
  await expect(
    page.locator('header').first().getByRole('link', { name: 'Herunterladen', exact: true }),
  ).toHaveAttribute('href', '/de/install/');
});

for (const locale of ['de', 'fr', 'ru', 'ja', 'ko', 'zh-CN', 'zh-TW', 'vi']) {
  test(`${locale} homepage is localized, indexable and correctly canonical`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://deskutils.app/${locale}/`,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    const hreflang = await page
      .locator('link[rel="alternate"]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('hreflang')));
    expect(hreflang).toContain('en');
    expect(hreflang).toContain(locale);
    expect(hreflang).toContain('x-default');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}

test('Traditional Chinese is distinct from Simplified Chinese', async ({ page }) => {
  await page.goto('/zh-CN/privacy/');
  const simplified = await page.locator('main').innerText();
  await page.goto('/zh-TW/privacy/');
  const traditional = await page.locator('main').innerText();
  expect(simplified).not.toBe(traditional);
  expect(traditional).toContain('隱私');
  expect(traditional).not.toContain('隐私');
});

test('switching language keeps the current page', async ({ page }) => {
  await page.goto('/screenshot/');
  const switcher = page.locator('header details').filter({ hasText: 'English' }).first();
  await switcher.locator('summary').click();
  await Promise.all([
    page.waitForURL('**/de/screenshot/'),
    switcher.getByRole('link', { name: 'Deutsch' }).click(),
  ]);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://deskutils.app/de/screenshot/',
  );
});

test('localized comparison links keep the current language', async ({ page }) => {
  for (const path of ['/vi/features/', '/vi/quick-ring/']) {
    await page.goto(path);
    await expect(page.locator('main a[href="/"]')).toHaveCount(0);
    await expect(page.locator('main a[href="/vi/"]')).toHaveCount(2);
  }
});

test('localized feedback stays noindex', async ({ page }) => {
  await page.goto('/de/feedback/');
  await expect(page.locator('meta[name="robots"][content="noindex, nofollow"]')).toHaveCount(1);
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

for (const width of [390, 768, 1200, 1440]) {
  test(`screenshot feature page works at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/screenshot/');

    await expect(
      page.getByRole('heading', { name: 'Take and annotate screenshots on your Mac', level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Capture modes and screenshot actions' }),
    ).toBeVisible();
    await expect(page.locator('#faq details')).toHaveCount(5);

    // Every demo slot has real media or its approved mockup, never an empty placeholder.
    await expect(page.locator('[data-media-state="placeholder"]')).toHaveCount(0);

    await expect(
      page.locator(
        '[data-media-slot][data-media-state="mockup"], [data-media-slot][data-media-state="ready"]',
      ),
    ).toHaveCount(5);

    // The replaced slots now use real recordings, including the poster fallback.
    const quickAccess = page.locator('[data-umami-section="quick-access"] figure');
    await quickAccess.scrollIntoViewIfNeeded();
    const quickAccessVideo = quickAccess.locator('video');
    await expect(quickAccessVideo).toHaveAttribute('poster', '/videos/quick-access-poster.webp');
    await expect(quickAccessVideo.locator('source')).toHaveAttribute(
      'src',
      '/videos/quick-access-demo.mp4',
    );
    await expect
      .poll(() => quickAccessVideo.evaluate((el) => (el as HTMLVideoElement).readyState))
      .toBeGreaterThanOrEqual(2);
    await expect(quickAccessVideo).toHaveCSS('object-fit', 'cover');

    if (width >= 1200) {
      const annotate = page.locator('[data-umami-section="screenshot-annotate"] figure');
      await annotate.scrollIntoViewIfNeeded();
      const annotateVideo = annotate.locator('video');
      await expect(annotateVideo).toHaveAttribute('poster', '/videos/annotate-poster.webp');
      await expect(annotateVideo.locator('source')).toHaveAttribute(
        'src',
        '/videos/annotate-demo.mp4',
      );
      await expect
        .poll(() => annotateVideo.evaluate((el) => (el as HTMLVideoElement).readyState))
        .toBeGreaterThanOrEqual(2);
    }

    const schemaTypes = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((elements) =>
        elements.map((element) => JSON.parse(element.textContent ?? '{}')['@type']),
      );
    expect(schemaTypes).toContain('BreadcrumbList');
    expect(schemaTypes).toContain('FAQPage');

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}

test('screenshot FAQ keeps one answer open at a time', async ({ page }) => {
  await page.goto('/screenshot/');
  const items = page.locator('#faq details');
  await items.nth(0).locator('summary').click();
  await expect(items.nth(0)).toHaveAttribute('open', '');
  await items.nth(1).locator('summary').click();
  await expect(items.nth(0)).not.toHaveAttribute('open', '');
  await expect(items.nth(1)).toHaveAttribute('open', '');
});

test('feature media frames keep their mobile crop and desktop scale', async ({ page }) => {
  // Screenshot uses the prepared image in full, without a crop or transform.
  // Window Switcher retains its approved fixed mobile crop.
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/screenshot/');
  const shotMobile = await page.locator('[data-media-slot="screenshot-hero"]').boundingBox();
  expect(shotMobile?.height).toBeCloseTo((shotMobile!.width * 769) / 1098, 0);
  const imageStyle = await page
    .locator('[data-media-slot="screenshot-hero"] img')
    .evaluate((el) => ({
      fit: getComputedStyle(el).objectFit,
      transform: getComputedStyle(el).transform,
    }));
  expect(imageStyle).toEqual({ fit: 'contain', transform: 'none' });
  await expect(
    page.locator('[data-umami-section="screenshot-annotate"] [data-media-slot]'),
  ).toBeHidden();

  await page.goto('/window-switcher/');
  const dockMobile = await page.locator('[data-media-slot="window-switcher-hero"]').boundingBox();
  expect(dockMobile?.height).toBeCloseTo(150, 0);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/screenshot/');
  const shotDesktop = await page.locator('[data-media-slot="screenshot-hero"]').boundingBox();
  expect(shotDesktop?.height).toBeGreaterThan(600);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('each utility page owns a distinct media slot', async ({ page }) => {
  const expected = [
    ['/prevent-sleep/', 'utility-prevent-sleep'],
    ['/mouse-jiggler/', 'utility-mouse-jiggler'],
    ['/clean-keyboard/', 'utility-clean-keyboard'],
    ['/display-dimming/', 'utility-display-dimming'],
    ['/external-display-only/', 'utility-external-display-only'],
    ['/system-monitoring/', 'utility-system-monitoring'],
  ] as const;
  const seen = new Set<string>();
  for (const [path, slot] of expected) {
    await page.goto(path);
    await expect(page.locator(`[data-media-slot="${slot}"]`)).toHaveCount(1);
    seen.add(slot);
  }
  // A shared slot would collapse the set; six distinct slots must remain.
  expect(seen.size).toBe(expected.length);
});

test('support hub links every topic to a real destination', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 1000 });
  await page.goto('/support/');
  await expect(page.getByRole('heading', { name: 'How can we help?', level: 1 })).toBeVisible();

  const expected = [
    ['Installation', '/install/'],
    ['Permissions', '/install/#permissions'],
    ['Screenshot help', '/screenshot/'],
    ['Clipboard help', '/clipboard-manager/'],
    ['Feedback and bug reports', '/feedback/'],
  ] as const;
  for (const [name, href] of expected) {
    await expect(page.getByRole('link', { name: new RegExp(name) }).first()).toHaveAttribute(
      'href',
      href,
    );
  }
  await expect(page.getByRole('link', { name: /Release notes/ })).toHaveAttribute(
    'href',
    '/changelog/',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('install page keeps the verified download facts and adds troubleshooting', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 1000 });
  await page.goto('/install/');
  await expect(page.getByText('shasum -a 256 ~/Downloads/DeskUtils.dmg')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'You’re home.', exact: true })).toBeVisible();
  await expect(
    page.locator('section', { hasText: 'Troubleshooting' }).locator('details'),
  ).toHaveCount(4);
  await expect(page.getByRole('link', { name: /Report a problem/ })).toHaveAttribute(
    'href',
    '/feedback/',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('feedback tips follow the selected type', async ({ page }) => {
  await page.goto('/feedback/');
  await expect(page.getByRole('heading', { name: 'What makes feedback useful' })).toBeVisible();
  await page.getByRole('button', { name: 'Bug', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'What helps with a bug report' })).toBeVisible();
  await page.getByRole('button', { name: 'Idea', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'What helps us understand an idea' }),
  ).toBeVisible();
});

for (const width of [390, 1440]) {
  test(`pricing page renders plans, checkout and schema at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/pricing/');

    await expect(
      page.getByRole('heading', { name: 'Free to start. Pro when you need more.', level: 1 }),
    ).toBeVisible();
    await expect(page.locator('article')).toHaveCount(2);

    await expect(page.getByText('Lifetime license', { exact: true })).toBeVisible();

    // Pro checkout uses the real Lemon Squeezy URL with the launch discount.
    const proCheckout = page.getByRole('link', { name: 'Get DeskUtils Pro', exact: true });
    const checkoutURL = new URL((await proCheckout.getAttribute('href')) ?? '');
    expect(checkoutURL.origin).toBe('https://deskutils.lemonsqueezy.com');
    expect(checkoutURL.searchParams.get('checkout[discount_code]')).toBe('LAUNCH799');

    // Price, compare table and FAQ.
    await expect(page.getByText('$7.99', { exact: true })).toBeVisible();
    await expect(page.getByText('$14.99', { exact: true })).toHaveCSS(
      'text-decoration-line',
      'line-through',
    );
    await expect(
      page.getByText('50 clipboard items').filter({ visible: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByText('500 clipboard items').filter({ visible: true }).first(),
    ).toBeVisible();
    // Pro card text must stay visible on its dark background, and compare
    // labels must not leak `{count}` placeholders.
    await expect(page.getByText('Extended clipboard history', { exact: true })).toBeVisible();
    await expect(
      page.getByText('Clipboard history', { exact: true }).filter({ visible: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByText('Macs per license', { exact: true }).filter({ visible: true }).first(),
    ).toBeVisible();
    await expect(page.getByText(/\{count\}/)).toHaveCount(0);

    const schemaTypes = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((elements) =>
        elements.map((element) => JSON.parse(element.textContent ?? '{}')['@type']),
      );
    expect(schemaTypes).toContain('BreadcrumbList');
    expect(schemaTypes).toContain('FAQPage');
    expect(schemaTypes).toContain('SoftwareApplication');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}

test.describe('pricing plans render for launch on and off', () => {
  const bundles: Record<'on' | 'off', string> = { on: '', off: '' };
  test.beforeAll(async () => {
    for (const state of ['on', 'off'] as const) {
      const result = await build({
        entryPoints: ['tests/fixtures/pricing-plans.tsx'],
        bundle: true,
        write: false,
        outdir: `/private/tmp/deskutils-pricing-${state}`,
        format: 'iife',
        jsx: 'automatic',
        banner: { js: 'var process = globalThis.process || { env: {} };' },
        define: {
          'process.env.NODE_ENV': '"production"',
          'process.env.NEXT_PUBLIC_DESKUTILS_LAUNCH_OFFER': JSON.stringify(
            state === 'on' ? 'true' : 'false',
          ),
        },
      });
      bundles[state] = result.outputFiles.find((file) => file.path.endsWith('.js'))!.text;
    }
  });

  async function mount(page: import('@playwright/test').Page, state: 'on' | 'off') {
    await page.setContent('<div id="root"></div>');
    await page.addScriptTag({ content: bundles[state] });
  }

  test('launch offer on shows the launch price, badge and discount checkout', async ({ page }) => {
    await page.goto('/');
    await mount(page, 'on');

    await expect(page.getByText('$7.99', { exact: true })).toBeVisible();
    await expect(page.getByText('$14.99', { exact: true })).toHaveCSS(
      'text-decoration-line',
      'line-through',
    );
    await expect(page.getByText('Launch Offer')).toBeVisible();
    await expect(page.getByText('Lifetime license', { exact: true })).toBeVisible();
    await expect(page.getByText('First 100 customers · Then $14.99')).toBeVisible();
    const checkout = new URL(
      (await page
        .getByRole('link', { name: 'Get DeskUtils Pro', exact: true })
        .getAttribute('href')) ?? '',
    );
    expect(checkout.searchParams.get('checkout[discount_code]')).toBe('LAUNCH799');
  });

  test('launch offer off shows the regular price with no discount', async ({ page }) => {
    await page.goto('/');
    await mount(page, 'off');

    await expect(page.getByText('$14.99', { exact: true })).toBeVisible();
    await expect(page.getByText('$7.99', { exact: true })).toHaveCount(0);
    await expect(page.getByText('Launch Offer')).toHaveCount(0);
    await expect(page.getByText('Lifetime license', { exact: true })).toBeVisible();
    await expect(page.getByText('$14.99', { exact: true })).not.toHaveCSS(
      'text-decoration-line',
      'line-through',
    );
    const checkout = new URL(
      (await page
        .getByRole('link', { name: 'Get DeskUtils Pro', exact: true })
        .getAttribute('href')) ?? '',
    );
    expect(checkout.searchParams.get('checkout[discount_code]')).toBeNull();
  });
});

for (const width of [390, 1440]) {
  test(`changelog page renders every release at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/changelog/');

    await expect(page.getByRole('heading', { name: 'Changelog', level: 1 })).toBeVisible();

    const snapshot = releaseSnapshot as { tag_name: string; html_url: string }[];
    const articles = page.locator('main article');
    await expect(articles).toHaveCount(snapshot.length);

    // Newest release first, with a stable shareable anchor (ids contain dots,
    // so they are matched with an attribute selector).
    const first = snapshot[0];
    const firstArticle = page.locator(`[id="${first.tag_name}"]`);
    await expect(firstArticle).toHaveCount(1);
    await expect(firstArticle.getByRole('link', { name: 'View on GitHub' })).toHaveAttribute(
      'href',
      first.html_url,
    );

    // Dates are rendered for every release.
    await expect(page.locator('main time')).toHaveCount(snapshot.length);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}

test('changelog shows version, date and link for a release without notes', async ({ page }) => {
  await page.goto('/changelog/');
  const empty = page.locator('[id="v0.1.2"]');
  await expect(empty).toHaveCount(1);
  await expect(empty).toContainText('DeskUtils');
  await expect(empty.locator('time')).toHaveCount(1);
  await expect(empty.getByRole('link', { name: 'View on GitHub' })).toHaveAttribute(
    'href',
    /releases\/tag\/v0\.1\.2$/,
  );
  // No fabricated notes paragraph when the body is empty.
  await expect(empty.locator('p')).toHaveCount(0);
});

test('changelog markdown renders safely without executing or unsafe links', async ({ page }) => {
  const result = await build({
    entryPoints: ['tests/fixtures/markdown.tsx'],
    bundle: true,
    write: false,
    outdir: '/private/tmp/deskutils-markdown-test',
    format: 'iife',
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  const js = result.outputFiles.find((file) => file.path.endsWith('.js'))!.text;
  const markdown = [
    '## Heading',
    '',
    '- item with **bold** and `code`',
    '- [safe](https://example.com) and [unsafe](javascript:alert(1))',
    '- Parent',
    '  - Child',
    '',
    '<script>window.__pwned = true</script>',
    'plain <b>tag</b> text',
  ].join('\n');

  await page.goto('/');
  const data = JSON.stringify(markdown).replace(/</g, '\\u003c');
  await page.setContent(
    `<div id="root"></div><script id="md-data" type="application/json">${data}</script>`,
  );
  await page.addScriptTag({ content: js });

  // A hang would block the page thread; the short timeout makes it fail fast.
  await expect(page.getByRole('heading', { name: 'Heading' })).toBeVisible({ timeout: 5000 });
  await expect(page.locator('li strong', { hasText: 'bold' })).toHaveCount(1);
  await expect(page.locator('li code', { hasText: 'code' })).toHaveCount(1);
  // Nested list items are flattened and rendered (regression: infinite loop).
  await expect(page.locator('li', { hasText: 'Parent' })).toHaveCount(1);
  await expect(page.locator('li', { hasText: 'Child' })).toHaveCount(1);
  expect(await page.locator('a[href^="javascript:"]').count()).toBe(0);
  expect(await page.locator('a[href="https://example.com"]').count()).toBe(1);
  expect(await page.evaluate(() => (window as { __pwned?: boolean }).__pwned)).toBeUndefined();
  // Raw HTML is shown as text, not parsed into elements.
  expect(await page.locator('#root b').count()).toBe(0);
});

test('pricing page keeps the launch price and JSON-LD offer in sync', async ({ page }) => {
  await page.goto('/pricing/');
  const offer = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((elements) =>
      elements
        .map((element) => JSON.parse(element.textContent ?? '{}'))
        .find((data) => data['@type'] === 'SoftwareApplication'),
    );
  expect(offer.offers.price).toBe('7.99');
  expect(offer.offers.priceCurrency).toBe('USD');
  const checkout = new URL(offer.offers.url);
  expect(checkout.origin).toBe('https://deskutils.lemonsqueezy.com');
  expect(checkout.searchParams.get('checkout[discount_code]')).toBe('LAUNCH799');
});

test('install page exposes the permissions anchor used by feature pages', async ({ page }) => {
  await page.goto('/install/#permissions');
  await expect(page.locator('#permissions')).toBeVisible();
  await expect(page.locator('#permissions')).toContainText('You stay in control');
});

test('related guides hides the browse link until Guides is published', async ({ page }) => {
  await page.goto('/screenshot/');
  const related = page.locator('[data-umami-section="screenshot-related"]');
  await expect(related.getByRole('link', { name: 'Browse all guides →' })).toHaveCount(0);
  await expect(related.getByRole('link', { name: /Install DeskUtils/ })).toHaveAttribute(
    'href',
    '/install/',
  );
});

test('quick ring explains how to choose an action and the Accessibility permission', async ({
  page,
}) => {
  await page.goto('/quick-ring/');
  await expect(
    page.getByText('Click an action, or hold and flick toward it. The tool opens, ready to use.'),
  ).toBeVisible();
  await expect(
    page.getByText(/Accessibility permission is required so Quick Ring can detect/),
  ).toBeVisible();
});

test('screenshot related links point to published feature routes', async ({ page }) => {
  await page.goto('/screenshot/');
  const related = page.locator('[data-umami-section="screenshot-related"]');
  for (const path of ['/capture-text/', '/color-picker/', '/quick-ring/', '/clipboard-manager/']) {
    await expect(related.locator(`a[href="${path}"]`)).toHaveCount(1);
  }
  // No related link still falls back to a homepage anchor now that features are published.
  await expect(related.locator('a[href="/#tools"]')).toHaveCount(0);
});

const featurePages = [
  { path: '/features/', h1: 'Every DeskUtils tool for your Mac', faq: 0 },
  { path: '/screenshot/', h1: 'Take and annotate screenshots on your Mac', faq: 5 },
  { path: '/clipboard-manager/', h1: 'Clipboard history for Mac you can search', faq: 5 },
  { path: '/quick-ring/', h1: 'Open your go-to Mac actions by pressing ⌘ twice', faq: 4 },
  { path: '/capture-text/', h1: 'Copy text from anything on your Mac screen', faq: 4 },
  { path: '/color-picker/', h1: 'Pick any color on your Mac screen', faq: 4 },
  { path: '/window-switcher/', h1: 'Switch between windows on your Mac, not just apps', faq: 4 },
];

for (const feature of featurePages) {
  test(`${feature.path} renders hero, schema and no placeholder`, async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1000 });
    await page.goto(feature.path);

    await expect(page.getByRole('heading', { name: feature.h1, level: 1 })).toBeVisible();
    await expect(page.locator('[data-media-state="placeholder"]')).toHaveCount(0);

    if (feature.path === '/capture-text/') {
      const video = page.locator('header video');
      await expect(video.locator('source')).toHaveAttribute('src', '/videos/capture-text-demo.mp4');
      await expect(video).toHaveAttribute('poster', '/videos/capture-text-poster.webp');
    }

    const schemaTypes = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((elements) =>
        elements.map((element) => JSON.parse(element.textContent ?? '{}')['@type']),
      );
    expect(schemaTypes).toContain('BreadcrumbList');
    if (feature.faq > 0) {
      await expect(page.locator('#faq details')).toHaveCount(feature.faq);
      expect(schemaTypes).toContain('FAQPage');
    }

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}

const utilityPages = [
  { path: '/prevent-sleep/', h1: 'Keep your Mac awake during long tasks', faq: 4 },
  {
    path: '/mouse-jiggler/',
    h1: 'Prevent idle interruptions during presentations and long-running tasks',
    faq: 4,
  },
  { path: '/clean-keyboard/', h1: 'Wipe your keyboard without typing anything', faq: 3 },
  { path: '/display-dimming/', h1: 'Dim a bright external display', faq: 4 },
  { path: '/external-display-only/', h1: 'Work on your external display only', faq: 3 },
  {
    path: '/system-monitoring/',
    h1: 'See CPU, memory and disk storage at a glance.',
    faq: 3,
  },
];

for (const utility of utilityPages) {
  test(`${utility.path} renders its verified content and schema`, async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1000 });
    await page.goto(utility.path);

    await expect(page.getByRole('heading', { name: utility.h1, level: 1 })).toBeVisible();
    await expect(page.locator('#faq details')).toHaveCount(utility.faq);
    await expect(page.getByText('What macOS asks for')).toBeVisible();
    await expect(page.locator('[data-media-state="placeholder"]')).toHaveCount(0);

    const schemaTypes = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((elements) =>
        elements.map((element) => JSON.parse(element.textContent ?? '{}')['@type']),
      );
    expect(schemaTypes).toContain('BreadcrumbList');
    expect(schemaTypes).toContain('FAQPage');

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}

test('localized utility breadcrumb schema points at the localized URL', async ({ page }) => {
  await page.goto('/de/prevent-sleep/');
  const breadcrumb = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((elements) => {
      const graph = elements
        .map((element) => JSON.parse(element.textContent ?? '{}'))
        .find((data) => data['@type'] === 'BreadcrumbList');
      return graph.itemListElement.map((item: { item: string }) => item.item);
    });
  expect(breadcrumb.at(-1)).toBe('https://deskutils.app/de/prevent-sleep/');
});

test('display dimming explains the Free preview versus Pro persistence', async ({ page }) => {
  await page.goto('/display-dimming/');
  await expect(page.getByText(/In the Free version the dimming is a live preview/)).toBeVisible();
  await expect(page.locator('#faq details')).toHaveCount(4);
});

test('published utility routes are linked from the features catalog', async ({ page }) => {
  await page.goto('/features/');
  for (const [name, path] of [
    ['Prevent Sleep', '/prevent-sleep/'],
    ['Mouse Jiggler', '/mouse-jiggler/'],
    ['Clean Keyboard', '/clean-keyboard/'],
    ['Display Dimming', '/display-dimming/'],
    ['External Display Only', '/external-display-only/'],
    ['System Monitoring', '/system-monitoring/'],
  ] as const) {
    await expect(page.locator(`a[href="${path}"]`, { hasText: name }).first()).toBeVisible();
  }
});

test('published feature routes are linked from the shared navigation', async ({ page }) => {
  await page.goto('/');
  await page.locator('summary', { hasText: 'Features' }).first().click();
  for (const [name, path] of [
    ['Screenshot', '/screenshot/'],
    ['Clipboard Manager', '/clipboard-manager/'],
    ['Quick Ring', '/quick-ring/'],
    ['Capture Text', '/capture-text/'],
    ['Color Picker', '/color-picker/'],
    ['Window Switcher', '/window-switcher/'],
  ] as const) {
    await expect(page.locator('.home-features-panel a', { hasText: name }).first()).toHaveAttribute(
      'href',
      path,
    );
  }
  await expect(page.locator('.home-features-panel a', { hasText: 'All features' })).toHaveAttribute(
    'href',
    '/features/',
  );
});

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
  await expect(page.locator('#faq details')).toHaveCount(7);
  await expect(page.getByText(/^No. Clipboard history stays on your Mac/)).toBeAttached();
  await expect(
    page.getByRole('link', { name: 'Download for Mac', exact: false }).first(),
  ).toHaveAttribute('href', '/install/');
  await page.setViewportSize({ width: 1440, height: 900 });
  const features = page.locator('.home-features-disclosure');
  await features.locator('summary').click();
  await expect(features).toHaveAttribute('open', '');
  await expect(features.locator('summary')).toHaveCSS('color', 'rgb(20, 80, 245)');
  await expect(features.locator('.home-features-panel')).toBeVisible();
  await features.locator('summary').click();
  await expect(features.locator('.home-features-panel')).toBeHidden();
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

  async function mount(page: import('@playwright/test').Page, generated: boolean, crop = false) {
    await page.setContent(
      `<div id="root"></div><script id="slot-data" type="application/json">${JSON.stringify({
        generated,
        crop,
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

  test('crop geometry is identical in the mockup and ready states', async ({ page }) => {
    // Guards the Screenshot/Window Switcher crops: the same offset positioner
    // must hold when generated media replaces the mockup.
    const readGeometry = async () => {
      const figure = page.locator('[data-media-slot="hero"]');
      const inner = figure.locator(':scope > *').first();
      const [frameBox, innerBox] = await Promise.all([figure.boundingBox(), inner.boundingBox()]);
      return {
        state: await figure.getAttribute('data-media-state'),
        frameHeight: Math.round(frameBox!.height),
        innerWidth: Math.round(innerBox!.width),
        innerTop: Math.round(innerBox!.y - frameBox!.y),
        innerLeft: Math.round(innerBox!.x - frameBox!.x),
      };
    };
    await page.goto('/');
    await mount(page, false, true);
    const mockup = await readGeometry();

    await mount(page, true, true);
    const ready = await readGeometry();

    expect(mockup.state).toBe('mockup');
    expect(ready.state).toBe('ready');
    // Same frame height and the same offset positioner in both states.
    expect(ready.frameHeight).toBe(mockup.frameHeight);
    expect(ready.frameHeight).toBe(352);
    expect(ready.innerWidth).toBe(mockup.innerWidth);
    expect(ready.innerWidth).toBe(550);
    expect(ready.innerLeft).toBe(mockup.innerLeft);
    expect(ready.innerLeft).toBeLessThan(0);
    // The generated image fills the crop positioner and is told to cover it
    // (the Tailwind class is verified against the real page where CSS loads).
    await expect(page.locator('[data-media-slot="hero"] img')).toHaveClass(/object-cover/);
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
  await expect(rows).toHaveCount(7);
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
    '/pricing/',
  );
  await expect(nav.getByRole('link', { name: 'Feedback', exact: true })).toHaveAttribute(
    'href',
    '/feedback/',
  );
  await expect(nav.getByRole('link', { name: 'Changelog', exact: true })).toHaveAttribute(
    'href',
    '/changelog/',
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
});

test('Quick Ring recording synchronizes one Command key and respects playback and Reduce Motion', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const ring = page.locator('[data-ring-recording]');
  await ring.scrollIntoViewIfNeeded();
  const video = ring.locator('video');
  const key = ring.locator('[data-command-key]');
  await expect(key).toHaveCount(1);
  await expect(key).toHaveAttribute('data-pressed', 'false');
  await expect(video).toHaveCSS('opacity', '0');
  expect(await video.evaluate((el) => (el as HTMLVideoElement).paused)).toBe(true);
  await expect(ring.locator('img')).toBeVisible();
  await expect(ring.locator('img')).toHaveAttribute('src', '/videos/quickring-poster.webp');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(video).toHaveCSS('opacity', '1');
  await expect(video).toHaveCSS('object-fit', 'cover');
  await expect(video.locator('source')).toHaveAttribute('src', '/videos/quickring-demo.mp4');
  await expect(video).toHaveAttribute('poster', '/videos/quickring-start.webp');
  await expect(ring.locator('img')).toHaveAttribute('src', '/videos/quickring-start.webp');
  await expect(key).toHaveCSS('transition-duration', '0.04s');
  for (const start of [0, 7.55]) {
    const presses = await video.evaluate(async (element, start) => {
      const player = element as HTMLVideoElement;
      player.pause();
      player.currentTime = start;
      await new Promise<void>((resolve) =>
        player.addEventListener('seeked', () => resolve(), { once: true }),
      );
      const key = player.parentElement!.querySelector('[data-command-key]')!;
      const presses: number[] = [];
      let previous = false;
      let wrapped = start === 0;
      const sample = new Promise<number[]>((resolve) => {
        const tick = () => {
          if (player.currentTime < 0.2) wrapped = true;
          const pressed = key.getAttribute('data-pressed') === 'true';
          if (pressed && !previous) presses.push(player.currentTime);
          previous = pressed;
          if (wrapped && player.currentTime > 1.1) resolve(presses);
          else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      await player.play();
      return sample;
    }, start);
    expect(presses).toHaveLength(2);
    expect(presses[0]).toBeGreaterThanOrEqual(0.16);
    expect(presses[0]).toBeLessThan(0.35);
    expect(presses[1]).toBeGreaterThanOrEqual(0.42);
    expect(presses[1]).toBeLessThan(0.61);
  }
  await page.locator('main > header').scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((el) => (el as HTMLVideoElement).paused)).toBe(true);
  await expect(key).toHaveAttribute('data-pressed', 'false');
  await expect.poll(() => video.evaluate((el) => (el as HTMLVideoElement).currentTime)).toBe(0);
  await expect(video).toHaveCSS('opacity', '0');
  await ring.scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((el) => (el as HTMLVideoElement).paused)).toBe(false);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(video).toHaveCSS('opacity', '0');
  await expect(key).toHaveAttribute('data-pressed', 'false');
  expect(await video.evaluate((el) => (el as HTMLVideoElement).paused)).toBe(true);
});

test('Quick Ring recording keeps the real poster when playback fails', async ({ page }) => {
  await page.route('**/videos/quickring-demo.mp4', (route) => route.fulfill({ status: 404 }));
  await page.goto('/');
  const ring = page.locator('[data-ring-recording]');
  await ring.scrollIntoViewIfNeeded();
  await expect(ring.locator('video')).toHaveCount(0);
  await expect(ring.locator('img')).toBeVisible();
  await expect(ring.locator('img')).toHaveAttribute('src', '/videos/quickring-poster.webp');
  await expect(ring.locator('[data-command-key]')).toHaveAttribute('data-pressed', 'false');
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
