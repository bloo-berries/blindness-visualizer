import { VisualEffect } from '../../types/visualEffects';
import { generateColorBlindnessFilter } from './colorBlindnessFilters';
import { generateBlurFilter, generateRefractiveErrorFilters } from './blurFilters';
import { generateVisualSnowFilters, generateSymptomFilters } from './symptomFilters';
import { generateCataractsFilter, generateOcularDiseaseFilters } from './ocularFilters';
import {
  generateGalileoFilters,
  generateMonetFilters,
  generateChristineFilters,
  generateLucyFilters,
  generateDavidFilters,
  generateMarlaFilters,
  generateMinkaraFilters,
  generateJoshuaFilters,
  generateMilaFilters,
  generateJudiFilters,
  generateSugarFilters,
  generateStephenFilters,
  generateAmadouFilters,
  generateDavidBrownFilters,
  generateLexFilters,
  generateCrazzysteveFilters,
  generateTofiriFilters,
  generatePlateauFilters,
  generateEulerFilters,
  generateNemethFilters,
  generateHeatherFilters,
  generateDaredevilFilters,
  generateGeordiFilters,
  generateBlindspotFilters,
  generateJoseCidFilters,
  generateTophFilters,
  generateCustomFamousPeopleFilters
} from './famousPeopleFilters';

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
    generateGalileoFilters(effects),
    generateMonetFilters(effects),
    generateChristineFilters(effects),
    generateLucyFilters(effects),
    generateDavidFilters(effects),
    generateMarlaFilters(effects),
    generateMinkaraFilters(effects),
    generateJoshuaFilters(effects),
    generateMilaFilters(effects),
    generateJudiFilters(effects),
    generateSugarFilters(effects),
    generateStephenFilters(effects),
    generateAmadouFilters(effects),
    generateDavidBrownFilters(effects),
    generateLexFilters(effects),
    generateCrazzysteveFilters(effects),
    generateTofiriFilters(effects),
    generatePlateauFilters(effects),
    generateEulerFilters(effects),
    generateNemethFilters(effects),
    generateHeatherFilters(effects),
    generateDaredevilFilters(effects),
    generateGeordiFilters(effects),
    generateBlindspotFilters(effects),
    generateJoseCidFilters(effects),
    generateTophFilters(effects),
    generateVisualSnowFilters(effects),
    generateCustomFamousPeopleFilters(effects),
    generateOcularDiseaseFilters(effects),
    generateSymptomFilters(effects),
    generateRefractiveErrorFilters(effects)
  ].filter(Boolean);

  const finalFilter = filterComponents.join(' ');

  return finalFilter;
};

/**
 * Generates base styles for media elements
 */
export const generateBaseStyles = (): React.CSSProperties => {
  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '100%',
    maxHeight: '100%',
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  };
};
