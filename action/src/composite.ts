import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';

export interface CompositeResult {
  /** Path to the composite grid image */
  path: string;
  /** Alt text describing the composite */
  altText: string;
  /** The source image this composite was built from */
  sourceImage: string;
}

/**
 * Tile a set of rendered screenshots into a labeled grid image.
 *
 * Layout: the "original" image at top-left, followed by each condition.
 * Each cell gets a label burned into the top-left corner.
 */
export async function createComposite(
  sourceImage: string,
  renders: Array<{ condition: string; screenshotPath: string }>,
  outputDir: string,
): Promise<CompositeResult> {
  const cellWidth = 600;
  const cellHeight = 338;
  const labelHeight = 28;
  const cols = Math.min(renders.length, 3);
  const rows = Math.ceil(renders.length / cols);
  const gridWidth = cols * cellWidth;
  const gridHeight = rows * cellHeight;

  // Create the grid canvas
  const composites: sharp.OverlayOptions[] = [];
  const conditionNames: string[] = [];

  for (let i = 0; i < renders.length; i++) {
    const render = renders[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * cellWidth;
    const y = row * cellHeight;

    const label = render.condition || 'Original';
    conditionNames.push(label);

    // Resize the screenshot to cell size
    const resized = await sharp(render.screenshotPath)
      .resize(cellWidth, cellHeight, { fit: 'cover' })
      .toBuffer();

    composites.push({ input: resized, top: y, left: x });

    // Create label overlay
    const labelSvg = Buffer.from(`
      <svg width="${cellWidth}" height="${labelHeight}">
        <rect width="${cellWidth}" height="${labelHeight}" fill="rgba(0,0,0,0.7)" />
        <text x="8" y="19" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white">
          ${escapeXml(label)}
        </text>
      </svg>
    `);

    composites.push({ input: labelSvg, top: y, left: x });
  }

  const basename = path.basename(sourceImage, path.extname(sourceImage));
  const outputPath = path.join(outputDir, `${basename}_composite.png`);

  await sharp({
    create: {
      width: gridWidth,
      height: gridHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite(composites)
    .png()
    .toFile(outputPath);

  // Build alt text
  const conditionsForAlt = conditionNames.filter(n => n !== 'Original');
  const altText = conditionsForAlt.length > 0
    ? `${basename} rendered under ${conditionsForAlt.join(', ')}; original at top left.`
    : `${basename} original rendering.`;

  return { path: outputPath, altText, sourceImage };
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
