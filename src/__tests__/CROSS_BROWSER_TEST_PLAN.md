# Cross-Browser Color Vision Filter Test Plan

## Background

Color vision filters use DOM-injected SVG `<filter>` elements referenced via `url("#cvd-{type}")`.
This replaced the previous `data:image/svg+xml` data URI approach, which Safari/WebKit silently ignores
(WebKit Bug #104169, open since 2012).

## Browsers to Test

| Browser | Platform | Engine |
|---------|----------|--------|
| Chrome | Desktop | Blink |
| Firefox | Desktop | Gecko |
| Safari | macOS | WebKit |
| Safari | iOS | WebKit |
| Chrome | Android | Blink |

## Manual Test Scenarios

### Color Vision Filters

1. **Protanopia at 100%** — Enable protanopia at full intensity on an uploaded image. Image should show a clear red-blind color shift (reds become dark, blue-yellow spectrum dominates).
2. **Deuteranopia at 50%** — Enable deuteranopia at half intensity. Partial green-blind shift should be visible but less pronounced than full intensity.
3. **Switch protanopia → tritanopia** — Enable protanopia, then switch to tritanopia. Filter should change immediately with no flash of unfiltered content.
4. **Disable all filters** — After enabling a filter, set intensity to 0 or disable the condition. Original colors should be fully restored.
5. **Color filter + blur** — Enable a color vision filter and a blur/cataract effect simultaneously. Both should apply.
6. **YouTube video** — Enable protanopia on a YouTube video source. Video frames should be filtered in real-time.
7. **Uploaded image** — Enable deuteranopia on an uploaded image. Image should be filtered.
8. **Famous person simulation** — Open a person with a color vision condition (e.g., someone with protanopia) and click "Experience Simulation". Filters should apply automatically.

### DOM Inspection

9. **Inspect SVG container** — With a filter active, open DevTools and verify:
   - A `<svg id="cvd-svg-filters">` element exists in `<body>`
   - It contains a `<filter id="cvd-{type}">` element
   - The filter contains a `<feColorMatrix>` with the `values` attribute
10. **Cleanup on disable** — Disable the filter and verify the filter element is removed from the DOM.

## E2E Test Recommendations (Future)

For automated cross-browser testing, we recommend [Playwright](https://playwright.dev/) which supports Chromium, Firefox, and WebKit engines.

### Sample Playwright Config

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
});
```

### Sample Test Skeleton

```typescript
// e2e/color-vision-filters.spec.ts
import { test, expect } from '@playwright/test';

test('protanopia filter applies visible color shift', async ({ page }) => {
  await page.goto('/simulator');
  // Upload a test image with known colors
  // Enable protanopia at 100%
  // Screenshot and compare against baseline
  // Verify no data:image/svg+xml in computed styles
});

test('filter cleanup on disable', async ({ page }) => {
  await page.goto('/simulator');
  // Enable then disable a filter
  // Verify SVG container is cleaned up
  const svgContainer = await page.$('#cvd-svg-filters filter');
  expect(svgContainer).toBeNull();
});
```

> **Note**: Playwright is not added as a dependency. This is a recommendation for future adoption.
