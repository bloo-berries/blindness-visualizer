import { VisualEffect } from '../../types/visualEffects';

/**
 * Famous People Effects
 * Specific visualizations for notable blind individuals
 */
export const famousPeopleEffects: VisualEffect[] = [
  // John Milton - Bilateral Retinal Detachment and Secondary Glaucoma
  {
    id: 'miltonGlaucomaHalos',
    name: 'Glaucoma Rainbow Halos (Milton)',
    enabled: false,
    intensity: 1.0,
    description: 'Prismatic rings of color around light sources (red on outside, violet inside) caused by corneal swelling from glaucoma. Classic symptom of acute angle-closure glaucoma with corneal edema.'
  },
  {
    id: 'miltonProgressiveVignetting',
    name: 'Progressive Vignetting (Milton)',
    enabled: false,
    intensity: 1.0,
    description: 'Progressive darkening from the edges inward, simulating the tunnel vision that develops as peripheral vision is lost. Represents the 7-year progression from age 36 to complete blindness at 43.'
  },
  {
    id: 'miltonScotomas',
    name: 'Progressive Scotomas (Milton)',
    enabled: false,
    intensity: 1.0,
    description: 'Blind spots or dark patches appearing randomly in the visual field. Represents the irregular vision loss patterns from retinal detachment and glaucoma progression.'
  },
  {
    id: 'miltonRetinalDetachment',
    name: 'Retinal Detachment Shadows (Milton)',
    enabled: false,
    intensity: 1.0,
    description: 'Dark shadows or curtains descending from top or sides, representing the retinal detachment that contributed to Milton\'s vision loss. Includes wavy/distorted vision (metamorphopsia).'
  },
  {
    id: 'miltonPhotophobia',
    name: 'Extreme Photophobia (Milton)',
    enabled: false,
    intensity: 1.0,
    description: 'Extreme light sensitivity causing pain and discomfort in normal lighting. Simulates the photophobia that made normal lighting conditions unbearable for Milton.'
  },
  {
    id: 'miltonTemporalFieldLoss',
    name: 'Temporal Field Loss (Milton)',
    enabled: false,
    intensity: 1.0,
    description: 'Vision loss starting from the outer sides (temples) moving inward - like black curtains slowly closing from the periphery. Represents the early stage of Milton\'s glaucoma progression.'
  },
  {
    id: 'miltonProgressiveBlindness',
    name: 'Progressive Blindness (Milton)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Milton\'s 7-year progression from partial vision at age 36 to complete blindness at 43. Combines all symptoms with increasing severity over time.'
  },
  {
    id: 'completeBlindness',
    name: 'Complete Blindness (No Light Perception)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete absence of light perception - total darkness. Represents conditions like Louis Braille\'s sympathetic ophthalmia, where there is no visual input whatsoever. The person experiences complete blackness with no ability to detect light, shapes, or movement.'
  },

  // Galileo Galilei - Acute Angle-Closure Glaucoma
  {
    id: 'galileoAcuteHalos',
    name: 'Acute Glaucoma Halos (Galileo)',
    enabled: false,
    intensity: 1.0,
    description: 'Intense, vivid prismatic rings around ALL light sources during acute angle-closure glaucoma attacks. Much more pronounced than chronic glaucoma, with pulsating/breathing effects. Red on outside, violet inside, caused by severe corneal edema.'
  },
  {
    id: 'galileoSevereBlurring',
    name: 'Severe Blurring (Galileo)',
    enabled: false,
    intensity: 1.0,
    description: 'Sudden dramatic drop in visual acuity during acute attacks, like looking through heavy fog. Visual acuity can drop from 20/20 to 20/200 within minutes during an acute episode.'
  },
  {
    id: 'galileoRedEyeEffect',
    name: 'Red Eye Effect (Galileo)',
    enabled: false,
    intensity: 1.0,
    description: 'Reddish tint to vision from conjunctival injection during acute glaucoma attacks. The eye becomes severely inflamed and bloodshot, affecting color perception.'
  },
  {
    id: 'galileoExtremePhotophobia',
    name: 'Extreme Photophobia (Galileo)',
    enabled: false,
    intensity: 1.0,
    description: 'Unbearable light sensitivity during acute attacks - even dim lights cause severe pain and discomfort. Normal lighting becomes excruciating and causes white-out effects.'
  },
  {
    id: 'galileoCornealHaziness',
    name: 'Corneal Haziness (Galileo)',
    enabled: false,
    intensity: 1.0,
    description: 'Milky white veil over entire visual field from severe corneal edema during acute attacks. Creates a foggy, clouded appearance that obscures all details.'
  },
  {
    id: 'galileoSectoralDefects',
    name: 'Sectoral Defects (Galileo)',
    enabled: false,
    intensity: 1.0,
    description: 'Wedge-shaped blind spots typically starting superior-nasal (upper nose-side) after acute attacks. Each attack leaves permanent sectoral damage that never fully recovers.'
  },
  {
    id: 'galileoArcuateScotomas',
    name: 'Arcuate Scotomas (Galileo)',
    enabled: false,
    intensity: 1.0,
    description: 'Curved blind areas following nerve fiber patterns, creating arc-shaped defects in the visual field. These develop after multiple acute attacks and follow the anatomical structure of the optic nerve.'
  },
  {
    id: 'galileoSwissCheeseVision',
    name: 'Swiss Cheese Vision (Galileo)',
    enabled: false,
    intensity: 1.0,
    description: 'Multiple patchy blind spots throughout the visual field after multiple acute attacks. Creates irregular, scattered vision loss with islands of preserved vision surrounded by blind areas.'
  },
  {
    id: 'galileoAcuteAttackMode',
    name: 'Acute Attack Mode (Galileo)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of an acute angle-closure glaucoma attack with sudden onset. Combines intense halos, severe blurring, red eye effect, extreme photophobia, and corneal haziness in a dramatic, episodic presentation.'
  },
  {
    id: 'galileoChronicProgression',
    name: 'Chronic Progression (Galileo)',
    enabled: false,
    intensity: 1.0,
    description: 'Progressive deterioration pattern showing cumulative damage from multiple acute attacks. Features stepped rather than smooth deterioration with sectoral defects, arcuate scotomas, and eventual severe tunnel vision.'
  },

  // Claude Monet - Cataracts
  {
    id: 'monetCataractsFog',
    name: 'Cataracts Fog Effect (Monet)',
    enabled: false,
    intensity: 1.0,
    description: 'The characteristic "fog" effect that Monet described seeing through. Creates a cloudy, hazy overlay that reduces visual clarity and contrast, simulating the clouding of the eye\'s natural lens.'
  },
  {
    id: 'monetColorDistortion',
    name: 'Color Distortion (Monet)',
    enabled: false,
    intensity: 1.0,
    description: 'Dramatic alteration of color perception where cool colors (blue, purple) become difficult to distinguish while warm tones (red, yellow, orange) are accentuated. Represents the yellowing and filtering effect of cataracts on color vision.'
  },
  {
    id: 'monetProgressiveLoss',
    name: 'Progressive Vision Loss (Monet)',
    enabled: false,
    intensity: 1.0,
    description: 'Simulates Monet\'s progressive vision deterioration from his 60s to his 80s, showing the gradual worsening of visual acuity and contrast sensitivity that led to legal blindness in his right eye and only 10% vision in his left.'
  },
  {
    id: 'monetCataractsProgression',
    name: 'Complete Cataracts Progression (Monet)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Monet\'s cataracts experience combining fog effects, color distortion, and progressive vision loss. Represents his journey from initial symptoms in his 60s to severe impairment by 1922.'
  },

  // Ved Mehta - Complete Blindness from Meningitis
  {
    id: 'vedCompleteBlindness',
    name: 'Complete Blindness (Ved Mehta)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete absence of light perception - total darkness. Represents Ved Mehta\'s experience after meningitis at age 3, with no visual input whatsoever. The person experiences complete blackness with no ability to detect light, shapes, or movement.'
  },
  {
    id: 'vedSpatialAwareness',
    name: 'Spatial Awareness System (Ved Mehta)',
    enabled: false,
    intensity: 1.0,
    description: 'Non-visual spatial representation system showing abstract indicators for navigation. Includes sound source indicators, proximity sensors, air flow patterns, and temperature mapping to represent how Ved developed exceptional spatial awareness without vision.'
  },
  {
    id: 'vedEchoLocation',
    name: 'Echo Location Patterns (Ved Mehta)',
    enabled: false,
    intensity: 1.0,
    description: 'Visualization of echo/reverb patterns that Ved used for navigation. Shows sound wave reflections and acoustic feedback patterns that helped him understand spatial relationships and object locations through echolocation.'
  },
  {
    id: 'vedAirFlowSensors',
    name: 'Air Flow Sensors (Ved Mehta)',
    enabled: false,
    intensity: 1.0,
    description: 'Air current and pressure indicators showing how Ved perceived air flow patterns for navigation. Represents his ability to sense air movement, pressure changes, and spatial boundaries through air current perception.'
  },
  {
    id: 'vedProximityRadar',
    name: 'Proximity Radar (Ved Mehta)',
    enabled: false,
    intensity: 1.0,
    description: 'Radar-like proximity indicators showing object detection and distance sensing. Represents Ved\'s exceptional ability to detect objects, people, and spatial boundaries through non-visual means like sound reflection and air pressure changes.'
  },
  {
    id: 'vedTemperatureMapping',
    name: 'Temperature Mapping (Ved Mehta)',
    enabled: false,
    intensity: 1.0,
    description: 'Temperature gradient visualization showing how Ved perceived thermal information for spatial awareness. Represents his ability to sense temperature variations, heat sources, and spatial boundaries through thermal perception.'
  },

  // Christine Ha - Neuromyelitis Optica (NMO)
  {
    id: 'christineNMOBlur',
    name: 'NMO Extreme Blur (Christine Ha)',
    enabled: false,
    intensity: 1.0,
    description: 'Extreme Gaussian blur representing the severe vision loss from NMO optic neuritis. Uniform blur across entire visual field with no focal point, simulating 20/1000+ vision where even high contrast edges are completely softened.'
  },
  {
    id: 'christineSteamyMirror',
    name: 'Steamy Mirror Effect (Christine Ha)',
    enabled: false,
    intensity: 1.0,
    description: 'The characteristic "steamy mirror" effect that Christine describes - like looking through a bathroom mirror completely fogged with condensation. Creates an impenetrable fog over everything with no clear zones.'
  },
  {
    id: 'christineLightScatter',
    name: 'Light Scatter & Halos (Christine Ha)',
    enabled: false,
    intensity: 1.0,
    description: 'Light scatter effects where bright lights create large, soft halos and extensive blooming. Represents how Christine can detect light sources and windows but with severe light scatter and no sharp shadows.'
  },
  {
    id: 'christineFogOverlay',
    name: 'Animated Fog Overlay (Christine Ha)',
    enabled: false,
    intensity: 1.0,
    description: 'Animated fog/steam overlay that shifts and moves like real steam. Creates uneven visibility with denser areas and represents the wavering distortion effect of looking through water.'
  },
  {
    id: 'christineFluctuatingVision',
    name: 'Fluctuating Vision (Christine Ha)',
    enabled: false,
    intensity: 1.0,
    description: 'Simulates the day-to-day variation and heat sensitivity (Uhthoff\'s phenomenon) of NMO. Vision fluctuates with subtle wavering and swimming effects, worse with exertion and throughout the day.'
  },
  {
    id: 'christineNMOComplete',
    name: 'Complete NMO Experience (Christine Ha)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Christine Ha\'s NMO experience combining extreme blur, steamy mirror effect, light scatter, fog overlay, and fluctuating vision. Represents her 20/1000+ vision with 10-12 inch functional range.'
  },

  // Lucy Edwards - Incontinentia Pigmenti
  {
    id: 'lucyFrostedGlass',
    name: 'Frosted Glass Effect (Lucy Edwards)',
    enabled: false,
    intensity: 1.0,
    description: 'Thick frosted glass effect creating severe visual obstruction where all specific information, detail, and clarity are entirely lost. Represents the profound visual impairment from incontinentia pigmenti with no ability to resolve objects or textures.'
  },
  {
    id: 'lucyHeavyBlur',
    name: 'Heavy Blur (Lucy Edwards)',
    enabled: false,
    intensity: 1.0,
    description: 'Extremely heavy blur creating a uniform, intensely blurred visual field with no sharp edges or clear forms. Everything appears as if viewed through a very thick, opaque medium with severe reduction in clarity and contrast.'
  },
  {
    id: 'lucyDesaturation',
    name: 'Severe Desaturation (Lucy Edwards)',
    enabled: false,
    intensity: 1.0,
    description: 'Severe color desaturation where colors lack vibrancy and appear muted. Creates a monochromatic appearance with stark contrasts between black, white, and pale grey, with faint hints of desaturated colors.'
  },
  {
    id: 'lucyLightDiffusion',
    name: 'Light Diffusion (Lucy Edwards)',
    enabled: false,
    intensity: 1.0,
    description: 'Heavy light scatter and diffusion where light appears heavily scattered and unfocused. Light areas bleed into dark areas through gradual, blurry transitions with no sharp highlights or defined shadows.'
  },
  {
    id: 'lucyTextureOverlay',
    name: 'Frosted Texture Overlay (Lucy Edwards)',
    enabled: false,
    intensity: 1.0,
    description: 'Frosted glass texture overlay creating amorphous, blob-like shapes that are completely devoid of detail. Represents highly distorted objects and diffused light sources scattered irregularly.'
  },
  {
    id: 'lucyCompleteVision',
    name: 'Complete Vision (Lucy Edwards)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Lucy Edwards\' vision with incontinentia pigmenti. Combines frosted glass effect, heavy blur, severe desaturation, light diffusion, and texture overlay. Represents vision limited to broad, indistinct masses of color and light.'
  },

  // David Paterson - Hemispheric Vision Loss
  {
    id: 'davidLeftEyeBlindness',
    name: 'Left Eye Blindness (David Paterson)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete blindness in the left eye from optic nerve damage caused by ear infection at 3 months old. Creates complete blackness in the left hemisphere of vision, representing total loss of visual input from the left eye.'
  },
  {
    id: 'davidRightEyeGlaucoma',
    name: 'Right Eye Glaucoma (David Paterson)',
    enabled: false,
    intensity: 1.0,
    description: 'Glaucoma affecting the right eye, causing peripheral vision loss and tunnel vision. Creates a circular tunnel effect in the right hemisphere with severe peripheral darkening, representing the characteristic "tunnel vision" of advanced glaucoma.'
  },
  {
    id: 'davidHemisphericVision',
    name: 'Hemispheric Vision Loss (David Paterson)',
    enabled: false,
    intensity: 1.0,
    description: 'Combined effect showing left eye complete blindness and right eye glaucoma. Creates a unique hemispheric vision loss where the left side is completely black and the right side shows tunnel vision with peripheral darkening.'
  },
  {
    id: 'davidCompleteVision',
    name: 'Complete Vision (David Paterson)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of David Paterson\'s vision combining left eye blindness and right eye glaucoma. Represents his unique visual experience with complete left hemisphere blindness and right hemisphere tunnel vision from glaucoma.'
  },

  // Erik Weihenmayer - Retinoschisis
  {
    id: 'erikRetinoschisisIslands',
    name: 'Retinoschisis Islands (Erik Weihenmayer)',
    enabled: false,
    intensity: 1.0,
    description: 'Random, irregular "islands" of vision scattered across the visual field with sharp boundaries. Each island has independent clarity, color saturation, and brightness. Represents the unique fragmenting pattern of retinoschisis where vision breaks into disconnected pieces rather than gradual loss.'
  },
  {
    id: 'erikIslandFragmentation',
    name: 'Island Fragmentation (Erik Weihenmayer)',
    enabled: false,
    intensity: 1.0,
    description: 'Progressive fragmentation where islands become smaller, more scattered, and less clear over time. Simulates the "lights being turned off in different rooms" effect that Erik described, with sharp edges between seeing and blind areas.'
  },
  {
    id: 'erikProgressiveLoss',
    name: 'Progressive Island Loss (Erik Weihenmayer)',
    enabled: false,
    intensity: 1.0,
    description: 'Simulates the progression from multiple islands to fewer islands to complete blindness. Shows how Erik\'s vision deteriorated from scattered fragments to complete darkness by age 13, with each island disappearing independently.'
  },
  {
    id: 'erikCompleteBlindness',
    name: 'Complete Blindness (Erik Weihenmayer)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete vision loss with no light perception - total darkness. Represents Erik\'s current state since age 13, where all islands have disappeared and he relies entirely on spatial/tactile navigation, echolocation, and mental mapping.'
  },
  {
    id: 'erikScanningBehavior',
    name: 'Scanning Behavior (Erik Weihenmayer)',
    enabled: false,
    intensity: 1.0,
    description: 'Simulates the constant head and eye scanning required to find remaining islands of vision. User must actively search to locate scattered fragments, representing the cognitive effort of assembling partial visual information.'
  },
  {
    id: 'erikCognitiveLoad',
    name: 'Cognitive Load (Erik Weihenmayer)',
    enabled: false,
    intensity: 1.0,
    description: 'Represents the mental effort required to piece together information from scattered islands. Shows how incomplete visual data creates cognitive burden and requires constant mental mapping to understand spatial relationships.'
  },

  // Marla Runyan - Stargardt Disease
  {
    id: 'marlaCentralScotoma',
    name: 'Central Scotoma (Marla Runyan)',
    enabled: false,
    intensity: 1.0,
    description: 'Large central blind spot (20-30 degrees) caused by Stargardt macular degeneration. Creates a gray void in the center where objects disappear when looked at directly. Not black but a "gray fog" or "nothingness" that makes faces blank and objects vanish.'
  },
  {
    id: 'marlaPeripheralVision',
    name: 'Preserved Peripheral Vision (Marla Runyan)',
    enabled: false,
    intensity: 1.0,
    description: 'Clear peripheral vision starting at 15-20 degrees from center. Excellent motion detection, navigation, and contrast detection in periphery. Represents the paradox of Stargardt - excellent vision everywhere except where you\'re looking.'
  },
  {
    id: 'marlaEccentricViewing',
    name: 'Eccentric Viewing (Marla Runyan)',
    enabled: false,
    intensity: 1.0,
    description: 'Simulates the need to look 10-15 degrees to the side of what you want to see. Shows how Marla must use a "preferred retinal locus" (PRL) and fight the instinct to look directly at objects, which would make them disappear.'
  },
  {
    id: 'marlaFillingIn',
    name: 'Filling-In Phenomenon (Marla Runyan)',
    enabled: false,
    intensity: 1.0,
    description: 'Brain\'s attempt to "fill" the blind spot with surrounding patterns, creating false continuity across the scotoma. Straight lines appear to continue through the blind spot, and the brain tries to complete missing information.'
  },
  {
    id: 'marlaCrowdingEffect',
    name: 'Crowding Effect (Marla Runyan)',
    enabled: false,
    intensity: 1.0,
    description: 'Text and objects in near-periphery appear jumbled and merge together even if technically visible. Letters crowd together and spacing must be increased for recognition. Represents the difficulty of reading with peripheral vision.'
  },
  {
    id: 'marlaStargardtComplete',
    name: 'End-Stage Stargardt Disease (Marla Runyan)',
    enabled: false,
    intensity: 1.0,
    description: 'TRUE END-STAGE simulation of Marla Runyan\'s Stargardt disease with MASSIVE central scotoma (30-40 degrees), severe gray void in center, minimal brain filling-in, and preserved peripheral vision. Represents the most severe form where faces disappear when looked at directly, but peripheral motion detection remains excellent for athletic navigation.'
  },

  // Dr. Mona Minkara - Combined Macular Degeneration + Cone-Rod Dystrophy
  {
    id: 'minkaraEndStageComplete',
    name: 'End-Stage Combined Vision Loss (Dr. Mona Minkara)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Dr. Mona Minkara\'s end-stage vision combining macular degeneration and cone-rod dystrophy. Features massive central scotoma (35+ degrees), ring scotoma, minimal peripheral crescents, extreme photophobia, complete achromatopsia, and severe night blindness. Represents near-total vision loss affecting both central and peripheral vision.'
  },
  {
    id: 'minkaraCentralScotoma',
    name: 'Massive Central Scotoma (Dr. Mona Minkara)',
    enabled: false,
    intensity: 1.0,
    description: 'Large central blind spot (35+ degrees) from macular degeneration. Complete blindness in center where faces and details disappear. Represents the primary visual field loss that affects reading, face recognition, and detailed tasks.'
  },
  {
    id: 'minkaraRingScotoma',
    name: 'Ring Scotoma (Dr. Mona Minkara)',
    enabled: false,
    intensity: 1.0,
    description: 'Blind ring around the central scotoma creating a "donut" pattern. Partial blindness in the 15-25 degree ring around the central blind spot. Represents the expanding macular degeneration affecting the parafoveal region.'
  },
  {
    id: 'minkaraPeripheralIslands',
    name: 'Peripheral Vision Islands (Dr. Mona Minkara)',
    enabled: false,
    intensity: 1.0,
    description: 'Small, scattered islands of limited vision in the far periphery. Only motion detection and light perception remain. Represents the cone-rod dystrophy affecting peripheral photoreceptors, leaving only tiny functional areas.'
  },
  {
    id: 'minkaraPhotophobia',
    name: 'Extreme Photophobia (Dr. Mona Minkara)',
    enabled: false,
    intensity: 1.0,
    description: 'Painful light sensitivity with overwhelming glare and bloom effects. Bright areas create massive white-out with extreme contrast. Represents the cone dysfunction causing severe photophobia while paradoxically needing light to see.'
  },
  {
    id: 'minkaraAchromatopsia',
    name: 'Complete Achromatopsia (Dr. Mona Minkara)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete loss of color vision - everything appears in grayscale. No color perception whatsoever due to cone cell death. Represents the cone-rod dystrophy destroying all color-detecting photoreceptors.'
  },
  {
    id: 'minkaraNightBlindness',
    name: 'Severe Night Blindness (Dr. Mona Minkara)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete inability to see in dim light due to rod cell death. Cannot navigate in low light conditions. Represents the cone-rod dystrophy destroying rod photoreceptors responsible for night vision and peripheral detection.'
  },
  {
    id: 'minkaraProgressiveTimeline',
    name: 'Progressive Timeline (Dr. Mona Minkara)',
    enabled: false,
    intensity: 1.0,
    description: 'Interactive timeline showing the progression from early childhood photophobia to end-stage near-total blindness. Demonstrates how the combined conditions create a unique deterioration pattern affecting both central and peripheral vision.'
  },
  {
    id: 'minkaraChemistryMode',
    name: 'Chemistry Lab Mode (Dr. Mona Minkara)',
    enabled: false,
    intensity: 1.0,
    description: 'Special mode showing how Dr. Minkara conducts chemistry research without vision. Includes sonification overlays, tactile model indicators, and auditory feedback systems. Demonstrates alternative sensing methods for scientific research.'
  },

  // Joshua Miele - Chemical Burn Complete Blindness
  {
    id: 'joshuaCompleteBlindness',
    name: 'Complete Blindness (Joshua Miele)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete bilateral blindness from chemical burns at age 4. No light perception whatsoever due to severe corneal scarring and tissue destruction. Represents the most severe form of vision loss with no visual input of any kind.'
  },
  {
    id: 'joshuaEcholocation',
    name: 'Echolocation Navigation (Joshua Miele)',
    enabled: false,
    intensity: 1.0,
    description: 'Radar-like visualization showing how Joshua uses echolocation for spatial awareness. Displays sound pulse returns, distance measurements, and material detection. Shows how he "sees" his environment through sound reflection patterns.'
  },
  {
    id: 'joshuaTactileMaps',
    name: 'Tactile Map System (Joshua Miele)',
    enabled: false,
    intensity: 1.0,
    description: 'Visualization of Joshua\'s innovative tactile map system. Shows raised-line graphics, braille labels, and touch-based navigation aids. Demonstrates how he creates and uses tactile representations of spatial information.'
  },
  {
    id: 'joshuaAudioLandscape',
    name: 'Audio Landscape (Joshua Miele)',
    enabled: false,
    intensity: 1.0,
    description: '3D audio environment showing how Joshua perceives his surroundings through sound. Displays directional audio sources, distance cues, and environmental audio mapping. Shows the rich auditory world that replaces visual input.'
  },
  {
    id: 'joshuaAccessibilityMode',
    name: 'Accessibility Interface (Joshua Miele)',
    enabled: false,
    intensity: 1.0,
    description: 'Screen reader and braille display visualization showing how Joshua accesses digital information. Displays JAWS/NVDA output, refreshable braille, and keyboard navigation. Demonstrates information equality through alternative formats.'
  },
  {
    id: 'joshuaSonification',
    name: 'Data Sonification (Joshua Miele)',
    enabled: false,
    intensity: 1.0,
    description: 'Visualization of how Joshua converts visual data into sound patterns. Shows pitch mapping for height, volume for intensity, and temporal patterns for spatial data. Demonstrates his innovative approach to accessible data visualization.'
  },

  // Custom Famous People Visualizations
  {
    id: 'helenKellerBlindness',
    name: 'Complete Blindness (Helen Keller)',
    enabled: false,
    intensity: 1.0,
    description: 'Total blindness from age 19 months due to illness (likely scarlet fever or meningitis). Complete black overlay representing no light perception whatsoever.'
  },
  {
    id: 'johnMiltonBlindness',
    name: 'Progressive Blindness (John Milton)',
    enabled: false,
    intensity: 1.0,
    description: 'Gradual deterioration to complete blindness in adulthood. Very dark gray overlay representing the progressive nature of his vision loss.'
  },
  {
    id: 'louisBrailleBlindness',
    name: 'Sympathetic Ophthalmia (Louis Braille)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete blindness from age 5 due to sympathetic ophthalmia following an eye injury with an awl. Total darkness overlay.'
  },
  {
    id: 'erikWeihenmayerRetinoschisis',
    name: 'Retinoschisis (Erik Weihenmayer)',
    enabled: false,
    intensity: 1.0,
    description: 'Progressive tunnel vision effect leading to complete blindness by age 13. X-linked juvenile retinoschisis causing degenerative splitting of retinal layers.'
  },
  {
    id: 'marlaRunyanStargardt',
    name: 'Stargardt Disease (Marla Runyan)',
    enabled: false,
    intensity: 1.0,
    description: 'Advanced "donut vision" with central scotoma (20-30° diameter gray void) and preserved peripheral vision. Features eccentric viewing requirements, filling-in phenomenon, and enhanced motion detection in periphery. Visual acuity: 20/300 centrally, 20/40 peripherally.'
  },
  {
    id: 'joshuaMieleBlindness',
    name: 'Chemical Burn Blindness (Joshua Miele)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete blindness from acid attack at age 4. Severe damage to facial tissues and eyes resulting in total darkness.'
  },
  {
    id: 'davidPatersonBlindness',
    name: 'Optic Atrophy (David Paterson)',
    enabled: false,
    intensity: 1.0,
    description: 'Legal blindness with severely reduced vision in both eyes. Heavy blur and reduced contrast representing approximately 20/400 vision.'
  },
  {
    id: 'rayCharlesBlindness',
    name: 'Glaucoma Blindness (Ray Charles)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete blindness by age 7 due to glaucoma. Gradual vision loss from age 5 to 7 resulting in total darkness.'
  },
  {
    id: 'stevieWonderROP',
    name: 'Retinopathy of Prematurity (Stevie Wonder)',
    enabled: false,
    intensity: 1.0,
    description: 'Total or near-total blindness from retinopathy of prematurity. Caused by excess oxygen in incubator as premature infant.'
  },
  {
    id: 'andreaBocelliBlindness',
    name: 'Congenital Glaucoma (Andrea Bocelli)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete blindness following soccer accident at age 12. Brain hemorrhage during soccer match resulted in total darkness.'
  },
  {
    id: 'vedMehtaBlindness',
    name: 'Meningitis Blindness (Ved Mehta)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete blindness from cerebrospinal meningitis at age 3. Total darkness with retained visual memories from before age 3.'
  },

  // Mila Kunis - Chronic Iritis & Mild Cataracts (left eye only)
  {
    id: 'milaMildIritis',
    name: 'Mild Iritis (Mila Kunis)',
    enabled: false,
    intensity: 1.0,
    description: 'Chronic iritis causing mild light sensitivity and slight inflammation effects. Creates subtle glare around bright lights and minor discomfort in high-contrast situations. Her condition was treated and vision largely restored.'
  },
  {
    id: 'milaMildCataracts',
    name: 'Mild Cataracts (Mila Kunis)',
    enabled: false,
    intensity: 1.0,
    description: 'Very mild cataract effects from chronic iritis complications. Creates subtle haziness and slight color desaturation, but the majority of vision remains clear and functional.'
  },
  {
    id: 'milaLeftEyeOnly',
    name: 'Left Eye Impairment (Mila Kunis)',
    enabled: false,
    intensity: 1.0,
    description: 'Mild vision impairment primarily affecting the left eye. The right eye compensates well, resulting in largely normal binocular vision with only subtle depth perception differences.'
  },
  {
    id: 'milaCompleteVision',
    name: 'Complete Vision (Mila Kunis)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Mila Kunis\' mild iritis and cataracts. Represents her treated condition with subtle light sensitivity and very minor visual impairment. She can see the vast majority of her environment clearly.'
  },

  // Dame Judi Dench - Age-Related Macular Degeneration (AMD)
  // "I can see your outline" but "I can't recognize anybody now"
  // Central vision loss with preserved peripheral vision
  {
    id: 'judiCentralScotoma',
    name: 'Central Scotoma (Judi Dench)',
    enabled: false,
    intensity: 1.0,
    description: 'Central blind spot from AMD affecting the macula. Creates a dark or blurry area in the center of vision where faces and text would normally be seen. Peripheral vision around the edges remains clear.'
  },
  {
    id: 'judiPeripheralPreserved',
    name: 'Preserved Peripheral Vision (Judi Dench)',
    enabled: false,
    intensity: 1.0,
    description: 'Clear peripheral (side) vision characteristic of AMD. While central vision is lost, the outer edges of the visual field remain functional, allowing navigation and seeing general shapes and outlines.'
  },
  {
    id: 'judiFaceBlindness',
    name: 'Face Recognition Loss (Judi Dench)',
    enabled: false,
    intensity: 1.0,
    description: 'Inability to recognize faces due to central vision loss. As Judi describes: "I can\'t recognize anybody now" - she can see outlines but loses all facial detail when looking directly at someone.'
  },
  {
    id: 'judiReadingLoss',
    name: 'Reading Difficulty (Judi Dench)',
    enabled: false,
    intensity: 1.0,
    description: 'Loss of ability to read standard text due to central scotoma. Judi needed scripts in 22-point font before her vision worsened further. Now relies on friends to read and repeat lines to her.'
  },
  {
    id: 'judiAMDComplete',
    name: 'Complete AMD Vision (Judi Dench)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Judi Dench\'s AMD as she describes it: "I can see your outline" but "I can\'t recognize anybody now...I can\'t see the television...I can\'t see to read." Central vision is lost while peripheral vision remains, allowing her to navigate but not see faces or details.'
  },

  // Amadou Bagayoko - Congenital Cataracts Progression to Total Blindness
  // Four phases: Early childhood haze → Fog thickens → Light perception only → Total blindness
  {
    id: 'amadouPhase1',
    name: 'Phase 1: Early Childhood Haze (Amadou Bagayoko)',
    enabled: false,
    intensity: 1.0,
    description: 'Ages 5-8: Uniform milky haze like viewing through frosted glass. Muted warm-shifted colors (yellows/browns emphasized), soft 8-12px blur, and mild diffuse halos around lights. The world Amadou was born into - never knowing clear vision.'
  },
  {
    id: 'amadouPhase2',
    name: 'Phase 2: The Fog Thickens (Amadou Bagayoko)',
    enabled: false,
    intensity: 1.0,
    description: 'Ages 10-13: Cataracts maturing. Heavy milky overlay like a steamed bathroom window. Pronounced yellowish-brown cast, 18-25px blur making faces unrecognizable. Light sources create expansive blooms that wash out surrounding detail.'
  },
  {
    id: 'amadouPhase3',
    name: 'Phase 3: Light Perception Only (Amadou Bagayoko)',
    enabled: false,
    intensity: 1.0,
    description: 'Ages 14-16: Near-total white-out. Dense warm milky-white fog dominates. Only the strongest light sources register as brighter patches of warm glow. No shapes, no edges, no faces - just diffuse light and dark, and even that distinction is fading.'
  },
  {
    id: 'amadouPhase4',
    name: 'Phase 4: Total Blindness (Amadou Bagayoko)',
    enabled: false,
    intensity: 1.0,
    description: 'Age 16 onward (54+ years): Complete, absolute darkness. Not the black of a dark room - the black of no visual processing whatsoever. The darkness Amadou filled with the ring of guitar strings, the pulse of the djembe, and the voice of Mariam beside him.'
  },
  {
    id: 'amadouCataractProgression',
    name: 'Complete Cataract Progression (Amadou Bagayoko)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Amadou Bagayoko\'s congenital cataract progression. Use intensity slider to move through all four phases: 0-25% (childhood haze), 26-50% (fog thickens), 51-75% (light perception only), 76-100% (total blindness). A slow, inevitable, graceful dimming - like a long sunset ending in night.'
  },

  // Stephen Curry - Keratoconus (Mild-to-Moderate, Both Eyes)
  // Directional smearing, ghosting, irregular halos, waviness, reduced contrast
  {
    id: 'stephenComaAberration',
    name: 'Coma Aberration/Directional Smear (Stephen Curry)',
    enabled: false,
    intensity: 1.0,
    description: 'Asymmetric directional blur where each point of light or contrast edge produces a comet-shaped tail trailing in one consistent direction (inferior/downward). NOT a uniform Gaussian blur - more like looking through a warped pane of glass with motion blur frozen in one direction.'
  },
  {
    id: 'stephenGhosting',
    name: 'Monocular Polyopia/Ghosting (Stephen Curry)',
    enabled: false,
    intensity: 1.0,
    description: '2-4 faint duplicate ghost images offset from the true position. High-contrast objects produce messy, chaotic scattering of semi-transparent echoes - not clean double vision but a "dirty" visual impression with ghosts spreading in a consistent directional pattern.'
  },
  {
    id: 'stephenIrregularHalos',
    name: 'Irregular Halos & Streaking (Stephen Curry)',
    enabled: false,
    intensity: 1.0,
    description: 'Exaggerated, elongated halos around lights that are irregular and asymmetric with comet-like tails. NOT neat circular halos - they streak outward with smeared rays extending primarily in one direction. Bright lights bleed aggressively into surroundings.'
  },
  {
    id: 'stephenWaviness',
    name: 'Irregular Waviness (Stephen Curry)',
    enabled: false,
    intensity: 1.0,
    description: 'Subtle but unmistakable waviness in straight lines - like viewing through slightly melted or heat-warped lens. Non-uniform undulation reflecting irregular corneal thinning. Feels like looking through old imperfect window glass with subtle ripples.'
  },
  {
    id: 'stephenReducedContrast',
    name: 'Reduced Contrast & Haze (Stephen Curry)',
    enabled: false,
    intensity: 1.0,
    description: 'Mildly reduced contrast with subtle diffuse light scatter - blacks aren\'t as black, whites aren\'t as white. A faint milky film caused by light scattering off the irregularly shaped cornea. Colors remain but lack their normal punch and saturation.'
  },
  {
    id: 'stephenAsymmetry',
    name: 'Asymmetric Eye Distortion (Stephen Curry)',
    enabled: false,
    intensity: 1.0,
    description: 'Slightly different distortion between eyes - keratoconus is typically bilateral but asymmetric. One half is more smeared and ghosted than the other, creating subtle dissonance as the brain tries to fuse two imperfect images that don\'t quite match.'
  },
  {
    id: 'stephenKeratoconusComplete',
    name: 'Complete Keratoconus Vision (Stephen Curry)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Stephen Curry\'s mild-to-moderate keratoconus before contact lens correction: directional coma aberration smearing, monocular polyopia ghosting, irregular streaking halos around lights, wavy distortion, reduced contrast with diffuse haze, and asymmetric distortion between eyes. The world refuses to come into sharp focus - every edge bleeds, every light smears, every detail is a soft, ghosted, wavy approximation.'
  },

  // Lex Gillette - Recurrent Retinal Detachments (ROP → Multiple Detachments → Total Blindness)
  // Cyclical pattern: hope → loss → hope → loss → final darkness
  // Right eye only (left always blind from ROP), cycles of detachment and surgical restoration
  {
    id: 'lexMonocularVision',
    name: 'Monocular Vision (Lex Gillette)',
    enabled: false,
    intensity: 1.0,
    description: 'Single-eye vision from right eye only. Left eye blind from birth (ROP). Creates slight depth perception loss with the left visual field showing complete blackness. The "normal" Lex knew before the first detachment.'
  },
  {
    id: 'lexFirstDetachment',
    name: 'First Detachment (Lex Gillette)',
    enabled: false,
    intensity: 1.0,
    description: 'First retinal detachment symptoms in the right eye at age 8. Floaters drifting across vision, peripheral flashes like distant lightning, and a dark shadow beginning to creep from the upper edge - covering 15-20% of remaining vision.'
  },
  {
    id: 'lexPostSurgeryRestoration',
    name: 'Post-Surgery Restoration (Lex Gillette)',
    enabled: false,
    intensity: 1.0,
    description: 'After surgical reattachment - vision returns but not quite the same. Clearer center with peripheral scotomas where laser scarring occurred. A fragile restoration, better but imperfect, with hope tinged by uncertainty.'
  },
  {
    id: 'lexRedetachment',
    name: 'Re-Detachment (Lex Gillette)',
    enabled: false,
    intensity: 1.0,
    description: 'The retina detaches again despite surgery. Larger shadow now covering 30-40% of vision, more floaters, the curtain advancing faster this time. The familiar terror returning - "not again."'
  },
  {
    id: 'lexCumulativeDamage',
    name: 'Cumulative Damage (Lex Gillette)',
    enabled: false,
    intensity: 1.0,
    description: 'Multiple cycles of detachment and repair leave cumulative damage. Clear zone shrinking to a small central island (50-70% occluded), permanent floater clouds, surgical scars creating blind patches. Each "fix" leaves the retina weaker.'
  },
  {
    id: 'lexDailyFading',
    name: 'Daily Fading (Lex Gillette)',
    enabled: false,
    intensity: 1.0,
    description: 'The final stage - "a little less each morning." No dramatic event, just gradual dimming day by day. The central island shrinking, edges going dark, until one morning there\'s nothing left. The quiet ending of a long fight.'
  },
  {
    id: 'lexRecurrentDetachmentCycle',
    name: 'Complete Recurrent Detachment Cycle (Lex Gillette)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete cyclical simulation of Lex Gillette\'s recurrent retinal detachments. Use intensity slider to experience: 0-15% (monocular normal), 16-30% (first detachment), 31-45% (post-surgery restoration), 46-60% (re-detachment), 61-80% (cumulative damage), 81-100% (daily fading to total blindness). NOT straight progression but oscillating hope and loss.'
  },

  // David Brown - Kawasaki Disease to Glaucoma: Dual-Phase Asymmetric Progression
  // Left eye lost at age 3, right eye progressive glaucoma until sudden collapse at 13
  // Key elements: dirty-glass haze, rainbow halos, extreme light sensitivity, ongoing pain
  {
    id: 'davidKawasakiEyes',
    name: 'Phase 1: Kawasaki Eyes (David Brown)',
    enabled: false,
    intensity: 1.0,
    description: 'Infancy to age 3 (1993-1995): Both eyes under assault from Kawasaki-induced glaucoma. Subtle overall haze like petroleum jelly on lens, washed-out colors, soft rainbow-tinged halos around light sources from corneal edema, peripheral edges beginning to soften and dim.'
  },
  {
    id: 'davidLeftEyeLoss',
    name: 'Left Eye Catastrophe (David Brown)',
    enabled: false,
    intensity: 1.0,
    description: 'Age 3: The left eye, damaged beyond repair by inflammation and pressure, stops sending meaningful signal. Not gradual - it simply ceases. Flat uniform dark gray (not black - a dead eye may still transmit some non-visual light sensation before atrophy).'
  },
  {
    id: 'davidMonocularHaze',
    name: 'Phase 2: Monocular Haze (David Brown)',
    enabled: false,
    intensity: 1.0,
    description: 'Ages 3-8 (1995-2000): Right eye only, carrying entire burden. Overall dirty-glass haze, reduced contrast (40-50% less), beginning peripheral loss (soft vignette to 60-70% field), muted colors, shapes without detail. David thought everyone saw like this.'
  },
  {
    id: 'davidOutdoorNightmare',
    name: 'Outdoor Nightmare - Too Bright (David Brown)',
    enabled: false,
    intensity: 1.0,
    description: 'Ages 6-12: The terror of going outside. Damaged retina cannot handle bright light - scene BLOWN OUT with painful glare. Sky becomes featureless white blaze, reflective surfaces produce searing starbursts, rainbow halos explode and overlap. Painful white fog with vague shapes swimming in it.'
  },
  {
    id: 'davidIndoorNightmare',
    name: 'Indoor Nightmare - Too Dark (David Brown)',
    enabled: false,
    intensity: 1.0,
    description: 'Ages 6-12: The terror of dim interiors. Without sufficient light for compromised optic nerve, scene barely registers. Murky soupy near-darkness, furniture as slightly darker shadows, doorways as slightly lighter rectangles. The haze absorbs what little light exists.'
  },
  {
    id: 'davidSweetSpot',
    name: 'Sweet Spot - Narrow Tolerable Band (David Brown)',
    enabled: false,
    intensity: 1.0,
    description: 'The narrow range between blinding outdoor glare and impenetrable indoor darkness where David can function: overcast days, shaded areas, well-lit indoor spaces. Tunnel vision advancing (40-50% field), thickening haze, intensifying halos, periodic pain intrusions.'
  },
  {
    id: 'davidPainIntrusions',
    name: 'Pain Intrusions (David Brown)',
    enabled: false,
    intensity: 1.0,
    description: 'Elevated eye pressure triggers waves of intense pain - crushing, migraine-like sensation behind the eye. During episodes, vision blurs further and flashes with visual artifacts (photopsias). A pulse of distortion - warping, constricting, throbbing - before settling to degraded baseline.'
  },
  {
    id: 'davidFinalCollapse',
    name: 'Phase 4: Final Collapse (David Brown)',
    enabled: false,
    intensity: 1.0,
    description: 'Age 13 (2005): Unlike slow fading, David\'s loss was sudden and catastrophic. The tunnel constricts rapidly, peripheral darkness rushes inward, haze thickens to near-opacity, colors drain to gray-brown then dim, a tiny island of dim light perception, then nothing. The optic nerve goes silent.'
  },
  {
    id: 'davidOngoingPain',
    name: 'Total Blindness with Ongoing Pain (David Brown)',
    enabled: false,
    intensity: 1.0,
    description: 'Age 13 onward: Complete permanent darkness, but not silent. The glaucoma continues building pressure, generating excruciating pain episodes. The darkness is periodically punctuated by waves of crushing pain behind an eye that can no longer see. The visual system is dead; the pain system is alive.'
  },
  {
    id: 'davidKawasakiGlaucomaComplete',
    name: 'Complete Kawasaki-Glaucoma Progression (David Brown)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of David Brown\'s vision journey. Use intensity slider: 0-12% (Kawasaki eyes - bilateral haze/halos), 13-25% (left eye loss + monocular haze), 26-50% (light extremes - outdoor/indoor nightmares), 51-75% (advancing tunnel + sweet spot + pain), 76-90% (rapid final collapse), 91-100% (total blindness with ongoing pain). Confused adaptation → sudden devastation.'
  },

  // Sugar Ray Leonard - Partial Retinal Detachment (Left Eye, 1982)
  // Dark curtain encroaching, floaters, peripheral flashes, monocular
  {
    id: 'sugarDarkCurtain',
    name: 'Dark Curtain/Shade (Sugar Ray Leonard)',
    enabled: false,
    intensity: 1.0,
    description: 'A large dark shadow like a lowered window shade creeping from the upper peripheral edge, covering 30-40% of vision. The area behind the curtain is deep smoky dark gray with no detail - representing retina separated from blood supply.'
  },
  {
    id: 'sugarFloaters',
    name: 'Vitreous Floaters (Sugar Ray Leonard)',
    enabled: false,
    intensity: 1.0,
    description: 'Scattered semi-transparent drifting shapes: dark specks, squiggly strands, cobweb-like filaments, and cloudy blobs. These are shadows of vitreous gel clumps and cells floating inside the eye, slightly out of focus.'
  },
  {
    id: 'sugarPeripheralFlashes',
    name: 'Peripheral Light Flashes (Sugar Ray Leonard)',
    enabled: false,
    intensity: 1.0,
    description: 'Subtle bright flashes or streaks at the edges of vision - lightning-like arcs of white/blue-white light. These photopsia represent vitreous gel tugging on still-attached portions of retina, interpreted by brain as light bursts.'
  },
  {
    id: 'sugarHaziness',
    name: 'Vitreous Haziness (Sugar Ray Leonard)',
    enabled: false,
    intensity: 1.0,
    description: 'Mild loss of contrast and faint milky haze across vision, like looking through slightly dirty glass. Colors are muted, particularly near the advancing edge of the dark curtain. Caused by vitreous gel becoming cloudy.'
  },
  {
    id: 'sugarLeftEyePressure',
    name: 'Left Eye Swelling Sensation (Sugar Ray Leonard)',
    enabled: false,
    intensity: 1.0,
    description: 'Subtle compression and darkening along the left periphery, simulating the sensation Leonard described of his eye feeling swollen - as if puffiness is interfering with the field of view.'
  },
  {
    id: 'sugarRetinalDetachmentComplete',
    name: 'Complete Retinal Detachment (Sugar Ray Leonard)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Sugar Ray Leonard\'s 1982 partial retinal detachment in left eye: dark curtain encroaching from upper periphery (30-40%), numerous floaters, peripheral light flashes, haziness, and asymmetric pressure sensation. Central vision still intact but threatened by advancing darkness.'
  },

  // Crazzy Steve (Steven Scott) - Bilateral Aphakia + Secondary Glaucoma
  // Born with congenital cataracts (removed in infancy), now legally blind
  // Key elements: heavy blur, desaturation, tunnel vision, low contrast, light halos
  // "Hazy aftermath of a dream" - shapes and colors only, no detail
  {
    id: 'crazzySteveDreamlikeBlur',
    name: 'Dreamlike Blur (Crazzy Steve)',
    enabled: false,
    intensity: 1.0,
    description: 'Heavy Gaussian blur (30-50px radius) representing vision without a natural lens (aphakia). Nothing resolves to a sharp edge - like looking through frost or waking from deep sleep with eyes half-open. Even large shapes appear as soft blobs rather than defined objects.'
  },
  {
    id: 'crazzysteveDesaturation',
    name: 'Washed-Out Colors (Crazzy Steve)',
    enabled: false,
    intensity: 1.0,
    description: 'Severe color desaturation (40-60% reduction) due to aphakia. Without the natural lens\'s filtering properties, colors appear faded and washed out - present but muted, like viewing through a very faded filter. The vibrant world reduced to pale impressions.'
  },
  {
    id: 'crazzysteveGlaucomaTunnel',
    name: 'Glaucomatous Tunnel Vision (Crazzy Steve)',
    enabled: false,
    intensity: 1.0,
    description: 'Progressive peripheral field loss from secondary glaucoma, leaving a 20-30° central cone of usable (but still blurred) vision. A soft, progressive black ring encroaches from the edges - the world viewed through an ever-narrowing window.'
  },
  {
    id: 'crazzySteveLowContrast',
    name: 'Severe Contrast Loss (Crazzy Steve)',
    enabled: false,
    intensity: 1.0,
    description: 'Dramatically reduced contrast (~50%) making dark objects against dark backgrounds nearly invisible. Only high-contrast boundaries register - bright lights, white objects, skin against dark clothing. Low-contrast objects (like dark ring ropes) simply disappear.'
  },
  {
    id: 'crazzysteveAphakicHalos',
    name: 'Aphakic Light Halos (Crazzy Steve)',
    enabled: false,
    intensity: 1.0,
    description: 'Chromatic aberration and halo effects around bright light sources. Aphakic eyes lack the UV-filtering of the natural lens, causing light scatter and colorful halos. Bright lights bloom and spread into surrounding darkness with rainbow-tinged edges.'
  },
  {
    id: 'crazzysteveComplete',
    name: 'Complete Aphakia + Glaucoma (Crazzy Steve)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Crazzy Steve\'s vision: bilateral aphakia (lensless eyes) combined with secondary glaucoma. Features heavy dreamlike blur where nothing is sharp, severely washed-out colors, progressive tunnel vision narrowing the visual field, drastically reduced contrast, and light halos. The overall impression is dreamlike and impressionistic - soft color blobs, light gradients, and large moving forms without any identifiable detail, viewed through an ever-narrowing window. As Steve describes: "like the hazy aftermath of a dream."'
  },

  // Tofiri Kibuuka - Progressive Degenerative Blindness (B1/T11 Classification)
  // Lost sight at age 13 due to degenerative disease in rural Uganda (1960)
  // Consistently classified B1/T11 (most severe visual impairment) throughout career
  // Most likely NLP or bare LP - navigated entirely through non-visual means
  {
    id: 'tofiriNLP',
    name: 'No Light Perception (Tofiri Kibuuka)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete absence of visual input - uniform black at 100% opacity. No gradients, no glow, no variation. Represents the most likely scenario for Tofiri\'s B1/T11 classification where there is no functional vision whatsoever.'
  },
  {
    id: 'tofiriBareLightPerception',
    name: 'Bare Light Perception (Tofiri Kibuuka)',
    enabled: false,
    intensity: 1.0,
    description: 'Near-total darkness with extremely subtle, diffuse, non-directional luminance shifts when strong light sources (sunlight, stadium floodlights) are present. Not enough to localize anything - only enough to sense "it is brighter here than it was a moment ago." No edges, no shapes, no color - just faint ambient warmth of light with no spatial meaning.'
  },
  {
    id: 'tofiriComplete',
    name: 'Complete B1/T11 Vision (Tofiri Kibuuka)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete simulation of Tofiri Kibuuka\'s vision after progressive degenerative blindness at age 13. Near-total darkness (98-100% opacity) with only the most subtle ambient luminance variation possible under bright light conditions. No spatial information, no edges, no shapes, no color - only the barest sense that light exists somewhere. He navigated Paralympic ski courses, marathon routes, and Mount Kilimanjaro through sound, touch, guide communication, spatial memory, and proprioception - with effectively zero visual input.'
  }
];
