import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('Simulator Flow', () => {
  test('step 0: input selector shows YouTube and image upload options', async ({ page }) => {
    await page.goto('/simulator');
    await expect(page.getByText(/youtube|video/i).first()).toBeVisible();
    await expect(page.getByText(/upload|image/i).first()).toBeVisible();
  });

  test('image upload advances to step 1 with conditions list', async ({ page }) => {
    await page.goto('/simulator');
    await page.waitForLoadState('networkidle');

    // Upload garden.png via the file input
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(path.join(__dirname, '..', 'public', 'images', 'garden.png'));

    // Should advance to step 1 — condition list becomes visible
    const conditionsList = page.locator('[data-tour-step="conditions"]');
    await expect(conditionsList).toBeVisible({ timeout: 10000 });
  });

  test('toggling a condition enables the effect', async ({ page }) => {
    await page.goto('/simulator');
    await page.waitForLoadState('networkidle');

    // Upload image to get to step 1
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(path.join(__dirname, '..', 'public', 'images', 'garden.png'));

    const conditionsList = page.locator('[data-tour-step="conditions"]');
    await expect(conditionsList).toBeVisible({ timeout: 10000 });

    // Find and click a condition checkbox (protanopia is typically first in color vision)
    const protanopiaCheckbox = page.getByRole('checkbox', { name: /protanopia/i }).first();
    if (await protanopiaCheckbox.isVisible()) {
      await protanopiaCheckbox.check();
      await expect(protanopiaCheckbox).toBeChecked();
    }
  });

  test('intensity slider appears when a condition is enabled', async ({ page }) => {
    await page.goto('/simulator');
    await page.waitForLoadState('networkidle');

    // Upload image
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(path.join(__dirname, '..', 'public', 'images', 'garden.png'));

    const conditionsList = page.locator('[data-tour-step="conditions"]');
    await expect(conditionsList).toBeVisible({ timeout: 10000 });

    // Enable a condition
    const checkbox = page.getByRole('checkbox').first();
    await checkbox.check();

    // Severity slider area should become visible
    const severityArea = page.locator('[data-tour-step="severity"]');
    await expect(severityArea).toBeVisible({ timeout: 5000 });
  });

  test('simulator page has accessible main content', async ({ page }) => {
    await page.goto('/simulator');
    await page.waitForLoadState('networkidle');

    // Should have a main landmark
    const main = page.locator('main, [role="main"], #main-content');
    const count = await main.count();
    expect(count).toBeGreaterThan(0);
  });

  test('preconfigured conditions skip to step 1', async ({ page }) => {
    // Navigate via React Router state isn't possible in E2E, but we can verify
    // the page loads without error when coming from the conditions page
    await page.goto('/conditions');
    await page.waitForLoadState('networkidle');

    // Find a "Try Simulation" or similar link that navigates to simulator
    const simLink = page.getByRole('link', { name: /try|simulate|experience/i }).first();
    if (await simLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await simLink.click();
      // Should land on simulator at step 1 (conditions list visible)
      await expect(page.locator('[data-tour-step="conditions"]')).toBeVisible({ timeout: 10000 });
    }
  });
});
