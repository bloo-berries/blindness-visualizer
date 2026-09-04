import { chromium, Browser, BrowserContext, Page } from 'playwright';
import * as path from 'path';

export interface RenderResult {
  /** The source image path this render came from */
  sourceImage: string;
  /** The condition ID applied (empty string for "original") */
  condition: string;
  /** Path to the rendered screenshot PNG */
  screenshotPath: string;
}

export interface RendererOptions {
  /** Base URL of the running app (e.g. http://localhost:3000) */
  baseUrl: string;
  /** Directory to write screenshots into */
  outputDir: string;
  /** Effect intensity 0–1 */
  intensity: number;
}

let browser: Browser | null = null;
let context: BrowserContext | null = null;

export async function launchBrowser(): Promise<void> {
  browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });
  context = await browser.newContext({
    viewport: { width: 1200, height: 675 },
  });
}

export async function closeBrowser(): Promise<void> {
  await context?.close();
  await browser?.close();
  context = null;
  browser = null;
}

/**
 * Render a single image under a single condition (or "original" with no condition).
 */
export async function renderScreenshot(
  imagePath: string,
  condition: string,
  opts: RendererOptions,
): Promise<RenderResult> {
  if (!context) throw new Error('Browser not launched — call launchBrowser() first');

  const page: Page = await context.newPage();

  try {
    // Build URL with query params
    const url = new URL('/headless', opts.baseUrl);
    if (condition) {
      url.searchParams.set('conditions', condition);
      url.searchParams.set('intensity', String(Math.round(opts.intensity * 100)));
    }

    await page.goto(url.toString(), { waitUntil: 'networkidle' });

    // Inject the source image via the hidden file input
    const fileInput = page.locator('[data-testid="headless-file-input"]');
    await fileInput.setInputFiles(imagePath);

    // Wait for effects to render
    await page.waitForSelector('[data-visionsim-ready="true"]', { timeout: 15000 });

    // Extra settle time for CSS/SVG filter painting
    await page.waitForTimeout(500);

    // Screenshot the container
    const container = page.locator('[data-visionsim-ready="true"]');
    const basename = path.basename(imagePath, path.extname(imagePath));
    const label = condition || 'original';
    const screenshotPath = path.join(opts.outputDir, `${basename}_${label}.png`);

    await container.screenshot({ path: screenshotPath });

    return { sourceImage: imagePath, condition, screenshotPath };
  } finally {
    await page.close();
  }
}
