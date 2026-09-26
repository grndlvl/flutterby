const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('has no axe violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('publishes dated JSON-LD metadata', async ({ page }) => {
  await page.goto('/');
  const structuredData = await page
    .locator('script[type="application/ld+json"]')
    .evaluate((script) => JSON.parse(script.textContent));
  const webPage = structuredData['@graph'].find((entity) => entity['@type'] === 'WebPage');
  const business = structuredData['@graph'].find((entity) => entity['@id'].endsWith('#business'));

  expect(webPage.datePublished).toBe('2026-09-26');
  expect(webPage.dateModified).toBe('2026-09-26');
  expect(webPage.lastReviewed).toBe('2026-09-26');
  expect(webPage.mainEntity['@id']).toBe(business['@id']);
  expect(business.mainEntityOfPage['@id']).toBe(webPage['@id']);
});

test('supports keyboard navigation and mobile menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeInViewport();
  await page.locator('.menu-button').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.menu-button')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.menu-button')).toHaveAccessibleName('Close menu');
  await page.keyboard.press('Tab');
  await expect(page.locator('#primary-nav a').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('.menu-button')).toBeFocused();
  await expect(page.locator('.menu-button')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.menu-button')).toHaveAccessibleName('Open menu');
  await page.keyboard.press('Enter');
  await page.locator('#primary-nav a').first().press('Enter');
  await expect(page.locator('.menu-button')).toBeFocused();
  await expect(page.locator('.menu-button')).toHaveAttribute('aria-expanded', 'false');
});

test('reflows without horizontal scrolling at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  const hasHorizontalScroll = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalScroll).toBe(false);
});

test('keeps the contact form focus ring inside the transition stage', async ({ page }) => {
  await page.goto('/');
  const field = page.locator('#contact-name');
  const stage = page.locator('.form-stage');
  await field.focus();

  const fieldBox = await field.boundingBox();
  const stageBox = await stage.boundingBox();
  expect(fieldBox.x - stageBox.x).toBeGreaterThanOrEqual(8);
  expect(stageBox.x + stageBox.width - (fieldBox.x + fieldBox.width)).toBeGreaterThanOrEqual(8);
});

test('submits the contact form with AJAX and shows an inline confirmation', async ({ page }) => {
  let submission;

  await page.route('https://submit-form.com/QGJyevJGm', async (route) => {
    submission = route.request();
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });

  await page.goto('/');
  await page.locator('#contact-name').fill('Test Person');
  await page.locator('#contact-email').fill('test@example.com');
  await page.locator('#contact-message').fill('I would like to plan a session.');
  const initialStageBox = await page.locator('.form-stage').boundingBox();
  await page.locator('.contact-form button[type="submit"]').click();

  await expect(page.locator('.form-success')).toContainText('Your message was sent');
  await expect(page.locator('.form-success')).toBeFocused();
  await expect(page.locator('.form-success')).toHaveCSS('outline-offset', '-7px');
  await expect(page.locator('.contact-form')).toHaveClass(/is-complete/);
  await expect(page.locator('.form-fields')).toHaveCSS('opacity', '0');
  const completedStageBox = await page.locator('.form-stage').boundingBox();
  expect(completedStageBox.height).toBe(initialStageBox.height);
  expect(submission.method()).toBe('POST');
  expect(submission.headers()['content-type']).toBe('application/json');
  expect(submission.headers().accept).toBe('application/json');
  expect(submission.postDataJSON()).toEqual({
    name: 'Test Person',
    email: 'test@example.com',
    message: 'I would like to plan a session.',
  });
});

test('keeps the form values and shows an inline error when submission fails', async ({ page }) => {
  await page.route('https://submit-form.com/QGJyevJGm', (route) =>
    route.fulfill({ status: 500, contentType: 'application/json', body: '{}' }),
  );

  await page.goto('/');
  await page.locator('#contact-name').fill('Test Person');
  await page.locator('#contact-email').fill('test@example.com');
  await page.locator('#contact-message').fill('Please keep this message if sending fails.');
  await page.locator('.contact-form button[type="submit"]').click();

  await expect(page.locator('.form-error')).toContainText('could not be sent');
  await expect(page.locator('.form-error')).toHaveClass(/is-visible/);
  await expect(page.locator('#contact-name')).toHaveValue('Test Person');
  await expect(page.locator('#contact-email')).toHaveValue('test@example.com');
  await expect(page.locator('#contact-message')).toHaveValue('Please keep this message if sending fails.');
  await expect(page.locator('.contact-form button[type="submit"]')).toBeEnabled();
});
