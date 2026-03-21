import { personData, categories } from '../data/famousPeople';
import { PersonData } from '../data/famousPeople/types';
import {
  PERSON_IDS,
  PERSON_COUNT,
  CATEGORY_PEOPLE_SETS,
  PRECOMPUTED_CONDITION_CATEGORIES,
  PRECOMPUTED_COUNTRIES,
  getCategoryKey,
} from '../data/famousPeople/constants';

describe('Famous People Data Integrity', () => {
  test('personData is non-empty', () => {
    expect(Object.keys(personData).length).toBeGreaterThan(0);
  });

  test('every person has all required fields', () => {
    const missingFields: string[] = [];

    for (const [id, person] of Object.entries(personData)) {
      const required: (keyof PersonData)[] = [
        'name', 'condition', 'years', 'onset', 'simulation', 'description', 'nationality',
      ];
      for (const field of required) {
        if (person[field] === undefined || person[field] === null) {
          missingFields.push(`${id}: missing "${field}"`);
        }
      }
      if (person.nationality) {
        if (!person.nationality.country) missingFields.push(`${id}: missing nationality.country`);
        if (!person.nationality.flag) missingFields.push(`${id}: missing nationality.flag`);
      }
    }

    expect(missingFields).toEqual([]);
  });

  test('every person has non-empty name, condition, and description', () => {
    const empty: string[] = [];
    for (const [id, person] of Object.entries(personData)) {
      if (!person.name.trim()) empty.push(`${id}: empty name`);
      if (!person.condition.trim()) empty.push(`${id}: empty condition`);
      if (!person.description.trim()) empty.push(`${id}: empty description`);
    }
    expect(empty).toEqual([]);
  });

  test('PERSON_IDS matches personData keys', () => {
    expect(new Set(PERSON_IDS)).toEqual(new Set(Object.keys(personData)));
  });

  test('PERSON_COUNT matches actual count', () => {
    expect(PERSON_COUNT).toBe(Object.keys(personData).length);
  });

  test('every person in categories exists in personData', () => {
    const missing: string[] = [];
    for (const category of categories) {
      for (const personId of category.people) {
        if (!(personId in personData)) {
          missing.push(`"${personId}" in category "${category.name}" not found in personData`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  test('every person in personData appears in exactly one category', () => {
    const personCategories: Record<string, string[]> = {};
    for (const category of categories) {
      for (const personId of category.people) {
        if (!personCategories[personId]) personCategories[personId] = [];
        personCategories[personId].push(category.name);
      }
    }

    const uncategorized = Object.keys(personData).filter(id => !personCategories[id]);
    const duplicated = Object.entries(personCategories)
      .filter(([, cats]) => cats.length > 1)
      .map(([id, cats]) => `${id}: [${cats.join(', ')}]`);

    expect(uncategorized).toEqual([]);
    expect(duplicated).toEqual([]);
  });

  test('no duplicate person IDs within a category', () => {
    const duplicates: string[] = [];
    for (const category of categories) {
      const seen = new Set<string>();
      for (const personId of category.people) {
        if (seen.has(personId)) {
          duplicates.push(`"${personId}" duplicated in "${category.name}"`);
        }
        seen.add(personId);
      }
    }
    expect(duplicates).toEqual([]);
  });

  test('CATEGORY_PEOPLE_SETS matches categories array', () => {
    for (const category of categories) {
      const set = CATEGORY_PEOPLE_SETS.get(category.name);
      expect(set).toBeDefined();
      expect(set).toEqual(new Set(category.people));
    }
    expect(CATEGORY_PEOPLE_SETS.size).toBe(categories.length);
  });

  test('PRECOMPUTED_CONDITION_CATEGORIES covers all people conditions', () => {
    const allCategorizedConditions = new Set(
      PRECOMPUTED_CONDITION_CATEGORIES.flatMap(c => c.conditions)
    );
    const uncategorized: string[] = [];
    for (const [id, person] of Object.entries(personData)) {
      if (!allCategorizedConditions.has(person.condition)) {
        uncategorized.push(`${id}: "${person.condition}"`);
      }
    }
    expect(uncategorized).toEqual([]);
  });

  test('PRECOMPUTED_COUNTRIES includes all nationalities', () => {
    const precomputedCountries = new Set(PRECOMPUTED_COUNTRIES.map(c => c.country));
    const missing: string[] = [];
    for (const [id, person] of Object.entries(personData)) {
      if (person.nationality && !precomputedCountries.has(person.nationality.country)) {
        missing.push(`${id}: country "${person.nationality.country}" not in PRECOMPUTED_COUNTRIES`);
      }
    }
    expect(missing).toEqual([]);
  });

  test('PRECOMPUTED_COUNTRIES are sorted alphabetically', () => {
    const countries = PRECOMPUTED_COUNTRIES.map(c => c.country);
    const sorted = [...countries].sort((a, b) => a.localeCompare(b));
    expect(countries).toEqual(sorted);
  });

  test('getCategoryKey returns a key for all known categories', () => {
    const expectedMappings: Record<string, string> = {
      'Ocular Issues': 'ocularIssues',
      'Neurologic Issues': 'neurologicIssues',
      'Accident/Injury': 'accidentInjury',
      'Congenital Defects': 'congenitalDefects',
      'Degenerative Eye Diseases': 'degenerativeEyeDiseases',
      'Illness': 'illness',
      'Other': 'other',
    };
    for (const [cat, expectedKey] of Object.entries(expectedMappings)) {
      expect(getCategoryKey(cat)).toBe(expectedKey);
    }
  });

  test('getCategoryKey falls back to "other" for unknown categories', () => {
    expect(getCategoryKey('Unknown Category')).toBe('other');
  });
});
