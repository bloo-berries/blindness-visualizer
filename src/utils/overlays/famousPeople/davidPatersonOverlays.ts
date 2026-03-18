import { OverlayConfig } from './overlayConfig';

/**
 * David Paterson - Hemispheric Vision Loss
 */
export const davidPatersonOverlays: OverlayConfig[] = [
  {
    effectId: 'davidLeftEyeBlindness',
    background: i => `rgba(0,0,0,${i})`,
    blendMode: 'multiply',
    clipPath: () => 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)',
  },
  {
    effectId: 'davidRightEyeGlaucoma',
    background: i => `linear-gradient(to right, rgba(0,0,0,${i * 0.1}) 0%, rgba(255,255,200,${i * 0.18}) 50%, rgba(255,255,180,${i * 0.1}) 100%)`,
    blendMode: 'screen',
    clipPath: () => 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)',
  },
  {
    effectId: 'davidHemisphericVision',
    overlayId: 'visual-field-overlay-davidHemisphericVision-left',
    background: i => `rgba(0,0,0,${i})`,
    blendMode: 'multiply',
    clipPath: () => 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)',
  },
  {
    effectId: 'davidHemisphericVision',
    overlayId: 'visual-field-overlay-davidHemisphericVision-right',
    background: i => `linear-gradient(to right, rgba(0,0,0,${i * 0.15}) 0%, rgba(255,255,200,${i * 0.2}) 50%, rgba(255,255,180,${i * 0.15}) 100%)`,
    blendMode: 'screen',
    clipPath: () => 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)',
  },
  {
    effectId: 'davidCompleteVision',
    overlayId: 'visual-field-overlay-davidCompleteVision-left',
    background: i => `rgba(0,0,0,${i})`,
    blendMode: 'multiply',
    clipPath: () => 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)',
  },
  {
    effectId: 'davidCompleteVision',
    overlayId: 'visual-field-overlay-davidCompleteVision-right',
    background: i => `linear-gradient(to right, rgba(0,0,0,${i * 0.15}) 0%, rgba(255,255,200,${i * 0.2}) 50%, rgba(255,255,180,${i * 0.15}) 100%)`,
    blendMode: 'screen',
    clipPath: () => 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)',
  },
];
