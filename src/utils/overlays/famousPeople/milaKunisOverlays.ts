import { OverlayConfig } from './overlayConfig';

/**
 * Mila Kunis - Mild iritis and cataracts
 *
 * Her condition is very mild - chronic iritis that caused cataracts in her left eye.
 * After treatment, she can see the vast majority of her environment clearly.
 * Effects should be subtle: slight light sensitivity and minimal haziness.
 */
export const milaKunisOverlays: OverlayConfig[] = [
  {
    effectId: 'milaCompleteVision',
    background: i => [
      `radial-gradient(circle at 50% 30%,`,
      `  rgba(255,255,255,${i * 0.08}) 0%,`,
      `  rgba(255,255,255,${i * 0.04}) 20%,`,
      `  transparent 50%`,
      `),`,
      `radial-gradient(circle at 30% 25%,`,
      `  rgba(255,255,255,${i * 0.06}) 0%,`,
      `  rgba(255,255,255,${i * 0.03}) 15%,`,
      `  transparent 40%`,
      `),`,
      `radial-gradient(circle at 70% 35%,`,
      `  rgba(255,255,255,${i * 0.05}) 0%,`,
      `  rgba(255,255,255,${i * 0.02}) 18%,`,
      `  transparent 45%`,
      `)`,
    ].join('\n'),
    blendMode: 'screen',
    opacity: i => Math.min(0.4, 0.2 + i * 0.2).toString(),
  },
  {
    effectId: 'milaMildIritis',
    background: i => [
      `radial-gradient(circle at 50% 25%,`,
      `  rgba(255,255,255,${i * 0.10}) 0%,`,
      `  rgba(255,255,255,${i * 0.05}) 15%,`,
      `  transparent 40%`,
      `),`,
      `radial-gradient(circle at 25% 30%,`,
      `  rgba(255,255,255,${i * 0.07}) 0%,`,
      `  transparent 30%`,
      `),`,
      `radial-gradient(circle at 75% 28%,`,
      `  rgba(255,255,255,${i * 0.07}) 0%,`,
      `  transparent 32%`,
      `)`,
    ].join('\n'),
    blendMode: 'screen',
    opacity: i => Math.min(0.35, 0.15 + i * 0.20).toString(),
  },
  {
    effectId: 'milaMildCataracts',
    background: i => [
      `radial-gradient(ellipse 150% 150% at 50% 50%,`,
      `  rgba(255,255,255,${i * 0.06}) 0%,`,
      `  rgba(255,255,255,${i * 0.04}) 40%,`,
      `  rgba(255,255,255,${i * 0.02}) 70%,`,
      `  transparent 100%`,
      `)`,
    ].join('\n'),
    blendMode: 'screen',
    opacity: i => Math.min(0.30, 0.10 + i * 0.20).toString(),
  },
];
