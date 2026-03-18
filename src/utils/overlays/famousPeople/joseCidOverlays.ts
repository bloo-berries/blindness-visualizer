import { OverlayConfig } from './overlayConfig';

/** Jose Cid - Monocular Vision (Left Eye Blindness) */
export const joseCidOverlays: OverlayConfig[] = [
  {
    effectId: 'joseCidMonocularVision',
    overlayId: 'visual-field-overlay-joseCidMonocular',
    background: i => `linear-gradient(to right,
      rgba(0,0,0,${i}) 0%, rgba(0,0,0,${i}) 45%, rgba(0,0,0,${i * 0.7}) 48%,
      rgba(0,0,0,${i * 0.4}) 50%, rgba(0,0,0,${i * 0.1}) 52%, rgba(0,0,0,0) 55%)`,
    blendMode: 'normal',
    opacity: () => '1',
  },
];
