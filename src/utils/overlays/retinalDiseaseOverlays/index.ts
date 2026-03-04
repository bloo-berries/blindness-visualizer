import { VisualEffect } from '../../../types/visualEffects';

import { createGlaucomaOverlay } from './glaucomaOverlay';
import { createAmdOverlay } from './amdOverlay';
import { createDiabeticRetinopathyOverlay } from './diabeticRetinopathyOverlay';
import { createStargardtOverlay } from './stargardtOverlay';
import { createRetinitisPigmentosaOverlay } from './retinitisPigmentosaOverlay';
import { createRetinalDetachmentOverlay } from './retinalDetachmentOverlay';
import { createVitreousHemorrhageOverlay } from './vitreousHemorrhageOverlay';

/**
 * Creates overlays for retinal disease conditions
 * Includes: glaucoma, AMD, diabetic retinopathy, stargardt, retinitis pigmentosa,
 * retinal detachment, vitreous hemorrhage
 */
export const createRetinalDiseaseOverlays = (
  effects: Map<string, VisualEffect>,
  container?: HTMLElement
): void => {
  const getEffect = (id: string) => effects.get(id);

  createGlaucomaOverlay(getEffect('glaucoma'), container);
  createStargardtOverlay(getEffect('stargardt'), container);
  createAmdOverlay(getEffect('amd'), container);
  createDiabeticRetinopathyOverlay(getEffect('diabeticRetinopathy'), container);
  createRetinalDetachmentOverlay(getEffect('retinalDetachment'), container);
  createRetinitisPigmentosaOverlay(getEffect('retinitisPigmentosa'), container);
  createVitreousHemorrhageOverlay(getEffect('vitreousHemorrhage'), container);
};
