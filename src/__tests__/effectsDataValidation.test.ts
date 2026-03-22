import { colorVisionEffects } from '../data/effects/colorVisionEffects';
import { visualFieldEffects } from '../data/effects/visualFieldEffects';
import { visualDisturbanceEffects } from '../data/effects/visualDisturbanceEffects';
import { retinalEffects } from '../data/effects/retinalEffects';
import { ocularEffects } from '../data/effects/ocularEffects';
import { famousPeopleEffects } from '../data/effects/famousPeopleEffects';
import { allEffects } from '../data/effects';
import { VISUAL_EFFECTS } from '../data/visualEffects';
import { VisualEffect } from '../types/visualEffects';

const ALL_CATEGORY_ARRAYS: { name: string; effects: VisualEffect[] }[] = [
  { name: 'colorVisionEffects', effects: colorVisionEffects },
  { name: 'visualFieldEffects', effects: visualFieldEffects },
  { name: 'visualDisturbanceEffects', effects: visualDisturbanceEffects },
  { name: 'retinalEffects', effects: retinalEffects },
  { name: 'ocularEffects', effects: ocularEffects },
  { name: 'famousPeopleEffects', effects: famousPeopleEffects },
];

describe('Effects Data Validation', () => {
  describe('per-category validation', () => {
    test.each(ALL_CATEGORY_ARRAYS)('$name is non-empty', ({ effects }) => {
      expect(effects.length).toBeGreaterThan(0);
    });

    test.each(ALL_CATEGORY_ARRAYS)(
      '$name has no duplicate IDs within the category',
      ({ effects }) => {
        const ids = effects.map(e => e.id);
        const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
        expect(duplicates).toEqual([]);
      }
    );

    test.each(ALL_CATEGORY_ARRAYS)(
      '$name: every effect has non-empty name and description',
      ({ effects, name }) => {
        const problems: string[] = [];
        for (const effect of effects) {
          if (!effect.name || !effect.name.trim()) {
            problems.push(`${name}/${effect.id}: empty name`);
          }
          if (!effect.description || !effect.description.trim()) {
            problems.push(`${name}/${effect.id}: empty description`);
          }
        }
        expect(problems).toEqual([]);
      }
    );

    test.each(ALL_CATEGORY_ARRAYS)(
      '$name: every effect has a non-empty string ID',
      ({ effects }) => {
        for (const effect of effects) {
          expect(typeof effect.id).toBe('string');
          expect(effect.id.length).toBeGreaterThan(0);
        }
      }
    );

    test.each(ALL_CATEGORY_ARRAYS)(
      '$name: every effect has intensity in [0, 1]',
      ({ effects, name }) => {
        const outOfRange: string[] = [];
        for (const effect of effects) {
          if (effect.intensity < 0 || effect.intensity > 1) {
            outOfRange.push(`${name}/${effect.id}: intensity=${effect.intensity}`);
          }
        }
        expect(outOfRange).toEqual([]);
      }
    );

    test.each(ALL_CATEGORY_ARRAYS)(
      '$name: every effect defaults to enabled=false',
      ({ effects, name }) => {
        const enabled: string[] = [];
        for (const effect of effects) {
          if (effect.enabled !== false) {
            enabled.push(`${name}/${effect.id}: enabled=${effect.enabled}`);
          }
        }
        expect(enabled).toEqual([]);
      }
    );
  });

  describe('barrel export completeness', () => {
    test('allEffects contains every category array', () => {
      for (const { name, effects } of ALL_CATEGORY_ARRAYS) {
        for (const effect of effects) {
          expect(allEffects).toContain(effect);
        }
      }
    });

    test('allEffects length equals sum of all categories', () => {
      const expectedLength = ALL_CATEGORY_ARRAYS.reduce(
        (sum, { effects }) => sum + effects.length,
        0
      );
      expect(allEffects.length).toBe(expectedLength);
    });

    test('VISUAL_EFFECTS is the same reference as allEffects', () => {
      expect(VISUAL_EFFECTS).toBe(allEffects);
    });
  });

  describe('cross-category uniqueness', () => {
    test('no ID appears in more than one category', () => {
      const idToCategory = new Map<string, string>();
      const duplicates: string[] = [];

      for (const { name, effects } of ALL_CATEGORY_ARRAYS) {
        for (const effect of effects) {
          const existing = idToCategory.get(effect.id);
          if (existing) {
            duplicates.push(`"${effect.id}" in both "${existing}" and "${name}"`);
          } else {
            idToCategory.set(effect.id, name);
          }
        }
      }
      expect(duplicates).toEqual([]);
    });
  });
});
