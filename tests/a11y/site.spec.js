const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('has no axe violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
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
