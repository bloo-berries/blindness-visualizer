import { VisualEffect } from '../../types/visualEffects';
import { generateColorBlindnessFilter } from './colorBlindnessFilters';
import { generateBlurFilter, generateRefractiveErrorFilters } from './blurFilters';
import { generateVisualSnowFilters, generateSymptomFilters } from './symptomFilters';
import { generateCataractsFilter, generateOcularDiseaseFilters } from './ocularFilters';
import { processCSSFilterConfigs } from './famousPeopleFilters/filterConfig';
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
  generateAmadouFilters,
  generateDavidBrownFilters,
  generateLexFilters,
  crazzysteveFilterConfigs,
  tofiriFilterConfigs,
  plateauFilterConfigs,
  eulerFilterConfigs,
  nemethFilterConfigs,
  heatherFilterConfigs,
  daredevilFilterConfigs,
  geordiFilterConfigs,
  blindspotFilterConfigs,
  joseCidFilterConfigs,
  tophFilterConfigs,
  customFamousPeopleFilterConfigs,
  davidFilterConfigs,
  marlaFilterConfigs,
  anselmoFilterConfigs,
  margaritaFilterConfigs,
  fujitoraFilterConfigs,
  chirrutFilterConfigs,
  juliaCarpenterFilterConfigs
} from './famousPeopleFilters';

/** All declarative filter configs combined for batch processing */
const allFilterConfigs = [
  ...galileoFilterConfigs,
  ...monetFilterConfigs,
  ...christineFilterConfigs,
  ...lucyFilterConfigs,
  ...minkaraFilterConfigs,
  ...joshuaFilterConfigs,
  ...milaFilterConfigs,
  ...judiFilterConfigs,
  ...sugarFilterConfigs,
  ...stephenFilterConfigs,
  ...crazzysteveFilterConfigs,
  ...heatherFilterConfigs,
  ...daredevilFilterConfigs,
  ...geordiFilterConfigs,
  ...blindspotFilterConfigs,
  ...tophFilterConfigs,
  ...anselmoFilterConfigs,
  ...joseCidFilterConfigs,
  ...margaritaFilterConfigs,
  ...fujitoraFilterConfigs,
  ...chirrutFilterConfigs,
  ...juliaCarpenterFilterConfigs,
  ...tofiriFilterConfigs,
  ...plateauFilterConfigs,
  ...eulerFilterConfigs,
  ...nemethFilterConfigs,
  ...customFamousPeopleFilterConfigs,
  ...davidFilterConfigs,
  ...marlaFilterConfigs,
];

/**
 * Generates filter for complete blindness (total darkness)
 */
const generateCompleteBlindnessFilter = (effects: VisualEffect[]): string => {
  const completeBlindness = effects.find(e => e.id === 'completeBlindness' && e.enabled);
  if (completeBlindness) {
    // Complete blindness = total darkness (brightness 0)
    return 'brightness(0)';
  }
  return '';
};

/**
 * Generates complete CSS filter string for all effects
 */
export const generateCSSFilters = (effects: VisualEffect[], diplopiaSeparation: number = 1.0, diplopiaDirection: number = 0.0): string => {
  const enabledEffects = effects.filter(e => e.enabled);

  if (enabledEffects.length === 0) {
    return '';
  }

  // Check for complete blindness first - if enabled, return only that filter
  const completeBlindnessFilter = generateCompleteBlindnessFilter(effects);
  if (completeBlindnessFilter) {
    return completeBlindnessFilter;
  }

  // Check if vitreousHemorrhage is enabled - if so, skip cataracts filter to avoid conflicts
  const hasVitreousHemorrhage = enabledEffects.some(e => e.id === 'vitreousHemorrhage');

  const filterComponents = [
    generateColorBlindnessFilter(effects),
    generateBlurFilter(effects),
    // Only apply cataracts filter if vitreousHemorrhage is NOT enabled (to avoid yellow/brown tint conflict)
    ...(hasVitreousHemorrhage ? [] : [generateCataractsFilter(effects)]),
    generateAmadouFilters(effects),
    generateDavidBrownFilters(effects),
    generateLexFilters(effects),
    generateVisualSnowFilters(effects),
    generateOcularDiseaseFilters(effects),
    generateSymptomFilters(effects),
    generateRefractiveErrorFilters(effects),
    processCSSFilterConfigs(allFilterConfigs, effects)
  ].filter(Boolean);

  const finalFilter = filterComponents.join(' ');

  return finalFilter;
};
