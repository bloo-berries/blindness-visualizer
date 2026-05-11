import { VisualEffect } from '../../../types/visualEffects';
import { effect } from '../effectHelper';

/**
 * Sugar Ray Leonard - Partial Retinal Detachment (Left Eye, 1982)
 * Dark curtain encroaching, floaters, peripheral flashes, monocular
 */
export const sugarRayLeonardEffects: VisualEffect[] = [
  effect('sugarDarkCurtain', 'Dark Curtain/Shade (Sugar Ray Leonard)', 'A large dark shadow like a lowered window shade creeping from the upper peripheral edge, covering 30-40% of vision. The area behind the curtain is deep smoky dark gray with no detail - representing retina separated from blood supply.'),
  effect('sugarFloaters', 'Vitreous Floaters (Sugar Ray Leonard)', 'Scattered semi-transparent drifting shapes: dark specks, squiggly strands, cobweb-like filaments, and cloudy blobs. These are shadows of vitreous gel clumps and cells floating inside the eye, slightly out of focus.'),
  effect('sugarPeripheralFlashes', 'Peripheral Light Flashes (Sugar Ray Leonard)', 'Subtle bright flashes or streaks at the edges of vision - lightning-like arcs of white/blue-white light. These photopsia represent vitreous gel tugging on still-attached portions of retina, interpreted by brain as light bursts.'),
  effect('sugarHaziness', 'Vitreous Haziness (Sugar Ray Leonard)', 'Mild loss of contrast and faint milky haze across vision, like looking through slightly dirty glass. Colors are muted, particularly near the advancing edge of the dark curtain. Caused by vitreous gel becoming cloudy.'),
  effect('sugarLeftEyePressure', 'Left Eye Swelling Sensation (Sugar Ray Leonard)', 'Subtle compression and darkening along the left periphery, simulating the sensation Leonard described of his eye feeling swollen - as if puffiness is interfering with the field of view.'),
  effect('sugarRetinalDetachmentComplete', 'Complete Retinal Detachment (Sugar Ray Leonard)', 'Complete simulation of Sugar Ray Leonard\'s 1982 partial retinal detachment in left eye: dark curtain encroaching from upper periphery (30-40%), numerous floaters, peripheral light flashes, haziness, and asymmetric pressure sensation. Central vision still intact but threatened by advancing darkness.'),
];
