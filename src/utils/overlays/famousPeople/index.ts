/**
 * Famous People Overlays Index
 * Re-exports all person-specific overlay functions
 */

import { VisualEffect } from '../../../types/visualEffects';
import { createMiltonOverlays } from './miltonOverlays';
import { createGalileoOverlays } from './galileoOverlays';
import { createVedMehtaOverlays } from './vedMehtaOverlays';
import { createChristineHaOverlays } from './christineHaOverlays';
import { createLucyEdwardsOverlays } from './lucyEdwardsOverlays';
import { createDavidPatersonOverlays } from './davidPatersonOverlays';
import { createErikWeihenmayerOverlays } from './erikWeihenmayerOverlays';
import { createMarlaRunyanOverlays } from './marlaRunyanOverlays';
import { createMinkaraOverlays } from './minkaraOverlays';
import { createJoshuaMieleOverlays } from './joshuaMieleOverlays';
import { createMilaKunisOverlays } from './milaKunisOverlays';
import { createJudiDenchOverlays } from './judiDenchOverlays';
import { createSugarRayLeonardOverlays } from './sugarRayLeonardOverlays';
import { createStephenCurryOverlays } from './stephenCurryOverlays';
import { createAmadouBagayokoOverlays } from './amadouBagayokoOverlays';
import { createDavidBrownOverlays } from './davidBrownOverlays';
import { createLexGilletteOverlays } from './lexGilletteOverlays';
import { createJoseCidOverlays } from './joseCidOverlays';

// Re-export individual functions
export { createMiltonOverlays } from './miltonOverlays';
export { createGalileoOverlays } from './galileoOverlays';
export { createVedMehtaOverlays } from './vedMehtaOverlays';
export { createChristineHaOverlays } from './christineHaOverlays';
export { createLucyEdwardsOverlays } from './lucyEdwardsOverlays';
export { createDavidPatersonOverlays } from './davidPatersonOverlays';
export { createErikWeihenmayerOverlays } from './erikWeihenmayerOverlays';
export { createMarlaRunyanOverlays } from './marlaRunyanOverlays';
export { createMinkaraOverlays } from './minkaraOverlays';
export { createJoshuaMieleOverlays } from './joshuaMieleOverlays';
export { createMilaKunisOverlays } from './milaKunisOverlays';
export { createJudiDenchOverlays } from './judiDenchOverlays';
export { createSugarRayLeonardOverlays } from './sugarRayLeonardOverlays';
export { createStephenCurryOverlays } from './stephenCurryOverlays';
export { createAmadouBagayokoOverlays } from './amadouBagayokoOverlays';
export { createDavidBrownOverlays } from './davidBrownOverlays';
export { createLexGilletteOverlays } from './lexGilletteOverlays';
export { createJoseCidOverlays } from './joseCidOverlays';

/**
 * Creates all famous people overlays
 */
export const createAllFamousPeopleOverlays = (
  effects: Map<string, VisualEffect>,
  container?: HTMLElement
): void => {
  createMiltonOverlays(effects, container);
  createGalileoOverlays(effects);
  createVedMehtaOverlays(effects);
  createChristineHaOverlays(effects);
  createLucyEdwardsOverlays(effects);
  createDavidPatersonOverlays(effects);
  createErikWeihenmayerOverlays(effects);
  createMarlaRunyanOverlays(effects);
  createMinkaraOverlays(effects);
  createJoshuaMieleOverlays(effects);
  createMilaKunisOverlays(effects);
  createJudiDenchOverlays(effects);
  createSugarRayLeonardOverlays(effects);
  createStephenCurryOverlays(effects);
  createAmadouBagayokoOverlays(effects);
  createDavidBrownOverlays(effects);
  createLexGilletteOverlays(effects);
  createJoseCidOverlays(effects);
};
