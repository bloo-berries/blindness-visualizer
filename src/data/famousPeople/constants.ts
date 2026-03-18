import { personData, categories } from './index';

// Pre-computed person keys and count (never changes)
export const PERSON_IDS = Object.keys(personData);
export const PERSON_COUNT = PERSON_IDS.length;

// Pre-computed category people as Sets for O(1) lookup
export const CATEGORY_PEOPLE_SETS: Map<string, Set<string>> = new Map(
  categories.map(cat => [cat.name, new Set(cat.people)])
);

// Helper to convert category name to translation key
const CATEGORY_KEY_MAP: Record<string, string> = {
  'Ocular Issues': 'ocularIssues',
  'Neurologic Issues': 'neurologicIssues',
  'Accident/Injury': 'accidentInjury',
  'Congenital Defects': 'congenitalDefects',
  'Degenerative Eye Diseases': 'degenerativeEyeDiseases',
  'Illness': 'illness',
  'Other': 'other'
};

export const getCategoryKey = (category: string): string => {
  return CATEGORY_KEY_MAP[category] || 'other';
};

// Keyword-to-category lookup map for condition categorization
const CONDITION_CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Ocular Issues': [
    'glaucoma', 'cataract', 'retinal detachment', 'retinopathy', 'retinoschisis',
    'macular degeneration', 'macular', 'amd', 'keratoconus', 'aniridia', 'nystagmus',
    'retinoblastoma', 'stargardt', 'cone-rod', 'diabetic retinopathy', 'ophthalmia',
    'iritis', 'eye infection', 'eye disease', 'sight disease', 'color blindness',
    'color deficiency', 'achromatopsia', 'deuteranopia', 'deuteranomaly', 'nearsighted',
    'myasthenia'
  ],
  'Neurologic Issues': [
    'neuromyelitis', 'stroke', 'brain injury', 'traumatic brain', 'meningitis',
    'neurologic', 'neurological'
  ],
  'Accident/Injury': [
    'accident', 'injury', 'trauma', 'gunshot', 'car accident', 'chemical burn',
    'explosion', 'shooting', 'broken glass', 'eye injury'
  ],
  'Congenital Defects': [
    'congenital', 'from birth', 'born blind', 'birth defect'
  ],
  'Degenerative Eye Diseases': [
    'degenerative', 'progressive', 'retinitis pigmentosa', 'dystrophy'
  ],
  'Illness': [
    'illness', 'disease', 'fever', 'smallpox', 'diphtheria', 'kawasaki',
    'epilepsy', 'terry syndrome', 'oxygen toxicity', 'scarlet fever', 'complications'
  ]
};

// Category order for display
const CATEGORY_ORDER = [
  'Ocular Issues',
  'Neurologic Issues',
  'Accident/Injury',
  'Congenital Defects',
  'Degenerative Eye Diseases',
  'Illness',
  'Other'
];

// Pre-compute condition categories (static data, never changes)
export const PRECOMPUTED_CONDITION_CATEGORIES = (() => {
  const categorizeCondition = (condition: string): string => {
    const lower = condition.toLowerCase();
    for (const [category, keywords] of Object.entries(CONDITION_CATEGORY_KEYWORDS)) {
      if (keywords.some(keyword => lower.includes(keyword))) {
        return category;
      }
    }
    return 'Other';
  };

  const conditionsMap = new Map<string, string[]>();
  Object.values(personData).forEach(person => {
    const category = categorizeCondition(person.condition);
    if (!conditionsMap.has(category)) {
      conditionsMap.set(category, []);
    }
    const categoryConditions = conditionsMap.get(category)!;
    if (!categoryConditions.includes(person.condition)) {
      categoryConditions.push(person.condition);
    }
  });

  conditionsMap.forEach((conditions) => {
    conditions.sort((a, b) => a.localeCompare(b));
  });

  const categorized: Array<{ category: string; conditions: string[]; conditionSet: Set<string> }> = [];
  CATEGORY_ORDER.forEach(category => {
    if (conditionsMap.has(category)) {
      const conditions = conditionsMap.get(category)!;
      categorized.push({
        category,
        conditions,
        conditionSet: new Set(conditions)
      });
    }
  });

  return categorized;
})();

// Pre-compute countries (static data, never changes)
export const PRECOMPUTED_COUNTRIES = (() => {
  const countryMap = new Map<string, string>();
  Object.values(personData).forEach(person => {
    if (person.nationality) {
      countryMap.set(person.nationality.country, person.nationality.flag);
    }
  });
  return Array.from(countryMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([country, flag]) => ({ country, flag }));
})();
