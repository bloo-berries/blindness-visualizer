import { VisualEffect } from '../../types/visualEffects';

/**
 * Visual Disturbance Effects
 * Visual aura, visual snow, floaters, hallucinations, and related symptoms
 */
export const visualDisturbanceEffects: VisualEffect[] = [
  {
    id: 'visualAura',
    name: 'Visual Aura',
    enabled: false,
    intensity: 1.0,
    description: 'Temporary visual disturbances that can precede migraines. May include flashing lights, zigzag patterns, or blind spots. Usually lasts 20-60 minutes before the headache begins.'
  },
  {
    id: 'visualAuraLeft',
    name: 'Visual Aura (Left Side)',
    enabled: false,
    intensity: 1.0,
    description: 'Visual aura affecting only the left side of the visual field. Common in migraine with aura, where visual disturbances appear on one side before spreading.'
  },
  {
    id: 'visualAuraRight',
    name: 'Visual Aura (Right Side)',
    enabled: false,
    intensity: 1.0,
    description: 'Visual aura affecting only the right side of the visual field. Common in migraine with aura, where visual disturbances appear on one side before spreading.'
  },
  {
    id: 'visualSnow',
    name: 'Visual Snow (Static Particles)',
    enabled: false,
    intensity: 1.0,
    description: 'A persistent visual disturbance where people see tiny, static dots across their entire visual field. Similar to the static noise on an untuned television screen. This is a neurological condition that affects 2-3% of the population and remains present even with closed eyes.'
  },
  {
    id: 'visualSnowFlashing',
    name: 'Visual Snow (Flashing Static)',
    enabled: false,
    intensity: 1.0,
    description: 'A subtype of Visual Snow where the static particles appear to flash or flicker rapidly. This can be particularly distracting and may worsen in certain lighting conditions.'
  },
  {
    id: 'visualSnowColored',
    name: 'Visual Snow (Colored Static)',
    enabled: false,
    intensity: 1.0,
    description: 'Visual Snow that appears in colors rather than black and white. Common colors include blue, red, green, or other chromatic variations. This subtype can be more noticeable against certain backgrounds.'
  },
  {
    id: 'visualSnowTransparent',
    name: 'Visual Snow (Transparent Static)',
    enabled: false,
    intensity: 1.0,
    description: 'Visual Snow that appears as transparent or semi-transparent particles. This subtype may be less noticeable but can still significantly impact visual clarity and cause visual fatigue.'
  },
  {
    id: 'visualSnowDense',
    name: 'Visual Snow (Dense Static)',
    enabled: false,
    intensity: 1.0,
    description: 'A severe form of Visual Snow with high density particles that can significantly obscure vision. This subtype can be particularly debilitating and may interfere with daily activities like reading and driving.'
  },
  {
    id: 'visualFloaters',
    name: 'Visual Floaters (Myodesopsia)',
    enabled: false,
    intensity: 1.0,
    description: 'Shadows cast on the retina by debris floating in the vitreous humor. Includes cobweb/string floaters, dots/spots, ring floaters (Weiss Ring), and cloud/sheet floaters. Move with eye movement but lag behind, following fluid dynamics. Most visible against bright backgrounds, can interfere with reading and detailed tasks.'
  },
  {
    id: 'hallucinations',
    name: 'Visual Hallucinations (CBS)',
    enabled: false,
    intensity: 1.0,
    description: 'Charles Bonnet Syndrome / Release hallucinations common after stroke or traumatic brain injury. Simple hallucinations include flashes of light, geometric patterns, and colored spots. Complex hallucinations show formed images of people, animals, or objects, often appearing in areas of vision loss. Patients retain insight that these are not real.'
  },
  {
    id: 'blueFieldPhenomena',
    name: 'Blue Field Entoptic Phenomenon',
    enabled: false,
    intensity: 1.0,
    description: 'Small, fast-moving bright dots darting along random, looping trajectories on a light-blue background, best visible when looking at a bright sky texture. Motion correlates with pulse rhythm and vanishes when gaze shifts toward darker or non-uniform backgrounds.'
  },
  {
    id: 'glare',
    name: 'Glare Sensitivity',
    enabled: false,
    intensity: 1.0,
    description: 'Bloom or light-scatter effect proportional to scene luminance and eye adaptation state. Causes local veiling glare that washes out nearby details, especially after exposure to sudden brightness changes. Contrast recovery can be delayed to simulate photostress.'
  },
  {
    id: 'halos',
    name: 'Halos Around Lights',
    enabled: false,
    intensity: 1.0,
    description: 'Concentric rings or soft circular gradients around point light sources with size and intensity depending on brightness and pupil dilation. Combines with mild chromatic fringes at halo edges for realism. Halos become more intense when night mode (dilated pupil) or lens scatter conditions are active.'
  },
  {
    id: 'persistentPositiveVisualPhenomenon',
    name: 'Persistent Positive Visual Phenomenon',
    enabled: false,
    intensity: 1.0,
    description: 'Images or visual patterns that persist in the visual field after the original stimulus has been removed. Similar to an afterimage but lasting much longer. Can be simple shapes, colors, or complex patterns that remain visible for extended periods.'
  },
  {
    id: 'palinopsia',
    name: 'Palinopsia (Visual Perseveration)',
    enabled: false,
    intensity: 1.0,
    description: 'Seeing trailing images or "ghosts" of moving objects that persist after the object has moved. Moving objects leave behind a trail or afterimage that follows their path. Can be associated with migraine, medications, or neurological conditions.'
  },
  {
    id: 'trails',
    name: 'Visual Trails',
    enabled: false,
    intensity: 1.0,
    description: 'Motion blur effects where moving objects appear to leave trails behind them. Similar to palinopsia but specifically related to motion perception. Can make tracking moving objects difficult and create a "strobe light" effect with rapid movements.'
  },
  {
    id: 'starbursting',
    name: 'Starbursting',
    enabled: false,
    intensity: 1.0,
    description: 'Light sources appearing as star-like rays or spikes extending outward from the center. Creates a "sunburst" or "starburst" pattern around bright lights, especially noticeable at night. Often caused by corneal irregularities or certain eye surgeries.'
  }
];
