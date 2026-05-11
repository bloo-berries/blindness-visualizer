import { VisualEffect } from '../../../types/visualEffects';
import { effect } from '../effectHelper';

/**
 * Crazzy Steve (Steven Scott) - Bilateral Aphakia + Secondary Glaucoma
 * Born with congenital cataracts (removed in infancy), now legally blind
 * Key elements: heavy blur, desaturation, tunnel vision, low contrast, light halos
 * "Hazy aftermath of a dream" - shapes and colors only, no detail
 */
export const crazzysteveEffects: VisualEffect[] = [
  effect('crazzySteveDreamlikeBlur', 'Dreamlike Blur (Crazzy Steve)', 'Heavy Gaussian blur (30-50px radius) representing vision without a natural lens (aphakia). Nothing resolves to a sharp edge - like looking through frost or waking from deep sleep with eyes half-open. Even large shapes appear as soft blobs rather than defined objects.'),
  effect('crazzysteveDesaturation', 'Washed-Out Colors (Crazzy Steve)', 'Severe color desaturation (40-60% reduction) due to aphakia. Without the natural lens\'s filtering properties, colors appear faded and washed out - present but muted, like viewing through a very faded filter. The vibrant world reduced to pale impressions.'),
  effect('crazzysteveGlaucomaTunnel', 'Glaucomatous Tunnel Vision (Crazzy Steve)', 'Progressive peripheral field loss from secondary glaucoma, leaving a 20-30\u00b0 central cone of usable (but still blurred) vision. A soft, progressive black ring encroaches from the edges - the world viewed through an ever-narrowing window.'),
  effect('crazzySteveLowContrast', 'Severe Contrast Loss (Crazzy Steve)', 'Dramatically reduced contrast (~50%) making dark objects against dark backgrounds nearly invisible. Only high-contrast boundaries register - bright lights, white objects, skin against dark clothing. Low-contrast objects (like dark ring ropes) simply disappear.'),
  effect('crazzysteveAphakicHalos', 'Aphakic Light Halos (Crazzy Steve)', 'Chromatic aberration and halo effects around bright light sources. Aphakic eyes lack the UV-filtering of the natural lens, causing light scatter and colorful halos. Bright lights bloom and spread into surrounding darkness with rainbow-tinged edges.'),
  effect('crazzysteveComplete', 'Complete Aphakia + Glaucoma (Crazzy Steve)', 'Complete simulation of Crazzy Steve\'s vision: bilateral aphakia (lensless eyes) combined with secondary glaucoma. Features heavy dreamlike blur where nothing is sharp, severely washed-out colors, progressive tunnel vision narrowing the visual field, drastically reduced contrast, and light halos. The overall impression is dreamlike and impressionistic - soft color blobs, light gradients, and large moving forms without any identifiable detail, viewed through an ever-narrowing window. As Steve describes: "like the hazy aftermath of a dream."'),
];
