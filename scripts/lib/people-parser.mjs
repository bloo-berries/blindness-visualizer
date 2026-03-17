/**
 * people-parser.mjs
 *
 * Shared person-data parsing utilities used by generate-llms-txt.mjs and
 * generate-og-images.mjs.  Parses TypeScript source files via regex to
 * extract famous-people records without requiring a TS compiler.
 */

import { readFileSync, readdirSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const BASE_URL = 'https://theblind.spot';
export const PEOPLE_DIR = join(ROOT, 'src/data/famousPeople');

/** Read a file as UTF-8 */
export const read = (path) => readFileSync(path, 'utf-8');

/** Strip surrounding quotes (single or double) and unescape */
export function unquote(s) {
  if (!s) return '';
  s = s.trim();
  if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
    s = s.slice(1, -1);
  }
  return s.replace(/\\n/g, '\n').replace(/\\'/g, "'").replace(/\\"/g, '"');
}

/** Extract person fields from a single { ... } object block */
export function parsePersonBlock(block) {
  const getString = (key) => {
    const pattern = new RegExp(`^\\s*${key}:\\s*(['"])((?:(?!\\1)[^\\\\]|\\\\.)*)\\1`, 'm');
    const m = block.match(pattern);
    return m ? unquote(`${m[1]}${m[2]}${m[1]}`) : '';
  };

  return {
    name: getString('name'),
    achievement: getString('achievement'),
    condition: getString('condition'),
    years: getString('years'),
    onset: getString('onset'),
    description: getString('description'),
    wikiUrl: getString('wikiUrl'),
  };
}

/** Parse a single people data file into a Record<string, PersonData> */
export function parsePeopleFile(filePath) {
  const src = read(filePath);
  const people = {};

  const recordStart = src.indexOf(': Record<string, PersonData>');
  if (recordStart === -1) return people;

  const recordBody = src.slice(src.indexOf('{', recordStart));

  let depth = 0;
  let blockStart = -1;
  let currentKey = '';

  for (let i = 0; i < recordBody.length; i++) {
    if (recordBody[i] === '{') {
      if (depth === 1) {
        const before = recordBody.slice(Math.max(0, i - 80), i);
        const keyMatch = before.match(/(\w+)\s*:\s*$/);
        if (keyMatch) currentKey = keyMatch[1];
        blockStart = i;
      }
      depth++;
    } else if (recordBody[i] === '}') {
      depth--;
      if (depth === 1 && blockStart !== -1 && currentKey) {
        const block = recordBody.slice(blockStart, i + 1);
        people[currentKey] = parsePersonBlock(block);
        blockStart = -1;
        currentKey = '';
      }
      if (depth === 0) break;
    }
  }

  return people;
}

/** Load all people from every data file in PEOPLE_DIR */
export function loadAllPeople() {
  const files = readdirSync(PEOPLE_DIR).filter(
    (f) => f.endsWith('.ts') && f !== 'index.ts' && f !== 'types.ts' && f !== 'constants.ts'
  );

  let allPeople = {};
  for (const f of files) {
    allPeople = { ...allPeople, ...parsePeopleFile(join(PEOPLE_DIR, f)) };
  }
  return allPeople;
}

/** Parse the categories array from famousPeople/index.ts */
export function parseFamousPeopleIndex() {
  const src = read(join(PEOPLE_DIR, 'index.ts'));

  const catMatch = src.match(/categories:\s*PersonCategory\[\]\s*=\s*\[([\s\S]*?)\];/);
  if (!catMatch) throw new Error('Could not parse categories array');

  const categories = [];
  for (const m of catMatch[1].matchAll(/\{\s*id:\s*"(\w+)",\s*name:\s*"([^"]+)",\s*people:\s*\[([^\]]+)\]/g)) {
    const people = m[3].match(/"(\w+)"/g)?.map((s) => s.replace(/"/g, '')) || [];
    categories.push({ id: m[1], name: m[2], people });
  }

  return categories;
}
