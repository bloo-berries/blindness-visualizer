import { getSimulationConditions, simulationMap, getWebsiteUrl } from '../utils/famousPeopleUtils';
import { getPersonImagePath, PLACEHOLDER_IMAGE } from '../utils/imagePaths';
import { personData } from '../data/famousPeople';
import { VISUAL_EFFECTS } from '../data/visualEffects';

const validEffectIds = new Set(VISUAL_EFFECTS.map(e => e.id));

describe('Famous People Navigation', () => {
  describe('simulation mapping completeness', () => {
    test('every person simulation maps to at least one valid effect', () => {
      const problems: string[] = [];
      for (const [personId, person] of Object.entries(personData)) {
        const conditions = getSimulationConditions(person.simulation);
        if (conditions.length === 0) {
          problems.push(`${personId}: simulation="${person.simulation}" maps to no conditions`);
        }
        for (const condId of conditions) {
          if (!validEffectIds.has(condId as any)) {
            problems.push(
              `${personId}: condition "${condId}" from simulation "${person.simulation}" not in VISUAL_EFFECTS`
            );
          }
        }
      }
      expect(problems).toEqual([]);
    });

    test('simulation map has no empty arrays', () => {
      const emptyKeys: string[] = [];
      for (const [key, conditions] of Object.entries(simulationMap)) {
        if (conditions.length === 0) {
          emptyKeys.push(key);
        }
      }
      expect(emptyKeys).toEqual([]);
    });

    test('all simulation map values contain only valid effect IDs', () => {
      const invalid: string[] = [];
      for (const [key, conditions] of Object.entries(simulationMap)) {
        for (const condId of conditions) {
          if (!validEffectIds.has(condId as any)) {
            invalid.push(`simulationMap["${key}"]: "${condId}" is not a valid effect`);
          }
        }
      }
      expect(invalid).toEqual([]);
    });
  });

  describe('image availability', () => {
    test('every person has a non-placeholder image', () => {
      const missing: string[] = [];
      for (const personId of Object.keys(personData)) {
        const imagePath = getPersonImagePath(personId);
        if (imagePath === PLACEHOLDER_IMAGE) {
          missing.push(personId);
        }
      }
      expect(missing).toEqual([]);
    });
  });

  describe('wikiUrl validation', () => {
    test('every person with a wikiUrl has a valid URL format', () => {
      const invalid: string[] = [];
      for (const [personId, person] of Object.entries(personData)) {
        if (person.wikiUrl) {
          if (!person.wikiUrl.startsWith('http://') && !person.wikiUrl.startsWith('https://')) {
            invalid.push(`${personId}: wikiUrl="${person.wikiUrl}" is not a valid URL`);
          }
        }
      }
      expect(invalid).toEqual([]);
    });
  });

  describe('getWebsiteUrl', () => {
    test('returns URL for known static domain', () => {
      const url = getWebsiteUrl('andreabocelli.com', 'bocelli');
      expect(url).toContain('andreabocelli.com');
    });

    test('returns Wikipedia URL for en.wikipedia.org domain', () => {
      const url = getWebsiteUrl('en.wikipedia.org', 'monet');
      expect(url).toContain('wikipedia.org');
      expect(url).toContain('Claude_Monet');
    });

    test('returns empty string for unknown domain', () => {
      const url = getWebsiteUrl('nonexistent-domain.com', 'monet');
      expect(url).toBe('');
    });

    test('returns team USA URL for teamusa.com domain', () => {
      const url = getWebsiteUrl('teamusa.com', 'marla');
      expect(url).toContain('teamusa.com');
      expect(url).toContain('marla-runyan');
    });
  });

  describe('fallback behavior', () => {
    test('getSimulationConditions returns fallback for unknown simulation key', () => {
      const conditions = getSimulationConditions('totally-unknown-key');
      expect(conditions).toEqual(['blurryVision', 'lossOfContrast']);
    });

    test('fallback conditions are valid effect IDs', () => {
      const fallback = getSimulationConditions('unknown');
      for (const id of fallback) {
        expect(validEffectIds.has(id as any)).toBe(true);
      }
    });
  });
});
