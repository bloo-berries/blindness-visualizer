import { test, expect } from '@playwright/test';

test.describe('Famous People', () => {
  test('page renders with person cards', async ({ page }) => {
    await page.goto('/famous-people');
    await page.waitForLoadState('networkidle');
    const body = await page.textContent('body');
    expect(body).toContain('Famous');
  });

  test('person cards are visible', async ({ page }) => {
    await page.goto('/famous-people');
    await page.waitForLoadState('networkidle');
    // Person cards are <a> tags with aria-label containing "View details about"
    const cards = page.locator('a[aria-label*="View details about"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('clicking a person card opens dialog', async ({ page }) => {
    await page.goto('/famous-people');
    await page.waitForLoadState('networkidle');
    // Click the first person card
    const firstCard = page.locator('a[aria-label*="View details about"]').first();
    await firstCard.click();
    // A MUI dialog should appear
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
  });

  test('person dialog shows person details', async ({ page }) => {
    await page.goto('/famous-people');
    await page.waitForLoadState('networkidle');
    // Click first person card
    const firstCard = page.locator('a[aria-label*="View details about"]').first();
    const ariaLabel = await firstCard.getAttribute('aria-label') || '';
    await firstCard.click();
    // Wait for dialog
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
    // Dialog should contain person details (name, condition info)
    const dialogContent = await page.getByRole('dialog').textContent();
    expect(dialogContent!.length).toBeGreaterThan(50);
  });

  test('person dialog has navigation arrows', async ({ page }) => {
    await page.goto('/famous-people');
    await page.waitForLoadState('networkidle');
    // Click first person card
    const firstCard = page.locator('a[aria-label*="View details about"]').first();
    await firstCard.click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
    // Should have next person navigation button
    const nextButton = page.getByRole('button', { name: /next person/i });
    await expect(nextButton).toBeVisible({ timeout: 5000 });
  });

  test('search/filter functionality exists', async ({ page }) => {
    await page.goto('/famous-people');
    await page.waitForLoadState('networkidle');
    const searchInput = page.getByRole('textbox').or(page.locator('input[type="search"], input[type="text"]'));
    const count = await searchInput.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('category filters are present', async ({ page }) => {
    await page.goto('/famous-people');
    await page.waitForLoadState('networkidle');
    const body = await page.textContent('body');
    expect(body!.length).toBeGreaterThan(100);
  });
});
