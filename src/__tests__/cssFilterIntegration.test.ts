import {
  CSSFilterEffectConfig,
  processCSSFilterConfigs,
} from '../utils/cssFilters/famousPeopleFilters/filterConfig';
import {
  galileoFilterConfigs,
  monetFilterConfigs,
  christineFilterConfigs,
  lucyFilterConfigs,
  minkaraFilterConfigs,
  joshuaFilterConfigs,
  milaFilterConfigs,
  judiFilterConfigs,
  sugarFilterConfigs,
  stephenFilterConfigs,
  crazzysteveFilterConfigs,
  heatherFilterConfigs,
  daredevilFilterConfigs,
  geordiFilterConfigs,
  blindspotFilterConfigs,
  joseCidFilterConfigs,
  tophFilterConfigs,
  anselmoFilterConfigs,
  margaritaFilterConfigs,
  fujitoraFilterConfigs,
  chirrutFilterConfigs,
  juliaCarpenterFilterConfigs,
} from '../utils/cssFilters/famousPeopleFilters';
import { generateCSSFilters } from '../utils/cssFilters';
import { createDefaultEffects } from '../data/visualEffects';
import { VisualEffect } from '../types/visualEffects';

/** Helper: enable a single effect by ID at a given intensity */
function enableEffect(effects: VisualEffect[], id: string, intensity: number = 1.0): VisualEffect[] {
  return effects.map(e =>
    e.id === id ? { ...e, enabled: true, intensity } : e
  );
}

/** All declarative filter config arrays with their names */
const ALL_DECLARATIVE_CONFIGS: { name: string; configs: CSSFilterEffectConfig[] }[] = [
  { name: 'galileo', configs: galileoFilterConfigs },
  { name: 'monet', configs: monetFilterConfigs },
  { name: 'christine', configs: christineFilterConfigs },
  { name: 'lucy', configs: lucyFilterConfigs },
  { name: 'minkara', configs: minkaraFilterConfigs },
  { name: 'joshua', configs: joshuaFilterConfigs },
  { name: 'mila', configs: milaFilterConfigs },
  { name: 'judi', configs: judiFilterConfigs },
  { name: 'sugar', configs: sugarFilterConfigs },
  { name: 'stephen', configs: stephenFilterConfigs },
  { name: 'crazzysteve', configs: crazzysteveFilterConfigs },
  { name: 'heather', configs: heatherFilterConfigs },
  { name: 'daredevil', configs: daredevilFilterConfigs },
  { name: 'geordi', configs: geordiFilterConfigs },
  { name: 'blindspot', configs: blindspotFilterConfigs },
  { name: 'joseCid', configs: joseCidFilterConfigs },
  { name: 'toph', configs: tophFilterConfigs },
  { name: 'anselmo', configs: anselmoFilterConfigs },
  { name: 'margarita', configs: margaritaFilterConfigs },
  { name: 'fujitora', configs: fujitoraFilterConfigs },
  { name: 'chirrut', configs: chirrutFilterConfigs },
  { name: 'juliaCarpenter', configs: juliaCarpenterFilterConfigs },
];

describe('CSS Filter Integration', () => {
  describe('declarative filter configs', () => {
    test.each(ALL_DECLARATIVE_CONFIGS)(
      '$name configs: every config has a non-empty effectId',
      ({ configs }) => {
        for (const config of configs) {
          expect(typeof config.effectId).toBe('string');
          expect(config.effectId.length).toBeGreaterThan(0);
        }
      }
    );

    test.each(ALL_DECLARATIVE_CONFIGS)(
      '$name configs: filters function returns non-empty arrays for intensity 0.5',
      ({ configs }) => {
        for (const config of configs) {
          const result = config.filters(0.5);
          expect(Array.isArray(result)).toBe(true);
          expect(result.length).toBeGreaterThan(0);
        }
      }
    );

    test.each(ALL_DECLARATIVE_CONFIGS)(
      '$name configs: filter output contains no undefined or NaN',
      ({ configs }) => {
        const intensities = [0, 0.25, 0.5, 0.75, 1.0];
        for (const config of configs) {
          for (const intensity of intensities) {
            const result = config.filters(intensity);
            const joined = result.join(' ');
            expect(joined).not.toContain('undefined');
            expect(joined).not.toContain('NaN');
            expect(joined).not.toContain('null');
          }
        }
      }
    );

    test.each(ALL_DECLARATIVE_CONFIGS)(
      '$name configs: filter output contains valid CSS filter functions',
      ({ configs }) => {
        for (const config of configs) {
          const result = config.filters(0.75);
          for (const filter of result) {
            // Should match CSS filter function pattern like blur(5px), brightness(50%), etc.
            expect(filter).toMatch(/\w+\([^)]*\)/);
          }
        }
      }
    );
  });

  describe('processCSSFilterConfigs', () => {
    test('returns empty string when no effects are enabled', () => {
      const effects: VisualEffect[] = [
        { id: 'galileoAcuteHalos' as any, name: 'Test', enabled: false, intensity: 0.5, description: 'Test' },
      ];
      const result = processCSSFilterConfigs(galileoFilterConfigs, effects);
      expect(result).toBe('');
    });

    test('returns filter string when matching effect is enabled', () => {
      const defaults = createDefaultEffects();
      // Enable a Galileo effect (use actual effect ID from galileoFilterConfigs)
      const effects = enableEffect(defaults, 'galileoSevereBlurring');
      const result = processCSSFilterConfigs(galileoFilterConfigs, effects);
      expect(result.length).toBeGreaterThan(0);
      expect(result).toMatch(/\w+\([^)]*\)/);
    });

    test('respects excludeWhenActive', () => {
      // Find a config with excludeWhenActive
      const configWithExclusion = ALL_DECLARATIVE_CONFIGS
        .flatMap(({ configs }) => configs)
        .find(c => c.excludeWhenActive && c.excludeWhenActive.length > 0);

      if (configWithExclusion) {
        const excludedId = configWithExclusion.excludeWhenActive![0];
        // Enable both the effect and the excluded effect
        const effects: VisualEffect[] = [
          { id: configWithExclusion.effectId as any, name: 'A', enabled: true, intensity: 0.5, description: '' },
          { id: excludedId as any, name: 'B', enabled: true, intensity: 0.5, description: '' },
        ];
        const result = processCSSFilterConfigs([configWithExclusion], effects);
        expect(result).toBe('');
      }
    });

    test('intensity affects filter output', () => {
      const defaults = createDefaultEffects();
      const lowEffects = enableEffect(defaults, 'galileoSevereBlurring', 0.1);
      const highEffects = enableEffect(defaults, 'galileoSevereBlurring', 1.0);

      const lowResult = processCSSFilterConfigs(galileoFilterConfigs, lowEffects);
      const highResult = processCSSFilterConfigs(galileoFilterConfigs, highEffects);
      expect(lowResult).not.toBe(highResult);
    });
  });

  describe('full pipeline with famous people effects', () => {
    let defaults: VisualEffect[];

    beforeEach(() => {
      defaults = createDefaultEffects();
    });

    test('Galileo effects produce valid CSS filters', () => {
      const effects = enableEffect(defaults, 'galileoSevereBlurring');
      const result = generateCSSFilters(effects);
      expect(result.length).toBeGreaterThan(0);
    });

    test('Monet effects produce valid CSS filters', () => {
      const effects = enableEffect(defaults, 'monetCataractsFog');
      const result = generateCSSFilters(effects);
      expect(result.length).toBeGreaterThan(0);
    });

    test('Christine effects produce valid CSS filters', () => {
      const effects = enableEffect(defaults, 'christineNMOComplete');
      const result = generateCSSFilters(effects);
      expect(result.length).toBeGreaterThan(0);
    });

    test('Lucy effects produce valid CSS filters', () => {
      const effects = enableEffect(defaults, 'lucyCompleteVision');
      const result = generateCSSFilters(effects);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
