#!/usr/bin/env node

/**
 * generate-og-images.mjs
 *
 * Build-time script that generates Open Graph images (1200×630 PNG) for each
 * famous person and a generic site OG image.  Also produces a metadata JSON
 * file consumed by the Cloudflare Pages middleware to inject person-specific
 * meta tags for social-media crawlers.
 *
 * Run: node scripts/generate-og-images.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { loadAllPeople, BASE_URL } from './lib/people-parser.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
const IMAGES_DIR = join(PUBLIC, 'images/people');
const OG_DIR = join(PUBLIC, 'og');

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const PORTRAIT_WIDTH = 420;
const BATCH_SIZE = 20;

// ─── Helpers ─────────────────────────────────────────────────────────

const read = (path) => readFileSync(path, 'utf-8');

// ─── Parse PEOPLE_IMAGE_MAP from imagePaths.ts ───────────────────────

function parseImageMap() {
  const src = read(join(ROOT, 'src/utils/imagePaths.ts'));
  const map = {};
  // Match entries like: personId: 'filename.webp',
  const mapMatch = src.match(/PEOPLE_IMAGE_MAP[^{]*\{([\s\S]*?)\};/);
  if (!mapMatch) throw new Error('Could not parse PEOPLE_IMAGE_MAP');
  for (const m of mapMatch[1].matchAll(/(\w+):\s*'([^']+)'/g)) {
    map[m[1]] = m[2];
  }
  return map;
}

// ─── SVG text helpers ────────────────────────────────────────────────

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

/** Wrap text to fit within maxWidth (approximate char-based wrapping) */
function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    if (line.length + word.length + 1 > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// ─── Generate a person OG image ──────────────────────────────────────

async function generatePersonOG(personId, person, imageMap) {
  const filename = imageMap[personId];
  const imagePath = filename ? join(IMAGES_DIR, filename) : null;
  const hasImage = imagePath && existsSync(imagePath);

  // Build the right-side text SVG overlay
  const textX = hasImage ? 470 : 80;
  const textWidth = hasImage ? 680 : 1040;
  const maxChars = hasImage ? 36 : 55;

  const nameLines = wrapText(person.name, maxChars);
  const conditionLines = wrapText(person.condition, maxChars + 5);

  let svgParts = [];
  let y = 180;

  // Name (bold, white)
  for (const line of nameLines) {
    svgParts.push(`<text x="${textX}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="bold" fill="white">${escapeXml(line)}</text>`);
    y += 54;
  }

  y += 12;

  // Condition (muted)
  for (const line of conditionLines) {
    svgParts.push(`<text x="${textX}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#94a3b8">${escapeXml(line)}</text>`);
    y += 34;
  }

  // Years
  if (person.years) {
    y += 8;
    svgParts.push(`<text x="${textX}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#64748b">${escapeXml(person.years)}</text>`);
    y += 30;
  }

  // Achievement (accent blue)
  if (person.achievement) {
    y += 8;
    const achLines = wrapText(person.achievement, maxChars + 2);
    for (const line of achLines) {
      svgParts.push(`<text x="${textX}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#60a5fa">${escapeXml(line)}</text>`);
      y += 30;
    }
  }

  // Bottom branding bar
  svgParts.push(`<rect x="0" y="${OG_HEIGHT - 50}" width="${OG_WIDTH}" height="50" fill="#1e3a8a"/>`);
  svgParts.push(`<text x="${OG_WIDTH / 2}" y="${OG_HEIGHT - 18}" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">theblind.spot</text>`);

  const textSvg = `<svg width="${OG_WIDTH}" height="${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    ${svgParts.join('\n    ')}
  </svg>`;

  // Create dark gradient background
  const bgSvg = `<svg width="${OG_WIDTH}" height="${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
    </defs>
    <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#bg)"/>
  </svg>`;

  const composites = [
    { input: Buffer.from(textSvg), top: 0, left: 0 },
  ];

  // Add person portrait on the left
  if (hasImage) {
    try {
      const portraitHeight = OG_HEIGHT - 50; // Leave room for branding bar
      const portrait = await sharp(imagePath)
        .resize(PORTRAIT_WIDTH, portraitHeight, { fit: 'cover', position: 'top' })
        .png()
        .toBuffer();

      // Create a gradient fade overlay for the right edge of the portrait
      const fadeSvg = `<svg width="${PORTRAIT_WIDTH}" height="${portraitHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fade" x1="0.7" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="black" stop-opacity="1"/>
            <stop offset="100%" stop-color="black" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <rect width="${PORTRAIT_WIDTH}" height="${portraitHeight}" fill="url(#fade)"/>
      </svg>`;

      // Apply fade mask to portrait
      const maskedPortrait = await sharp(portrait)
        .composite([{
          input: Buffer.from(fadeSvg),
          blend: 'dest-in',
        }])
        .png()
        .toBuffer();

      composites.unshift({ input: maskedPortrait, top: 0, left: 0 });
    } catch {
      // If image processing fails, skip portrait
    }
  }

  const result = await sharp(Buffer.from(bgSvg))
    .png()
    .composite(composites)
    .png({ quality: 80, compressionLevel: 9 })
    .toBuffer();

  return result;
}

// ─── Generate generic site OG image ──────────────────────────────────

async function generateSiteOG() {
  const bgSvg = `<svg width="${OG_WIDTH}" height="${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
    </defs>
    <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#bg)"/>
    <text x="${OG_WIDTH / 2}" y="240" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="bold" fill="white" text-anchor="middle">The Blind Spot</text>
    <text x="${OG_WIDTH / 2}" y="310" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#94a3b8" text-anchor="middle">Vision Condition Simulator</text>
    <text x="${OG_WIDTH / 2}" y="380" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#60a5fa" text-anchor="middle">214 famous people · 148 conditions · 26 languages</text>
    <rect x="0" y="${OG_HEIGHT - 50}" width="${OG_WIDTH}" height="50" fill="#1e3a8a"/>
    <text x="${OG_WIDTH / 2}" y="${OG_HEIGHT - 18}" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">theblind.spot</text>
  </svg>`;

  return sharp(Buffer.from(bgSvg))
    .png({ compressionLevel: 9 })
    .toBuffer();
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  // eslint-disable-next-line no-console
  console.log('Generating OG images...');

  const allPeople = loadAllPeople();
  const imageMap = parseImageMap();
  const personIds = Object.keys(allPeople);

  // eslint-disable-next-line no-console
  console.log(`  Found ${personIds.length} people, ${Object.keys(imageMap).length} image mappings`);

  // Ensure output directory exists
  mkdirSync(OG_DIR, { recursive: true });

  // Generate generic site OG image
  const siteOG = await generateSiteOG();
  writeFileSync(join(PUBLIC, 'og-image.png'), siteOG);
  // eslint-disable-next-line no-console
  console.log('  Generated og-image.png');

  // Generate per-person OG images in batches
  const metadata = {};
  let generated = 0;
  let skipped = 0;

  for (let i = 0; i < personIds.length; i += BATCH_SIZE) {
    const batch = personIds.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map(async (personId) => {
        const person = allPeople[personId];
        if (!person || !person.name) {
          skipped++;
          return;
        }

        try {
          const buf = await generatePersonOG(personId, person, imageMap);
          writeFileSync(join(OG_DIR, `${personId}.png`), buf);

          metadata[personId] = {
            name: person.name,
            condition: person.condition,
            years: person.years || '',
            achievement: person.achievement || '',
          };
          generated++;
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn(`  Warning: Failed to generate OG for ${personId}: ${err.message}`);
          skipped++;
        }
      })
    );

    // eslint-disable-next-line no-console
    console.log(`  Progress: ${Math.min(i + BATCH_SIZE, personIds.length)}/${personIds.length}`);
  }

  // Write metadata JSON for Cloudflare middleware
  writeFileSync(join(OG_DIR, 'metadata.json'), JSON.stringify(metadata, null, 2));

  // eslint-disable-next-line no-console
  console.log(`  Generated ${generated} person OG images (${skipped} skipped)`);
  // eslint-disable-next-line no-console
  console.log(`  metadata.json: ${Object.keys(metadata).length} entries`);
  // eslint-disable-next-line no-console
  console.log('Done.');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('OG image generation failed:', err);
  process.exit(1);
});
