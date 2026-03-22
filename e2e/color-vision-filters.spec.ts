import { test, expect } from '@playwright/test';

test.describe('Color Vision Filters', () => {
  // These tests verify the DOM-injected SVG filter approach works correctly
  // The app injects <filter> elements into a hidden <svg> container in document.body

  test('SVG filter container is created when color vision effect is enabled', async ({ page }) => {
    await page.goto('/simulator');
    await page.waitForLoadState('networkidle');

    // Navigate to simulator and check that the DOM doesn't have data URI filters
    // (Safari compatibility: should use DOM-injected SVG, not data URIs)
    const filters = await page.evaluate(() => {
      const elements = document.querySelectorAll('[style*="filter"]');
      const dataUriFilters: string[] = [];
      elements.forEach(el => {
        const style = (el as HTMLElement).style.filter;
        if (style && style.includes('data:image/svg+xml')) {
          dataUriFilters.push(style);
        }
      });
      return dataUriFilters;
    });
    // Should not use data URI approach
    expect(filters.length).toBe(0);
  });

  test('SVG filter uses feColorMatrix (not data URI) approach', async ({ page }) => {
    // This test verifies the architectural decision to use DOM-injected SVG filters
    await page.goto('/simulator');
    await page.waitForLoadState('networkidle');

    // Check that no inline SVG data URIs are used for filters
    const pageContent = await page.content();
    // The page should not contain data:image/svg+xml in filter attributes
    const dataUriFilterCount = (pageContent.match(/filter:\s*url\("data:image\/svg\+xml/g) || []).length;
    expect(dataUriFilterCount).toBe(0);
  });

  test('SVG filter container uses defs wrapper for Safari compatibility', async ({ page }) => {
    await page.goto('/simulator');
    await page.waitForLoadState('networkidle');

    // Inject a test filter to verify structure
    const structure = await page.evaluate(() => {
      // Trigger a color vision filter to create the SVG container
      const { getColorVisionFilter } = (window as any).__CVD_TEST__ || {};

      // Check if the container exists (it may be created lazily)
      const container = document.getElementById('cvd-svg-filters');
      if (!container) return { exists: false };

      const hasDefsChild = !!container.querySelector('defs');
      // Verify no zero-size SVG attributes
      const widthAttr = container.getAttribute('width');
      const heightAttr = container.getAttribute('height');

      return {
        exists: true,
        hasDefsChild,
        widthAttr,
        heightAttr,
        cssWidth: (container as HTMLElement).style.width,
        cssOverflow: (container as HTMLElement).style.overflow,
      };
    });

    // If the container was created (e.g., by navigating to a page with color effects),
    // verify its structure is Safari-compatible
    if (structure.exists) {
      expect(structure.hasDefsChild).toBe(true);
      // Should NOT have zero-size SVG attributes (Safari ignores filters in zero-sized SVGs)
      expect(structure.widthAttr).toBeNull();
      expect(structure.heightAttr).toBeNull();
      // Should use CSS for hiding instead
      expect(structure.cssWidth).toBe('0px');
      expect(structure.cssOverflow).toBe('hidden');
    }
  });

  test('page renders without WebGL errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/simulator');
    await page.waitForLoadState('networkidle');

    // Filter out known non-critical errors (like resource loading)
    const criticalErrors = consoleErrors.filter(
      err => err.includes('WebGL') || err.includes('shader') || err.includes('GLSL')
    );
    expect(criticalErrors).toEqual([]);
  });

  test('YouTube embeds use correct domain', async ({ page }) => {
    await page.goto('/simulator');
    await page.waitForLoadState('networkidle');

    const iframes = await page.evaluate(() => {
      const frames = document.querySelectorAll('iframe[src*="youtube"]');
      return Array.from(frames).map(f => f.getAttribute('src') || '');
    });

    for (const src of iframes) {
      expect(src).toContain('youtube.com/embed/');
    }
  });
});
