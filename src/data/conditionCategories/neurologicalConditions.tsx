import React from 'react';
import { Psychology as PsychologyIcon } from '@mui/icons-material';
import { ConditionCategory, PUBLIC_URL } from './types';

export const neurologicalConditionsCategory: ConditionCategory = {
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
};
