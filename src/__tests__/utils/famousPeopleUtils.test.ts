/**
 * Tests for famous people utilities (src/utils/famousPeopleUtils.tsx)
 */

import {
  getSimulationConditions,
  simulationMap,
  getWebsiteUrl,
} from '../../utils/famousPeopleUtils';

describe('getSimulationConditions', () => {
  test('returns conditions for complete-blindness', () => {
    const conditions = getSimulationConditions('complete-blindness');
    expect(conditions).toEqual(['completeBlindness']);
  });

  test('returns conditions for paul-retinitis-pigmentosa', () => {
    const conditions = getSimulationConditions('paul-retinitis-pigmentosa');
    expect(conditions).toEqual(['retinitisPigmentosa', 'nightBlindness']);
  });

  test('returns conditions for daredevil-radar-sense', () => {
    const conditions = getSimulationConditions('daredevil-radar-sense');
    expect(conditions).toEqual(['daredevilRadarSenseComplete']);
  });

  test('returns conditions for glaucoma with halos', () => {
    const conditions = getSimulationConditions('glaucoma-halos progressive-loss');
    expect(conditions).toContain('glaucoma');
    expect(conditions).toContain('halos');
    expect(conditions).toContain('tunnelVision');
  });

  test('returns conditions for fred-rogers-deuteranopia', () => {
    const conditions = getSimulationConditions('fred-rogers-deuteranopia');
    expect(conditions).toEqual(['deuteranopia']);
  });

  test('returns default conditions for unknown simulation key', () => {
    const conditions = getSimulationConditions('nonexistent-condition');
    expect(conditions).toEqual(['blurryVision', 'lossOfContrast']);
  });

  test('returns default conditions for empty string', () => {
    const conditions = getSimulationConditions('');
    expect(conditions).toEqual(['blurryVision', 'lossOfContrast']);
  });

  test('returns an array for every entry in simulationMap', () => {
    for (const [key, value] of Object.entries(simulationMap)) {
      const result = getSimulationConditions(key);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result).toEqual(value);
    }
  });

  test('all simulation condition values are non-empty strings', () => {
    for (const [key, conditions] of Object.entries(simulationMap)) {
      for (const condition of conditions) {
        expect(typeof condition).toBe('string');
        expect(condition.length).toBeGreaterThan(0);
      }
    }
  });

  test('simulationMap has a large number of entries', () => {
    const keys = Object.keys(simulationMap);
    // There are ~100+ simulation entries based on the source
    expect(keys.length).toBeGreaterThan(80);
  });
});

describe('getWebsiteUrl', () => {
  test('returns URL for known static domain', () => {
    const url = getWebsiteUrl('andreabocelli.com', 'bocelli');
    expect(url).toBe('https://www.andreabocelli.com/');
  });

  test('returns Wikipedia URL for known person', () => {
    const url = getWebsiteUrl('en.wikipedia.org', 'monet');
    expect(url).toBe('https://en.wikipedia.org/wiki/Claude_Monet');
  });

  test('returns Team USA URL for marla', () => {
    const url = getWebsiteUrl('teamusa.com', 'marla');
    expect(url).toBe('https://www.teamusa.com/profiles/marla-runyan');
  });

  test('returns empty string for unknown domain', () => {
    const url = getWebsiteUrl('unknown-domain.com', 'somebody');
    expect(url).toBe('');
  });

  test('returns IMDb URL for known person', () => {
    const url = getWebsiteUrl('imdb.com', 'marilee');
    expect(url).toBe('https://www.imdb.com/name/nm3411258/');
  });

  test('returns Paralympic URL for tofiri', () => {
    const url = getWebsiteUrl('paralympic.org', 'tofiri');
    expect(url).toBeTruthy();
    expect(url).toContain('paralympic.org');
  });
});

describe('simulationMap structure', () => {
  test('complete-blindness maps to completeBlindness', () => {
    expect(simulationMap['complete-blindness']).toContain('completeBlindness');
  });

  test('fictional enhanced perception conditions use custom Complete effects', () => {
    expect(simulationMap['daredevil-radar-sense']).toEqual(['daredevilRadarSenseComplete']);
    expect(simulationMap['geordi-visor-sense']).toEqual(['geordiVisorSenseComplete']);
    expect(simulationMap['toph-seismic-sense']).toEqual(['tophSeismicSenseComplete']);
    expect(simulationMap['neo-matrix-code-vision']).toEqual(['neoMatrixCodeVisionComplete']);
  });

  test('cataracts-related simulations map to relevant conditions', () => {
    // Keys that explicitly use the cataracts condition
    expect(simulationMap['cataracts color-distortion']).toContain('cataracts');

    // Custom cataract effects use person-specific condition IDs
    expect(simulationMap['amadou-cataract-progression']).toEqual(['amadouCataractProgression']);
    expect(simulationMap['mila-iritis-cataracts']).toEqual(['milaCompleteVision']);
  });

  test('color blindness simulations map to correct condition types', () => {
    expect(simulationMap['fred-rogers-deuteranopia']).toEqual(['deuteranopia']);
    expect(simulationMap['john-kay-achromatopsia']).toEqual(['monochromacy']);
    expect(simulationMap['jonny-greenwood-color-blindness']).toEqual(['deuteranomaly']);
  });
});
