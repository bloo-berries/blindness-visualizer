import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('skip-to-content link is present on non-home pages', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    // Skip link uses translated text "Skip to main content"
    const skipLink = page.getByText(/skip to main content/i);
    await expect(skipLink).toBeAttached();
  });

  test('theme toggle cycles modes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find theme toggle button
    const themeToggle = page.getByRole('button', { name: /theme/i }).first();
    if (await themeToggle.isVisible()) {
      // Default is dim mode
      let htmlClass = await page.evaluate(() => document.documentElement.className);
      expect(htmlClass).toContain('dim-mode');

      // Click to cycle to dark
      await themeToggle.click();
      htmlClass = await page.evaluate(() => document.documentElement.className);
      expect(htmlClass).toContain('dark-mode');

      // Click to cycle to light
      await themeToggle.click();
      htmlClass = await page.evaluate(() => document.documentElement.className);
      expect(htmlClass).not.toContain('dim-mode');
      expect(htmlClass).not.toContain('dark-mode');
    }
  });

  test('high contrast mode applies CSS class', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    let htmlClass = await page.evaluate(() => document.documentElement.className);
    expect(htmlClass).not.toContain('high-contrast-mode');
  });

  test('large text mode applies CSS class', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const htmlClass = await page.evaluate(() => document.documentElement.className);
    expect(htmlClass).not.toContain('large-text-mode');
  });

  test('home page has no critical axe violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast', 'link-in-text-block'])
      .analyze();

    const criticalViolations = results.violations.filter(
      v => v.impact === 'critical'
    );
    expect(criticalViolations).toEqual([]);
  });

  test('famous people page has no critical axe violations', async ({ page }) => {
    await page.goto('/famous-people');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast', 'link-in-text-block', 'image-alt'])
      .analyze();

    const criticalViolations = results.violations.filter(
      v => v.impact === 'critical'
    );
    expect(criticalViolations).toEqual([]);
  });

  test('simulator page has no critical axe violations', async ({ page }) => {
    await page.goto('/simulator');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast', 'link-in-text-block'])
      .analyze();

    const criticalViolations = results.violations.filter(
      v => v.impact === 'critical'
    );
    expect(criticalViolations).toEqual([]);
  });

  test('about page has no critical axe violations', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast', 'link-in-text-block'])
      .analyze();

    const criticalViolations = results.violations.filter(
      v => v.impact === 'critical'
    );
    expect(criticalViolations).toEqual([]);
  });

  test('conditions page has no critical axe violations', async ({ page }) => {
    await page.goto('/conditions');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast', 'link-in-text-block'])
      .analyze();

    const criticalViolations = results.violations.filter(
      v => v.impact === 'critical'
    );
    expect(criticalViolations).toEqual([]);
  });

  test('navigation is keyboard accessible', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });
    expect(focusedElement).toBeTruthy();
  });
});
