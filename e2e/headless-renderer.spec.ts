import { test, expect } from '@playwright/test';

test.describe('Headless Renderer', () => {
  test('renders with a single condition from URL params', async ({ page }) => {
    await page.goto('/headless?conditions=protanopia&intensity=80');

    // Wait for readiness signal
    await page.waitForSelector('[data-visionsim-ready="true"]', { timeout: 10000 });

    // Should render the garden fallback image
    const img = page.locator('img');
    await expect(img).toBeVisible();

    // Container should be 1200×675
    const container = page.locator('[data-visionsim-ready="true"]');
    const box = await container.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBe(1200);
    expect(box!.height).toBe(675);
  });

  test('renders with multiple conditions', async ({ page }) => {
    await page.goto('/headless?conditions=protanopia,glaucoma,cataracts');

    await page.waitForSelector('[data-visionsim-ready="true"]', { timeout: 10000 });

    const img = page.locator('img');
    await expect(img).toBeVisible();
  });

  test('renders gracefully with no conditions', async ({ page }) => {
    await page.goto('/headless');

    await page.waitForSelector('[data-visionsim-ready="true"]', { timeout: 10000 });

    // Image should still show — just unfiltered
    const img = page.locator('img');
    await expect(img).toBeVisible();
  });

  test('accepts file input for custom screenshot source', async ({ page }) => {
    await page.goto('/headless?conditions=deuteranopia');

    await page.waitForSelector('[data-visionsim-ready="true"]', { timeout: 10000 });

    // Hidden file input should exist
    const fileInput = page.locator('[data-testid="headless-file-input"]');
    await expect(fileInput).toBeAttached();
  });

  test('screenshot captures the rendered output', async ({ page }) => {
    await page.goto('/headless?conditions=protanopia&intensity=100');

    await page.waitForSelector('[data-visionsim-ready="true"]', { timeout: 10000 });

    const container = page.locator('[data-visionsim-ready="true"]');
    const screenshot = await container.screenshot();
    expect(screenshot.byteLength).toBeGreaterThan(0);
  });

  test('has no navigation or footer chrome', async ({ page }) => {
    await page.goto('/headless?conditions=protanopia');

    await page.waitForSelector('[data-visionsim-ready="true"]', { timeout: 10000 });

    // No nav bar should be present
    const nav = page.locator('nav');
    await expect(nav).toHaveCount(0);
  });
});
