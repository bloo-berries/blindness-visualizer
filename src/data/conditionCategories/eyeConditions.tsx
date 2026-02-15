import React from 'react';
import { MedicalServices as MedicalServicesIcon } from '@mui/icons-material';
import { ConditionCategory, PUBLIC_URL } from './types';

export const eyeConditionsCategory: ConditionCategory = {
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
};
