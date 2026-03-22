import { test, expect } from '@playwright/test';

test.describe('Routing', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Blind Spot/i);
  });

  test('simulator page loads', async ({ page }) => {
    await page.goto('/simulator');
    await expect(page).toHaveTitle(/Simulator|Blind Spot/i);
  });

  test('famous people page loads', async ({ page }) => {
    await page.goto('/famous-people');
    await expect(page).toHaveTitle(/Famous|Blind Spot/i);
  });

  test('conditions / glossary page loads', async ({ page }) => {
    await page.goto('/conditions');
    await expect(page).toHaveTitle(/Glossary|Conditions|Blind Spot/i);
  });

  test('FAQ page loads', async ({ page }) => {
    await page.goto('/faq');
    await expect(page).toHaveTitle(/FAQ|Blind Spot/i);
  });

  test('about page loads', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(/About|Blind Spot/i);
  });

  test('feedback page loads', async ({ page }) => {
    await page.goto('/feedback');
    await expect(page).toHaveTitle(/Feedback|Blind Spot/i);
  });

  test('resources page loads', async ({ page }) => {
    await page.goto('/resources');
    await expect(page).toHaveTitle(/Resources|Blind Spot/i);
  });

  test('404 page for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent-page-12345');
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  });

  test('navigation between pages via navbar', async ({ page }) => {
    await page.goto('/');
    // Click About in the navigation
    await page.getByRole('button', { name: /about/i }).first().click();
    await expect(page).toHaveURL(/\/about/);
  });
});
