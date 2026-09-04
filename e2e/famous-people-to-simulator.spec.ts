import { test, expect } from '@playwright/test';

test.describe('Famous People → Simulator Navigation', () => {
  test('Experience Simulation button navigates to simulator with effects', async ({ page }) => {
    await page.goto('/famous-people');
    await page.waitForLoadState('networkidle');

    // Click the first person card
    const firstCard = page.locator('a[aria-label*="View details about"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await firstCard.click();

    // Wait for the dialog
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Click "Experience Simulation"
    const expButton = dialog.getByRole('link', { name: /experience simulation/i })
      .or(dialog.getByRole('button', { name: /experience simulation/i }));
    await expect(expButton).toBeVisible({ timeout: 5000 });
    await expButton.click();

    // Should navigate to the simulator
    await expect(page).toHaveURL(/\/simulator/, { timeout: 10000 });

    // Step 1 should be active — conditions list visible with preconfigured effects
    const conditionsList = page.locator('[data-tour-step="conditions"]');
    await expect(conditionsList).toBeVisible({ timeout: 10000 });

    // At least one checkbox should be checked (preconfigured conditions)
    const checkedBoxes = page.getByRole('checkbox', { checked: true });
    const checkedCount = await checkedBoxes.count();
    expect(checkedCount).toBeGreaterThan(0);
  });

  test('preconfigured banner shows person name', async ({ page }) => {
    await page.goto('/famous-people');
    await page.waitForLoadState('networkidle');

    // Click first person card and get their name
    const firstCard = page.locator('a[aria-label*="View details about"]').first();
    const ariaLabel = await firstCard.getAttribute('aria-label') || '';
    const personName = ariaLabel.replace('View details about ', '');
    await firstCard.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Click "Experience Simulation"
    const expButton = dialog.getByRole('link', { name: /experience simulation/i })
      .or(dialog.getByRole('button', { name: /experience simulation/i }));
    await expButton.click();

    await expect(page).toHaveURL(/\/simulator/, { timeout: 10000 });

    // A banner with the person's name should appear
    if (personName) {
      const banner = page.getByText(personName).first();
      await expect(banner).toBeVisible({ timeout: 5000 });
    }
  });

  test('person dialog shows embedded simulation preview', async ({ page }) => {
    await page.goto('/famous-people');
    await page.waitForLoadState('networkidle');

    const firstCard = page.locator('a[aria-label*="View details about"]').first();
    await firstCard.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Embedded preview should be present (YouTube iframe or simulation container)
    const preview = dialog.locator('iframe, [class*="simulation"], [class*="preview"]');
    const previewCount = await preview.count();
    expect(previewCount).toBeGreaterThan(0);
  });

  test('search filters people correctly', async ({ page }) => {
    await page.goto('/famous-people');
    await page.waitForLoadState('networkidle');

    // Find the search input
    const searchInput = page.getByRole('textbox').first();
    if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await searchInput.fill('Monet');
      await page.waitForTimeout(500); // debounce

      // Should show filtered results with Monet
      const cards = page.locator('a[aria-label*="View details about"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
      expect(count).toBeLessThan(20); // filtered down from 200+
    }
  });
});
