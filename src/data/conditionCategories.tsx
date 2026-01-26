import React from 'react';
import {
  RemoveRedEye as RemoveRedEyeIcon,
  ColorLens as ColorLensIcon,
  MedicalServices as MedicalServicesIcon,
  Visibility as VisibilityIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';

export interface ConditionCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  conditions: Array<{
    id: string;
    name: string;
    description: string;
    relatedPeople?: string[];
    imagePath?: string;
    treatments?: {
      available: boolean;
      options: string[];
      notes?: string;
    };
  }>;
}

const PUBLIC_URL = process.env.PUBLIC_URL || '';

export const conditionCategories: ConditionCategory[] = [
  {
    id: 'visual-field',
    name: 'Visual Field Loss',
    icon: <RemoveRedEyeIcon />,
    description: 'Conditions affecting specific areas of the visual field',
    conditions: [
      {
        id: 'hemianopiaLeft',
        name: 'Homonymous Hemianopia (Left-field)',
        imagePath: `${PUBLIC_URL}/images/glossary/Homonymous Hemianopia (Left-field).webp`,
        description: 'Loss of the left half of the visual field in both eyes. Caused by damage to the right side of the brain\'s visual pathways. May cause difficulty seeing objects to the left and problems with navigation.',
        relatedPeople: ['John Milton'],
        treatments: {
          available: true,
          options: [
            'Vision rehabilitation therapy to improve scanning and awareness',
            'Prism glasses to expand visual field awareness',
            'Visual field expansion training',
            'Compensatory strategies and adaptive techniques',
            'Treatment of underlying cause (stroke, tumor, trauma) when possible'
          ],
          notes: 'Vision loss from brain damage is typically permanent, but rehabilitation can help maximize remaining vision and develop compensatory strategies.'
        }
      },
      {
        id: 'hemianopiaRight',
        name: 'Homonymous Hemianopia (Right-field)',
        imagePath: `${PUBLIC_URL}/images/glossary/Homonymous Hemianopia (Right-field).webp`,
        description: 'Loss of the right half of the visual field in both eyes. Caused by damage to the left side of the brain\'s visual pathways. May cause difficulty seeing objects to the right and problems with navigation.',
        treatments: {
          available: true,
          options: [
            'Vision rehabilitation therapy to improve scanning and awareness',
            'Prism glasses to expand visual field awareness',
            'Visual field expansion training',
            'Compensatory strategies and adaptive techniques',
            'Treatment of underlying cause (stroke, tumor, trauma) when possible'
          ],
          notes: 'Vision loss from brain damage is typically permanent, but rehabilitation can help maximize remaining vision and develop compensatory strategies.'
        }
      },
      {
        id: 'quadrantanopiaInferior',
        name: 'Homonymous Inferior Quadrantanopia',
        imagePath: `${PUBLIC_URL}/images/glossary/Homonymous Inferior Quadrantanopia.webp`,
        description: 'Loss of vision in the same lower quadrant of visual field in both eyes. Caused by damage to the superior optic radiations (parietal pathway). Often referred to as "pie on the floor" defect.',
        treatments: {
          available: true,
          options: [
            'Vision rehabilitation therapy',
            'Prism glasses or visual field awareness devices',
            'Compensatory scanning techniques',
            'Treatment of underlying neurological cause when possible'
          ],
          notes: 'Treatment focuses on rehabilitation and adaptation rather than restoring lost vision.'
        }
      },
      {
        id: 'quadrantanopiaSuperior',
        name: 'Homonymous Superior Quadrantanopia',
        imagePath: `${PUBLIC_URL}/images/glossary/Homonymous Superior Quadrantanopia.webp`,
        description: 'Loss of vision in the same upper quadrant of visual field in both eyes. Caused by damage to the inferior optic radiations (temporal pathway or Meyer\'s loop). Often referred to as "pie in the sky" defect.',
        treatments: {
          available: true,
          options: [
            'Vision rehabilitation therapy',
            'Prism glasses or visual field awareness devices',
            'Compensatory scanning techniques',
            'Treatment of underlying neurological cause when possible'
          ],
          notes: 'Treatment focuses on rehabilitation and adaptation rather than restoring lost vision.'
        }
      },
      {
        id: 'blindnessLeftEye',
        name: 'Complete Loss of Vision in Left Eye',
        imagePath: `${PUBLIC_URL}/images/glossary/Complete Loss of Vision in Left Eye.webp`,
        description: 'Complete blindness in the left eye. Caused by damage to the left optic nerve. Results in total loss of vision in the left eye while the right eye remains unaffected.',
        treatments: {
          available: true,
          options: [
            'Treatment depends on underlying cause:',
            '• Optic neuritis: Corticosteroids, treatment of underlying autoimmune condition',
            '• Glaucoma: Eye drops, laser therapy, surgery to lower intraocular pressure',
            '• Trauma: Immediate medical attention, surgical repair when possible',
            '• Tumor: Surgical removal, radiation therapy, chemotherapy',
            '• Stroke: Treatment of underlying cardiovascular condition',
            'Vision rehabilitation for monocular vision',
            'Protective eyewear for remaining eye',
            'Adaptive strategies for depth perception and spatial awareness'
          ],
          notes: 'Vision loss in one eye is typically permanent. Treatment focuses on preserving the remaining eye and developing compensatory strategies for monocular vision.'
        }
      },
      {
        id: 'blindnessRightEye',
        name: 'Complete Loss of Vision in Right Eye',
        imagePath: `${PUBLIC_URL}/images/glossary/Complete Loss of Vision in Right Eye.webp`,
        description: 'Complete blindness in the right eye. Caused by damage to the right optic nerve. Results in total loss of vision in the right eye while the left eye remains unaffected.',
        treatments: {
          available: true,
          options: [
            'Treatment depends on underlying cause:',
            '• Optic neuritis: Corticosteroids, treatment of underlying autoimmune condition',
            '• Glaucoma: Eye drops, laser therapy, surgery to lower intraocular pressure',
            '• Trauma: Immediate medical attention, surgical repair when possible',
            '• Tumor: Surgical removal, radiation therapy, chemotherapy',
            '• Stroke: Treatment of underlying cardiovascular condition',
            'Vision rehabilitation for monocular vision',
            'Protective eyewear for remaining eye',
            'Adaptive strategies for depth perception and spatial awareness'
          ],
          notes: 'Vision loss in one eye is typically permanent. Treatment focuses on preserving the remaining eye and developing compensatory strategies for monocular vision.'
        }
      },
      {
        id: 'bitemporalHemianopia',
        name: 'Bitemporal Hemianopia',
        imagePath: `${PUBLIC_URL}/images/glossary/Bitemporal Hemianopia.webp`,
        description: 'Loss of vision in the outer (temporal) half of each eye\'s visual field. Caused by damage to the optic chiasm, often from pituitary tumors. Creates a "tunnel vision" effect.',
        treatments: {
          available: true,
          options: [
            'Surgical removal or treatment of pituitary tumor (if applicable)',
            'Radiation therapy for tumors',
            'Hormone therapy for pituitary disorders',
            'Vision rehabilitation and adaptive strategies',
            'Prism glasses to improve peripheral awareness'
          ],
          notes: 'Early treatment of the underlying cause (often pituitary tumors) may prevent further vision loss and sometimes improve vision.'
        }
      },
      {
        id: 'scotoma',
        name: 'Central Scotoma',
        imagePath: `${PUBLIC_URL}/images/glossary/Central Scotoma.webp`,
        description: 'A blind spot in the center of vision. Can be caused by macular degeneration, optic neuritis, or other conditions affecting the macula. Makes reading and recognizing faces difficult.',
        relatedPeople: ['Marla Runyan', 'Dr. Mona Minkara'],
        treatments: {
          available: true,
          options: [
            'Treatment depends on underlying cause:',
            '• AMD: Anti-VEGF injections, photodynamic therapy, AREDS supplements',
            '• Optic neuritis: Corticosteroids, treatment of underlying autoimmune condition',
            '• Macular hole: Vitrectomy surgery',
            '• Diabetic macular edema: Anti-VEGF injections, laser therapy',
            'Low vision aids (magnifiers, telescopic lenses)',
            'Eccentric viewing training to use peripheral vision',
            'Vision rehabilitation therapy'
          ],
          notes: 'Central scotomas are often permanent, but treatment of the underlying cause and low vision rehabilitation can help maximize remaining vision.'
        }
      },
      {
        id: 'tunnelVision',
        name: 'Tunnel Vision',
        imagePath: `${PUBLIC_URL}/images/glossary/Tunnel Vision.webp`,
        description: 'Loss of peripheral vision while central vision remains. Can be caused by glaucoma, retinitis pigmentosa, or other conditions affecting the retina or optic nerve.',
        relatedPeople: ['Erik Weihenmayer'],
        treatments: {
          available: true,
          options: [
            'Treatment depends on underlying cause:',
            '• Glaucoma: Eye drops, laser therapy, surgery to lower intraocular pressure',
            '• Retinitis pigmentosa: Vitamin A palmitate, gene therapy (experimental), retinal implants',
            '• Retinal detachment: Surgical repair',
            '• Optic nerve damage: Treatment of underlying cause when possible',
            'Vision rehabilitation and mobility training',
            'Low vision aids and adaptive devices'
          ],
          notes: 'Peripheral vision loss is often progressive and irreversible, but early treatment of underlying conditions may slow progression.'
        }
      }
    ]
  },
  {
    id: 'color-vision',
    name: 'Color Vision Deficiencies',
    icon: <ColorLensIcon />,
    description: 'Conditions affecting color perception and discrimination',
    conditions: [
      {
        id: 'protanopia',
        name: 'Protanopia (Red-Blind)',
        imagePath: `${PUBLIC_URL}/images/glossary/Protanopia (Red-Blind).webp`,
        description: 'Complete inability to distinguish between red and green colors. Red appears as black, and green appears as yellow. Affects about 1% of males and 0.01% of females.',
        treatments: {
          available: false,
          options: [
            'No cure currently available',
            'Color-correcting glasses (EnChroma, etc.) may help some individuals distinguish colors better',
            'Adaptive strategies: using patterns, labels, or apps to identify colors',
            'Gene therapy research is ongoing but not yet available'
          ],
          notes: 'Color vision deficiencies are typically genetic and permanent. Specialized glasses can help some people but do not restore normal color vision.'
        }
      },
      {
        id: 'deuteranopia',
        name: 'Deuteranopia (Green-Blind)',
        imagePath: `${PUBLIC_URL}/images/glossary/Deuteranopia (Green-Blind).webp`,
        description: 'Complete inability to distinguish between red and green colors. Green appears as light gray or beige, and red appears as brown. Most common form of color blindness.',
        treatments: {
          available: false,
          options: [
            'No cure currently available',
            'Color-correcting glasses (EnChroma, etc.) may help some individuals distinguish colors better',
            'Adaptive strategies: using patterns, labels, or apps to identify colors',
            'Gene therapy research is ongoing but not yet available'
          ],
          notes: 'Color vision deficiencies are typically genetic and permanent. Specialized glasses can help some people but do not restore normal color vision.'
        }
      },
      {
        id: 'tritanopia',
        name: 'Tritanopia (Blue-Blind)',
        imagePath: `${PUBLIC_URL}/images/glossary/Tritanopia (Blue-Blind).webp`,
        description: 'Inability to distinguish between blue and yellow colors. Blue appears as green, and yellow appears as light gray or violet. Very rare form of color blindness.',
        treatments: {
          available: false,
          options: [
            'No cure currently available',
            'May be acquired (from eye disease, medication, or aging) or inherited',
            'If acquired, treating underlying cause may help',
            'Adaptive strategies and color identification apps'
          ],
          notes: 'Acquired tritanopia may improve if the underlying cause is treated. Inherited forms are permanent.'
        }
      },
      {
        id: 'protanomaly',
        name: 'Protanomaly (Red-Weak)',
        imagePath: `${PUBLIC_URL}/images/glossary/Protanomaly (Red-Weak).webp`,
        description: 'Reduced sensitivity to red light. Red appears darker and less bright than normal. Difficulty distinguishing between red and green, especially in low light.',
        treatments: {
          available: false,
          options: [
            'No cure currently available',
            'Color-correcting glasses may provide some improvement',
            'Adaptive strategies and color identification tools'
          ],
          notes: 'Milder than protanopia but still permanent. Adaptive strategies are the primary management approach.'
        }
      },
      {
        id: 'deuteranomaly',
        name: 'Deuteranomaly (Green-Weak)',
        imagePath: `${PUBLIC_URL}/images/glossary/Deuteranomaly (Green-Weak).webp`,
        description: 'Reduced sensitivity to green light. Green appears more red than normal. Most common form of color vision deficiency, affecting about 6% of males.',
        treatments: {
          available: false,
          options: [
            'No cure currently available',
            'Color-correcting glasses may provide some improvement',
            'Adaptive strategies and color identification tools'
          ],
          notes: 'Most common color vision deficiency. Usually does not significantly impact daily life, but adaptive strategies can help when needed.'
        }
      },
      {
        id: 'tritanomaly',
        name: 'Tritanomaly (Blue-Weak)',
        imagePath: `${PUBLIC_URL}/images/glossary/Tritanomaly (Blue-Weak).webp`,
        description: 'Reduced sensitivity to blue light. Blue appears greener than normal, and yellow appears lighter. Very rare form of color vision deficiency.',
        treatments: {
          available: false,
          options: [
            'No cure currently available',
            'If acquired, treating underlying cause may help',
            'Adaptive strategies and color identification tools'
          ],
          notes: 'Very rare condition. Treatment depends on whether it is inherited or acquired.'
        }
      },
      {
        id: 'monochromacy',
        name: 'Monochromacy (Complete Color Blindness)',
        imagePath: `${PUBLIC_URL}/images/glossary/Monochromacy (Complete Color Blindness).webp`,
        description: 'Complete inability to see any colors. Vision is limited to shades of gray. Extremely rare, affecting only about 1 in 33,000 people.',
        treatments: {
          available: false,
          options: [
            'No cure currently available',
            'Low vision aids and adaptive strategies',
            'Protection from bright light (often associated with photophobia)',
            'Gene therapy research is ongoing but experimental'
          ],
          notes: 'Complete color blindness is typically genetic and permanent. Management focuses on maximizing remaining vision and adaptive strategies.'
        }
      }
    ]
  },
  {
    id: 'eye-conditions',
    name: 'Eye Conditions',
    icon: <MedicalServicesIcon />,
    description: 'Physical conditions affecting the eye structure and function',
    conditions: [
      {
        id: 'glaucoma',
        name: 'Glaucoma',
        description: 'A group of eye diseases that damage the optic nerve, typically due to elevated intraocular pressure. Known as the "silent thief of sight" because vision loss occurs gradually and peripherally first. Early stages show small paracentral scotomas, progressing to arc-shaped defects, then tunnel vision, and finally severe constriction. Central vision remains sharp until late stages. Includes blue-yellow color deficits and reduced contrast sensitivity.',
        relatedPeople: ['John Milton', 'Galileo Galilei', 'Ray Charles', 'Andrea Bocelli', 'David Paterson'],
        treatments: {
          available: true,
          options: [
            'Prescription eye drops to lower intraocular pressure (prostaglandins, beta-blockers, alpha agonists, carbonic anhydrase inhibitors)',
            'Laser trabeculoplasty (SLT or ALT) to improve fluid drainage',
            'Minimally invasive glaucoma surgery (MIGS)',
            'Traditional glaucoma surgery (trabeculectomy, tube shunt) for advanced cases',
            'Acute angle-closure glaucoma: immediate medical treatment with medications and laser iridotomy'
          ],
          notes: 'Early detection and treatment can prevent or slow vision loss. Vision already lost cannot be restored, but treatment can preserve remaining vision. Regular eye exams are crucial.'
        }
      },
      {
        id: 'cataracts',
        name: 'Nuclear Sclerotic Cataract',
        imagePath: `${PUBLIC_URL}/images/glossary/Nuclear Sclerotic Cataract.webp`,
        description: 'Nuclear sclerotic cataract - the most common type of cataract affecting the center of the lens. Causes progressive blurring, dimming of vision, and loss of color vibrancy, especially affecting blue color perception. The image becomes progressively more yellowed and less colorful over time.',
        treatments: {
          available: true,
          options: [
            'Cataract surgery: removal of clouded lens and replacement with artificial intraocular lens (IOL)',
            'Phacoemulsification: most common technique using ultrasound to break up cataract',
            'Femtosecond laser-assisted cataract surgery',
            'Various IOL options: monofocal, multifocal, toric (for astigmatism), accommodating lenses',
            'Early stages: stronger glasses, brighter lighting, anti-glare sunglasses'
          ],
          notes: 'Cataract surgery is one of the most common and successful surgeries, with high success rates. It is reversible and can restore clear vision. Surgery is typically recommended when cataracts interfere with daily activities.'
        }
      },
      {
        id: 'posteriorSubcapsularCataract',
        name: 'Posterior Subcapsular Cataract',
        imagePath: `${PUBLIC_URL}/images/glossary/Posterior Subcapsular Cataract.webp`,
        description: 'Small central area of light scatter behind the pupil, causing pronounced glare sensitivity and loss of contrast in bright lighting. Creates a bright halo or cloudy patch that grows with brightness intensity, disproportionately affecting near and backlit vision. Peripheral vision may remain clearer.',
        treatments: {
          available: true,
          options: [
            'Cataract surgery: removal of clouded lens and replacement with artificial intraocular lens (IOL)',
            'Phacoemulsification: most common technique using ultrasound to break up cataract',
            'Femtosecond laser-assisted cataract surgery',
            'Various IOL options: monofocal, multifocal, toric (for astigmatism), accommodating lenses',
            'Early stages: stronger glasses, brighter lighting, anti-glare sunglasses',
            'Pupil-dilating eye drops may provide temporary relief'
          ],
          notes: 'Posterior subcapsular cataracts often progress more quickly than other types and can significantly impact vision, especially in bright light. Surgery is typically recommended when vision is significantly affected.'
        }
      },
      {
        id: 'amd',
        name: 'Age-Related Macular Degeneration (AMD)',
        imagePath: `${PUBLIC_URL}/images/glossary/Age-Related Macular Degeneration (AMD).webp`,
        description: 'Deterioration of the macula, the central part of the retina. Causes loss of central vision while peripheral vision remains. Leading cause of vision loss in older adults.',
        relatedPeople: ['Dr. Mona Minkara'],
        treatments: {
          available: true,
          options: [
            'Wet AMD: Anti-VEGF injections (bevacizumab, ranibizumab, aflibercept, faricimab) into the eye',
            'Photodynamic therapy (PDT) for certain types of wet AMD',
            'Dry AMD: AREDS2 supplements (vitamins C, E, zinc, copper, lutein, zeaxanthin)',
            'Low vision rehabilitation and aids',
            'Amsler grid monitoring for early detection of progression',
            'Lifestyle modifications: quit smoking, healthy diet, exercise, UV protection'
          ],
          notes: 'Wet AMD can be treated to slow progression and sometimes improve vision. Dry AMD progresses slowly and currently has no cure, but supplements may slow progression. Early detection is crucial.'
        }
      },
      {
        id: 'diabeticRetinopathy',
        name: 'Diabetic Retinopathy',
        description: 'Damage to the blood vessels in the retina caused by diabetes. Can cause blurry vision, dark spots, and eventually blindness if untreated.',
        treatments: {
          available: true,
          options: [
            'Tight blood sugar control (most important)',
            'Blood pressure and cholesterol management',
            'Anti-VEGF injections for diabetic macular edema',
            'Laser photocoagulation (panretinal or focal)',
            'Vitrectomy surgery for advanced cases with bleeding or retinal detachment',
            'Regular comprehensive eye exams (annually or more frequently)'
          ],
          notes: 'Early detection and good diabetes management can prevent or slow progression. Treatment can preserve vision, but vision already lost may not be fully restored.'
        }
      },
      {
        id: 'astigmatism',
        name: 'Astigmatism/Pterygium',
        description: 'Irregular curvature of the cornea or lens causing blurred or distorted vision at all distances. Common refractive error that can be corrected with glasses or contacts. Pterygium is a fibrovascular growth onto the cornea that can cause astigmatism by distorting the corneal surface.',
        treatments: {
          available: true,
          options: [
            'Prescription glasses or contact lenses (toric lenses)',
            'Refractive surgery: LASIK, PRK, or SMILE for corneal astigmatism',
            'Toric intraocular lens implants during cataract surgery',
            'Pterygium: surgical removal if it affects vision or causes discomfort',
            'Lubricating eye drops for associated dry eye'
          ],
          notes: 'Astigmatism is easily correctable with glasses or contacts. Refractive surgery can provide permanent correction. Pterygium surgery has good success rates.'
        }
      },
      {
        id: 'nearSighted',
        name: 'Myopia (Near-Sightedness)',
        imagePath: `${PUBLIC_URL}/images/glossary/Myopia (Near-Sightedness).webp`,
        description: 'Difficulty seeing distant objects clearly while near objects appear normal. Caused by the eye being too long or the cornea being too curved.',
        treatments: {
          available: true,
          options: [
            'Prescription glasses or contact lenses',
            'Refractive surgery: LASIK, PRK, SMILE, or ICL (implantable collamer lens)',
            'Orthokeratology (ortho-k): overnight contact lenses to reshape cornea',
            'Atropine eye drops (low-dose) to slow progression in children',
            'Multifocal contact lenses for children to slow progression'
          ],
          notes: 'Myopia is easily correctable. In children, treatments can slow progression. Refractive surgery can provide permanent correction for adults.'
        }
      },
      {
        id: 'farSighted',
        name: 'Hyperopia (Far-Sightedness)',
        description: 'Difficulty seeing near objects clearly while distant objects appear normal. Caused by the eye being too short or the cornea being too flat.',
        treatments: {
          available: true,
          options: [
            'Prescription glasses or contact lenses',
            'Refractive surgery: LASIK, PRK, or SMILE',
            'Refractive lens exchange (RLE) for high hyperopia',
            'Reading glasses for presbyopia (age-related near vision loss)'
          ],
          notes: 'Hyperopia is easily correctable with glasses or contacts. Refractive surgery can provide permanent correction.'
        }
      }
    ]
  },
  {
    id: 'retinal-disorders',
    name: 'Retinal Disorders',
    icon: <VisibilityIcon />,
    description: 'Conditions affecting the retina and its specialized cells',
    conditions: [
      {
        id: 'retinitisPigmentosa',
        name: 'Retinitis Pigmentosa',
        imagePath: `${PUBLIC_URL}/images/glossary/Retinitis Pigmentosa.webp`,
        description: 'Progressive genetic disorder causing gradual degeneration of photoreceptor cells in the retina. Creates distinctive tunnel vision with progressive peripheral vision loss, night blindness requiring 10-100x more light, severe light sensitivity and glare issues, color desaturation, and eventual complete blindness at advanced stages. The visual field constricts from normal 180° to 40°, 20°, or less, making navigation extremely challenging.',
        relatedPeople: ['Erik Weihenmayer'],
        treatments: {
          available: true,
          options: [
            'Vitamin A palmitate (15,000 IU/day) - may slow progression in some forms',
            'Docosahexaenoic acid (DHA) supplements',
            'Gene therapy (Luxturna) for specific RPE65 mutations - FDA approved',
            'Retinal implants (Argus II, Alpha AMS) for advanced cases',
            'Stem cell therapy (experimental)',
            'Low vision aids and rehabilitation',
            'Protection from bright light with sunglasses',
            'Genetic counseling and testing'
          ],
          notes: 'RP is progressive and currently has no cure for most forms. Treatment focuses on slowing progression and maximizing remaining vision. Gene therapy is available for specific genetic mutations.'
        }
      },
      {
        id: 'stargardt',
        name: 'Stargardt Disease',
        imagePath: `${PUBLIC_URL}/images/glossary/Stargardt Disease.webp`,
        description: 'Genetic eye disorder causing progressive vision loss in the macula. Usually begins in childhood or adolescence, affecting central vision while peripheral vision remains.',
        relatedPeople: ['Marla Runyan'],
        treatments: {
          available: true,
          options: [
            'No cure currently available',
            'Low vision rehabilitation and aids',
            'Eccentric viewing training',
            'Gene therapy research is ongoing (experimental)',
            'Stem cell therapy research (experimental)',
            'Protection from bright light (may slow progression)',
            'Avoid high-dose vitamin A supplements',
            'Genetic counseling'
          ],
          notes: 'Stargardt disease is progressive and currently incurable. Management focuses on maximizing remaining peripheral vision and adaptive strategies. Research into gene and stem cell therapies is promising.'
        }
      },
      {
        id: 'retinalDetachment',
        name: 'Retinal Detachment',
        imagePath: `${PUBLIC_URL}/images/glossary/Retinal Detachment.webp`,
        description: 'Separation of the retina from the underlying tissue. Can cause sudden flashes of light, floaters, and a curtain-like shadow over the visual field. Requires immediate medical attention.',
        relatedPeople: ['John Milton'],
        treatments: {
          available: true,
          options: [
            'Surgical repair (urgent):',
            '• Pneumatic retinopexy: gas bubble injection',
            '• Scleral buckle: band around eye to support retina',
            '• Vitrectomy: removal of vitreous gel and retinal reattachment',
            'Laser photocoagulation or cryopexy to seal retinal tears',
            'Post-surgical positioning (face-down) to help reattachment'
          ],
          notes: 'Retinal detachment is a medical emergency requiring immediate treatment. Success rates are high if treated promptly (within days). Delayed treatment can result in permanent vision loss.'
        }
      }
    ]
  },
  {
    id: 'neurological',
    name: 'Neurological Conditions',
    icon: <PsychologyIcon />,
    description: 'Conditions affecting the brain and nervous system that impact vision',
    conditions: [
      {
        id: 'visualAura',
        name: 'Visual Aura',
        description: 'Temporary visual disturbances that can precede migraines. May include flashing lights, zigzag patterns, or blind spots. Usually lasts 20-60 minutes before the headache begins.',
        treatments: {
          available: true,
          options: [
            'Migraine prevention medications: beta-blockers, anticonvulsants, antidepressants, CGRP inhibitors',
            'Acute migraine treatment: triptans, NSAIDs, ergotamines',
            'Lifestyle modifications: identify and avoid triggers, regular sleep, stress management',
            'Botox injections for chronic migraines',
            'Neuromodulation devices (Cefaly, gammaCore)',
            'Supplements: magnesium, riboflavin, coenzyme Q10'
          ],
          notes: 'Visual auras typically resolve on their own. Treatment focuses on preventing migraines and managing symptoms. Most people with auras can identify triggers to avoid.'
        }
      },
      {
        id: 'visualSnow',
        name: 'Visual Snow',
        description: 'A persistent visual disturbance where people see tiny, flickering dots across their entire visual field. Similar to the static noise on an old television. Can be constant or intermittent.',
        treatments: {
          available: true,
          options: [
            'Medications: lamotrigine, acetazolamide, topiramate (variable effectiveness)',
            'Tinted lenses (FL-41) to reduce symptoms',
            'Treatment of associated conditions (migraine, anxiety, depression)',
            'Cognitive behavioral therapy for associated anxiety',
            'Lifestyle modifications: reduce stress, adequate sleep, avoid triggers'
          ],
          notes: 'Visual snow syndrome has no definitive cure. Treatment is often trial-and-error. Some medications may help reduce symptoms. Research into the condition is ongoing.'
        }
      },
      {
        id: 'visualFloaters',
        name: 'Visual Floaters (Myodesopsia)',
        description: 'Shadows cast on the retina by debris floating in the vitreous humor. Includes cobweb/string floaters, dots/spots, ring floaters (Weiss Ring), and cloud/sheet floaters. Move with eye movement but lag behind, following fluid dynamics. Most visible against bright backgrounds, can interfere with reading and detailed tasks.',
        treatments: {
          available: true,
          options: [
            'Most floaters are harmless and require no treatment',
            'Vitrectomy: surgical removal of vitreous gel (for severe, persistent floaters)',
            'YAG laser vitreolysis: laser to break up floaters (limited effectiveness)',
            'Observation: many floaters settle or become less noticeable over time',
            'Address underlying causes: diabetic retinopathy, retinal tears, uveitis'
          ],
          notes: 'Most floaters are benign and do not require treatment. Sudden increase in floaters, especially with flashes, requires immediate eye exam to rule out retinal tear or detachment.'
        }
      },
      {
        id: 'hallucinations',
        name: 'Visual Hallucinations',
        description: 'Seeing things that are not actually present. Can be simple (lights, shapes) or complex (people, animals). Associated with various neurological conditions and medications.',
        treatments: {
          available: true,
          options: [
            'Treatment depends on underlying cause:',
            '• Charles Bonnet Syndrome (vision loss): reassurance, improved lighting, social interaction',
            '• Parkinson\'s disease: adjust medications, antipsychotics if severe',
            '• Dementia: cholinesterase inhibitors, antipsychotics (with caution)',
            '• Medication-induced: adjust or discontinue offending medication',
            '• Psychiatric conditions: antipsychotic medications, therapy',
            '• Epilepsy: anticonvulsant medications'
          ],
          notes: 'Treatment is highly dependent on the underlying cause. Charles Bonnet Syndrome (hallucinations due to vision loss) is usually harmless and may resolve on its own.'
        }
      },
      {
        id: 'diplopia',
        name: 'Diplopia (Double Vision)',
        description: 'Seeing two images of a single object. Can be monocular (affecting one eye) or binocular (affecting both eyes). Usually caused by misalignment of the eyes or problems within the eye itself.',
        treatments: {
          available: true,
          options: [
            'Treatment depends on cause:',
            '• Strabismus: eye muscle surgery, prism glasses, vision therapy, Botox injections',
            '• Cranial nerve palsy: treat underlying cause, prism glasses, eye patching, surgery if persistent',
            '• Thyroid eye disease: treat thyroid condition, steroids, surgery',
            '• Myasthenia gravis: medications (pyridostigmine, immunosuppressants)',
            '• Cataracts: cataract surgery',
            '• Corneal irregularities: contact lenses, corneal surgery',
            '• Brain tumor/stroke: treat underlying condition'
          ],
          notes: 'Monocular diplopia is usually due to eye problems (cataracts, corneal issues). Binocular diplopia requires treatment of eye alignment or underlying neurological conditions.'
        }
      },
      {
        id: 'glare',
        name: 'Glare Sensitivity',
        imagePath: `${PUBLIC_URL}/images/glossary/Glare Sensitivity.webp`,
        description: 'Bloom or light-scatter effect proportional to scene luminance and eye adaptation state. Causes local veiling glare that washes out nearby details, especially after exposure to sudden brightness changes. Contrast recovery can be delayed to simulate photostress.',
        treatments: {
          available: true,
          options: [
            'Anti-glare sunglasses with polarized or tinted lenses',
            'FL-41 tinted lenses (rose-colored) for light sensitivity',
            'Treatment of underlying conditions: cataracts, dry eye, corneal issues',
            'Cataract surgery if cataracts are causing glare',
            'Lubricating eye drops for dry eye-related glare',
            'Avoiding bright light sources when possible',
            'Using hats or visors to block overhead light'
          ],
          notes: 'Glare sensitivity can be a symptom of various eye conditions. Treatment depends on the underlying cause. Anti-glare lenses and protective eyewear can significantly improve comfort.'
        }
      },
      {
        id: 'nightBlindness',
        name: 'Night Blindness (Nyctalopia)',
        imagePath: `${PUBLIC_URL}/images/glossary/Night Blindness (Nyctalopia).webp`,
        description: 'Difficulty seeing in low light conditions or darkness. Vision becomes significantly impaired in dim lighting, making navigation and object recognition challenging. Often associated with rod cell dysfunction or vitamin A deficiency.',
        treatments: {
          available: true,
          options: [
            'Treatment depends on underlying cause:',
            '• Vitamin A deficiency: vitamin A supplementation',
            '• Retinitis pigmentosa: vitamin A palmitate, gene therapy (for specific mutations)',
            '• Cataracts: cataract surgery',
            '• Glaucoma: treatment to lower intraocular pressure',
            '• Refractive errors: prescription glasses or contact lenses',
            '• Zinc deficiency: zinc supplementation (often needed with vitamin A)',
            'Low vision aids: night vision devices, enhanced lighting',
            'Adaptive strategies: avoiding driving at night, using extra lighting'
          ],
          notes: 'Night blindness can be a symptom of various conditions. Some causes are treatable (vitamin deficiencies, cataracts), while others (retinitis pigmentosa) may be progressive. Early diagnosis is important.'
        }
      },
      {
        id: 'starbursting',
        name: 'Starbursting',
        imagePath: `${PUBLIC_URL}/images/glossary/Starbursting.webp`,
        description: 'Light sources appearing as star-like rays or spikes extending outward from the center. Creates a "sunburst" or "starburst" pattern around bright lights, especially noticeable at night. Often caused by corneal irregularities or certain eye surgeries.',
        treatments: {
          available: true,
          options: [
            'Treatment depends on underlying cause:',
            '• Post-surgical (LASIK, PRK): usually improves over time, may require enhancement surgery',
            '• Corneal irregularities: rigid gas permeable contact lenses, corneal cross-linking',
            '• Cataracts: cataract surgery',
            '• Dry eye: lubricating eye drops, punctal plugs',
            '• Astigmatism: prescription glasses or contact lenses',
            'Anti-glare coatings on glasses',
            'Avoiding bright lights when possible',
            'Using polarized sunglasses at night (if legally allowed)'
          ],
          notes: 'Starbursting after refractive surgery often improves over 6-12 months. If persistent, it may require additional treatment. Corneal irregularities may need specialized contact lenses or surgical correction.'
        }
      }
    ]
  },
  {
    id: 'trauma-infections',
    name: 'Trauma & Infections',
    icon: <MedicalServicesIcon />,
    description: 'Conditions caused by injury, infection, or other external factors',
    conditions: [
      {
        id: 'sympatheticOphthalmia',
        name: 'Sympathetic Ophthalmia',
        description: 'An autoimmune response that can occur after injury to one eye, causing inflammation in both eyes. Can lead to complete blindness if not treated promptly.',
        relatedPeople: ['Louis Braille'],
        treatments: {
          available: true,
          options: [
            'High-dose systemic corticosteroids (oral or IV)',
            'Immunosuppressive medications: cyclosporine, azathioprine, mycophenolate, methotrexate',
            'Biologic agents: infliximab, adalimumab (for refractory cases)',
            'Long-term maintenance therapy to prevent recurrence',
            'Enucleation of injured eye (if vision is lost) may prevent SO but controversial'
          ],
          notes: 'Early, aggressive treatment is crucial to preserve vision. Treatment may need to be long-term to prevent recurrence. Modern treatment has improved outcomes significantly.'
        }
      },
      {
        id: 'meningitis',
        name: 'Meningitis',
        description: 'Inflammation of the membranes surrounding the brain and spinal cord. Can cause vision loss, hearing loss, and other neurological complications.',
        relatedPeople: ['Helen Keller', 'Ved Mehta'],
        treatments: {
          available: true,
          options: [
            'Immediate antibiotic or antiviral treatment (depending on cause)',
            'Corticosteroids to reduce inflammation and complications',
            'Supportive care: IV fluids, pain management, fever control',
            'Vision rehabilitation if vision loss occurs',
            'Prevention: vaccines (meningococcal, pneumococcal, Hib)',
            'Early treatment of infections that can lead to meningitis'
          ],
          notes: 'Immediate medical treatment is critical. Vision loss from meningitis is often permanent but early treatment can prevent complications. Vaccination is the best prevention.'
        }
      },
      {
        id: 'chemicalBurns',
        name: 'Chemical Burns',
        description: 'Severe damage to the eyes caused by exposure to chemicals. Can result in complete blindness and requires immediate medical attention.',
        relatedPeople: ['Joshua Miele'],
        treatments: {
          available: true,
          options: [
            'Immediate irrigation: flush eye with water or saline for 15-30 minutes',
            'Emergency medical treatment: continued irrigation, pH testing',
            'Topical antibiotics to prevent infection',
            'Lubricating eye drops and ointments',
            'Corticosteroids to reduce inflammation',
            'Amniotic membrane transplantation for severe burns',
            'Corneal transplantation (keratoplasty) if cornea is severely damaged',
            'Limbal stem cell transplantation for limbal stem cell deficiency',
            'Scleral contact lenses for severe surface damage'
          ],
          notes: 'Immediate irrigation is critical - seconds count. Alkali burns (lye, ammonia) are more severe than acid burns. Severe burns may require multiple surgeries and have variable outcomes.'
        }
      },
      {
        id: 'retinopathyPrematurity',
        name: 'Retinopathy of Prematurity (ROP)',
        description: 'Abnormal blood vessel development in the retina of premature infants. Can cause retinal detachment and blindness if not treated.',
        relatedPeople: ['Stevie Wonder'],
        treatments: {
          available: true,
          options: [
            'Laser photocoagulation: standard treatment for severe ROP',
            'Anti-VEGF injections (bevacizumab, ranibizumab)',
            'Cryotherapy (less common now)',
            'Vitrectomy surgery for retinal detachment',
            'Scleral buckle for retinal detachment',
            'Careful oxygen management in NICU to prevent ROP',
            'Regular screening exams for premature infants'
          ],
          notes: 'Early detection and treatment can prevent blindness. Treatment is most effective when done promptly. Modern NICU care and screening have significantly improved outcomes.'
        }
      },
      {
        id: 'neuromyelitisOptica',
        name: 'Neuromyelitis Optica (NMO)',
        description: 'Autoimmune disorder that attacks the optic nerves and spinal cord. Can cause severe vision loss and other neurological symptoms.',
        relatedPeople: ['Christine Ha'],
        treatments: {
          available: true,
          options: [
            'Acute attacks: high-dose IV corticosteroids, plasmapheresis',
            'Long-term prevention: immunosuppressive medications (azathioprine, mycophenolate, rituximab)',
            'Monoclonal antibodies: eculizumab, inebilizumab (FDA approved)',
            'IVIG (intravenous immunoglobulin)',
            'Vision rehabilitation and low vision aids',
            'Physical therapy for spinal cord involvement'
          ],
          notes: 'Early treatment of attacks and long-term immunosuppression can prevent further vision loss. Some vision may recover after attacks, but damage is often permanent. Modern treatments have significantly improved outcomes.'
        }
      },
      {
        id: 'juvenileRetinoschisis',
        name: 'Juvenile Retinoschisis',
        description: 'Genetic condition causing splitting of retinal layers, leading to progressive vision loss. Usually begins in childhood.',
        relatedPeople: ['Erik Weihenmayer'],
        treatments: {
          available: true,
          options: [
            'No cure currently available',
            'Regular monitoring for complications (retinal detachment, vitreous hemorrhage)',
            'Laser photocoagulation or cryotherapy for retinal tears',
            'Vitrectomy surgery for retinal detachment or persistent vitreous hemorrhage',
            'Low vision aids and rehabilitation',
            'Genetic counseling',
            'Gene therapy research is ongoing (experimental)'
          ],
          notes: 'Juvenile retinoschisis is progressive and currently incurable. Treatment focuses on managing complications and maximizing remaining vision. Regular monitoring is essential.'
        }
      },
      {
        id: 'incontinentiaPigmenti',
        name: 'Incontinentia Pigmenti',
        description: 'Rare genetic condition that can affect multiple body systems, including the eyes. Can cause vision loss from birth.',
        relatedPeople: ['Lucy Edwards'],
        treatments: {
          available: true,
          options: [
            'Regular eye exams to monitor for complications',
            'Laser photocoagulation for abnormal blood vessels',
            'Vitrectomy for retinal detachment or vitreous hemorrhage',
            'Treatment of other systemic manifestations',
            'Low vision aids and rehabilitation',
            'Genetic counseling',
            'Multidisciplinary care (neurology, dermatology, ophthalmology)'
          ],
          notes: 'Treatment focuses on managing eye complications and other systemic manifestations. Regular monitoring is essential. Vision loss varies widely among individuals.'
        }
      }
    ]
  }
];
