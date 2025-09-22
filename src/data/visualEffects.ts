import { ConditionType, VisualEffect } from '../types/visualEffects';

/**
 * Complete list of visual effects with descriptions
 * Extracted from VisionSimulator.tsx to improve maintainability
 */
export const VISUAL_EFFECTS: VisualEffect[] = [
  { 
    id: 'hemianopiaLeft',
    name: 'Homonymous Hemianopia (Left-field)',
    enabled: false,
    intensity: 1.0,
    description: 'Loss of the left half of the visual field in both eyes. Caused by damage to the right side of the brain\'s visual pathways. May cause difficulty seeing objects to the left and problems with navigation.'
  },
  { 
    id: 'hemianopiaRight',
    name: 'Homonymous Hemianopia (Right-field)',
    enabled: false,
    intensity: 1.0,
    description: 'Loss of the right half of the visual field in both eyes. Caused by damage to the left side of the brain\'s visual pathways. May cause difficulty seeing objects to the right and problems with navigation.'
  },
  { 
    id: 'quadrantanopiaRight',
    name: 'Homonymous Hemianopia (Right-field) + Quadrantanopia',
    enabled: false,
    intensity: 1.0,
    description: 'Loss of vision in one quarter (quadrant) of the visual field. Often caused by damage to specific parts of the brain that process vision. Affects spatial awareness and navigation.'
  },
  { 
    id: 'quadrantanopiaInferior',
    name: 'Homonymous Inferior Quadrantanopia',
    enabled: false,
    intensity: 1.0,
    description: 'Loss of vision in the same lower quadrant of visual field in both eyes. Caused by damage to the superior optic radiations (parietal pathway). Often referred to as "pie on the floor" defect.'
  },
  { 
    id: 'quadrantanopiaSuperior',
    name: 'Homonymous Superior Quadrantanopia',
    enabled: false,
    intensity: 1.0,
    description: 'Loss of vision in the same upper quadrant of visual field in both eyes. Caused by damage to the inferior optic radiations (temporal pathway or Meyer\'s loop). Often referred to as "pie in the sky" defect.'
  },
  { 
    id: 'blindnessLeftEye',
    name: 'Complete Loss of Vision in Left Eye',
    enabled: false,
    intensity: 1.0,
    description: 'Complete blindness in the left eye. Caused by damage to the left optic nerve. Results in total loss of vision in the left eye while the right eye remains unaffected.'
  },
  { 
    id: 'blindnessRightEye',
    name: 'Complete Loss of Vision in Right Eye',
    enabled: false,
    intensity: 1.0,
    description: 'Complete blindness in the right eye. Caused by damage to the right optic nerve. Results in total loss of vision in the right eye while the left eye remains unaffected.'
  },
  { 
    id: 'bitemporalHemianopia',
    name: 'Bitemporal Hemianopia',
    enabled: false,
    intensity: 1.0,
    description: 'Loss of vision in the outer (temporal) half of each eye\'s visual field. Caused by damage to the optic chiasm, often from pituitary tumors. Creates a "tunnel vision" effect.'
  },
  { 
    id: 'scotoma',
    name: 'Central Scotoma',
    enabled: false,
    intensity: 1.0,
    description: 'A blind spot in the center of vision. Can be caused by macular degeneration, optic neuritis, or other conditions affecting the macula. Makes reading and recognizing faces difficult.'
  },
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
    name: 'Visual Hallucinations',
    enabled: false,
    intensity: 1.0,
    description: 'Seeing things that are not actually present. Can be simple (lights, shapes) or complex (people, animals). Associated with various neurological conditions and medications.'
  },
  { 
    id: 'protanopia',
    name: 'Protanopia (Red-Blind)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete inability to distinguish between red and green colors. Red appears as black, and green appears as yellow. Affects about 1% of males and 0.01% of females.'
  },
  { 
    id: 'deuteranopia',
    name: 'Deuteranopia (Green-Blind)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete inability to distinguish between red and green colors. Green appears as light gray or beige, and red appears as brown. Most common form of color blindness.'
  },
  { 
    id: 'tritanopia',
    name: 'Tritanopia (Blue-Blind)',
    enabled: false,
    intensity: 1.0,
    description: 'Inability to distinguish between blue and yellow colors. Blue appears as green, and yellow appears as light gray or violet. Very rare form of color blindness.'
  },
  { 
    id: 'protanomaly',
    name: 'Protanomaly (Red-Weak)',
    enabled: false,
    intensity: 1.0,
    description: 'Reduced sensitivity to red light. Red appears darker and less bright than normal. Difficulty distinguishing between red and green, especially in low light.'
  },
  { 
    id: 'deuteranomaly',
    name: 'Deuteranomaly (Green-Weak)',
    enabled: false,
    intensity: 1.0,
    description: 'Reduced sensitivity to green light. Green appears more red than normal. Most common form of color vision deficiency, affecting about 6% of males.'
  },
  { 
    id: 'tritanomaly',
    name: 'Tritanomaly (Blue-Weak)',
    enabled: false,
    intensity: 1.0,
    description: 'Reduced sensitivity to blue light. Blue appears greener than normal, and yellow appears lighter. Very rare form of color vision deficiency.'
  },
  { 
    id: 'monochromacy',
    name: 'Monochromacy (Complete Color Blindness)',
    enabled: false,
    intensity: 1.0,
    description: 'Complete inability to see any colors. Vision is limited to shades of gray. Extremely rare, affecting only about 1 in 33,000 people.'
  },
  { 
    id: 'monochromatic',
    name: 'Monochromatic Vision',
    enabled: false,
    intensity: 1.0,
    description: 'Seeing only in shades of one color (usually blue). Different from complete color blindness as some color perception remains. Very rare condition.'
  },
  { 
    id: 'cataracts',
    name: 'Cataracts',
    enabled: false,
    intensity: 1.0,
    description: 'Clouding of the eye\'s natural lens. Causes blurry vision, difficulty seeing in bright light, and faded colors. Common with aging but can occur at any age.'
  },
  { 
    id: 'glaucoma',
    name: 'Glaucoma',
    enabled: false,
    intensity: 1.0,
    description: 'A group of eye diseases that damage the optic nerve, typically due to elevated intraocular pressure. Known as the "silent thief of sight" because vision loss occurs gradually and peripherally first. Early stages show small paracentral scotomas, progressing to arc-shaped defects, then tunnel vision, and finally severe constriction. Central vision remains sharp until late stages. Includes blue-yellow color deficits and reduced contrast sensitivity.'
  },
  { 
    id: 'amd',
    name: 'Age-Related Macular Degeneration (AMD)',
    enabled: false,
    intensity: 1.0,
    description: 'Deterioration of the macula, the central part of the retina. Causes loss of central vision while peripheral vision remains. Leading cause of vision loss in older adults.'
  },
  { 
    id: 'diabeticRetinopathy',
    name: 'Diabetic Retinopathy',
    enabled: false,
    intensity: 1.0,
    description: 'Damage to the blood vessels in the retina caused by diabetes. Can cause blurry vision, dark spots, and eventually blindness if untreated.'
  },
  { 
    id: 'astigmatism',
    name: 'Astigmatism',
    enabled: false,
    intensity: 1.0,
    description: 'Irregular curvature of the cornea or lens causing blurred or distorted vision at all distances. Common refractive error that can be corrected with glasses or contacts.'
  },
  { 
    id: 'retinitisPigmentosa',
    name: 'Retinitis Pigmentosa',
    enabled: false,
    intensity: 1.0,
    description: 'Progressive genetic disorder causing gradual degeneration of photoreceptor cells in the retina. Creates distinctive tunnel vision with progressive peripheral vision loss, night blindness requiring 10-100x more light, severe light sensitivity and glare issues, color desaturation, and eventual complete blindness at advanced stages. The visual field constricts from normal 180° to 40°, 20°, or less, making navigation extremely challenging.'
  },
  { 
    id: 'stargardt',
    name: 'Stargardt Disease',
    enabled: false,
    intensity: 1.0,
    description: 'Genetic eye disorder causing progressive vision loss in the macula. Usually begins in childhood or adolescence, affecting central vision while peripheral vision remains.'
  },
  { 
    id: 'nearSighted',
    name: 'Myopia (Near-Sightedness)',
    enabled: false,
    intensity: 1.0,
    description: 'Difficulty seeing distant objects clearly while near objects appear normal. Caused by the eye being too long or the cornea being too curved.'
  },
  { 
    id: 'farSighted',
    name: 'Hyperopia (Far-Sightedness)',
    enabled: false,
    intensity: 1.0,
    description: 'Difficulty seeing near objects clearly while distant objects appear normal. Caused by the eye being too short or the cornea being too flat.'
  },
  { 
    id: 'diplopiaMonocular',
    name: 'Monocular Diplopia (Double Vision in One Eye)',
    enabled: false,
    intensity: 1.0,
    description: 'Seeing double with one eye closed. Usually caused by problems within the eye itself, such as cataracts, corneal irregularities, or retinal issues.'
  },
  { 
    id: 'diplopiaBinocular',
    name: 'Binocular Diplopia (Double Vision in Both Eyes)',
    enabled: false,
    intensity: 1.0,
    description: 'Seeing double when both eyes are open, but single when one eye is closed. Usually caused by misalignment of the eyes due to muscle or nerve problems.'
  },
  { 
    id: 'tunnelVision',
    name: 'Tunnel Vision',
    enabled: false,
    intensity: 1.0,
    description: 'Loss of peripheral vision while central vision remains. Can be caused by glaucoma, retinitis pigmentosa, or other conditions affecting the retina or optic nerve.'
  },
  // John Milton-specific effects for bilateral retinal detachment and secondary glaucoma
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
  // Galileo Galilei - Acute Angle-Closure Glaucoma Effects
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
  // Claude Monet - Cataracts Effects
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
  // Ved Mehta - Complete Blindness with Spatial Awareness Systems
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
  // Christine Ha - Neuromyelitis Optica (NMO) Effects
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
  // Lucy Edwards - Incontinentia Pigmenti Effects
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

  // David Paterson - Hemispheric Vision Loss Effects
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

  // Erik Weihenmayer - Retinoschisis Island Vision Loss Effects
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

  // Marla Runyan - Stargardt Disease Central Scotoma Effects
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
  // Dr. Mona Minkara - Combined Macular Degeneration + Cone-Rod Dystrophy Effects
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
  // Joshua Miele - Chemical Burn Complete Blindness Effects
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
  }
];

// Create a Map for O(1) lookup performance
const EFFECT_MAP = new Map(VISUAL_EFFECTS.map(effect => [effect.id, effect]));

/**
 * Gets a visual effect by its ID with O(1) performance
 * 
 * @param id - The effect ID to find
 * @returns The visual effect or undefined if not found
 */
export const getVisualEffectById = (id: ConditionType): VisualEffect | undefined => {
  return EFFECT_MAP.get(id);
};

/**
 * Gets all enabled visual effects
 * 
 * @param effects - Array of visual effects
 * @returns Array of enabled effects
 */
export const getEnabledEffects = (effects: VisualEffect[]): VisualEffect[] => {
  return effects.filter(effect => effect.enabled);
};

/**
 * Creates a new visual effects array with default values
 * 
 * @returns Array of visual effects with all disabled
 */
export const createDefaultEffects = (): VisualEffect[] => {
  return VISUAL_EFFECTS.map(effect => ({
    ...effect,
    enabled: false,
    intensity: 1.0
  }));
};
