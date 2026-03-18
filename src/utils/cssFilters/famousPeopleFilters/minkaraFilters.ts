import { CSSFilterEffectConfig } from './filterConfig';

// Dr. Mona Minkara - Combined Macular Degeneration + Cone-Rod Dystrophy Filters
export const minkaraFilterConfigs: CSSFilterEffectConfig[] = [
  {
    effectId: 'minkaraEndStageComplete',
    filters: i => [
      `contrast(${100 - i * 40}%)`,
      `brightness(${100 - i * 30}%)`,
      `saturate(0%)`,
      `blur(${i * 5}px)`,
    ],
  },
  {
    effectId: 'minkaraCentralScotoma',
    filters: i => [
      `contrast(${100 - i * 50}%)`,
      `brightness(${100 - i * 40}%)`,
    ],
  },
  {
    effectId: 'minkaraRingScotoma',
    filters: i => [
      `contrast(${100 - i * 30}%)`,
      `brightness(${100 - i * 20}%)`,
    ],
  },
  {
    effectId: 'minkaraPeripheralIslands',
    filters: i => [
      `contrast(${100 - i * 60}%)`,
      `brightness(${100 - i * 50}%)`,
    ],
  },
  {
    effectId: 'minkaraPhotophobia',
    filters: i => [
      `brightness(${100 + i * 200}%)`,
      `contrast(${100 + i * 300}%)`,
      `blur(${i * 10}px)`,
    ],
  },
  {
    effectId: 'minkaraAchromatopsia',
    filters: i => [
      `saturate(0%)`,
      `contrast(${100 - i * 20}%)`,
    ],
  },
  {
    effectId: 'minkaraNightBlindness',
    filters: i => [
      `brightness(${100 - i * 80}%)`,
      `contrast(${100 - i * 60}%)`,
    ],
  },
  {
    effectId: 'minkaraChemistryMode',
    filters: i => [
      `contrast(${100 + i * 20}%)`,
      `brightness(${100 + i * 10}%)`,
    ],
  },
];
