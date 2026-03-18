/**
 * Famous People Overlays Index
 * Re-exports all person-specific overlay functions and configs
 */

import { VisualEffect } from '../../../types/visualEffects';
import { createOverlayProcessor, processOverlayConfigs } from './overlayConfig';
import { createMiltonOverlays } from './miltonOverlays';
import { galileoOverlays } from './galileoOverlays';
import { vedMehtaOverlays } from './vedMehtaOverlays';
import { createChristineHaOverlays } from './christineHaOverlays';
import { lucyEdwardsOverlays } from './lucyEdwardsOverlays';
import { davidPatersonOverlays } from './davidPatersonOverlays';
import { erikWeihenmayerOverlays } from './erikWeihenmayerOverlays';
import { marlaRunyanOverlays } from './marlaRunyanOverlays';
import { minkaraOverlays } from './minkaraOverlays';
import { joshuaMieleOverlays } from './joshuaMieleOverlays';
import { milaKunisOverlays } from './milaKunisOverlays';
import { createJudiDenchOverlays } from './judiDenchOverlays';
import { createSugarRayLeonardOverlays } from './sugarRayLeonardOverlays';
import { createStephenCurryOverlays } from './stephenCurryOverlays';
import { createAmadouBagayokoOverlays } from './amadouBagayokoOverlays';
import { createDavidBrownOverlays } from './davidBrownOverlays';
import { createLexGilletteOverlays } from './lexGilletteOverlays';
import { joseCidOverlays } from './joseCidOverlays';

// Re-export individual overlay functions and configs
export { createMiltonOverlays } from './miltonOverlays';
export { galileoOverlays } from './galileoOverlays';
export { vedMehtaOverlays } from './vedMehtaOverlays';
export { createChristineHaOverlays } from './christineHaOverlays';
export { lucyEdwardsOverlays } from './lucyEdwardsOverlays';
export { davidPatersonOverlays } from './davidPatersonOverlays';
export { erikWeihenmayerOverlays } from './erikWeihenmayerOverlays';
export { marlaRunyanOverlays } from './marlaRunyanOverlays';
export { minkaraOverlays } from './minkaraOverlays';
export { joshuaMieleOverlays } from './joshuaMieleOverlays';
export { milaKunisOverlays } from './milaKunisOverlays';
export { createJudiDenchOverlays } from './judiDenchOverlays';
export { createSugarRayLeonardOverlays } from './sugarRayLeonardOverlays';
export { createStephenCurryOverlays } from './stephenCurryOverlays';
export { createAmadouBagayokoOverlays } from './amadouBagayokoOverlays';
export { createDavidBrownOverlays } from './davidBrownOverlays';
export { createLexGilletteOverlays } from './lexGilletteOverlays';
export { joseCidOverlays } from './joseCidOverlays';

// Wrap declarative configs as processor functions for backward compatibility
export const createGalileoOverlays = createOverlayProcessor(galileoOverlays);
export const createVedMehtaOverlays = createOverlayProcessor(vedMehtaOverlays);
export const createLucyEdwardsOverlays = createOverlayProcessor(lucyEdwardsOverlays);
export const createDavidPatersonOverlays = createOverlayProcessor(davidPatersonOverlays);
export const createErikWeihenmayerOverlays = createOverlayProcessor(erikWeihenmayerOverlays);
export const createMarlaRunyanOverlays = createOverlayProcessor(marlaRunyanOverlays);
export const createMinkaraOverlays = createOverlayProcessor(minkaraOverlays);
export const createJoshuaMieleOverlays = createOverlayProcessor(joshuaMieleOverlays);
export const createMilaKunisOverlays = createOverlayProcessor(milaKunisOverlays);
export const createJoseCidOverlays = createOverlayProcessor(joseCidOverlays);

/** All declarative overlay configs combined */
const allDeclarativeConfigs = [
  ...galileoOverlays,
  ...vedMehtaOverlays,
  ...lucyEdwardsOverlays,
  ...davidPatersonOverlays,
  ...erikWeihenmayerOverlays,
  ...marlaRunyanOverlays,
  ...minkaraOverlays,
  ...joshuaMieleOverlays,
  ...milaKunisOverlays,
  ...joseCidOverlays,
];

/**
 * Creates all famous people overlays
 */
export const createAllFamousPeopleOverlays = (
  effects: Map<string, VisualEffect>,
  container?: HTMLElement
): void => {
  createMiltonOverlays(effects, container);
  createChristineHaOverlays(effects);
  createJudiDenchOverlays(effects);
  createSugarRayLeonardOverlays(effects);
  createStephenCurryOverlays(effects);
  createAmadouBagayokoOverlays(effects);
  createDavidBrownOverlays(effects);
  createLexGilletteOverlays(effects);
  processOverlayConfigs(allDeclarativeConfigs, effects, container);
};
