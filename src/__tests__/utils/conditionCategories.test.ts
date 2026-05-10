/**
 * Tests for condition categories data (src/data/conditionCategories/)
 */

// Mock React since JSX is used in the category files
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  createElement: jest.fn().mockReturnValue(null),
}));

// Mock MUI icons
jest.mock('@mui/icons-material', () => ({
  RemoveRedEye: jest.fn().mockReturnValue(null),
  ColorLens: jest.fn().mockReturnValue(null),
  MedicalServices: jest.fn().mockReturnValue(null),
  Visibility: jest.fn().mockReturnValue(null),
  Psychology: jest.fn().mockReturnValue(null),
}));

import { conditionCategories } from '../../data/conditionCategories';
import { ConditionCategory } from '../../data/conditionCategories/types';

describe('conditionCategories', () => {
  test('exports an array of categories', () => {
    expect(Array.isArray(conditionCategories)).toBe(true);
    expect(conditionCategories.length).toBeGreaterThan(0);
  });

  test('contains exactly 6 categories', () => {
    expect(conditionCategories).toHaveLength(6);
  });

  test('each category has required fields', () => {
    for (const category of conditionCategories) {
      expect(category.id).toBeTruthy();
      expect(typeof category.id).toBe('string');
      expect(category.name).toBeTruthy();
      expect(typeof category.name).toBe('string');
      expect(category.description).toBeTruthy();
      expect(typeof category.description).toBe('string');
      expect(Array.isArray(category.conditions)).toBe(true);
      expect(category.conditions.length).toBeGreaterThan(0);
    }
  });

  test('category IDs are unique', () => {
    const ids = conditionCategories.map(c => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('expected category IDs are present', () => {
    const ids = conditionCategories.map(c => c.id);
    expect(ids).toContain('visual-field');
    expect(ids).toContain('color-vision');
    expect(ids).toContain('eye-conditions');
    expect(ids).toContain('retinal-disorders');
    expect(ids).toContain('neurological');
    expect(ids).toContain('trauma-infections');
  });

  test('each condition has id, name, and description', () => {
    for (const category of conditionCategories) {
      for (const condition of category.conditions) {
        expect(condition.id).toBeTruthy();
        expect(typeof condition.id).toBe('string');
        expect(condition.name).toBeTruthy();
        expect(typeof condition.name).toBe('string');
        expect(condition.description).toBeTruthy();
        expect(typeof condition.description).toBe('string');
      }
    }
  });

  test('no duplicate condition IDs across all categories', () => {
    const allConditionIds: string[] = [];
    for (const category of conditionCategories) {
      for (const condition of category.conditions) {
        allConditionIds.push(condition.id);
      }
    }
    const uniqueConditionIds = new Set(allConditionIds);
    expect(uniqueConditionIds.size).toBe(allConditionIds.length);
  });

  test('total conditions across all categories is non-trivial', () => {
    const totalConditions = conditionCategories.reduce(
      (sum, cat) => sum + cat.conditions.length,
      0
    );
    // Should have a substantial number of conditions for a glossary
    expect(totalConditions).toBeGreaterThan(10);
  });

  test('color vision category contains common color blindness conditions', () => {
    const colorVision = conditionCategories.find(c => c.id === 'color-vision');
    expect(colorVision).toBeDefined();
    const conditionIds = colorVision!.conditions.map(c => c.id);
    expect(conditionIds).toContain('protanopia');
    expect(conditionIds).toContain('deuteranopia');
    expect(conditionIds).toContain('tritanopia');
  });

  test('visual field category contains hemianopia conditions', () => {
    const visualField = conditionCategories.find(c => c.id === 'visual-field');
    expect(visualField).toBeDefined();
    const conditionIds = visualField!.conditions.map(c => c.id);
    expect(conditionIds).toContain('hemianopiaLeft');
    expect(conditionIds).toContain('hemianopiaRight');
  });

  test('eye conditions category contains glaucoma and cataracts', () => {
    const eyeConditions = conditionCategories.find(c => c.id === 'eye-conditions');
    expect(eyeConditions).toBeDefined();
    const conditionIds = eyeConditions!.conditions.map(c => c.id);
    expect(conditionIds).toContain('glaucoma');
    expect(conditionIds).toContain('cataracts');
  });

  test('retinal disorders category contains RP and stargardt', () => {
    const retinal = conditionCategories.find(c => c.id === 'retinal-disorders');
    expect(retinal).toBeDefined();
    const conditionIds = retinal!.conditions.map(c => c.id);
    expect(conditionIds).toContain('retinitisPigmentosa');
    expect(conditionIds).toContain('stargardt');
  });

  test('eye conditions category contains AMD', () => {
    const eyeConditions = conditionCategories.find(c => c.id === 'eye-conditions');
    expect(eyeConditions).toBeDefined();
    const conditionIds = eyeConditions!.conditions.map(c => c.id);
    expect(conditionIds).toContain('amd');
  });

  test('conditions with treatments have valid treatment structure', () => {
    for (const category of conditionCategories) {
      for (const condition of category.conditions) {
        if (condition.treatments) {
          expect(typeof condition.treatments.available).toBe('boolean');
          expect(Array.isArray(condition.treatments.options)).toBe(true);
          expect(condition.treatments.options.length).toBeGreaterThan(0);
        }
      }
    }
  });

  test('relatedPeople is an array of strings when present', () => {
    for (const category of conditionCategories) {
      for (const condition of category.conditions) {
        if (condition.relatedPeople) {
          expect(Array.isArray(condition.relatedPeople)).toBe(true);
          for (const person of condition.relatedPeople) {
            expect(typeof person).toBe('string');
          }
        }
      }
    }
  });
});
