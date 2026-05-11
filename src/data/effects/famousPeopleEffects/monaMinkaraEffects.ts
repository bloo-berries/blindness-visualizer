import { VisualEffect } from '../../../types/visualEffects';
import { effect } from '../effectHelper';

/**
 * Dr. Mona Minkara - Combined Macular Degeneration + Cone-Rod Dystrophy
 */
export const monaMinkaraEffects: VisualEffect[] = [
  effect('minkaraEndStageComplete', 'End-Stage Combined Vision Loss (Dr. Mona Minkara)', 'Complete simulation of Dr. Mona Minkara\'s end-stage vision combining macular degeneration and cone-rod dystrophy. Features massive central scotoma (35+ degrees), ring scotoma, minimal peripheral crescents, extreme photophobia, complete achromatopsia, and severe night blindness. Represents near-total vision loss affecting both central and peripheral vision.'),
  effect('minkaraCentralScotoma', 'Massive Central Scotoma (Dr. Mona Minkara)', 'Large central blind spot (35+ degrees) from macular degeneration. Complete blindness in center where faces and details disappear. Represents the primary visual field loss that affects reading, face recognition, and detailed tasks.'),
  effect('minkaraRingScotoma', 'Ring Scotoma (Dr. Mona Minkara)', 'Blind ring around the central scotoma creating a "donut" pattern. Partial blindness in the 15-25 degree ring around the central blind spot. Represents the expanding macular degeneration affecting the parafoveal region.'),
  effect('minkaraPeripheralIslands', 'Peripheral Vision Islands (Dr. Mona Minkara)', 'Small, scattered islands of limited vision in the far periphery. Only motion detection and light perception remain. Represents the cone-rod dystrophy affecting peripheral photoreceptors, leaving only tiny functional areas.'),
  effect('minkaraPhotophobia', 'Extreme Photophobia (Dr. Mona Minkara)', 'Painful light sensitivity with overwhelming glare and bloom effects. Bright areas create massive white-out with extreme contrast. Represents the cone dysfunction causing severe photophobia while paradoxically needing light to see.'),
  effect('minkaraAchromatopsia', 'Complete Achromatopsia (Dr. Mona Minkara)', 'Complete loss of color vision - everything appears in grayscale. No color perception whatsoever due to cone cell death. Represents the cone-rod dystrophy destroying all color-detecting photoreceptors.'),
  effect('minkaraNightBlindness', 'Severe Night Blindness (Dr. Mona Minkara)', 'Complete inability to see in dim light due to rod cell death. Cannot navigate in low light conditions. Represents the cone-rod dystrophy destroying rod photoreceptors responsible for night vision and peripheral detection.'),
  effect('minkaraProgressiveTimeline', 'Progressive Timeline (Dr. Mona Minkara)', 'Interactive timeline showing the progression from early childhood photophobia to end-stage near-total blindness. Demonstrates how the combined conditions create a unique deterioration pattern affecting both central and peripheral vision.'),
  effect('minkaraChemistryMode', 'Chemistry Lab Mode (Dr. Mona Minkara)', 'Special mode showing how Dr. Minkara conducts chemistry research without vision. Includes sonification overlays, tactile model indicators, and auditory feedback systems. Demonstrates alternative sensing methods for scientific research.'),
];
