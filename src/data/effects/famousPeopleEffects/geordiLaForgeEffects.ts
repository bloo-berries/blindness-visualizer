import { VisualEffect } from '../../../types/visualEffects';

/**
 * Geordi La Forge - VISOR Enhanced Electromagnetic Spectrum Vision
 */
export const geordiLaForgeEffects: VisualEffect[] = [
  {
    id: 'geordiVisorSenseComplete',
    name: 'Complete VISOR Sense (Geordi La Forge)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Geordi La Forge\'s VISOR-enhanced vision from Star Trek: TNG. The VISOR translates the entire electromagnetic spectrum into visual information. Features: false-color thermal/spectral palette (blues for cold, oranges for warm, magentas for high-energy), EM emission halos around electronics, edge enhancement at material boundaries, scan-line artifacts from mechanical processing, no true darkness (ambient EM renders as deep violet), and occasional overload flicker in high-energy environments. The VISOR sees far more than human eyes, but processes it differently.'
  },
  {
    id: 'geordiThermalSpectrum',
    name: 'Thermal Spectrum (Geordi)',
    enabled: false,
    intensity: 1.0,
    description: 'False-color thermal remapping. Cold/low-energy objects appear in deep blue/violet, moderate temperatures in cyan, warm objects in orange, and hot/high-energy sources in bright white/magenta. No natural greens or earth tones exist in this spectrum.'
  },
  {
    id: 'geordiEMEnhancement',
    name: 'EM Enhancement (Geordi)',
    enabled: false,
    intensity: 1.0,
    description: 'Enhanced perception of electromagnetic emissions. Electronics, power conduits, and energy sources emit visible auras or corona effects. Bright glowing outlines appear around anything electrically active. Material boundaries show spectral-shift edge detection.'
  },
  {
    id: 'geordiNoTrueDarkness',
    name: 'No True Darkness (Geordi)',
    enabled: false,
    intensity: 1.0,
    description: 'Minimum brightness floor from ambient EM radiation. Even "dark" areas render in deep blue/violet because the VISOR perceives electromagnetic radiation beyond visible light. True black never appears - there is always some EM activity to visualize.'
  },
  {
    id: 'geordiScanLines',
    name: 'VISOR Scan Lines (Geordi)',
    enabled: false,
    intensity: 1.0,
    description: 'Faint horizontal banding and scan-line artifacts suggesting mechanical processing. The VISOR translates EM data through electronic processing, creating subtle interlacing effects. A moving scan bar periodically sweeps across the visual field.'
  },
  {
    id: 'geordiOverloadFlicker',
    name: 'Sensory Overload (Geordi)',
    enabled: false,
    intensity: 1.0,
    description: 'In bright or high-energy environments, occasional sharp white flash frames or bloom spikes appear. This simulates the sensory overload and discomfort Geordi experiences - the VISOR provides incredible perception but at the cost of constant low-level pain and occasional overwhelming input.'
  }
];
